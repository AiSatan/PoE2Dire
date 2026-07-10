(() => {
  "use strict";

  const api = typeof browser !== "undefined" ? browser : chrome;

  api.action.onClicked.addListener(async (tab) => {
    if (!tab?.id) return;

    try {
      await api.tabs.sendMessage(tab.id, { type: "poe2dire:toggle" });
    } catch (error) {
      // poe forum only, the rest ignore
    }
  });

  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "poe2dire:fetch-json") {
      fetchJson(message.url)
        .then((result) => sendResponse(result))
        .catch((error) => {
          sendResponse({
            proxied: true,
            ok: false,
            status: 0,
            statusText: "Network Error",
            error: error.message,
          });
        });
      return true;
    }

    if (message?.type === "poe2dire:fetch-image") {
      fetchImage(message.url)
        .then((result) => sendResponse(result))
        .catch((error) => {
          sendResponse({
            proxied: true,
            ok: false,
            status: 0,
            statusText: "Network Error",
            error: error.message,
          });
        });
      return true;
    }

    return false;
  });

  async function fetchJson(url) {
    if (!isAllowedWikiApiUrl(url)) {
      return {
        proxied: true,
        ok: false,
        status: 400,
        statusText: "Blocked URL",
        error: "Only PoE wiki API requests are allowed.",
      };
    }

    const response = await fetch(url, {
      credentials: "include",
      headers: { "Api-User-Agent": "PoE2Dire (https://github.com/aisatan/PoE2Dire)" },
    });
    const contentType = response.headers.get("Content-Type") || "";
    const cfMitigated = response.headers.get("cf-mitigated") || "";
    const retryAfter = response.headers.get("Retry-After") || "";
    const isJson = contentType.toLowerCase().includes("json");

    if (!response.ok || !isJson) {
      return {
        proxied: true,
        ok: false,
        status: response.ok ? 415 : response.status,
        statusText: response.ok ? "Unsupported Media Type" : response.statusText,
        retryAfter,
        cfMitigated,
        contentType,
        json: null,
      };
    }

    return {
      proxied: true,
      ok: true,
      status: response.status,
      statusText: response.statusText,
      retryAfter,
      cfMitigated,
      contentType,
      json: await response.json(),
    };
  }

  async function fetchImage(url) {
    if (!isAllowedWikiImageUrl(url)) {
      return {
        proxied: true,
        ok: false,
        status: 400,
        statusText: "Blocked URL",
        error: "Only PoE wiki image requests are allowed.",
      };
    }

    const response = await fetch(url, { credentials: "include" });
    const contentType = response.headers.get("Content-Type") || "";
    const cfMitigated = response.headers.get("cf-mitigated") || "";
    const retryAfter = response.headers.get("Retry-After") || "";

    if (!response.ok) {
      return {
        proxied: true,
        ok: false,
        status: response.status,
        statusText: response.statusText,
        retryAfter,
        cfMitigated,
        contentType,
      };
    }

    if (!contentType.toLowerCase().startsWith("image/")) {
      return {
        proxied: true,
        ok: false,
        status: 415,
        statusText: "Unsupported Media Type",
        retryAfter,
        cfMitigated,
        contentType,
      };
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    return {
      proxied: true,
      ok: true,
      status: response.status,
      statusText: response.statusText,
      retryAfter,
      cfMitigated,
      contentType,
      dataUrl: `data:${contentType};base64,${base64Encode(bytes)}`,
    };
  }

  function isAllowedWikiApiUrl(url) {
    try {
      const parsed = new URL(url);
      return (
        parsed.pathname === "/api.php" &&
        (parsed.origin === "https://www.poewiki.net" || parsed.origin === "https://www.poe2wiki.net")
      );
    } catch (error) {
      return false;
    }
  }

  function isAllowedWikiImageUrl(url) {
    try {
      const parsed = new URL(url);
      return (
        parsed.pathname.startsWith("/images/") &&
        (parsed.origin === "https://www.poewiki.net" || parsed.origin === "https://www.poe2wiki.net")
      );
    } catch (error) {
      return false;
    }
  }

  function base64Encode(bytes) {
    let binary = "";
    for (let index = 0; index < bytes.length; index += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    }
    return btoa(binary);
  }
})();
