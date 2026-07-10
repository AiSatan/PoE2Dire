  const TOOLTIP_ID = "PoE2Dire-tooltip";

  const tooltipState = {
    showTimer: 0,
    hideTimer: 0,
    activeCard: null,
    token: 0,
  };

  if (supportsHover()) initEntityTooltips();
  else initKeywordTapTooltips();

  function supportsHover() {
    return !window.matchMedia || window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  function initEntityTooltips() {
    document.addEventListener("mouseover", onPointerOver, true);
    document.addEventListener("mouseout", onPointerOut, true);
    document.addEventListener("focusin", onPointerOver, true);
    document.addEventListener("focusout", onPointerOut, true);
    window.addEventListener("scroll", hideTooltip, true);
  }

  function initKeywordTapTooltips() {
    document.addEventListener("click", onKeywordTap, true);
    window.addEventListener("scroll", hideTooltip, true);
  }

  function onKeywordTap(event) {
    const root = document.getElementById("PoE2Dire-root");
    if (!root) return;

    const keyword = event.target?.closest?.(".pdp-keyword");
    if (!keyword || !root.contains(keyword)) {
      hideTooltip();
      return;
    }

    if (tooltipState.activeCard === keyword && document.getElementById(TOOLTIP_ID)) {
      hideTooltip();
      return;
    }

    showTooltip(keyword);
  }

  function onPointerOver(event) {
    const viaMouse = event.type === "mouseover";
    const card = tooltipCardFrom(event.target, viaMouse);
    if (!card) return;
    if (!viaMouse && !isKeyboardFocus(card)) return;
    if (card === tooltipState.activeCard) {
      window.clearTimeout(tooltipState.hideTimer);
      return;
    }
    scheduleTooltip(card);
  }

  function isKeyboardFocus(element) {
    try {
      return element.matches(":focus-visible");
    } catch (error) {
      return true;
    }
  }

  function onPointerOut(event) {
    const viaMouse = event.type === "mouseout";
    const card = tooltipCardFrom(event.target, viaMouse);
    if (!card) return;
    const next = event.relatedTarget ? tooltipCardFrom(event.relatedTarget, viaMouse) : null;
    if (next === card) return;
    scheduleHide();
  }

  function tooltipCardFrom(target, viaMouse) {
    if (!target || typeof target.closest !== "function") return null;
    const root = document.getElementById("PoE2Dire-root");
    if (!root) return null;

    const keyword = target.closest(".pdp-keyword");
    if (keyword && root.contains(keyword)) return keyword;

    const scope = viaMouse ? target.closest(".pdp-icon") : target;
    if (!scope) return null;

    const card = scope.closest(".pdp-group[data-pdp-details-title]");
    return card && root.contains(card) ? card : null;
  }

  function scheduleTooltip(card) {
    window.clearTimeout(tooltipState.showTimer);
    window.clearTimeout(tooltipState.hideTimer);
    const delay = card.classList.contains("pdp-keyword")
      ? CONFIG.ui.keywordShowDelayMs
      : CONFIG.ui.tooltipShowDelayMs;
    tooltipState.showTimer = window.setTimeout(() => showTooltip(card), delay);
  }

  function scheduleHide() {
    window.clearTimeout(tooltipState.showTimer);
    window.clearTimeout(tooltipState.hideTimer);
    tooltipState.hideTimer = window.setTimeout(hideTooltip, CONFIG.ui.tooltipHideDelayMs);
  }

  function showTooltip(card) {
    const root = document.getElementById("PoE2Dire-root");
    if (!root || !root.contains(card)) return;

    if (card.classList.contains("pdp-keyword")) {
      tooltipState.activeCard = card;
      tooltipState.token += 1;
      const keywordTip = ensureTooltip(root);
      renderKeywordTooltip(keywordTip, card.dataset.pdpKeyword || "");
      positionTooltip(keywordTip, card);
      return;
    }

    tooltipState.activeCard = card;
    const token = ++tooltipState.token;

    const tip = ensureTooltip(root);
    renderTooltipLoading(tip, card.dataset.pdpDetailsTitle || "");
    positionTooltip(tip, card);

    const group = {
      wikiTitle: card.dataset.pdpDetailsTitle || "",
      title: card.dataset.pdpDetailsTitle || "",
      iconKind: card.dataset.pdpDetailsKind || "general",
    };

    fetchEntityDetails(group)
      .then((details) => {
        if (token !== tooltipState.token) return;
        if (details.status === "ok") renderTooltipDetails(tip, details);
        else if (details.status === "error") {
          renderTooltipError(tip, details);
          scheduleTooltipRetry(card, details);
        } else renderTooltipEmpty(tip);
        positionTooltip(tip, card);
      })
      .catch(() => {
        if (token !== tooltipState.token) return;
        renderTooltipError(tip, null);
        positionTooltip(tip, card);
      });
  }

  function hideTooltip() {
    window.clearTimeout(tooltipState.showTimer);
    window.clearTimeout(tooltipState.hideTimer);
    tooltipState.activeCard = null;
    tooltipState.token += 1;
    document.getElementById(TOOLTIP_ID)?.remove();
  }

  function ensureTooltip(root) {
    const existing = document.getElementById(TOOLTIP_ID);
    if (existing && existing.isConnected) return existing;

    const tip = el("div", "pdp-tooltip");
    tip.id = TOOLTIP_ID;
    tip.setAttribute("role", "tooltip");
    root.append(tip);
    return tip;
  }

  function renderTooltipLoading(tip, title) {
    const clean = cleanTitle(title);
    tip.replaceChildren(el("div", "pdp-tooltip-loading", clean ? `Loading ${clean}…` : "Loading…"));
  }

  function renderTooltipEmpty(tip) {
    tip.replaceChildren(el("div", "pdp-tooltip-empty", "No wiki details for this entry."));
  }

  function renderKeywordTooltip(tip, term) {
    const description = keywordDescription(term);
    if (!description) {
      renderTooltipEmpty(tip);
      return;
    }

    tip.replaceChildren(el("div", "pdp-tooltip-keyword", [
      el("div", "pdp-tooltip-keyword-term", term),
      el("div", "pdp-tooltip-keyword-text", description),
    ]));
  }

  function renderTooltipError(tip, details) {
    tip.replaceChildren(el("div", "pdp-tooltip-error", tooltipErrorText(details)));
  }

  function scheduleTooltipRetry(card, details) {
    const waitMs = details.retryInMs || 0;
    if (!waitMs || waitMs > CONFIG.network.maxCooldownMs) return;

    window.setTimeout(() => {
      if (tooltipState.activeCard !== card) return;
      if (!document.getElementById(TOOLTIP_ID)) return;
      showTooltip(card);
    }, waitMs + 500);
  }

  function tooltipErrorText(details) {
    if (details?.challenged) {
      return "Wiki is overwhelmed, try again in a minute.";
    }
    if (details?.rateLimited) {
      const seconds = Math.ceil((details.retryInMs || 0) / 1000);
      return seconds > 0
        ? `Wiki is overwhelmed, try again in ${seconds}s.`
        : "Wiki is overwhelmed, try again in a bit.";
    }
    return "Couldn't reach the wiki, hover again to retry.";
  }

  function renderTooltipDetails(tip, details) {
    const node = detailsNodeFromHtml(details.html);
    if (!node) {
      renderTooltipEmpty(tip);
      return;
    }

    const body = el("div", "pdp-tooltip-body");
    body.append(node);
    tip.replaceChildren(body, el("div", "pdp-tooltip-source", details.source || ""));
  }

  function detailsNodeFromHtml(html) {
    if (!html) return null;
    const node = selectDetailsBox(html)
      || new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
    if (!node) return null;
    const clean = sanitizeDetailsNode(node);
    return clean ? document.importNode(clean, true) : null;
  }

  function positionTooltip(tip, card) {
    fitTooltip(tip);
    const icon = card.querySelector(".pdp-icon") || card;
    const rect = icon.getBoundingClientRect();
    const margin = 12;
    const width = tip.offsetWidth || 320;
    const height = tip.offsetHeight || 160;

    let left = rect.right + margin;
    if (left + width > window.innerWidth - margin) left = rect.left - margin - width;
    if (left < margin) left = margin;

    let top = rect.top;
    if (top + height > window.innerHeight - margin) top = window.innerHeight - margin - height;
    if (top < margin) top = margin;

    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;
  }

  function fitTooltip(tip) {
    tip.classList.remove("pdp-tooltip-compact");
    if (!tip.querySelector(".pdp-tooltip-body")) return;
    const limit = window.innerHeight - 24;
    if (tip.offsetHeight > limit) tip.classList.add("pdp-tooltip-compact");
  }
