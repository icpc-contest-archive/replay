// locale
uojLocaleData = {
  username: {
    en: "Username",
    "zh-cn": "用户名",
    ja: "ユーザー名",
  },
  "contests::total score": {
    en: "Score",
    "zh-cn": "总分",
    ja: "スコア",
  },
  "contests::n participants": {
    en: function (n) {
      return n + " participant" + (n <= 1 ? "" : "s");
    },
    "zh-cn": function (n) {
      return "共 " + n + " 名参赛者";
    },
    ja: function (n) {
      return n + "名の参加者";
    },
  },
  "click-zan::good": {
    en: "",
    "zh-cn": "",
    ja: "",
  },
  "click-zan::bad": {
    en: "",
    "zh-cn": "",
    ja: "",
  },
  "editor::use advanced editor": {
    en: "use advanced editor",
    "zh-cn": "使用高级编辑器",
    ja: "高度なエディタを使用",
  },
  "editor::language": {
    en: "Language",
    "zh-cn": "语言",
    ja: "言語",
  },
  "editor::browse": {
    en: "Browse",
    "zh-cn": "浏览",
    ja: "参照",
  },
  "editor::upload by editor": {
    en: "Upload by editor",
    "zh-cn": "使用编辑器上传",
    ja: "エディタでアップロード",
  },
  "editor::upload from local": {
    en: "Upload from local",
    "zh-cn": "从本地文件上传",
    ja: "ローカルからアップロード",
  },
  "submission::copy code": {
    en: "Copy",
    "zh-cn": "复制",
    "zh-tw": "複製",
    ja: "コピー",
  },
  "submission::code copied": {
    en: "Copied!",
    "zh-cn": "已复制！",
    "zh-tw": "已複製！",
    ja: "コピーしました！",
  },
  "submission::edit": {
    en: "Edit", "zh-cn": "编辑", "zh-tw": "編輯",
  },
  "submission::save and rejudge": {
    en: "Save and rejudge", "zh-cn": "保存并重测", "zh-tw": "儲存並重新評測",
  },
  "submission::cancel edit": {
    en: "Cancel", "zh-cn": "取消", "zh-tw": "取消",
  },
  "submission::edit failed": {
    en: "The request failed. Your changes have been kept; please retry.",
    "zh-cn": "请求失败，编辑内容已保留，请重试。",
    "zh-tw": "請求失敗，編輯內容已保留，請重試。",
  },
  "submission::copy failed": {
    en: "Copy failed; please copy manually",
    "zh-cn": "复制失败，请手动复制",
    "zh-tw": "複製失敗，請手動複製",
    ja: "コピーできませんでした。手動でコピーしてください",
  },
  "add to favourites": {
    en: "Add to favourites",
    "zh-cn": "加入收藏",
    ja: "お気に入りに追加",
  },
  "remove from favourites": {
    en: "Remove from favourites",
    "zh-cn": "取消收藏",
    ja: "お気に入りから削除",
  },
  "log in to favourite": {
    en: "Log in to favourite",
    "zh-cn": "登录后即可收藏",
    ja: "ログインしてお気に入り",
  },
  "time zone::label": {
    en: "Time zone",
    "zh-cn": "时区",
    "zh-tw": "時區",
    ja: "タイムゾーン",
    ko: "시간대",
    es: "Zona horaria",
    fr: "Fuseau horaire",
    ru: "Часовой пояс",
    tr: "Saat dilimi",
    ar: "المنطقة الزمنية",
  },
  "time zone::auto": {
    en: "Local",
    "zh-cn": "本地",
    "zh-tw": "本地",
    ja: "ローカル",
    ko: "로컬",
    es: "Local",
    fr: "Local",
    ru: "Местное",
    tr: "Yerel",
    ar: "محلي",
  },
  "time zone::server": {
    en: "Server time",
    "zh-cn": "服务器时间",
    "zh-tw": "伺服器時間",
    ja: "サーバー時間",
    ko: "서버 시간",
    es: "Hora del servidor",
    fr: "Heure du serveur",
    ru: "Время сервера",
    tr: "Sunucu saati",
    ar: "وقت الخادم",
  },
};

function uojLocale(name) {
  locale = $.cookie("uoj_locale");
  if (uojLocaleData[name] === undefined) {
    return "";
  }
  if (uojLocaleData[name][locale] === undefined) {
    locale = "en";
  }
  val = uojLocaleData[name][locale];
  if (!$.isFunction(val)) {
    return val;
  } else {
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return val.apply(this, args);
  }
}

// utility
function strToDate(str) {
  var a = str.split(/[^0-9]/);
  return new Date(
    parseInt(a[0]),
    parseInt(a[1]) - 1,
    parseInt(a[2]),
    parseInt(a[3]),
    parseInt(a[4]),
    parseInt(a[5]),
    0
  );
}
function dateToStr(date) {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
}
function toFilledStr(o, f, l) {
  var s = o.toString();
  while (s.length < l) {
    s = f.toString() + s;
  }
  return s;
}

