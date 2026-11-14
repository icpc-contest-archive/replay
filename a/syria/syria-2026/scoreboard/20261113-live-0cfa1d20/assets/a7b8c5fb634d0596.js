(() => {
  "use strict";

  const DEFAULT_FALLBACK_IMAGE = "logo.png";
  const TEAM_ROW = ".team-row[data-team-id]";
  const PROBLEM_CELL = ".problem-cell[data-problem-index]";
  const DETAILS_TRIGGER = ".team-button, .team-details, [data-team-details]";
  const MANAGED_IMAGE = ".team-photo img, #teamPhotoImage";
  const HEX_COLOR = /^#?([0-9a-f]{6})$/i;
  const failedImages = new Set();

  let dialog = null;
  let overlay = null;
  let modalImage = null;
  let previousFocus = null;

  function element(id) {
    return document.getElementById(id);
  }

  function normalizedUrl(source) {
    if (!source) return "";

    try {
      return new URL(source, document.baseURI).href;
    } catch (_error) {
      return String(source);
    }
  }

  function fallbackImageSource(image) {
    return (
      image?.dataset?.fallbackSrc ||
      document.querySelector(".site-logo")?.getAttribute("src") ||
      DEFAULT_FALLBACK_IMAGE
    );
  }

  function useFallback(image) {
    const source = image.getAttribute("src") || "";
    const fallbackImage = fallbackImageSource(image);
    const fallbackUrl = normalizedUrl(fallbackImage);

    if (normalizedUrl(source) === fallbackUrl || image.dataset.fallbackApplied === "true") {
      image.hidden = true;
      return;
    }

    if (source) failedImages.add(normalizedUrl(source));
    image.dataset.originalSrc ||= source;
    image.dataset.fallbackApplied = "true";
    image.hidden = false;
    image.src = fallbackImage;
  }

  function handleImageError(event) {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.matches(MANAGED_IMAGE)) return;
    useFallback(image);
  }

  function text(selector, root = document) {
    return root.querySelector(selector)?.textContent?.trim() || "";
  }

  function setText(id, value) {
    const target = element(id);
    if (target) target.textContent = value ?? "";
  }

  function splitValues(value) {
    return String(value || "")
      .split(/[\s,;|]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseNumber(value) {
    const source = String(value ?? "").trim();
    if (!source) return null;

    const number = Number(source);
    return Number.isFinite(number) ? number : null;
  }

  function solvedProblems(row) {
    return splitValues(row.dataset.solvedProblems);
  }

  function firstToSolveProblems(row) {
    return splitValues(row.dataset.ftsProblems);
  }

  function replaceProblemList(id, labels) {
    const list = element(id);
    if (!list) return;

    list.replaceChildren();
    if (!labels.length) {
      list.textContent = "\u2014";
      return;
    }

    const fragment = document.createDocumentFragment();
    labels.forEach((label) => {
      const tag = document.createElement("span");
      tag.className = "problem-tag";
      tag.textContent = label;
      fragment.appendChild(tag);
    });
    list.appendChild(fragment);
  }

  function ensureModalImage() {
    if (modalImage?.isConnected) return modalImage;

    const existing = element("teamPhotoImage");
    if (existing instanceof HTMLImageElement) {
      modalImage = existing;
      return modalImage;
    }

    const container = element("teamPhoto");
    if (!container) return null;

    modalImage = document.createElement("img");
    modalImage.id = "teamPhotoImage";
    modalImage.decoding = "async";
    container.appendChild(modalImage);
    return modalImage;
  }

  function setModalPhoto(row, teamName) {
    const image = ensureModalImage();
    if (!image) return;

    const rowImage = row.querySelector(".team-photo img");
    const fallbackImage = fallbackImageSource(rowImage || image);
    const allowExternalTeamPhoto = document.body?.dataset.delivery !== "standalone";
    const source =
      row.dataset.photoSrc ||
      rowImage?.dataset.originalSrc ||
      rowImage?.getAttribute("src") ||
      (allowExternalTeamPhoto && row.dataset.teamId
        ? `images/photos/${encodeURIComponent(row.dataset.teamId)}/photo.jpg`
        : "");

    delete image.dataset.fallbackApplied;
    image.hidden = false;
    image.alt = teamName ? `${teamName} team photo` : "Team photo";

    if (!source || failedImages.has(normalizedUrl(source))) {
      image.dataset.fallbackApplied = "true";
      image.src = fallbackImage;
      return;
    }

    image.src = source;
  }

  function updateModal(row) {
    const solved = solvedProblems(row);
    const firstToSolve = firstToSolveProblems(row);
    const teamName = row.dataset.teamName || text(".team-name", row);
    const organization = row.dataset.organization || "";
    const rank = row.dataset.rank || text(".team-rank", row);
    const solvedCount =
      row.dataset.solved || text(".team-solved", row) || String(solved.length);
    const penalty =
      row.dataset.penalty || row.dataset.points || text(".team-time", row) || "\u2014";

    setText("teamName", teamName);
    setText("orgName", organization);
    setText("teamRank", rank ? `Rank #${rank}` : "Rank \u2014");
    setText("problemsSolvedCount", solvedCount);
    setText("penaltiesCount", penalty);
    setText("ftsCount", String(firstToSolve.length));
    replaceProblemList("problemsSolvedList", solved);
    replaceProblemList("ftsProblemsList", firstToSolve);

    const badge = element("ftsBadge");
    if (badge) badge.hidden = firstToSolve.length === 0;

    setModalPhoto(row, teamName);
  }

  function modalIsOpen() {
    return Boolean(overlay && !overlay.hidden && overlay.classList.contains("is-open"));
  }

  function focusableElements() {
    if (!dialog) return [];

    return Array.from(
      dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((item) => !item.hidden);
  }

  function openModal(row, trigger) {
    if (!dialog || !overlay) return;

    updateModal(row);
    if (!modalIsOpen()) {
      previousFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    }

    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-open");
    dialog.classList.add("is-open");
    document.body?.classList.add("modal-open");

    const closeButton = dialog.querySelector("[data-modal-close], .close-btn");
    requestAnimationFrame(() => (closeButton || dialog).focus({ preventScroll: true }));
  }

  function closeModal() {
    if (!dialog || !overlay || overlay.hidden) return;

    overlay.classList.remove("is-open");
    dialog.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    document.body?.classList.remove("modal-open");

    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
    previousFocus = null;
  }

  function rowForActivation(target) {
    if (!(target instanceof Element)) return null;

    const details = target.closest(DETAILS_TRIGGER);
    if (details) return details.closest(TEAM_ROW);

    const row = target.closest(TEAM_ROW);
    if (!row) return null;

    const interactive = target.closest(
      "a, button, input, select, textarea, label, summary, [role='button']"
    );
    return interactive ? null : row;
  }

  function handleClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const closeButton = target.closest("[data-modal-close], .close-btn");
    if (closeButton && dialog?.contains(closeButton)) {
      closeModal();
      return;
    }

    if (overlay && overlay !== dialog && target === overlay) {
      closeModal();
      return;
    }

    const row = rowForActivation(target);
    if (row) openModal(row, target.closest(DETAILS_TRIGGER) || row);
  }

  function trapFocus(event) {
    const focusable = focusableElements();
    if (!focusable.length) {
      event.preventDefault();
      dialog?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && modalIsOpen()) {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key === "Tab" && modalIsOpen()) {
      trapFocus(event);
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") return;
    if (!(event.target instanceof Element) || !event.target.matches(TEAM_ROW)) return;

    event.preventDefault();
    openModal(event.target, event.target);
  }

  function applyProblemColors() {
    document.querySelectorAll("[data-color]").forEach((target) => {
      const match = target.dataset.color?.trim().match(HEX_COLOR);
      if (match) {
        target.style.setProperty("--problem-color", `#${match[1].toLowerCase()}`);
      }
    });
  }

  function rankingMetrics(row) {
    const solved = parseNumber(row.dataset.solved);
    const penalty = parseNumber(row.dataset.penalty ?? row.dataset.points);
    const lastSolved = parseNumber(row.dataset.lastSolved);
    return {
      valid:
        solved !== null &&
        penalty !== null &&
        lastSolved !== null &&
        Number.isInteger(solved) &&
        solved >= 0,
      solved,
      penalty,
      lastSolved,
    };
  }

  function sameRanking(left, right) {
    if (!left.valid || !right.valid) return false;
    return (
      left.solved === right.solved &&
      left.penalty === right.penalty &&
      left.lastSolved === right.lastSolved
    );
  }

  function applyOfficialRanking() {
    const table = document.querySelector(
      'table.scoreboard[data-ranking="official"], table.scoreboard[data-official-ranking="true"]'
    );
    if (!table) return;

    const rows = Array.from(table.querySelectorAll(TEAM_ROW));
    let previous = null;
    let rank = 0;

    rows.forEach((row, index) => {
      const current = rankingMetrics(row);
      if (!previous || !sameRanking(previous, current)) rank = index + 1;

      const rankCell = row.querySelector(".team-rank");
      if (rankCell) rankCell.textContent = String(rank);
      row.dataset.rank = String(rank);
      previous = current;
    });
  }

  function compareAscending(left, right) {
    if (left === right) return 0;
    return left < right ? -1 : 1;
  }

  function compareDescending(left, right) {
    return compareAscending(right, left);
  }

  function compareOptionalAscending(left, right) {
    if (left === null && right === null) return 0;
    if (left === null) return 1;
    if (right === null) return -1;
    return compareAscending(left, right);
  }

  function scoreboardTeams() {
    const table = document.querySelector("table.scoreboard");
    if (!table) return [];

    return Array.from(table.querySelectorAll(`tbody.team-rows > ${TEAM_ROW}`)).map(
      (row, rowIndex) => {
        const siteId = row.dataset.siteId || "";
        const teamId = row.dataset.teamId || "";
        const teamKey = row.dataset.teamKey || `${siteId}:${teamId}:${rowIndex}`;
        const problems = Array.from(row.querySelectorAll(PROBLEM_CELL)).map((cell) => {
          const attempts = parseNumber(cell.dataset.attempts);
          const solutionMinute = parseNumber(cell.dataset.solutionMinute);
          const solved = cell.dataset.solved === "true";
          const validSolve =
            solved &&
            attempts !== null &&
            Number.isInteger(attempts) &&
            attempts >= 1 &&
            solutionMinute !== null &&
            solutionMinute >= 0 &&
            !cell.classList.contains("status-pending");

          return {
            cell,
            index: cell.dataset.problemIndex || "",
            letter: cell.dataset.problemLetter || cell.dataset.problemIndex || "?",
            solved,
            attempts,
            solutionMinute,
            validSolve,
            globalFts: validSolve && cell.dataset.globalFts === "true",
            wrongSubmissions: validSolve ? attempts - 1 : null,
          };
        });

        return {
          row,
          teamId,
          teamKey,
          name: row.dataset.teamName || text(".team-name", row) || `Team ${teamId}`,
          organization: row.dataset.organization || "",
          totalPenalty: parseNumber(row.dataset.penalty ?? row.dataset.points),
          problems,
        };
      }
    );
  }

  function recomputePageFirstToSolve(teams) {
    if (document.body?.dataset.ftsMode !== "page") return;

    const solvesByProblem = new Map();

    teams.forEach((team) => {
      team.row.dataset.ftsProblems = "";

      team.problems.forEach((problem) => {
        if (problem.cell.classList.contains("status-first")) {
          problem.cell.classList.remove("status-first");
          if (problem.solved) problem.cell.classList.add("status-solved");
        }

        if (!problem.validSolve) return;
        if (!solvesByProblem.has(problem.index)) solvesByProblem.set(problem.index, []);
        solvesByProblem.get(problem.index).push({ team, problem });
      });
    });

    solvesByProblem.forEach((candidates) => {
      const firstMinute = candidates.reduce(
        (minimum, candidate) => Math.min(minimum, candidate.problem.solutionMinute),
        Number.POSITIVE_INFINITY
      );
      const minuteWinners = candidates.filter(
        (candidate) => candidate.problem.solutionMinute === firstMinute
      );
      const knownGlobalWinners = minuteWinners.filter(
        (candidate) => candidate.problem.globalFts
      );
      const winners = knownGlobalWinners.length ? knownGlobalWinners : minuteWinners;

      winners.forEach(({ problem }) => {
        problem.cell.classList.remove("status-solved");
        problem.cell.classList.add("status-first");
      });
    });

    teams.forEach((team) => {
      const labels = [];
      const seen = new Set();
      team.problems.forEach((problem) => {
        if (!problem.validSolve || !problem.cell.classList.contains("status-first")) return;
        if (seen.has(problem.letter)) return;
        seen.add(problem.letter);
        labels.push(problem.letter);
      });
      team.row.dataset.ftsProblems = labels.join(",");
    });
  }

  function tiedBest(items, compare) {
    if (!items.length) return [];

    let best = items[0];
    let winners = [best];
    for (let index = 1; index < items.length; index += 1) {
      const candidate = items[index];
      const result = compare(candidate, best);
      if (result < 0) {
        best = candidate;
        winners = [candidate];
      } else if (result === 0) {
        winners.push(candidate);
      }
    }
    return winners;
  }

  function groupRunsByTeam(runs) {
    const grouped = new Map();
    runs.forEach(({ team, problem }) => {
      if (!grouped.has(team.teamKey)) grouped.set(team.teamKey, { team, problems: [] });
      grouped.get(team.teamKey).problems.push(problem);
    });
    return Array.from(grouped.values());
  }

  function solidCandidate(team) {
    const problems = team.problems.filter(
      (problem) => problem.validSolve && problem.attempts === 1
    );
    if (!problems.length) return null;

    const minutes = problems.map((problem) => problem.solutionMinute);
    const exactProduct = minutes.every(Number.isSafeInteger)
      ? minutes.reduce((product, minute) => product * BigInt(minute), 1n)
      : null;
    const hasZero = minutes.some((minute) => minute === 0);
    const logMean = hasZero
      ? Number.NEGATIVE_INFINITY
      : minutes.reduce((total, minute) => total + Math.log(minute), 0) / minutes.length;

    return {
      team,
      problems,
      count: problems.length,
      exactProduct,
      logMean,
      geometricMean: hasZero ? 0 : Math.exp(logMean),
    };
  }

  function compareSolid(left, right) {
    const countResult = compareDescending(left.count, right.count);
    if (countResult !== 0) return countResult;

    if (left.exactProduct !== null && right.exactProduct !== null) {
      return compareAscending(left.exactProduct, right.exactProduct);
    }
    return compareAscending(left.logMean, right.logMean);
  }

  function computeAwards(teams) {
    const runs = teams.flatMap((team) =>
      team.problems
        .filter((problem) => problem.validSolve)
        .map((problem) => ({ team, problem }))
    );

    const extreme = tiedBest(runs, (left, right) => {
      const minuteResult = compareAscending(
        left.problem.solutionMinute,
        right.problem.solutionMinute
      );
      return minuteResult || compareOptionalAscending(left.team.totalPenalty, right.team.totalPenalty);
    });

    const steadfast = tiedBest(runs, (left, right) => {
      const minuteResult = compareDescending(
        left.problem.solutionMinute,
        right.problem.solutionMinute
      );
      return minuteResult || compareOptionalAscending(left.team.totalPenalty, right.team.totalPenalty);
    });

    const relentless = tiedBest(runs, (left, right) => {
      const wrongResult = compareDescending(
        left.problem.wrongSubmissions,
        right.problem.wrongSubmissions
      );
      return (
        wrongResult ||
        compareDescending(left.problem.solutionMinute, right.problem.solutionMinute)
      );
    });

    const solid = tiedBest(teams.map(solidCandidate).filter(Boolean), compareSolid);

    return {
      extreme: groupRunsByTeam(extreme),
      steadfast: groupRunsByTeam(steadfast),
      solid,
      relentless: groupRunsByTeam(relentless),
    };
  }

  function uniqueProblemLabels(problems) {
    return Array.from(new Set(problems.map((problem) => problem.letter)));
  }

  function problemPhrase(problems) {
    const labels = uniqueProblemLabels(problems);
    return `${labels.length === 1 ? "Problem" : "Problems"} ${labels.join(", ")}`;
  }

  function displayNumber(value, maximumFractionDigits = 2) {
    if (!Number.isFinite(value)) return "\u2014";
    return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
  }

  function runAwardDetails(name, winner) {
    const problem = winner.problems[0];
    const problems = problemPhrase(winner.problems);

    if (name === "relentless") {
      const wrong = problem.wrongSubmissions;
      return `${problems}: ${wrong} wrong submission${wrong === 1 ? "" : "s"}, solved at minute ${displayNumber(problem.solutionMinute)}`;
    }

    const penalty =
      winner.team.totalPenalty === null ? "unknown" : displayNumber(winner.team.totalPenalty);
    return `${problems} at minute ${displayNumber(problem.solutionMinute)}; team penalty ${penalty}`;
  }

  function solidAwardDetails(winner) {
    const solves = `${winner.count} first-attempt solve${winner.count === 1 ? "" : "s"}`;
    const mean = `geometric mean ${displayNumber(winner.geometricMean)} min`;
    return `${solves}; ${mean}; ${problemPhrase(winner.problems)}`;
  }

  function renderAward(name, winners, details) {
    const container = document.querySelector(`[data-award-winners="${name}"]`);
    if (!container) return;

    container.replaceChildren();
    container.closest(".award-card")?.classList.toggle("has-joint-winners", winners.length > 1);

    if (!winners.length) {
      const empty = document.createElement("p");
      empty.className = "award-empty";
      empty.textContent = "Not awarded yet";
      container.appendChild(empty);
      return;
    }

    if (winners.length > 1) {
      const label = document.createElement("p");
      label.className = "award-result-label";
      label.textContent = "Joint winners";
      container.appendChild(label);
    }

    winners.forEach((winner) => {
      const item = document.createElement("div");
      item.className = "award-winner";
      item.dataset.teamId = winner.team.teamId;
      item.dataset.teamKey = winner.team.teamKey;

      const teamName = document.createElement("strong");
      teamName.className = "award-team-name";
      teamName.textContent = winner.team.name;
      item.appendChild(teamName);

      if (winner.team.organization) {
        const organization = document.createElement("span");
        organization.className = "award-organization";
        organization.textContent = winner.team.organization;
        item.appendChild(organization);
      }

      const metric = document.createElement("span");
      metric.className = "award-metric";
      metric.textContent = details(winner);
      item.appendChild(metric);
      container.appendChild(item);
    });
  }

  function renderAwards(teams) {
    const section = element("contest-awards");
    if (!section) return;

    const awards = computeAwards(teams);
    renderAward("extreme", awards.extreme, (winner) => runAwardDetails("extreme", winner));
    renderAward("steadfast", awards.steadfast, (winner) =>
      runAwardDetails("steadfast", winner)
    );
    renderAward("solid", awards.solid, solidAwardDetails);
    renderAward("relentless", awards.relentless, (winner) =>
      runAwardDetails("relentless", winner)
    );
    section.hidden = false;
  }

  function prepareModal() {
    dialog = element("floating-element");
    if (!dialog) return;

    overlay = element("modal-overlay") || dialog.closest(".modal-overlay") || dialog;
    dialog.setAttribute("role", dialog.getAttribute("role") || "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", dialog.getAttribute("aria-labelledby") || "teamName");
    if (!dialog.hasAttribute("tabindex")) dialog.setAttribute("tabindex", "-1");

    overlay.classList.remove("is-open");
    dialog.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    ensureModalImage();
  }

  function repairAlreadyBrokenImages() {
    document.querySelectorAll(MANAGED_IMAGE).forEach((image) => {
      if (image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0) {
        useFallback(image);
      }
    });
  }

  function init() {
    prepareModal();
    repairAlreadyBrokenImages();
    applyProblemColors();
    applyOfficialRanking();
    const teams = scoreboardTeams();
    recomputePageFirstToSolve(teams);
    renderAwards(teams);
    document.querySelector('.site-logo').src = "acpc-white.png";
  }

  document.addEventListener("error", handleImageError, true);
  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeydown);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
