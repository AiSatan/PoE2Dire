  async function run() {
    if (!isAllowedForumUrl(location.href)) {
      destroyPatchPage(document);
      return null;
    }

    const root = findSourceRoot(document);
    if (!root) {
      destroyPatchPage(document);
      return null;
    }
    const runId = ++state.renderRunId;

    injectStyles(document);

    const tokens = collectTokens(root);
    const patch = parsePatch(tokens);
    state.wikiDone = false;
    state.wikiEndpoints = apiEndpointsForPatch(patch);
    renderPatchPage(document, root, patch);
    cleanupStaleCacheEntries();

    const renderResolvedPatchNow = (resolvedPatch) => {
      if (runId !== state.renderRunId) return false;
      if (!updatePatchIcons(document, resolvedPatch)) {
        renderPatchPage(document, root, resolvedPatch);
      }
      return true;
    };
    const renderResolvedPatch = schedulePatchIconRender(renderResolvedPatchNow);

    resolveIcons(patch, renderResolvedPatch)
      .then((resolvedPatch) => {
        return renderResolvedPatchNow(resolvedPatch) ? resolvedPatch : null;
      })
      .catch((error) => {
        if (runId !== state.renderRunId) return null;
        state.wikiDone = true;
        state.iconStatus = null;
        state.retryWaitMs = 0;
        renderPatchPage(document, root, patch);
        console.warn("[PoE2Dire] Wiki icon lookup failed:", error);
        return patch;
      });

    return patch;
  }

  function schedulePatchIconRender(renderNow) {
    let scheduled = false;
    let pendingPatch = null;

    return (patch) => {
      pendingPatch = patch;
      if (scheduled) return true;

      scheduled = true;
      const schedule = typeof requestAnimationFrame === "function"
        ? requestAnimationFrame
        : (callback) => setTimeout(callback, 16);
      schedule(() => {
        scheduled = false;
        const nextPatch = pendingPatch;
        pendingPatch = null;
        if (nextPatch) renderNow(nextPatch);
      });
      return true;
    };
  }

  function setupExtensionMessages() {
    const api = extensionApi();
    if (!api?.runtime?.onMessage) return;

    api.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message?.type !== "poe2dire:toggle") return false;

      toggleCurrentPage()
        .then((result) => sendResponse(result))
        .catch((error) => {
          console.warn("[PoE2Dire] Toggle failed:", error);
          sendResponse({ transformed: false, error: error.message });
        });
      return true;
    });
  }

  function setupUserscriptMenu() {
    const registerMenuCommand = userscriptMenuCommand();
    if (!registerMenuCommand) return;

    registerMenuCommand("Toggle PoE2Dire", () => {
      toggleCurrentPage().catch((error) => {
        console.warn("[PoE2Dire] Toggle failed:", error);
      });
    });
  }

  async function toggleCurrentPage() {
    if (document.getElementById("PoE2Dire-root")) {
      destroyPatchPage(document);
      return { transformed: false };
    }
    return activateOnce();
  }

  async function activateOnce() {
    const patch = await run();
    return { transformed: Boolean(patch) };
  }

  function extensionApi() {
    if (typeof browser !== "undefined" && browser?.runtime) return browser;
    if (typeof chrome !== "undefined" && chrome?.runtime) return chrome;
    return null;
  }

  function userscriptMenuCommand() {
    if (typeof GM_registerMenuCommand === "function") return GM_registerMenuCommand;
    if (typeof GM !== "undefined" && typeof GM.registerMenuCommand === "function") {
      return GM.registerMenuCommand.bind(GM);
    }
    return null;
  }

  setupExtensionMessages();
  setupUserscriptMenu();
  if (!extensionApi()?.runtime?.id && !userscriptMenuCommand()) {
    run().catch((error) => {
      console.warn("[PoE2Dire] Startup failed:", error);
    });
  }
