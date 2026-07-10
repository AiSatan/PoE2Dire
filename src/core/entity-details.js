  const XHTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  const DETAILS_BOX_SELECTORS = [
    ".item-box",
    ".skill-box",
    ".infobox-page-container",
    ".infobox",
    ".infocard",
  ];
  const DETAILS_DROP_SELECTORS = [".images", ".group.-help", ".group.-flavour", ".item-icon"];
  const DETAILS_ALLOWED_TAGS = new Set([
    "A", "B", "BLOCKQUOTE", "BR", "CAPTION", "CODE", "COL", "COLGROUP",
    "DD", "DIV", "DL", "DT", "EM", "FIGCAPTION", "FIGURE",
    "H1", "H2", "H3", "H4", "H5", "H6", "HR", "I", "LI",
    "OL", "P", "PRE", "SMALL", "SPAN", "STRONG", "SUB", "SUP",
    "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "U", "UL",
  ]);
  const DETAILS_KEEP_ATTRS = new Set(["class", "title", "colspan", "rowspan"]);
  const DETAILS_STYLE_PROPS = new Set(["color", "background-color", "font-weight", "font-style", "text-align"]);

  const pendingDetails = new Map();

  function fetchEntityDetails(group) {
    const endpoint = detailsEndpoint();
    if (!endpoint) return Promise.resolve({ status: "missing" });

    const kind = group.iconKind || "general";
    const title = cleanTitle(group.wikiTitle || group.title);
    if (!title) return Promise.resolve({ status: "missing" });

    const key = detailsStoreKey(endpoint.name, title, kind);
    const pending = pendingDetails.get(key);
    if (pending) return pending;

    const request = lookupEntityDetails(endpoint, key, title, kind).finally(() => {
      pendingDetails.delete(key);
    });
    pendingDetails.set(key, request);
    return request;
  }

  async function lookupEntityDetails(endpoint, key, title, kind) {
    const store = createDetailsStore();

    if (store) {
      try {
        const cached = await store.get(key);
        if (cached) {
          return cached.missing
            ? { status: "missing" }
            : { status: "ok", html: cached.html, source: cached.source };
        }
      } catch (error) {}
    }

    let result = null;
    let failure = null;
    for (const candidate of iconLookupCandidateTitles(title, kind)) {
      try {
        result = await fetchParsedDetails(endpoint, candidate);
        if (result) break;
      } catch (error) {
        failure = error;
      }
    }

    if (!result && failure) {
      return {
        status: "error",
        challenged: Boolean(failure.challenged),
        rateLimited: Boolean(failure.rateLimited),
        retryInMs: failure.retryInMs || 0,
      };
    }

    if (store) {
      try {
        await store.set(key, result
          ? { html: result.html, source: result.source, cachedAt: Date.now(), expiresAt: Date.now() + CONFIG.cache.hitTtlMs }
          : { missing: true, cachedAt: Date.now(), expiresAt: Date.now() + CONFIG.cache.missTtlMs });
      } catch (error) {}
    }

    return result
      ? { status: "ok", html: result.html, source: result.source }
      : { status: "missing" };
  }

  function detailsEndpoint() {
    return state.wikiEndpoints?.[0] || CONFIG.apiEndpoints[0];
  }

  async function fetchParsedDetails(endpoint, title) {
    let box = selectDetailsBox(await parsePageHtml(endpoint, title, 0, true));
    if (!box) box = selectDetailsBox(await parsePageHtml(endpoint, title, null, true));
    if (!box) return null;

    const clean = sanitizeDetailsNode(box);
    if (!clean) return null;

    return {
      html: clean.outerHTML,
      source: endpoint.name,
    };
  }

  async function parsePageHtml(endpoint, title, section, priority) {
    const params = {
      action: "parse",
      redirects: "1",
      prop: "text",
      page: title,
    };
    if (section != null) params.section = String(section);

    const json = await fetchJsonWithRetry(wikiApiUrl(endpoint, params), priority);
    return json.parse?.text?.["*"] || "";
  }

  function selectDetailsBox(html) {
    if (!html) return null;
    const parsed = new DOMParser().parseFromString(html, "text/html");
    for (const selector of DETAILS_BOX_SELECTORS) {
      const node = parsed.querySelector(selector);
      if (node) return node;
    }
    return null;
  }

  function sanitizeDetailsNode(node) {
    if (!isAllowedDetailsElement(node)) return null;

    const clone = node.cloneNode(true);
    DETAILS_DROP_SELECTORS.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((element) => element.remove());
    });
    Array.from(clone.querySelectorAll("*")).forEach((element) => {
      if (!isAllowedDetailsElement(element)) {
        element.remove();
        return;
      }
      sanitizeDetailsElement(element);
    });
    sanitizeDetailsElement(clone);
    return clone;
  }

  function isAllowedDetailsElement(element) {
    return element.namespaceURI === XHTML_NAMESPACE && DETAILS_ALLOWED_TAGS.has(element.tagName.toUpperCase());
  }

  function sanitizeDetailsElement(element) {
    const style = sanitizeStyle(element.getAttribute("style"));
    Array.from(element.attributes).forEach((attr) => {
      if (!DETAILS_KEEP_ATTRS.has(attr.name.toLowerCase())) element.removeAttribute(attr.name);
    });
    if (style) element.setAttribute("style", style);
  }

  function sanitizeStyle(value) {
    if (!value) return "";
    return String(value)
      .split(";")
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .map((declaration) => {
        const split = declaration.indexOf(":");
        if (split < 0) return "";
        const prop = declaration.slice(0, split).trim().toLowerCase();
        const val = declaration.slice(split + 1).trim();
        if (!DETAILS_STYLE_PROPS.has(prop)) return "";
        if (/url\(|expression|javascript:/i.test(val)) return "";
        return `${prop}: ${val}`;
      })
      .filter(Boolean)
      .join("; ");
  }

