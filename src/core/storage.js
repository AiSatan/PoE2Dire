  function createStorageBackend() {
    const api = extensionApi();
    if (api?.storage?.local) {
      const area = api.storage.local;
      return {
        readMany: (keys) => area.get(keys),
        writeMany: (payload) => area.set(payload),
        removeMany: (keys) => area.remove(keys),
      };
    }

    const storage = getLocalStorage();
    if (storage) {
      return {
        readMany: (keys) => {
          const raw = {};
          keys.forEach((key) => {
            const entry = parseStoredJson(storage.getItem(key));
            if (entry) raw[key] = entry;
          });
          return raw;
        },
        writeMany: (payload) => {
          Object.keys(payload).forEach((key) => {
            storage.setItem(key, JSON.stringify(payload[key]));
          });
        },
        removeMany: (keys) => {
          keys.forEach((key) => storage.removeItem(key));
        },
      };
    }

    return null;
  }

  function createTtlStore() {
    const backend = createStorageBackend();
    if (!backend) return null;

    return {
      async get(key) {
        const found = await this.getMany([key]);
        return found.get(key) || null;
      },
      async set(key, entry) {
        await backend.writeMany({ [key]: entry });
      },
      async getMany(keys) {
        const raw = await backend.readMany(keys);
        const found = new Map();
        const expired = [];

        keys.forEach((key) => {
          const entry = raw[key];
          if (!entry) return;

          if (entry.expiresAt <= Date.now()) expired.push(key);
          else found.set(key, entry);
        });

        if (expired.length) await backend.removeMany(expired);
        return found;
      },
      async setMany(entries) {
        if (!entries.size) return;
        const payload = {};
        entries.forEach((entry, key) => {
          payload[key] = entry;
        });
        await backend.writeMany(payload);
      },
      async removeMany(keys) {
        await backend.removeMany(keys);
      },
    };
  }

  let staleCacheCleaned = false;

  async function cleanupStaleCacheEntries() {
    if (staleCacheCleaned) return;
    staleCacheCleaned = true;

    try {
      const api = extensionApi();
      if (api?.storage?.local) {
        const area = api.storage.local;
        const keys = typeof area.getKeys === "function"
          ? await area.getKeys()
          : Object.keys(await area.get(null));
        const stale = keys.filter(isStaleCacheKey);
        if (stale.length) await area.remove(stale);
        return;
      }

      const storage = getLocalStorage();
      if (!storage) return;

      const stale = [];
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key && isStaleCacheKey(key)) stale.push(key);
      }
      stale.forEach((key) => storage.removeItem(key));
    } catch (error) {}
  }

  function isStaleCacheKey(key) {
    return key.startsWith(CONFIG.cache.namespacePrefix) && !key.startsWith(CONFIG.cache.namespace);
  }

  function getLocalStorage() {
    try {
      return typeof window !== "undefined" ? window.localStorage : null;
    } catch (error) {
      return null;
    }
  }

  function parseStoredJson(value) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
