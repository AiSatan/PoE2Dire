  function createDetailsStore() {
    return createTtlStore();
  }

  function detailsStoreKey(scope, title, kind) {
    return `${CONFIG.cache.namespace}details:` + [
      scope,
      kind || "general",
      normalKey(title),
    ].map(encodeURIComponent).join(":");
  }
