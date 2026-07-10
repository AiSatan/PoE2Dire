  async function resolveIcons(patch, onUpdate) {
    const groups = patch.sections.flatMap((section) => section.groups);
    const jobs = collectIconJobs(groups);

    state.wikiDone = false;
    state.iconStatus = null;

    if (!jobs.length) {
      state.wikiDone = true;
      renderWikiStatusPill(document);
      return patch;
    }

    const endpoints = apiEndpointsForPatch(patch);
    const store = createIconStore();
    const storeScope = endpoints.map((endpoint) => endpoint.name).join("+");
    const storeKeys = new Map(jobs.map((job) => [
      job.key,
      iconStoreKey(storeScope, job.title, job.kind),
    ]));

    const resolved = new Map();
    const knownMissing = new Set();
    const lookupFailed = new Set();
    const status = { total: jobs.length, settled: 0, failed: 0, done: false };
    state.iconStatus = status;

    const updateIconStatus = () => {
      status.settled = Math.min(jobs.length, resolved.size + knownMissing.size + lookupFailed.size);
      status.failed = lookupFailed.size;
      renderWikiStatusPill(document);
    };

    const stored = await readStoredIconResults(store, jobs, storeKeys, resolved, knownMissing);
    applyResolvedIconResults(groups, resolved);
    applyMissingIconResults(groups, knownMissing);
    updateIconStatus();
    notifyIconUpdate(onUpdate, patch);

    for (let endpointIndex = 0; endpointIndex < endpoints.length; endpointIndex += 1) {
      const endpoint = endpoints[endpointIndex];
      const isLastEndpoint = endpointIndex === endpoints.length - 1;
      const missingJobs = jobs.filter((job) => !resolved.has(job.key) && !knownMissing.has(job.key));
      if (!missingJobs.length) break;

      const result = await queryWikiIconSource(endpoint, missingJobs, (job, image, failed) => {
        if (resolved.has(job.key) || knownMissing.has(job.key)) return;

        if (image) {
          resolved.set(job.key, image);
          applyResolvedIconResults(groups, new Map([[job.key, image]]));
          updateIconStatus();
          notifyIconUpdate(onUpdate, patch);
          return;
        }

        if (!isLastEndpoint) return;

        if (failed) {
          lookupFailed.add(job.key);
          applyDefaultIconResults(groups, new Set([job.key]));
        } else {
          knownMissing.add(job.key);
          applyMissingIconResults(groups, new Set([job.key]));
        }
        updateIconStatus();
        notifyIconUpdate(onUpdate, patch);
      });
      result.found.forEach((image, key) => resolved.set(key, image));
      result.failed.forEach((key) => lookupFailed.add(key));
    }

    applyIconResults(groups, resolved, jobs, lookupFailed);
    await writeStoredIconResults(store, jobs, storeKeys, stored, resolved, lookupFailed);

    state.wikiDone = true;
    status.done = true;
    updateIconStatus();
    finishWikiStatus(status);
    notifyIconUpdate(onUpdate, patch);
    return patch;
  }

  function finishWikiStatus(status) {
    if (!status.failed) {
      if (state.iconStatus === status) state.iconStatus = null;
      renderWikiStatusPill(document);
      return;
    }

    setTimeout(() => {
      if (state.iconStatus === status) {
        state.iconStatus = null;
        renderWikiStatusPill(document);
      }
    }, CONFIG.ui.statusErrorHideMs);
  }

  function collectIconJobs(groups) {
    const candidates = groups
      .filter((group) => !group.icon)
      .filter(isIconCandidate)
      .filter((group) => group.wikiTitle);

    const seen = new Set();
    const jobs = [];

    candidates.forEach((group) => {
      const title = cleanTitle(group.wikiTitle);
      const kind = group.iconKind || "general";
      const key = iconJobKey(title, kind);
      if (!title || seen.has(key)) return;
      seen.add(key);
      jobs.push({ title, key, kind });
    });

    return interleaveIconJobs(jobs);
  }

  function interleaveIconJobs(jobs) {
    const primary = jobs.filter((job) => job.kind === "ascendancy" || job.kind === "skill");
    const rest = jobs.filter((job) => job.kind !== "ascendancy" && job.kind !== "skill");
    const order = ["support", "item", "passive", "monster", "general"];
    const buckets = new Map(order.map((kind) => [kind, []]));
    rest.forEach((job) => {
      const bucket = buckets.get(job.kind) || buckets.get("general");
      bucket.push(job);
    });

    const result = primary;
    while (bucketsHaveJobs(buckets)) {
      order.forEach((kind) => {
        const job = buckets.get(kind)?.shift();
        if (job) result.push(job);
      });
    }
    return result;
  }

  function bucketsHaveJobs(buckets) {
    return Array.from(buckets.values()).some((bucket) => bucket.length);
  }

  function apiEndpointsForPatch(patch) {
    return /Path of Exile 2/i.test(patch.title)
      ? [CONFIG.apiEndpoints[0]]
      : [CONFIG.apiEndpoints[1]];
  }

  function applyIconResults(groups, resolved, jobs, lookupFailed) {
    const attempted = new Set(jobs.map((job) => job.key));

    for (const group of groups) {
      const key = iconJobKey(group.wikiTitle, group.iconKind);
      const image = resolved.get(key);

      if (image) {
        group.icon = image.url;
        group.source = image.source;
      } else if (attempted.has(key) && !lookupFailed.has(key) && isIconCandidate(group)) {
        group.source = "missing";
      }
    }
  }

  function applyResolvedIconResults(groups, resolved) {
    if (!resolved.size) return;

    for (const group of groups) {
      const image = resolved.get(iconJobKey(group.wikiTitle, group.iconKind));
      if (!image) continue;

      group.icon = image.url;
      group.source = image.source;
    }
  }

  function applyMissingIconResults(groups, missing) {
    if (!missing.size) return;

    for (const group of groups) {
      if (missing.has(iconJobKey(group.wikiTitle, group.iconKind)) && isIconCandidate(group)) {
        group.source = "missing";
      }
    }
  }

  function applyDefaultIconResults(groups, defaults) {
    if (!defaults.size) return;

    for (const group of groups) {
      if (defaults.has(iconJobKey(group.wikiTitle, group.iconKind)) && isIconCandidate(group) && !group.icon) {
        group.source = "default";
      }
    }
  }

  function notifyIconUpdate(onUpdate, patch) {
    if (onUpdate) onUpdate(patch);
  }

  function iconJobKey(title, kind) {
    return `${kind || "general"}:${normalKey(title)}`;
  }
