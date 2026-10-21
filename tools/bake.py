#!/usr/bin/env python3
"""Bake the public replay tree from the (private) archive repo.

Reads ../archive/index.json and copies each matched capture into a/<path>, injecting
a small ASCII-only header block: noindex, canonical to the original URL, and a
provenance banner with live/wayback links. Writes replay-index.json (also meant to be
copied to ../contests/data/replay-index.json so the site build can link here).

Stdlib only. Re-runnable: existing files are rewritten (this whole tree is a build
output; the archive repo is the canonical store).
"""
from __future__ import annotations

import argparse
import datetime
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BANNER = """<!-- baked by icpc-contest-archive/replay -->
{charset}<meta name="robots" content="noindex">
{canonical}
<style>#icpc-archive-banner{{position:sticky;top:0;z-index:99999;background:#1a2634;
color:#dfe7ee;font:13px/1.4 system-ui,sans-serif;padding:6px 12px;border-bottom:2px solid #4a90d9}}
#icpc-archive-banner a{{color:#8fc1f0}}</style>
"""

BANNER_BODY = """<div id="icpc-archive-banner">Archived copy of {url_link}{fetched} —
part of the <a href="https://icpc-contest-archive.github.io/contests/">ICPC contest archive</a>
({contest_link}){wayback}</div>
"""


META_CS_RE = re.compile(rb"charset\s*=\s*[\"']?\s*([A-Za-z0-9_.:-]+)", re.I)
META_CS_SUB = re.compile(rb"(charset\s*=\s*)([\"']?)\s*[A-Za-z0-9_.:-]+", re.I)
TLD_HINTS = {  # preferred legacy encodings when nothing decodes as declared/utf-8
    "pl": "windows-1250", "hr": "windows-1250", "cz": "windows-1250", "sk": "windows-1250",
    "si": "windows-1250", "hu": "windows-1250", "ro": "windows-1250",
    "ru": "windows-1251", "ua": "windows-1251", "by": "windows-1251", "bg": "windows-1251",
    "kz": "windows-1251", "eg": "windows-1256", "sa": "windows-1256", "jo": "windows-1256",
    "sy": "windows-1256", "lb": "windows-1256", "ma": "windows-1256", "tn": "windows-1256",
    "gr": "windows-1253", "tr": "windows-1254", "jp": "shift_jis", "kr": "euc-kr",
    "tw": "big5", "cn": "gb18030", "hk": "big5",
}


def to_utf8(raw: bytes, content_type: str, url: str):
    """Best-effort transcode to UTF-8 (GitHub Pages force-serves charset=utf-8, so
    anything else garbles no matter what the page declares). Returns (bytes, encoding)
    — encoding None when undecodable (bytes returned untouched)."""
    if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
        return raw, None  # UTF-16 with BOM: browsers handle via BOM
    cands = []
    m = re.search(r"charset=([A-Za-z0-9_.:-]+)", content_type or "", re.I)
    if m:
        cands.append(m.group(1))
    m = META_CS_RE.search(raw[:4096])
    if m:
        cands.append(m.group(1).decode("ascii", "ignore"))
    cands.append("utf-8")
    host = re.sub(r"^https?://(web\.archive\.org/web/[^/]+/https?://)?", "", url or "")
    tld = host.split("/")[0].rsplit(".", 1)[-1].lower() if host else ""
    cands.append(TLD_HINTS.get(tld, "windows-1252"))
    cands.append("windows-1252")
    for enc in cands:
        try:
            text = raw.decode(enc)
        except Exception:
            continue
        if enc.lower().replace("-", "").replace("_", "") in ("utf8", "usascii", "ascii"):
            return raw, "utf-8"
        out = text.encode("utf-8")
        head = META_CS_SUB.sub(rb"\g<1>\g<2>utf-8", out[:4096])
        return head + out[4096:], enc
    return raw, None


