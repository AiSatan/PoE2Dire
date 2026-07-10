  const CONFIG = {
    apiEndpoints: [
      { name: "PoE2Wiki", api: "https://www.poe2wiki.net/api.php" },
      { name: "PoEWiki", api: "https://www.poewiki.net/api.php" },
    ],
    apiUserAgent: "PoE2Dire (https://github.com/aisatan/PoE2Dire)",
    wikiLookupConcurrency: 2,
    wikiRequestConcurrency: 1,
    wikiImageConcurrency: 2,
    wikiBatchSize: 40,
    iconThumbWidth: 108,
    fallbackIcon: "https://www.poewiki.net/images/b/b6/Scroll_of_Wisdom_inventory_icon.png",
    cache: {
      namespacePrefix: "PoE2DireCache",
      namespace: "PoE2DireCache-10-07-2026",
      // 4 months
      hitTtlMs: 120 * 24 * 60 * 60 * 1000,
      // 7 days
      missTtlMs: 7 * 24 * 60 * 60 * 1000,
    },
    network: {
      retries: 2,
      retryDelayMs: 650,
      minRequestIntervalMs: 250,
      maxRetryDelayMs: 30000,
      challengeCooldownMs: 60000,
      maxCooldownMs: 120000,
      userscriptTimeoutMs: 30000,
    },
    ui: {
      tooltipShowDelayMs: 500,
      keywordShowDelayMs: 220,
      tooltipHideDelayMs: 120,
      statusErrorHideMs: 8000,
    },
  };

  const state = {
    renderRunId: 0,
    wikiDone: false,
    viewport: null,
    wikiEndpoints: null,
    iconStatus: null,
    retryWaitMs: 0,
    wikiCooldownUntil: 0,
    wikiCooldownReason: "",
  };