// local time zone display
// Times rendered by UOJTime::html() are <time class="uoj-time" datetime="ISO 8601 with offset" data-fmt="...">
// holding the server time; they are rewritten in the viewer's time zone.
// Preference cookie uoj_tz: unset / "auto" = browser time zone, "server" = keep server time, otherwise an IANA name.
var uojTimeFormatters = {};
function uojIsValidTimeZone(tz) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch (e) {
    return false;
  }
}
function uojBrowserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch (e) {
    return null;
  }
}
function uojTimeZonePref() {
  var pref = $.cookie("uoj_tz");
  if (pref === "server") {
    return "server";
  }
  if (pref && pref !== "auto" && uojIsValidTimeZone(pref)) {
    return pref;
  }
  return "auto";
}
// the IANA time zone times are displayed in, or null to keep server time
function uojTimeZone() {
  var pref = uojTimeZonePref();
  if (pref === "server") {
    return null;
  }
  if (pref === "auto") {
    return uojBrowserTimeZone();
  }
  return pref;
}
function uojTimeParts(date, tz) {
  if (!uojTimeFormatters[tz]) {
    uojTimeFormatters[tz] = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  var parts = {};
  uojTimeFormatters[tz].formatToParts(date).forEach(function (p) {
    parts[p.type] = p.value;
  });
  if (parts.hour === "24") {
    parts.hour = "00";
  }
  return parts;
}
function uojFormatTime(date, fmt, tz) {
  var p = uojTimeParts(date, tz);
  var d = p.year + "-" + p.month + "-" + p.day;
  switch (fmt) {
    case "date":
      return d;
    case "time":
      return p.hour + ":" + p.minute + ":" + p.second;
    case "time-short":
      return p.hour + ":" + p.minute;
    case "datetime-short":
      return d + " " + p.hour + ":" + p.minute;
    case "datetime-tz":
      return d + " " + p.hour + ":" + p.minute + ":" + p.second + " (" + uojUtcOffsetLabel(tz, date) + ")";
    default:
      return d + " " + p.hour + ":" + p.minute + ":" + p.second;
  }
}
// "UTC+8", "UTC+5:30" for the given time zone at the given moment
function uojUtcOffsetLabel(tz, date) {
  var p = uojTimeParts(date || new Date(), tz);
  var asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  var offset = Math.round((asUTC - Math.floor((date || new Date()).getTime() / 1000) * 1000) / 60000);
  var sign = offset < 0 ? "-" : "+";
  offset = Math.abs(offset);
  var label = "UTC" + sign + Math.floor(offset / 60);
  if (offset % 60) {
    label += ":" + toFilledStr(offset % 60, "0", 2);
  }
  return label;
}
$.fn.uoj_time = function () {
  var tz;
  try {
    tz = uojTimeZone();
  } catch (e) {
    return this;
  }
  return this.each(function () {
    var el = $(this);
    if (el.data("server-text") === undefined) {
      el.data("server-text", el.text());
    }
    var date = new Date(el.attr("datetime"));
    if (tz === null || isNaN(date.getTime())) {
      el.text(el.data("server-text"));
      return;
    }
    try {
      el.text(uojFormatTime(date, el.data("fmt"), tz));
    } catch (e) {
      el.text(el.data("server-text"));
    }
  });
};
// JS counterpart of UOJTime::html(): iso from UOJTime::iso(), text is the server-time fallback
function uojTimeHtml(iso, text, fmt) {
  if (!iso) {
    return $("<span />").text(text == null ? "" : text).html();
  }
  return $('<time class="uoj-time" />')
    .attr("datetime", iso)
    .attr("data-fmt", fmt || "datetime")
    .text(text == null ? "" : text)
    .prop("outerHTML");
}
// <option> text cannot hold <time>: times maps option value -> {iso, prefix}, where prefix is the
// server-time text the option label starts with; it is replaced by the time in the viewer's time zone
function uojLocalizeTimeOptions(select, times) {
  $(select).addClass("uoj-time-options").data("uoj-time-options", times).each(function () {
    var tz;
    try {
      tz = uojTimeZone();
    } catch (e) {
      return;
    }
    $(this).find("option").each(function () {
      var opt = $(this);
      var t = times[opt.val()];
      if (opt.data("server-text") === undefined) {
        opt.data("server-text", opt.text());
      }
      var text = opt.data("server-text");
      if (!t || text.indexOf(t.prefix) !== 0) {
        return;
      }
      if (tz === null) {
        opt.text(text);
        return;
      }
      try {
        opt.text(uojFormatTime(new Date(t.iso), "datetime-tz", tz) + text.substring(t.prefix.length));
      } catch (e) {
        opt.text(text);
      }
    });
  });
}
function uojLocalizeTimes(root) {
  $(root || "body").find("time.uoj-time").addBack("time.uoj-time").uoj_time();
  $(root || "body").find("select.uoj-time-options").addBack("select.uoj-time-options").each(function () {
    uojLocalizeTimeOptions(this, $(this).data("uoj-time-options"));
  });
}
$(function () {
  // times inserted later by scripts (AJAX tables, live updates, ...)
  if (window.MutationObserver) {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType === 1 && (node.matches("time.uoj-time") || node.querySelector("time.uoj-time"))) {
            uojLocalizeTimes(node);
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
});
// footer time zone selector
$.fn.uoj_time_zone_selector = function () {
  return this.each(function () {
    var sel = $('<select class="custom-select custom-select-sm d-inline-block w-auto" />');
    var pref = uojTimeZonePref();
    var browser = uojBrowserTimeZone();
    var server = typeof uojServerTimeZone !== "undefined" ? uojServerTimeZone : null;
    var label = function (tz) {
      try {
        return tz + " (" + uojUtcOffsetLabel(tz) + ")";
      } catch (e) {
        return tz;
      }
    };
    sel.append(
      $("<option />").val("auto").text(uojLocale("time zone::auto") + (browser ? ": " + label(browser) : ""))
    );
    sel.append(
      $("<option />").val("server").text(uojLocale("time zone::server") + (server ? ": " + label(server) : ""))
    );
    if (pref !== "auto" && pref !== "server") {
      sel.append($("<option />").val(pref).text(label(pref)));
    }
    sel.val(pref);
    // the full zone list (hundreds of formatters) is only built once the selector is used
    var zones_loaded = false;
    sel.on("mousedown focus touchstart", function () {
      if (zones_loaded) {
        return;
      }
      zones_loaded = true;
      var zones = [];
      try {
        zones = Intl.supportedValuesOf("timeZone");
      } catch (e) {}
      $.each(zones, function (i, tz) {
        if (tz !== pref) {
          sel.append($("<option />").val(tz).text(label(tz)));
        }
      });
    });
    sel.on("change", function () {
      var v = $(this).val();
      if (v === "auto") {
        $.removeCookie("uoj_tz", { path: "/" });
      } else {
        $.cookie("uoj_tz", v, { expires: 3650, path: "/" });
      }
      uojLocalizeTimes("body");
    });
    $(this)
      .empty()
      .append($('<span class="glyphicon glyphicon-time" />'), " ", uojLocale("time zone::label"), ": ", sel);
  });
};
function getPenaltyTimeStr(x) {
  var ss = toFilledStr(x % 60, "0", 2);
  x = Math.floor(x / 60);
  var mm = toFilledStr(x % 60, "0", 2);
  x = Math.floor(x / 60);
  var hh = x.toString();
  return hh + ":" + mm;
  //return hh + ':' + mm + ':' + ss;
}

function htmlspecialchars(str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/"/g, "&quot;");
  return s;
}
function getColOfRating(rating, mode = 1) {
  if (rating >= 4500) {
    // Aleph LGM
    return ColorConverter.toStr(new RGB(170, 0, 0));
  }
  if (rating >= 4000) {
    // LGM
    if (mode == 1) return ColorConverter.toStr(new RGB(170, 0, 0));
    return ColorConverter.toStr(new RGB(255, 51, 51));
  } else if (rating >= 3700) {
    // IGM
    return ColorConverter.toStr(new RGB(255, 51, 51));
  } else if (rating >= 3500) {
    // GM
    return ColorConverter.toStr(new RGB(255, 119, 119));
  } else if (rating >= 3000) {
    // Master
    return ColorConverter.toStr(new RGB(255, 204, 136));
  } else if (rating >= 2700) {
    // Candidate Master
    if (mode == 1) return ColorConverter.toStr(new RGB(255, 136, 255));
    return ColorConverter.toStr(new RGB(176, 36, 150));
  } else if (rating >= 2400) {
    if (mode == 1) return ColorConverter.toStr(new RGB(172, 172, 255));
    return ColorConverter.toStr(new RGB(16, 16, 232));
  } else if (rating >= 2000) {
    return ColorConverter.toStr(new RGB(159, 221, 187));
  } else if (rating >= 1500) {
    return ColorConverter.toStr(new RGB(55, 205, 155));
  } else if (rating >= 1000) {
    return ColorConverter.toStr(new RGB(12, 156, 19));
  } else if (rating >= 0) {
    return ColorConverter.toStr(new RGB(204, 204, 204));
  } else {
    return ColorConverter.toStr(new RGB(153, 102, 0));
  }
}

function getColOfScore(score, maxscore = 100) {
  if (maxscore == NaN || maxscore == 0) {
    maxscore = 100;
  }
  if (score == 0) {
    return ColorConverter.toStr(ColorConverter.toRGB(new HSV(0, 100, 80)));
  } else if (score == maxscore) {
    return ColorConverter.toStr(ColorConverter.toRGB(new HSV(120, 100, 80)));
  } else {
    return ColorConverter.toStr(
      ColorConverter.toRGB(new HSV(30 + (score * 60) / maxscore, 100, 90))
    );
  }
}

function getUserLink(username, rating, color, nickname, rated) {
  var _nickname = $(this).data("nickname");
  if (!username) {
    return "";
  }
  if (color == undefined) {
    color = getColOfRating(rating, 2);
  }
  var text = username;
  if (nickname != undefined) text = nickname;
  if (username.charAt(0) == "@") {
    username = username.substr(1);
  }
  var sticky = "";
  if (!rated) {
    sticky = " unrated";
  }
  else if (rating >= 4000 && rating < 10000) sticky = " lgm";
  
  result =
    '<a class="uoj-username' +
    sticky +
    '" href="' +
    uojHome +
    "/user/profile/" +
    username +
    '" style="color:' +
    color +
    '">' +
    text +
    "</a>";
  return result;
}
function getUserSpan(username, rating, addSymbol) {
  if (!username) {
    return "";
  }
  if (addSymbol == undefined) {
    addSymbol = true;
  }
  var text = username;
  if (username.charAt(0) == "@") {
    username = username.substr(1);
  }
  if (addSymbol) {
    if (rating >= 4500) {
      text += "<sup>";
      for (var i = 4500; i <= rating; i += 10000) {
        text += "&alefsym;";
      }
      text += "</sup>";
    }
  }
  var sticky = "";
  if (rating >= 4000 && rating < 10000) sticky = " lgm";
  return (
    '<span class="uoj-username ' +
    sticky +
    '" style="color:' +
    getColOfRating(rating, 2) +
    '">' +
    text +
    "</span>"
  );
}

function replaceWithHighlightUsername() {
  var username = $(this).text();
  var rating = $(this).data("rating");
  var admin = $(this).data("admin");
  var rated = $(this).data("rated");
  var uColor = $(this).data("user-color");
  if (admin == 1) {
    uColor = ColorConverter.toStr(new RGB(255, 51, 204));
  } else if (admin == 2) {
    uColor = ColorConverter.toStr(new RGB(122, 22, 233));
  }
  var nickname = $(this).data("nickname");
  if (isNaN(rating)) {
    return;
  }
  if ($(this).data("link") != 0) {
    $(this).replaceWith(getUserLink(username, rating, uColor, nickname, rated));
  } else {
    $(this).replaceWith(getUserSpan(username, rating));
  }
}

$.fn.uoj_honor = function () {
  return this.each(function () {
    var honor = $(this).text();
    var rating = $(this).data("rating");
    if (isNaN(rating)) {
      return;
    }
    if (rating >= 20000) {
      honor += "<sup>";
      for (var i = 4500; i <= rating; i += 20000) {
        honor += "&alefsym;";
      }
      honor += "</sup>";
    }
    $(this).css("color", getColOfRating(rating, 1)).html(honor);
  });
};

function showErrorHelp(name, err) {
  if (err) {
    $("#div-" + name).addClass("has-error");
    $("#help-" + name).text(err);
    return false;
  } else {
    $("#div-" + name).removeClass("has-error");
    $("#help-" + name).text("");
    return true;
  }
}
function getFormErrorAndShowHelp(name, val) {
  var err = val($("#input-" + name).val());
  return showErrorHelp(name, err);
}

function validateSettingPassword(str) {
  if (str.length < 6) {
    return "The password length should not be less than 6. ";
  } else if (!/^[!-~]+$/.test(str)) {
    return "Passwords can only contain numbers, lowercase letters, uppercase letters and special characters.";
  } else if (str != $("#input-confirm_password").val()) {
    return "Passwords don't match match. ";
  } else {
    return "";
  }
}
function validatePassword(str) {
  if (str.length < 6) {
    return "The password length should not be less than 6. ";
  } else if (!/^[!-~]+$/.test(str)) {
    return "Passwords can only contain numbers, lowercase letters, uppercase letters and special characters.";
  } else {
    return "";
  }
}
function validateEmail(str) {
  if (str.length > 50) {
    return "The length of email address should be less than 50";
  } else if (!/^(.+)@(.+)$/.test(str)) {
    return "Invalid email address";
  } else {
    return "";
  }
}
function validateUsername(str) {
  if (str.length == 0) {
    return "The username should not be empty.";
  } else if (!/^[a-zA-Z0-9_\-\.]+$/.test(str)) {
    return "Usernames can only contain numbers, lowercase letters, uppercase letters and underlines";
  } else {
    return "";
  }
}
function validateQQ(str) {
  if (str.length < 5) {
    return "QQ的长度不应小于5。";
  } else if (str.length > 15) {
    return "QQ的长度不应大于15。";
  } else if (/\D/.test(str)) {
    return "QQ应只包含0~9的数字。";
  } else {
    return "";
  }
}
function validateMotto(str) {
  if (str.length > 200) {
    return "No more than 200 characters";
  } else {
    return "";
  }
}

// tags
$.fn.uoj_problem_tag = function () {
  return this.each(function () {
    $(this).attr(
      "href",
      uojHome + "/problems?tag=" + encodeURIComponent($(this).text())
    );
  });
};
$.fn.uoj_blog_tag = function () {
  return this.each(function () {
    $(this).attr(
      "href",
      uojBlogUrl + "/archive?tag=" + encodeURIComponent($(this).text())
    );
  });
};

// click zan
function click_zan(zan_id, zan_type, zan_delta, node) {
  var loading_node = $('<div class="text-muted">loading...</div>');
  $(node).replaceWith(loading_node);
  $.post(
    zan_link + "/click-zan",
    {
      id: zan_id,
      delta: zan_delta,
      type: zan_type,
    },
    function (ret) {
      $(loading_node).replaceWith($(ret).click_zan_block());
    }
  ).fail(function () {
    $(loading_node).replaceWith('<div class="text-danger">failed</div>');
  });
}

$.fn.click_zan_block = function () {
  return this.each(function () {
    var id = $(this).data("id");
    var type = $(this).data("type");
    var val = parseInt($(this).data("val"));
    var cnt = parseInt($(this).data("cnt"));
    if (isNaN(cnt)) {
      return;
    }
    if (val >= 1) {
      $(this).addClass("uoj-click-zan-block-cur-up");
    } else if (val == 0) {
      $(this).addClass("uoj-click-zan-block-cur-zero");
    } else if (val <= -1) {
      $(this).addClass("uoj-click-zan-block-cur-down");
    } else {
      return;
    }
    if (cnt > 0) {
      $(this).addClass("uoj-click-zan-block-positive");
    } else if (cnt == 0) {
      $(this).addClass("uoj-click-zan-block-neutral");
    } else {
      $(this).addClass("uoj-click-zan-block-negative");
    }

    var node = this;
    var up_node = $(
      '<a href="#" class="uoj-click-zan-up"><span class="glyphicon glyphicon-thumbs-up"></span>' +
        uojLocale("click-zan::good") +
        "</a>"
    ).click(function (e) {
      e.preventDefault();
      click_zan(id, type, 1, node);
    });
    var down_node = $(
      '<a href="#" class="uoj-click-zan-down"><span class="glyphicon glyphicon-thumbs-down"></span>' +
        uojLocale("click-zan::bad") +
        "</a>"
    ).click(function (e) {
      e.preventDefault();
      click_zan(id, type, -1, node);
    });

    $(this)
      .append(up_node)
      .append(down_node)
      .append(
        $(
          '<span class="uoj-click-zan-cnt">[<strong>' +
            (cnt > 0 ? "+" + cnt : cnt) +
            "</strong>]</span>"
        )
      );
  });
};

$.fn.uoj_favourite_block = function () {
  return this.each(function () {
    var $el = $(this);
    if ($el.data("fav-initialized")) return;
    $el.data("fav-initialized", true);

    var type = $el.data("type");
    var id = $el.data("id");
    var loggedIn = parseInt($el.data("logged-in")) === 1;
    var isFav = parseInt($el.data("fav")) === 1;

    function render(fav) {
      $el.removeClass("uoj-favourite-on uoj-favourite-off");
      $el.addClass(fav ? "uoj-favourite-on" : "uoj-favourite-off");
      var title = loggedIn
        ? uojLocale(fav ? "remove from favourites" : "add to favourites")
        : uojLocale("log in to favourite");
      $el.attr("title", title);
      $el.html(
        '<span class="glyphicon glyphicon-' +
          (fav ? "star" : "star-empty") +
          '"></span>'
      );
    }

    render(isFav);

    $el.on("click", function (e) {
      e.preventDefault();
      if (!loggedIn) {
        window.location.href = "/login";
        return;
      }
      if ($el.data("fav-busy")) return;
      $el.data("fav-busy", true);
      $.post(
        (typeof uojHome !== "undefined" ? uojHome : "") + "/favourite",
        { type: type, id: id },
        function (resp) {
          if (resp && resp.success) {
            isFav = !!resp.is_favourite;
            render(isFav);
          }
        },
        "json"
      )
        .fail(function () {
          alert("Failed to update favourite");
        })
        .always(function () {
          $el.data("fav-busy", false);
        });
    });
  });
};

// count down
function getCountdownStr(t) {
  var x = Math.floor(t);
  var ss = toFilledStr(x % 60, "0", 2);
  x = Math.floor(x / 60);
  var mm = toFilledStr(x % 60, "0", 2);
  x = Math.floor(x / 60);
  var hh = toFilledStr(x % 24, "0", 2);
  x = Math.floor(x / 24);
  var dd = x.toString();

  var res = '<span style="font-size:30px">';
  if (dd > 0) { res +=
    '<span style="color:' +
    getColOfScore(Math.min((dd / 100) * 100, 100)) +
    '">' +
    dd +
    "</span> days ";
  }
  res +=
    '<span style="color:' +
    getColOfScore(Math.min((t / 10800) * 100, 100)) +
    '">' +
    hh +
    "</span>";
  res += ":";
  res +=
    '<span style="color:' +
    getColOfScore((mm / 60) * 100) +
    '">' +
    mm +
    "</span>";
  res += ":";
  res +=
    '<span style="color:' +
    getColOfScore((ss / 60) * 100) +
    '">' +
    ss +
    "</span>";
  res += "</span>";
  return res;
}

$.fn.countdown = function (rest, callback) {
  return this.each(function () {
    var start = new Date().getTime();
    var cur_rest = rest != undefined ? rest : parseInt($(this).data("rest"));
    var cur = this;
    var countdown = function () {
      var passed = Math.floor((new Date().getTime() - start) / 1000);
      if (passed >= cur_rest) {
        $(cur).html(getCountdownStr(0));
        if (callback != undefined) {
          callback();
        }
      } else {
        $(cur).html(getCountdownStr(cur_rest - passed));
        setTimeout(countdown, 1000);
      }
    };
    countdown();
  });
};

// update_judgement_status
update_judgement_status_list = [];
function update_judgement_status_details(id) {
  update_judgement_status_list.push(id);
}

$(document).ready(function () {
  function update() {
    $.get(
      "/submission-status-details",
      {
        get: update_judgement_status_list,
      },
      function (data) {
        for (var i = 0; i < update_judgement_status_list.length; i++) {
          $("#status_details_" + update_judgement_status_list[i]).html(
            data[i].html
          );
          if (data[i].judged) {
            location.reload();
          }
        }
      },
      "json"
    ).always(function () {
      setTimeout(update, 10000);
    });
  }
  if (update_judgement_status_list.length > 0) {
    setTimeout(update, 10000);
  }
});

// Copy the plain text of one submitted source file.
async function uojCopyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Try the fallback when clipboard access is denied.
    }
  }

  var activeElement = document.activeElement;
  var textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.readOnly = true;
  textarea.style.cssText = "position: fixed; top: 0; left: -9999px;";
  document.body.appendChild(textarea);
  try {
    textarea.select();
    return document.execCommand("copy");
  } catch (e) {
    return false;
  } finally {
    textarea.remove();
    if (activeElement) {
      activeElement.focus({ preventScroll: true });
    }
  }
}