def apply_assets(raw: bytes, manifest: dict, src_dir, dest_dir) -> bytes:
    """Copy backfilled assets next to the baked page and point its refs at them."""
    for a in manifest.get("assets") or []:
        f = src_dir / a["file"]
        if not f.exists():
            continue
        d = dest_dir / a["file"]
        d.parent.mkdir(parents=True, exist_ok=True)
        d.write_bytes(f.read_bytes())
        ref, rel = a["ref"].encode(), a["file"].encode()
        for q in (b'"%s"', b"'%s'"):
            raw = raw.replace(q % ref, q % rel)
    return raw


# Wayback's own additions to a page fetched through its wrapper rather than id_
# (the sheet-era 2026-04 captures and a few wrapper-URL live fetches): toolbar block,
# scripts/stylesheets, wombat init, playback/archived-on comments. Stripped at bake so
# the replay page is the resource, not Wayback's chrome around it; root-relative
# /web/<ts>/ links are made absolute so they keep working off web.archive.org.
_WB_JUNK = [
    re.compile(rb"(?is)<!--\s*BEGIN WAYBACK TOOLBAR INSERT\s*-->.*?<!--\s*END WAYBACK TOOLBAR INSERT\s*-->"),
    re.compile(rb"(?is)<script[^>]*(?:web-static\.archive\.org|archive\.org/_static/|/_static/js/)[^>]*>\s*</script>"),
    re.compile(rb"(?is)<link[^>]*(?:web-static\.archive\.org|archive\.org/_static/|/_static/css/)[^>]*>"),
    re.compile(rb"(?is)<script[^>]*>(?:(?!</script>).)*?(?:__wm\.(?:init|wombat|bt|rw)|wombat\.js|wbinfo\s*=)(?:(?!</script>).)*?</script>"),
    re.compile(rb"(?is)<!--\s*playback timings.*?-->"),
    re.compile(rb"(?is)<!--\s*FILE ARCHIVED ON .*?-->"),
    re.compile(rb"(?is)<!--\s*(?:End )?Wayback Rewrite JS Include\s*-->"),
]
_WB_RELLINK = re.compile(rb"""(?i)((?:href|src|action)\s*=\s*["']?)(/web/\d{4,14}[a-z_]*/)""")
_WRAP = re.compile(r"^https?://web\.archive\.org/web/(\d{4,14})(?:[a-z]{1,2}_?)?/+(.+)$", re.I)


def strip_wayback(raw: bytes):
    """-> (raw, stripped?)"""
    before = raw
    for rx in _WB_JUNK:
        raw = rx.sub(b"", raw)
    raw = _WB_RELLINK.sub(rb"\1https://web.archive.org\2", raw)
    return raw, raw != before


def unwrap(url: str):
    m = _WRAP.match(url or "")
    return (m.group(2) if m.group(2).startswith(("http://", "https://")) else "http://" + m.group(2),
            m.group(1)) if m else (url, None)


