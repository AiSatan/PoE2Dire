  // only retry on these erros, no point in hitting 404 each time
  const RETRYABLE_HTTP_STATUS = new Set([0, 408, 425, 429, 500, 502, 503, 504]);

  const wikiRequestQueue = [];
  let activeWikiRequests = 0;
  let wikiDispatchTimer = 0;
  let lastWikiDispatchAt = 0;

  async function fetchJsonWithRetry(url, priority) {
    for (let attempt = 0; attempt <= CONFIG.network.retries; attempt += 1) {
      throwIfWikiCoolingDown();

      const response = await fetchJsonThroughQueue(url, priority);
      if (response.ok) return response.json;

      if (response.cfMitigated === "challenge") {
        startWikiCooldown(CONFIG.network.challengeCooldownMs, "challenge");
        throw wikiRequestError(response);
      }

      if (attempt === CONFIG.network.retries || !isRetryableWikiResponse(response)) {
        throw wikiRequestError(response);
      }

      const delayMs = retryDelayMs(response, attempt);
      if (delayMs > CONFIG.network.maxRetryDelayMs) {
        startWikiCooldown(delayMs, "rate-limit");
        throw wikiRequestError(response);
      }

      await retryWait(delayMs);
    }

    throw new Error("retry loop failed");
  }

  function throwIfWikiCoolingDown() {
    const remaining = (state.wikiCooldownUntil || 0) - Date.now();
    if (remaining <= 0) return;

    const error = new Error("Wiki requests paused after rate limiting");
    error.retryInMs = remaining;
    if (state.wikiCooldownReason === "challenge") error.challenged = true;
    else error.rateLimited = true;
    throw error;
  }

  function startWikiCooldown(durationMs, reason) {
    const until = Date.now() + Math.min(durationMs, CONFIG.network.maxCooldownMs);
    if (until <= (state.wikiCooldownUntil || 0)) return;
    state.wikiCooldownUntil = until;
    state.wikiCooldownReason = reason;
  }

  function wikiRequestError(response) {
    const status = response?.status || 0;
    const statusText = response?.statusText || "";
    const label = status
      ? `HTTP ${status}${statusText ? ` ${statusText}` : ""}`
      : statusText || "Network Error";
    const error = new Error(label);
    error.status = status;
    if (response?.cfMitigated === "challenge") error.challenged = true;
    if (status === 429) error.rateLimited = true;
    return error;
  }

  async function fetchJsonThroughQueue(url, priority) {
    await acquireWikiRequestSlot(priority);
    try {
      throwIfWikiCoolingDown();
      return await fetchJsonResponse(url);
    } finally {
      releaseWikiRequestSlot();
    }
  }

  function acquireWikiRequestSlot(priority) {
    return new Promise((resolve) => {
      if (priority) wikiRequestQueue.unshift(resolve);
      else wikiRequestQueue.push(resolve);
      drainWikiRequestQueue();
    });
  }

  function releaseWikiRequestSlot() {
    activeWikiRequests -= 1;
    drainWikiRequestQueue();
  }

  function drainWikiRequestQueue() {
    const limit = Math.max(1, Number(CONFIG.wikiRequestConcurrency) || 1);
    while (activeWikiRequests < limit && wikiRequestQueue.length) {
      const waitMs = lastWikiDispatchAt + CONFIG.network.minRequestIntervalMs - Date.now();
      if (waitMs > 0) {
        scheduleWikiDispatch(waitMs);
        return;
      }
      lastWikiDispatchAt = Date.now();
      activeWikiRequests += 1;
      wikiRequestQueue.shift()();
    }
  }

  function scheduleWikiDispatch(waitMs) {
    if (wikiDispatchTimer) return;
    wikiDispatchTimer = setTimeout(() => {
      wikiDispatchTimer = 0;
      drainWikiRequestQueue();
    }, waitMs);
  }

  function wikiApiUrl(endpoint, params) {
    const url = new URL(endpoint.api);
    url.searchParams.set("origin", "*");
    url.searchParams.set("format", "json");
    url.searchParams.set("maxlag", "5");
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  }

  async function retryWait(delayMs) {
    setRetryWait(delayMs);
    try {
      await delay(delayMs);
    } finally {
      setRetryWait(0);
    }
  }

  function setRetryWait(delayMs) {
    state.retryWaitMs = delayMs;
    renderWikiStatusPill(document);
  }

  async function fetchJsonResponse(url) {
    const proxied = await fetchJsonViaExtension(url);
    if (proxied) return proxied;

    const userscript = await fetchJsonViaUserscript(url);
    if (userscript) return userscript;

    try {
      const response = await fetch(url);
      const contentType = response.headers.get("Content-Type") || "";
      const cfMitigated = response.headers.get("cf-mitigated") || "";
      const isJson = contentType.toLowerCase().includes("json");
      const mediaStatus = statusForMedia(response.status, response.statusText, isJson);
      return {
        ok: response.ok && isJson,
        status: mediaStatus.status,
        statusText: mediaStatus.statusText,
        retryAfter: response.headers.get("Retry-After") || "",
        cfMitigated,
        contentType,
        json: response.ok && isJson ? await response.json() : null,
      };
    } catch (error) {
      return {
        ok: false,
        status: 0,
        statusText: error.message || "Network Error",
        retryAfter: "",
        cfMitigated: "",
        contentType: "",
        json: null,
      };
    }
  }

  async function fetchJsonViaUserscript(url) {
    const request = userscriptXmlHttpRequest();
    if (!request || !isAllowedUserscriptJsonUrl(url)) return null;

    return requestViaUserscript(
      request,
      {
        method: "GET",
        url,
        headers: { Accept: "application/json", "Api-User-Agent": CONFIG.apiUserAgent },
        responseType: "text",
        timeout: CONFIG.network.userscriptTimeoutMs,
      },
      formatUserscriptJsonResponse
    );
  }

  function userscriptXmlHttpRequest() {
    if (typeof GM_xmlhttpRequest === "function") return GM_xmlhttpRequest;
    if (typeof GM !== "undefined" && typeof GM.xmlHttpRequest === "function") {
      return GM.xmlHttpRequest.bind(GM);
    }
    return null;
  }

  function requestViaUserscript(request, details, formatResponse) {
    return new Promise((resolve) => {
      let settled = false;
      const settle = (response) => {
        if (settled) return;
        settled = true;
        resolve(response);
      };

      const requestDetails = {
        ...details,
        onload: (response) => settle(formatResponse(response)),
        onerror: (error) => settle(userscriptNetworkError(error)),
        ontimeout: () => settle(userscriptNetworkError(new Error("Request timed out"))),
      };

      try {
        const result = request(requestDetails);
        if (result?.then) {
          result.then(
            (response) => settle(formatResponse(response)),
            (error) => settle(userscriptNetworkError(error))
          );
        }
      } catch (error) {
        settle(userscriptNetworkError(error));
      }
    });
  }

  function isAllowedUserscriptJsonUrl(url) {
    try {
      const parsed = new URL(url);
      return (
        parsed.pathname === "/api.php" &&
        (parsed.hostname === "www.poe2wiki.net" || parsed.hostname === "www.poewiki.net")
      );
    } catch (error) {
      return false;
    }
  }

  function formatUserscriptJsonResponse(response) {
    const headers = response?.responseHeaders || "";
    const contentType = userscriptHeader(headers, "content-type");
    const cfMitigated = userscriptHeader(headers, "cf-mitigated");
    const retryAfter = userscriptHeader(headers, "retry-after");
    const status = Number(response?.status) || 0;
    const statusText = response?.statusText || (status ? "OK" : "Network Error");
    const body = response?.responseText || "";
    const parsed = parseUserscriptJson(body);
    const isJson = Boolean(parsed.ok || contentType.toLowerCase().includes("json"));
    const mediaStatus = statusForMedia(status, statusText, isJson);

    return {
      proxied: true,
      ok: status >= 200 && status < 300 && parsed.ok,
      status: mediaStatus.status,
      statusText: mediaStatus.statusText,
      retryAfter,
      cfMitigated,
      contentType,
      json: parsed.ok ? parsed.json : null,
    };
  }

  function statusForMedia(status, statusText, validMedia) {
    if (status >= 200 && status < 300 && !validMedia) {
      return { status: 415, statusText: "Unsupported Media Type" };
    }
    return { status, statusText };
  }

  function parseUserscriptJson(value) {
    try {
      return { ok: true, json: JSON.parse(value) };
    } catch (error) {
      return { ok: false, json: null };
    }
  }

  function userscriptHeader(headers, name) {
    const key = name.toLowerCase();
    const line = String(headers || "")
      .split(/\r?\n/)
      .find((header) => header.slice(0, header.indexOf(":")).trim().toLowerCase() === key);
    return line ? line.slice(line.indexOf(":") + 1).trim() : "";
  }

  function userscriptNetworkError(error) {
    return {
      proxied: true,
      ok: false,
      status: 0,
      statusText: error?.message || "Network Error",
      retryAfter: "",
      cfMitigated: "",
      contentType: "",
      json: null,
    };
  }

  async function fetchJsonViaExtension(url) {
    const api = extensionApi();
    if (!api?.runtime?.id || !api.runtime.sendMessage) return null;

    try {
      const response = await api.runtime.sendMessage({ type: "poe2dire:fetch-json", url });
      return response?.proxied ? response : null;
    } catch (error) {
      return null;
    }
  }

  function retryDelayMs(response, attempt) {
    const retryAfter = response.retryAfter;
    if (retryAfter) {
      const seconds = Number(retryAfter);
      if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);

      const dateDelay = Date.parse(retryAfter) - Date.now();
      if (Number.isFinite(dateDelay)) return Math.max(0, dateDelay);
    }

    return CONFIG.network.retryDelayMs * 2 ** attempt;
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function isRetryableWikiResponse(response) {
    if (response?.cfMitigated === "challenge") return false;
    return RETRYABLE_HTTP_STATUS.has(response?.status || 0);
  }