$.fn.uoj_submission_code = function () {
  return this.each(function () {
    var panel = $(this);
    if (panel.find(".uoj-copy-code").length) {
      return;
    }
    // Capture before syntax highlighting, without trimming whitespace.
    var code = panel.find("pre code").text();
    var resetTimer;
    var button = $('<button type="button" class="btn btn-light btn-sm ml-2 uoj-copy-code" aria-live="polite"></button>')
      .text(uojLocale("submission::copy code"))
      .on("click", async function () {
        clearTimeout(resetTimer);
        button.prop("disabled", true);
        var copied = await uojCopyText(code);
        button.prop("disabled", false).text(uojLocale(
          copied ? "submission::code copied" : "submission::copy failed"
        ));
        resetTimer = setTimeout(function () {
          button.text(uojLocale("submission::copy code"));
        }, 3000);
      });
    var actions = $('<div class="uoj-submission-actions d-flex"></div>');
    panel.children(".card-header, .panel-heading").append(actions.append(button));
  });
};

$.fn.uoj_submission_editor = function () {
  return this.each(function () {
    var container = $(this);
    container.find("[data-edit-file]").each(function () {
      var panel = $(this);
      if (panel.find(".uoj-edit-code").length) return;
      var actions = panel.find(".uoj-submission-actions");
      if (!actions.length) {
        actions = $('<div class="uoj-submission-actions d-flex"></div>')
          .appendTo(panel.children(".card-header"));
      }
      var body = panel.children(".card-body");
      var original = body.children();
      var error = $('<div class="alert alert-danger mt-2" role="alert"></div>').hide().appendTo(body);
      var editor;
      function request(action, text) {
        return $.ajax({
          url: container.attr("data-url"), type: "POST", dataType: "json",
          data: {
            edit_submission_content: "1", action: action, text: text,
            file: panel.attr("data-edit-file"), version: container.attr("data-version"),
            _token: container.attr("data-token")
          }
        });
      }
      function showError(xhr) {
        error.text(xhr.responseJSON && xhr.responseJSON.error || uojLocale("submission::edit failed")).show();
      }
      var edit = $('<button type="button" class="btn btn-light btn-sm ml-2 uoj-edit-code"></button>')
        .text(uojLocale("submission::edit")).appendTo(actions).on("click", async function () {
          container.find(".uoj-edit-code").prop("disabled", true);
          error.hide();
          try {
            // Load the original bytes, never the highlighted or truncated preview.
            var result = await request("load");
            original.hide();
            editor = $('<div class="uoj-content-editor"></div>').appendTo(body);
            var input = $('<textarea class="form-control text-monospace" rows="20" spellcheck="false"></textarea>')
              .attr("aria-label", panel.attr("data-edit-file")).val(result.text).appendTo(editor);
            var controls = $('<div class="mt-2"></div>').appendTo(editor);
            var save = $('<button type="button" class="btn btn-primary mr-2"></button>')
              .text(uojLocale("submission::save and rejudge")).appendTo(controls);
            var cancel = $('<button type="button" class="btn btn-secondary"></button>')
              .text(uojLocale("submission::cancel edit")).appendTo(controls);
            cancel.on("click", function () {
              editor.remove(); original.show(); error.hide();
              container.find(".uoj-edit-code").prop("disabled", false);
            });
            save.on("click", async function () {
              save.add(cancel).prop("disabled", true);
              input.prop("disabled", true);
              error.hide();
              try {
                var response = await request("save", input.val());
                window.location.assign(response.url);
              } catch (xhr) {
                showError(xhr);
                save.add(cancel).prop("disabled", false);
                input.prop("disabled", false);
              }
            });
            input.trigger("focus");
          } catch (xhr) {
            showError(xhr); container.find(".uoj-edit-code").prop("disabled", false);
          }
        });
    });
  });
};