def inject(raw: bytes, head_extra: str, body_extra: str) -> bytes:
    if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):  # UTF-16: skip injection
        return raw
    he, be = head_extra.encode("ascii", "ignore"), body_extra.encode("ascii", "ignore")
    m = re.search(rb"<head[^>]*>", raw, re.I)
    if m:
        raw = raw[: m.end()] + b"\n" + he + raw[m.end():]
    else:
        raw = he + raw
    m = re.search(rb"<body[^>]*>", raw, re.I)
    if m:
        return raw[: m.end()] + b"\n" + be + raw[m.end():]
    return raw + be


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--archive", default=str(ROOT.parent / "archive"))
    args = ap.parse_args()
    arch = Path(args.archive)
    index = json.loads((arch / "index.json").read_text())

    pages, total = [], 0
    stats: dict = {}
    for cap in index["captures"]:
        if cap.get("content_caveat"):
            continue  # junk-flagged captures stay in the archive but are not published
        src = arch / cap["path"]
        if not src.exists():
            print(f"missing in archive: {cap['path']}", file=sys.stderr)
            continue
        dest = ROOT / "a" / cap["path"]
        dest.parent.mkdir(parents=True, exist_ok=True)
        raw = src.read_bytes()
        try:
            manifest = json.loads((src.parent / "manifest.json").read_text())
        except Exception:
            manifest = {}
        is_html = (cap.get("content_type") or "").startswith("text/html") or \
            src.suffix.lower() in (".html", ".htm")
        if is_html:
            url = cap.get("url") or ""
            raw, _enc = to_utf8(raw, cap.get("content_type") or "", url)
            raw = apply_assets(raw, manifest, src.parent, dest.parent)
            raw, stripped = strip_wayback(raw)
            # resource model: a wrapper URL is (url, time), never the address shown
            raw_url, inner_ts = unwrap(url)
            if inner_ts and not cap.get("wayback_timestamp"):
                cap = {**cap, "wayback_timestamp": inner_ts,
                       "wayback_url": f"https://web.archive.org/web/{inner_ts}/{raw_url}"}
            url = raw_url
            if stripped:
                stats["wayback chrome stripped"] = stats.get("wayback chrome stripped", 0) + 1
            canonical = f'<link rel="canonical" href="{html.escape(url, True)}">' if url else ""
            url_link = f'<a href="{html.escape(url, True)}">{html.escape(url[:80])}</a>' if url \
                else "an ICPC result page"
            ts = cap.get("wayback_timestamp")
            if ts:
                hm = f" {ts[8:10]}:{ts[10:12]}" if len(ts) >= 12 else ""
                fetched = (f" (content as captured {ts[:4]}-{ts[4:6]}-{ts[6:8]}{hm} "
                           f"via the Wayback Machine)")
            else:
                fetched = f" (fetched {cap['fetched'][:10]})" if cap.get("fetched") else ""
            wayback = ""
            wb = cap.get("wayback_url") or (f"https://web.archive.org/web/*/{url}" if url else "")
            if wb:
                wayback = f' · <a href="{html.escape(wb, True)}">wayback</a>'
            contest_link = (f'<a href="https://icpc-contest-archive.github.io/contests/contest/'
                            f'{cap["contest"]}.html">{cap["contest"]}</a>')
            raw = inject(raw, BANNER.format(
                charset='<meta charset="utf-8">\n' if _enc else "", canonical=canonical),
                         BANNER_BODY.format(url_link=url_link, fetched=fetched,
                                            contest_link=contest_link, wayback=wayback))
        dest.write_bytes(raw)
        total += len(raw)
        pages.append({"contest": cap["contest"], "artifact": cap["artifact"],
                      "path": "a/" + cap["path"], "url": cap.get("url"),
                      "fetched": cap.get("fetched"), "sha256_source": cap["sha256"]})

    if stats:
        print(stats)
    out = {"generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
           "shard": 1, "pages": pages}
    (ROOT / "replay-index.json").write_text(json.dumps(out, indent=1, ensure_ascii=False))
    (ROOT / ".nojekyll").write_text("")

    (ROOT / "404.html").write_text("""<!doctype html><html><head><meta charset="utf-8">
<meta name="robots" content="noindex"><title>Not in this archive</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:38rem;margin:15vh auto;padding:0 1rem}</style>
</head><body><h1>Not in this archive shard</h1>
<p>The page you followed a link to isn't part of this baked replay — typically an internal
link on an archived page pointing at a resource that was never captured.</p>
<p>Try the <a id="wb" href="https://web.archive.org/">Wayback Machine</a>, or start from the
<a href="https://icpc-contest-archive.github.io/contests/">ICPC contest catalogue</a>.</p>
<script>
if (document.referrer) { document.getElementById('wb').href =
  'https://web.archive.org/web/*/' + document.referrer; }
</script></body></html>""")

    (ROOT / "index.html").write_text("""<!doctype html><html><head><meta charset="utf-8">
<title>ICPC contest archive — replay</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:38rem;margin:15vh auto;padding:0 1rem}</style>
</head><body><h1>ICPC contest archive — replay shard 1</h1>
<p>Baked copies of archived ICPC result pages. There is no index here by design — browse
via the <a href="https://icpc-contest-archive.github.io/contests/">contest catalogue</a>,
where every archived page is linked from its contest.</p></body></html>""")

    print(f"baked {len(pages)} pages, {total / 1e6:.0f} MB payload")
    return 0


if __name__ == "__main__":
    sys.exit(main())
