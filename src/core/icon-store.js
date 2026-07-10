  function createIconStore() {
    return createTtlStore() || nullIconStore();
  }

  async function readStoredIconResults(store, jobs, storeKeys, resolved, knownMissing) {
    let stored = new Map();
    try {
      stored = await store.getMany(Array.from(storeKeys.values()));
    } catch (error) {
      return stored;
    }

    for (const job of jobs) {
      const entry = stored.get(storeKeys.get(job.key));
      if (!entry) continue;

      if (entry.url) {
        resolved.set(job.key, { url: entry.url, source: entry.source || "icon-cache" });
      } else if (entry.missing) {
        if (shouldCacheMissingIcon(job)) knownMissing.add(job.key);
        else stored.delete(storeKeys.get(job.key));
      }
    }

    return stored;
  }

  async function writeStoredIconResults(store, jobs, storeKeys, stored, resolved, lookupFailed) {
    const writes = new Map();

    for (const job of jobs) {
      const key = storeKeys.get(job.key);
      if (!key || stored.has(key) || lookupFailed.has(job.key)) continue;

      const image = resolved.get(job.key);
      if (!image && !shouldCacheMissingIcon(job)) continue;

      writes.set(key, image ? {
        url: image.url,
        source: image.source,
        cachedAt: Date.now(),
        expiresAt: Date.now() + CONFIG.cache.hitTtlMs,
      } : {
        missing: true,
        cachedAt: Date.now(),
        expiresAt: Date.now() + CONFIG.cache.missTtlMs,
      });
    }

    try {
      await store.setMany(writes);
    } catch (error) {}
  }

  function shouldCacheMissingIcon(job) {
    return job.kind !== "support";
  }

  function nullIconStore() {
    return {
      get: async () => null,
      set: async () => {},
      getMany: async () => new Map(),
      setMany: async () => {},
      removeMany: async () => {},
    };
  }

  function iconStoreKey(scope, title, kind) {
    return CONFIG.cache.namespace + [
      scope,
      kind || "general",
      normalKey(title),
    ].map(encodeURIComponent).join(":");
  }