// highlight
$.fn.uoj_highlight = function () {
  return $(this).each(function () {
    $(this).find("span.uoj-username").each(replaceWithHighlightUsername);
    $(this).find(".uoj-honor").uoj_honor();
    $(this)
      .find(".uoj-score")
      .each(function () {
        var score = parseInt($(this).text());
        var maxscore = parseInt($(this).data("max"));
        var assigned = parseInt($(this).data('assigned'))
        if (!isNaN(assigned) && assigned === 1) {
          return;
        }
        if (isNaN(score)) {
          score = parseInt($(this).data("score"));
          if (isNaN(score)) {
            return;
          }
        }
        var fullscore = parseFloat($(this).data("full"));
        if (isNaN(fullscore)) {
          fullscore = 100;
        }
        if (isNaN(maxscore)) {
          $(this).css("color", getColOfScore(score, fullscore));
        } else {
          if (score < 0) score = 0;
          $(this).css("color", getColOfScore(score, maxscore));
        }
      });
    $(this)
      .find(".uoj-status")
      .each(function () {
        var success = parseInt($(this).data("success"));
        if (isNaN(success)) {
          return;
        }
        if (success == 1) {
          $(this).css(
            "color",
            ColorConverter.toStr(ColorConverter.toRGB(new HSV(120, 100, 80)))
          );
        } else {
          $(this).css(
            "color",
            ColorConverter.toStr(ColorConverter.toRGB(new HSV(0, 100, 100)))
          );
        }
      });
    $(this).find(".uoj-problem-tag").uoj_problem_tag();
    $(this).find(".uoj-blog-tag").uoj_blog_tag();
    $(this).find(".uoj-click-zan-block").click_zan_block();
    $(this).find(".uoj-favourite-block").uoj_favourite_block();
    $(this).find(".uoj-submission-code").uoj_submission_code();
    $(this).find(".uoj-submission-editor").uoj_submission_editor();
    $(this).find(".countdown").countdown();
    $(this).find("time.uoj-time").uoj_time();
    $(this).find(".uoj-time-zone-selector").uoj_time_zone_selector();
    $(this).find(".uoj-readmore").readmore({
      moreLink: '<a href="#" class="text-right">more...</a>',
      lessLink: '<a href="#" class="text-right">close</a>',
    });
    //The comment is hidden because of too negative feedback, click here to view it
    $(this)
      .find(".comttoobad")
      .each(function () {
        var el = $(this),
          cb = el.find(".comtbox1").hide();
        $('<div class="comtbox1 negative-comment-cover" />')
          .append(
            "The comment is hidden because of too negative feedback, click "
          )
          .append(
            $('<a href="#">' + "here" + "</a>").click(function (e) {
              e.preventDefault();
              cb.show();
              el.find(".negative-comment-cover").hide();
            })
          )
          .append(" to view it")
          .insertAfter(cb);
      });
  });
};

$(document).ready(function () {
  $("body").uoj_highlight();
});

// contest notice
function checkContestNotice(id, lastTime) {
  $.post(
    "/contest/" + id.toString(),
    {
      check_notice: "",
      last_time: lastTime,
    },
    function (data) {
      setTimeout(function () {
        checkContestNotice(id, data.time);
      }, 120000);
      if (data.msg != undefined) {
        var len = data.msg.length;
        for (var i = 0; i < len; i++) alert(data.msg[i]);
      }
    },
    "json"
  ).fail(function () {
    setTimeout(function () {
      checkContestNotice(id, lastTime);
    }, 120000);
  });
}

// long table
$.fn.long_table = function (data, cur_page, header_row, get_row_str, config) {
  return this.each(function () {
    var table_div = this;

    $(table_div).html("");

    var page_len = config.page_len != undefined ? config.page_len : 10;

    if (!config.echo_full) {
      var n_rows = data.length;
      var n_pages = Math.max(Math.ceil(n_rows / page_len), 1);
      if (cur_page == undefined) {
        cur_page = 1;
      }
      if (cur_page < 1) {
        cur_page = 1;
      } else if (cur_page > n_pages) {
        cur_page = n_pages;
      }
      var cur_start = (cur_page - 1) * page_len;
    } else {
      var n_rows = data.length;
      var n_pages = 1;
      cur_page = 1;
      var cur_start = (cur_page - 1) * page_len;
    }

    var div_classes =
      config.div_classes != undefined
        ? config.div_classes
        : ["table-responsive"];
    var table_classes =
      config.table_classes != undefined
        ? config.table_classes
        : [
            "table",
            "table-bordered",
            "table-hover",
            "table-striped",
            "table-text-center",
          ];

    var now_cnt = 0;
    var tbody = $("<tbody />");
    for (var i = 0; i < page_len && cur_start + i < n_rows; i++) {
      now_cnt++;
      if (config.get_row_index) {
        tbody.append(get_row_str(data[cur_start + i], cur_start + i));
      } else {
        tbody.append(get_row_str(data[cur_start + i]));
      }
    }
    if (now_cnt == 0) {
      tbody.append('<tr><td colspan="233">None</td></tr>');
    }

    $(table_div).append(
      $('<div class="' + div_classes.join(" ") + '" />').append(
        $('<table class="' + table_classes.join(" ") + '" />')
          .append($("<thead>" + header_row + "</thead>"))
          .append(tbody)
      )
    );

    if (config.print_after_table != undefined) {
      $(table_div).append(config.print_after_table());
    }

    var get_page_li = function (p, h) {
      if (p == -1) {
        return $('<li class="page-item"></li>')
          .addClass("disabled")
          .append($('<a class="page-link"></a>').append(h));
      }

      var li = $('<li class="page-item"></li>');
      if (p == cur_page) {
        li.addClass("active");
      }
      li.append(
        $('<a class="page-link"></a>')
          .attr("href", "#" + table_div.id)
          .append(h)
          .click(function (e) {
            if (config.prevent_focus_on_click) {
              e.preventDefault();
            }
            $(table_div).long_table(data, p, header_row, get_row_str, config);
          })
      );
      return li;
    };

    if (n_pages > 1) {
      var pagination = $(
        '<ul class="pagination top-buffer-no bot-buffer-sm justify-content-center"></ul>'
      );
      if (cur_page > 1) {
        pagination.append(
          get_page_li(
            cur_page - 1,
            '<span class="glyphicon glyphicon glyphicon-backward"></span>'
          )
        );
      } else {
        pagination.append(
          get_page_li(
            -1,
            '<span class="glyphicon glyphicon glyphicon-backward"></span>'
          )
        );
      }
      var max_extend = config.max_extend != undefined ? config.max_extend : 5;
      for (
        var i = Math.max(cur_page - max_extend, 1);
        i <= Math.min(cur_page + max_extend, n_pages);
        i++
      ) {
        pagination.append(get_page_li(i, i.toString()));
      }
      if (cur_page < n_pages) {
        pagination.append(
          get_page_li(
            cur_page + 1,
            '<span class="glyphicon glyphicon glyphicon-forward"></span>'
          )
        );
      } else {
        pagination.append(
          get_page_li(
            -1,
            '<span class="glyphicon glyphicon glyphicon-forward"></span>'
          )
        );
      }
      $(table_div).append(
        $('<div class="text-center"></div>').append(pagination)
      );
    }
  });
};

// code mirror
function require_codemirror(config, callback) {
  if (
    $('link[href="' + uojHome + "/js/codemirror/lib/codemirror.css" + '"]')
      .length == 0
  ) {
    $(
      '<link type="text/css" rel="stylesheet" href="' +
        uojHome +
        "/js/codemirror/lib/codemirror.css" +
        '" />'
    ).appendTo("head");
  }
  $LAB
    .script(uojHome + "/js/codemirror/lib/codemirror.js")
    .wait()
    .script(uojHome + "/js/codemirror/addon/mode/overlay.js")
    .script(uojHome + "/js/codemirror/addon/selection/active-line.js")
    .wait(callback);
}

function get_codemirror_mode(lang) {
  switch (lang) {
    case "C++":
    case "C++98":
    case "C++03":
    case "C++11":
    case "C++14":
    case "C++17":
    case "C++20":
    case "C++23":
    case "C++26":
      return "text/x-c++src";
    case "C":
    case "C89":
    case "C99":
    case "C11":
      return "text/x-csrc";
    case "Python2":
    case "Python3":
      return "text/x-python";
    case "Java8":
    case "Java11":
    case "Java17":
    case "Java21":
      return "text/x-java";
    case "Pascal":
      return "text/x-pascal";
    case "text":
      return "text/plain";
    default:
      return "text/plain";
  }
}
function require_codemirror_mode(mode, callback) {
  var name = "none";
  switch (mode) {
    case "text/x-c++src":
    case "text/x-csrc":
    case "text/x-java":
      name = "clike";
      break;
    case "text/x-python":
      name = "python";
      break;
    case "text/x-pascal":
      name = "pascal";
      break;
  }
  if (name !== "none") {
    $LAB
      .script(uojHome + "/js/codemirror/mode/" + name + "/" + name + ".js")
      .wait(callback);
  } else {
    setTimeout(callback, 0);
  }
}

// auto save
function autosave_locally(interval, name, target) {
  if (typeof Storage === "undefined") {
    console.log("autosave_locally: Sorry! No Web Storage support..");
    return;
  }
  var url = window.location.href;
  var hp = url.indexOf("#");
  var uri = hp == -1 ? url : url.substr(0, hp);
  var full_name = name + "@" + uri;

  target.val(localStorage.getItem(full_name));
  var save = function () {
    localStorage.setItem(full_name, target.val());
    setTimeout(save, interval);
  };
  setTimeout(save, interval);
}

// source code form group
$.fn.source_code_form_group = function (name, text, langs_options_html, hide_textbox_submit) {
  return this.each(function () {
    var input_language_id = "input-" + name + "_language";
    var input_language_name = name + "_language";
    var input_upload_type_name = name + "_upload_type";
    var input_editor_id = "input-" + name + "_editor";
    var input_editor_name = name + "_editor";
    var input_file_id = "input-" + name + "_file";
    var input_file_name = name + "_file";

    var div_help_language_id = "div-help-" + name + "_language";
    var div_editor_id = "div-" + name + "_editor";
    var div_file_id = "div-" + name + "_file";

    var help_file_id = "help-" + name + "_file";

    var input_language = $(
      '<select id="' +
        input_language_id +
        '" name="' +
        input_language_name +
        '" class="form-control input-sm"/>'
    ).html(langs_options_html);
    var input_upload_type_editor = $(
      '<input type="radio" name="' +
        input_upload_type_name +
        '" value="editor" />'
    );
    var input_upload_type_file = $(
      '<input type="radio" name="' +
        input_upload_type_name +
        '" value="file" />'
    );
    var input_file = $(
      '<input type="file" id="' +
        input_file_id +
        '" name="' +
        input_file_name +
        '" style="display: none" />'
    );
    var input_file_path = $(
      '<input class="form-control" type="text" readonly="readonly" />'
    );
    var input_editor = $(
      '<textarea class="form-control" id="' +
        input_editor_id +
        '" name="' +
        input_editor_name +
        '"></textarea>'
    );
    var input_use_advanced_editor = $('<input type="checkbox">');

    var div_editor = $('<div id="' + div_editor_id + '" class="col-sm-12"/>')
      .append(input_editor)
      .append(
        $('<div class="checkbox text-right" />').append(
          $("<label />")
            .append(input_use_advanced_editor)
            .append(" " + uojLocale("editor::use advanced editor"))
        )
      );
    var div_file = $('<div id="' + div_file_id + '" class="col-sm-12"/>')
      .append(input_file)
      .append(
        $('<div class="input-group"/>')
          .append(input_file_path)
          .append(
            $('<span class="input-group-append"/>').append(
              $(
                '<button type="button" class="btn btn-primary">' +
                  '<span class="glyphicon glyphicon-folder-open"></span> ' +
                  uojLocale("editor::browse") +
                  "</button>"
              )
                .css("width", "100px")
                .click(function () {
                  input_file.click();
                })
            )
          )
      )
      .append($('<span class="help-block" id="' + help_file_id + '"></span>'));
    var div_help_language = $(
      '<div id="' +
        div_help_language_id +
        '" class="col-sm-12 text-warning top-buffer-sm">'
    );

    var show_help_lang = function () {
      if ($(this).val() == "Java8" || $(this).val() == "Java11" || $(this).val() == "Java17" || $(this).val() == "Java21") {
        div_help_language.text(
          "注意：Java 程序源代码中不应指定所在的 package。我们会在源代码中找到第一个被定义的类并以它的 main 函数为程序入口点。"
        );
      } else {
        div_help_language.text("");
      }
    };

    var advanced_editor = null;
    var advanced_editor_init = function () {
      require_codemirror({}, function () {
        var mode = get_codemirror_mode(input_language.val());
        require_codemirror_mode(mode, function () {
          if (advanced_editor != null) {
            return;
          }
          advanced_editor = CodeMirror.fromTextArea(input_editor[0], {
            mode: mode,
            lineNumbers: true,
            matchBrackets: true,
            lineWrapping: true,
            styleActiveLine: true,
            indentUnit: 4,
            indentWithTabs: true,
            theme: "default",
          });
          advanced_editor.on("change", function () {
            advanced_editor.save();
          });
          $(advanced_editor.getWrapperElement()).css(
            "box-shadow",
            "0 2px 10px rgba(0,0,0,0.2)"
          );
          advanced_editor.focus();
        });
      });
    };

    var save_prefer_upload_type = function (type) {
      $.cookie("uoj_source_code_form_group_preferred_upload_type", type, {
        expires: 7,
        path: "/",
      });
    };

    autosave_locally(2000, name, input_editor);

    // If hide_textbox_submit is true, force file upload and hide editor options
    if (hide_textbox_submit) {
      input_upload_type_file[0].checked = true;
      div_editor.css("display", "none");
      // Set a cookie to remember file upload preference
      save_prefer_upload_type("file");
      
      // Add a hidden input to ensure the upload_type is submitted
      $(this).append(
        $('<input type="hidden" name="' + input_upload_type_name + '" value="file" />')
      );
    } else {
      var prefer_upload_type = $.cookie(
        "uoj_source_code_form_group_preferred_upload_type"
      );
      if (prefer_upload_type === null) {
        prefer_upload_type = "editor";
      }
      if (prefer_upload_type == "file") {
        input_upload_type_file[0].checked = true;
        div_editor.css("display", "none");
      } else {
        input_upload_type_editor[0].checked = true;
        div_file.css("display", "none");

        if (prefer_upload_type == "advanced") {
          input_use_advanced_editor[0].checked = true;
        }
      }
    }

    input_language.each(show_help_lang);
    input_language.change(show_help_lang);
    input_language.change(function () {
      if (advanced_editor != null) {
        var mode = get_codemirror_mode(input_language.val());
        require_codemirror_mode(mode, function () {
          if (mode != get_codemirror_mode(input_language.val())) {
            return;
          }
          advanced_editor.setOption("mode", mode);
        });
      }
    });
    input_upload_type_editor.click(function () {
      div_editor.show("fast");
      div_file.hide("fast");
      save_prefer_upload_type("editor");
    });
    input_upload_type_file.click(function () {
      div_file.show("fast");
      div_editor.hide("fast");
      save_prefer_upload_type("file");
    });
    input_file.change(function () {
      input_file_path.val(input_file.val());
    });
    input_use_advanced_editor.click(function () {
      if (this.checked) {
        advanced_editor_init();
        save_prefer_upload_type("advanced");
      } else {
        if (advanced_editor != null) {
          advanced_editor.toTextArea();
          advanced_editor = null;
          input_editor.focus();
        }
        save_prefer_upload_type("editor");
      }
    });

    var row = $('<div class="row col-sm-12"/>');
    
    // Add label and language selection
    row.append(
      $(
        '<label class="col-sm-3 control-label"><div class="text-left">' +
          text +
          "</div></label>"
      )
    )
    .append(
      $(
        '<label class="col-sm-1 control-label" for="' +
          input_language_name +
          '">' +
          uojLocale("editor::language") +
          "</label>"
      )
    )
    .append($('<div class="col-sm-2"/>').append(input_language));

    // Only add the radio buttons if we're not hiding the editor
    if (!hide_textbox_submit) {
      row.append(
        $('<div class="col-sm-2 offset-sm-2 radio"/>').append(
          $("<label/>")
            .append(input_upload_type_editor)
            .append(" " + uojLocale("editor::upload by editor"))
        )
      )
      .append(
        $('<div class="col-sm-2 radio"/>').append(
          $("<label/>")
            .append(input_upload_type_file)
            .append(" " + uojLocale("editor::upload from local"))
        )
      );
    } else {
      // If we're hiding the editor, add a message about file upload
      row.append(
        $('<div class="col-sm-4 offset-sm-2 text-right"/>')
          .append("Upload file only")
      );
    }

    $(this)
      .append(row)
      .append(div_help_language)
      .append(div_editor)
      .append(div_file);

    if (!hide_textbox_submit && prefer_upload_type == "advanced") {
      var check_advanced_init = function () {
        if (div_editor.is(":visible")) {
          advanced_editor_init();
        } else {
          setTimeout(check_advanced_init, 1);
        }
      };
      check_advanced_init();
    }
  });
};

// text file form group
$.fn.text_file_form_group = function (name, text) {
  return this.each(function () {
    var input_upload_type_name = name + "_upload_type";
    var input_editor_id = "input-" + name + "_editor";
    var input_editor_name = name + "_editor";
    var input_file_id = "input-" + name + "_file";
    var input_file_name = name + "_file";

    var div_editor_id = "div-" + name + "_editor";
    var div_file_id = "div-" + name + "_file";

    var help_file_id = "help-" + name + "_file";

    var input_upload_type_editor = $(
      '<input type="radio" name="' +
        input_upload_type_name +
        '" value="editor" />'
    );
    var input_upload_type_file = $(
      '<input type="radio" name="' +
        input_upload_type_name +
        '" value="file" />'
    );
    var input_file = $(
      '<input type="file" id="' +
        input_file_id +
        '" name="' +
        input_file_name +
        '" style="display: none" />'
    );
    var input_file_path = $(
      '<input class="form-control" type="text" readonly="readonly" />'
    );
    var input_editor = $(
      '<textarea class="form-control" id="' +
        input_editor_id +
        '" name="' +
        input_editor_name +
        '"></textarea>'
    );
    var input_use_advanced_editor = $('<input type="checkbox">');

    var div_editor = $('<div id="' + div_editor_id + '" class="col-sm-12"/>')
      .append(input_editor)
      .append(
        $('<div class="checkbox text-right" />').append(
          $("<label />")
            .append(input_use_advanced_editor)
            .append(" " + uojLocale("editor::use advanced editor"))
        )
      );
    var div_file = $('<div id="' + div_file_id + '" class="col-sm-12"/>')
      .append(input_file)
      .append(
        $('<div class="input-group"/>')
          .append(input_file_path)
          .append(
            $('<span class="input-group-append"/>').append(
              $(
                '<button type="button" class="btn btn-primary">' +
                  '<span class="glyphicon glyphicon-folder-open"></span> ' +
                  uojLocale("editor::browse") +
                  "</button>"
              )
                .css("width", "100px")
                .click(function () {
                  input_file.click();
                })
            )
          )
      )
      .append($('<span class="help-block" id="' + help_file_id + '"></span>'));

    var advanced_editor = null;
    var advanced_editor_init = function () {
      require_codemirror({}, function () {
        var mode = get_codemirror_mode("text");
        require_codemirror_mode(mode, function () {
          if (advanced_editor != null) {
            return;
          }
          advanced_editor = CodeMirror.fromTextArea(input_editor[0], {
            mode: mode,
            lineNumbers: true,
            matchBrackets: true,
            lineWrapping: true,
            styleActiveLine: true,
            indentUnit: 4,
            indentWithTabs: true,
            theme: "default",
          });
          advanced_editor.on("change", function () {
            advanced_editor.save();
          });
          $(advanced_editor.getWrapperElement()).css(
            "box-shadow",
            "0 2px 10px rgba(0,0,0,0.2)"
          );
          advanced_editor.focus();
        });
      });
    };

    var save_prefer_upload_type = function (type) {
      $.cookie("uoj_text_file_form_group_preferred_upload_type", type, {
        expires: 7,
        path: "/",
      });
    };

    autosave_locally(2000, name, input_editor);

    var prefer_upload_type = $.cookie(
      "uoj_text_file_form_group_preferred_upload_type"
    );
    if (prefer_upload_type === null) {
      prefer_upload_type = "editor";
    }
    if (prefer_upload_type == "file") {
      input_upload_type_file[0].checked = true;
      div_editor.css("display", "none");
    } else {
      input_upload_type_editor[0].checked = true;
      div_file.css("display", "none");

      if (prefer_upload_type == "advanced") {
        input_use_advanced_editor[0].checked = true;
      }
    }

    input_upload_type_editor.click(function () {
      div_editor.show("fast");
      div_file.hide("fast");
      save_prefer_upload_type("editor");
    });
    input_upload_type_file.click(function () {
      div_file.show("fast");
      div_editor.hide("fast");
      save_prefer_upload_type("file");
    });
    input_file.change(function () {
      input_file_path.val(input_file.val());
    });
    input_use_advanced_editor.click(function () {
      if (this.checked) {
        advanced_editor_init();
        save_prefer_upload_type("advanced");
      } else {
        if (advanced_editor != null) {
          advanced_editor.toTextArea();
          advanced_editor = null;
          input_editor.focus();
        }
        save_prefer_upload_type("editor");
      }
    });

    $(this)
      .append(
        $('<div class="row col-sm-12"/>')
          .append(
            $(
              '<label class="col-sm-2 control-label"><div class="text-left">' +
                text +
                "</div></label>"
            )
          )
          .append($('<div class="top-buffer-sm" />'))
          .append(
            $('<div class="col-sm-2 offset-sm-6 radio"/>').append(
              $("<label/>")
                .append(input_upload_type_editor)
                .append(" " + uojLocale("editor::upload by editor"))
            )
          )
          .append(
            $('<div class="col-sm-2 radio"/>').append(
              $("<label/>")
                .append(input_upload_type_file)
                .append(" " + uojLocale("editor::upload from local"))
            )
          )
      )
      .append(div_editor)
      .append(div_file);

    if (prefer_upload_type == "advanced") {
      var check_advanced_init = function () {
        if (div_editor.is(":visible")) {
          advanced_editor_init();
        } else {
          setTimeout(check_advanced_init, 1);
        }
      };
      check_advanced_init();
    }
  });
};

// custom test
function custom_test_onsubmit(response_text, div_result, url) {
  if (response_text != "") {
    $(div_result).html('<div class="text-danger">' + response_text + "</div>");
    return;
  }
  var update = function () {
    var can_next = true;
    $.get(
      url,
      function (data) {
        if (data.judged === undefined) {
          $(div_result).html('<div class="text-danger">error</div>');
        } else {
          var judge_status = $(
            '<table class="table table-bordered table-text-center"><tr class="info">' +
              data.html +
              "</tr></table>"
          );
          $(div_result).empty();
          $(div_result).append(judge_status);
          if (data.judged) {
            var judge_result = $(data.result);
            judge_result.css("display", "none");
            $(div_result).append(judge_result);
            judge_status.hide(500);
            judge_result.slideDown(500);
            can_next = false;
          }
        }
      },
      "json"
    ).always(function () {
      if (can_next) {
        setTimeout(update, 500);
      }
    });
  };
  setTimeout(update, 500);
}

// comment
function showCommentReplies(id, replies) {
  var toggleFormReply = function (from, text) {
    if (text == undefined) {
      text = "";
    }

    var p = "#comment-body-" + id;
    var q = "#div-form-reply";
    var r = "#input-reply_comment";
    var t = "#input-reply_id";
    if ($(q).data("from") != from) {
      $(q).data("from", from);
      $(q).hide("fast", function () {
        $(this)
          .appendTo(p)
          .show("fast", function () {
            $(t).val(id);
            $(r).val(text).focus();
          });
      });
    } else if ($(q).css("display") != "none") {
      $(q).appendTo(p).hide("fast");
    } else {
      $(q)
        .appendTo(p)
        .show("fast", function () {
          $(t).val(id);
          $(r).val(text).focus();
        });
    }
  };

  $("#reply-to-" + id).click(function (e) {
    e.preventDefault();
    toggleFormReply(id);
  });

  if (replies.length == 0) {
    return;
  }

  $("#replies-" + id).long_table(
    replies,
    1,
    "<tr>" + "<th>Comment replies</th>" + "</tr>",
    function (reply) {
      return $('<tr id="' + "comment-" + reply.id + '" />')
        .append(
          $("<td />")
            .append(
              $(
                '<div class="comtbox6">' +
                  getUserLink(
                    reply.poster,
                    reply.poster_rating,
                    reply.color,
                    reply.nickname,
                    reply.rated
                  ) +
                  "：" +
                  reply.content +
                  "</div>"
              )
            )
            .append(
              $('<ul class="text-right list-inline bot-buffer-no" />')
                .append(
                  "<li>" +
                    '<small class="text-muted">' +
                    uojTimeHtml(reply.post_time_iso, reply.post_time) +
                    "</small>" +
                    "</li>"
                )
                .append(
                  $("<li />").append(
                    $('<a href="#">Reply</a>').click(function (e) {
                      e.preventDefault();
                      toggleFormReply(
                        reply.id,
                        "Reply @" + reply.nickname + "："
                      );
                    })
                  )
                )
            )
        )
        .uoj_highlight();
    },
    {
      table_classes: ["table", "table-condensed"],
      page_len: 20,
      prevent_focus_on_click: true,
    }
  );
}
function showScore() {

}

// Helper function to get medal type based on rank
function getMedalType(rank) {
  if (!show_medals || !medals_cutoff) {
    return '';
  }
  
  if (rank <= medals_cutoff[0]) {
    return 'gold';
  } else if (rank <= medals_cutoff[1]) {
    return 'silver';
  } else if (rank <= medals_cutoff[2]) {
    return 'bronze';
  }
  return '';
}

function getMedalHTML(medalType) {
  if (!medalType) {
    return '';
  }
  
  var medals = {
    'gold': '🥇',
    'silver': '🥈', 
    'bronze': '🥉'
  };
  
  return medals[medalType] || '';
}

// standings
function showStandings() {
  if (contest_type == "ICPC") {
    var partialScores = typeof icpc_partial_scores !== "undefined" && icpc_partial_scores;
    var solved_first = new Array();
    var n_ac = new Array();
    var n_tot = new Array();
    for (var i = 0; i < problems.length; ++i) {
      solved_first[i] = -1;
      n_ac[i] = 0;
      n_tot[i] = 0;
    }
    for (var key in score) {
      for (var i = 0; i < problems.length; ++i) {
        var item = score[key][i];
        if (item != undefined) {
          ++n_tot[i];
          if (item[0] == item[4] || (!partialScores && item[0] == 97)) {
            ++n_ac[i];
            if (solved_first[i] == -1) {
              solved_first[i] = parseInt(item[1]);
            } else if (parseInt(solved_first[i]) > parseInt(item[1])) {
              solved_first[i] = parseInt(item[1]);
            }
          }
        }
      }
    }
    var username_col = "";
    if (external) {
      username_col = '<th style="width:60em">';
    } else {
      username_col = '<th style="width:15em">';
    }
    $("#standings").long_table(
      standings,
      1,
      "<tr>" +
        '<th style="width:3em">#</th>' +
        username_col +
        uojLocale("username") +
        "</th>" +
        (show_medals ? '<th style="width:4em">Medal</th>' : '') +
        '<th style="width:4em">' +
        uojLocale("contests::total score") +
        "</th>" +
        $.map(problems, function (col, idx) {
          var problemID = "";

          if (problems_id[idx] != null) {
            problemID = problems_id[idx];
          } else {
            problemID = String.fromCharCode("A".charCodeAt(0) + idx);
          }
          if (external && !finalized) {
            var col_st = "success";
            if (n_ac[idx] == 0) {
              col_st = "danger";
            }
            return (
              '<th class="table-' +
              col_st +
              '" style="width:5em;"><div>' +
              problemID +
              '</div><div style="font-size:75%">' +
              n_ac[idx] +
              "/" +
              n_tot[idx] +
              "</div>" +
              "</th>"
            );
          } else {
            var col_st = "success";
            if (n_ac[idx] == 0) {
              col_st = "danger";
            }
            return (
              '<th class="table-' +
              col_st +
              '"style="width:5em;"><div>' +
              '<a href="/contest/' +
              contest_id +
              "/problem/" +
              col +
              '">' +
              problemID +
              '</a></div><div style="font-size:75%">' +
              n_ac[idx] +
              "/" +
              n_tot[idx] +
              "</div></th>"
            );
          }
        }).join("") +
        
        "</tr>",
      function (row) {
        var col_tr = "";
        if (my_name == row[2][0]) {
          col_tr += '<tr class="table-warning">';
        } else if (row[2][2] == 3 || row[2][2] == 0 || row[2][2] == 1) {
          col_tr += "<tr>";
        } else {
          if (external) {
            col_tr += '<tr class="table-info">';
          } else {
            col_tr += "<tr>";
          }
        }
        col_tr += "<td>" + row[3] + "</td>";
        if (row[2][2] == 0) {
          col_tr +=
            "<td>";
            col_tr += getUserLink(row[2][0], row[2][1], row[2][4], row[2][3], row[2][5]);
	if (row[2][6] != null && row[2][6] != "") {
		col_tr += "<br>";
		col_tr += "<div style=\"font-size:75%\"><b>" + row[2][6] + "</b></div>";
	}
		else {

		col_tr += "<br>";
		}
           col_tr += "</td>";
        } else if (row[2][2] == 1 || row[2][2] == 2) {
          col_tr +=
            "<td><b>*</b>" +
            getUserLink(row[2][0], row[2][1], row[2][4], row[2][3], row[2][5]) +
            "</td>";
        } else {
          col_tr += "<td>" + row[2][3] + "</td>";
        }
        
        // Add medal column if show_medals is true
        if (show_medals) {
          var medalType = getMedalType(row[3]);
          col_tr += "<td>" + getMedalHTML(medalType) + "</td>";
        }
        
        var accepted = 0;

        for (var i = 0; i < problems.length; i++) {
          col = score[row[2][0]][i];
          if (col != undefined) {
            if (partialScores) {
              accepted += col[4] > 0 ? Math.max(0, Math.min(1, col[0] / col[4])) : 0;
            } else if (col[0] == col[4] || col[0] == 97) {
              accepted++;
            } else {
              col[0] = 0;
            }
          }
        }

        accepted = Number(accepted.toFixed(10));
        col_tr +=
          "<td>" +
          '<div><span class="uoj-score" data-max="' +
          problems.length +
          '" style="color:' +
          getColOfScore(accepted / problems.length, 1) +
          '">' +
          accepted +
          "</span></div>" +
          "<div>" +
          getPenaltyTimeStr(row[1]) +
          "</div></td>";
        for (var i = 0; i < problems.length; i++) {
          col = score[row[2][0]][i];
          var hacked = false;
          var ac_style = '" style="color:rgb(0, 204,0)';
          if (col != undefined && col[0] == 97 && !partialScores) {
            hacked = true;
            ac_style = '" style="color:rgb(204, 0,0)';
            col_tr += '<td class="table-danger">';
          }
          else if (
            col != undefined &&
            col[0] == col[4] &&
            col[1] == solved_first[i]
          ) {
            col_tr += '<td class="table-success">';
          }
          else {
            col_tr += "<td>";
          }
          var partial = partialScores && col != undefined && col[0] > 0 && col[0] < col[4];
          var fractionLabel = partial ? " (" + Number((col[0] / col[4]).toFixed(10)).toString().replace(/^0/, "") + ")" : "";
          // Pending submissions after a partial score stay on the score line, like "?N" cells.
          var pendingLabel = partial && col[7] > 0 ? ' <span style="color:blue">?' + col[7] + "</span>" : "";
          if (partial) {
            ac_style = '" style="color:#c78000';
          }
          if (col != undefined) {
            var link = "/submission/" + col[2];
            if (col[2] == -1) link = "#";
            if (col[5] == 1) {
              col_tr +=
                '<div><a href="' +
                link +
                '" class="uoj-score" data-max="' +
                col[3] +
                '" style="color:blue">' +
                "?" +
                (partialScores ? col[7] : col[3] + 1) +
                "</a></div>";
            } else if (col[0] == 0) {
              col_tr +=
                '<div><a href="' +
                link +
                '" class="uoj-score" data-max="' +
                col[3] +
                '" style="color:' +
                getColOfScore(col[0], 1) +
                '">' +
                "-" +
                (col[3] + 1) +
                "</a></div>";
            } else if (col[3] > 0) {
              col_tr +=
                '<div><a href="' +
                link +
                '" class="uoj-score" data-max="' +
                col[3] +
                ac_style +
                '" data-assigned="1">' +
                "+" +
                col[3] + fractionLabel +
                "</a>" + pendingLabel + "</div>";
            } else if (col[3] == 0) {
              col_tr +=
                '<div><a href="' +
                link +
                '" class="uoj-score" data-max="' +
                col[3] +
                ac_style +
                  '" data-assigned="1">' +
                "+" + fractionLabel +
                "</a>" + pendingLabel + "</div>";
            }

            if (col[1] >= 0) {
              if (standings_version < 2) {
                col_tr += "<div>" + getPenaltyTimeStr(col[1]) + "</div>";
              } else {
                if (col[0] > 0) {
                  col_tr += "<div>" + getPenaltyTimeStr(col[1]) + "</div>";
                }
              }
            }
          }
          col_tr += "</td>";
        }
        col_tr += "</tr>";
        return col_tr;
      },
      {
        table_classes: [
          "table",
          "table-bordered",
          "table-striped",
          "table-text-center",
          "table-vertical-middle",
          "table-condensed",
        ],
        page_len: 100,
        print_after_table: function () {
          return (
            '<div class="text-right text-muted">' +
            uojLocale("contests::n participants", standings.length) +
            "</div>"
          );
        },
      }
    );
  } else {
    $("#standings").long_table(
      standings,
      1,
      "<tr>" +
        '<th style="width:5em">#</th>' +
        '<th style="width:14em">' +
        uojLocale("username") +
        "</th>" +
        (show_medals ? '<th style="width:5em">Medal</th>' : '') +
        '<th style="width:5em">' +
        uojLocale("contests::total score") +
        "</th>" +
        $.map(problems, function (col, idx) {
          if (problems_id[idx] != null) {
            return (
              '<th style="width:8em;">' +
              '<a href="/contest/' +
              contest_id +
              "/problem/" +
              col +
              '">' +
              problems_id[idx] +
              "</a>" +
              "</th>"
            );
          }
          return (
            '<th style="width:8em;">' +
            '<a href="/contest/' +
            contest_id +
            "/problem/" +
            col +
            '">' +
            String.fromCharCode("A".charCodeAt(0) + idx) +
            "</a>" +
            "</th>"
          );
        }).join("") +
        "</tr>",
      function (row) {
        var col_tr = "";
        if (my_name == row[2][0] || row[2][2] == 4) {
          col_tr += '<tr class="table-warning">';
        } else {
          col_tr += "<tr>";
        }
        col_tr += "<td>" + row[3] + "</td>";
        if (row[2][2] == 0) {
          col_tr +=
            "<td>" +
            getUserLink(row[2][0], row[2][1], row[2][4], row[2][3], row[2][5]) +
            "</td>";
        } else if (row[2][2] == 1 || row[2][2] == 2) {
          col_tr +=
            "<td><b>*</b>" +
            getUserLink(row[2][0], row[2][1], row[2][4], row[2][3], row[2][5]) +
            "</td>";
        } else {
          col_tr += "<td>" + row[2][3] + "</td>";
        }
        
        // Add medal column if show_medals is true
        if (show_medals) {
          var medalType = getMedalType(row[3]);
          col_tr += "<td>" + getMedalHTML(medalType) + "</td>";
        }
        
        var totalScore = fullscore;
        col_tr += "<td>";
        col_tr +=
          '<div><span class="uoj-score" data-max="' +
          totalScore +
          '" style="color:' +
          getColOfScore(row[0], totalScore) +
          '">' +
          row[0].toFixed(2) +
          "</span></div>";
        if (contest_type == "UOJ") {
          col_tr += "<div>" + getPenaltyTimeStr(row[1]) + "</div>";
        }
        col_tr += "</td>";
        for (var i = 0; i < problems.length; i++) {
          col_tr += "<td>";
          col = score[row[2][0]][i];
          if (col != undefined) {
            var link = "/submission/" + col[2];
            if (col[2] == -1) {
              link = "#";
            }
            col_tr +=
              '<div><a href="' +
              link +
              '" class="uoj-score" data-max = "' +
              col[4] +
              '" style="color:' +
              getColOfScore(col[0], col[4]) +
              '">' +
              (Number.isInteger(col[0]) ? col[0] : col[0].toFixed(2)) +
              "</a></div>";
            if (contest_type == "UOJ") {
              if (standings_version < 2) {
                col_tr += "<div>" + getPenaltyTimeStr(col[1]) + "</div>";
              } else {
                if (col[0] > 0) {
                  col_tr += "<div>" + getPenaltyTimeStr(col[1]) + "</div>";
                }
              }
            }
          }
          col_tr += "</td>";
        }
        col_tr += "</tr>";
        return col_tr;
      },
      {
        table_classes: [
          "table",
          "table-bordered",
          "table-striped",
          "table-text-center",
          "table-vertical-middle",
          "table-condensed",
        ],
        page_len: 100,
        print_after_table: function () {
          return (
            '<div class="text-right text-muted">' +
            uojLocale("contests::n participants", standings.length) +
            "</div>"
          );
        },
      }
    );
  }
}
