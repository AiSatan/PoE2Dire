  const WIKI_PLACEHOLDER_IMAGE = /Questionmark|Help\.svg|Level_up_icon/i;

  async function queryWikiIconSource(endpoint, jobs, onResult) {
    const found = new Map();
    const failed = new Set();

    await queryPredictableFileIcons(endpoint, jobs, found, onResult);

    const remainingJobs = jobs.filter((job) => !found.has(job.key));
    const existingTitles = await queryExistingTitles(endpoint, remainingJobs);

    await mapWithConcurrency(remainingJobs, CONFIG.wikiLookupConcurrency, async (job) => {
      try {
        const image = await queryWikiIcon(endpoint, job, existingTitles);
        if (image) {
          found.set(job.key, image);
          if (onResult) onResult(job, image, false);
        } else if (onResult) {
          onResult(job, null, false);
        }
      } catch (error) {
        failed.add(job.key);
        if (onResult) onResult(job, null, true);
      }
    });

    return { found, failed };
  }

  async function queryPredictableFileIcons(endpoint, jobs, found, onResult) {
    const lookups = predictableFileIconLookups(jobs);
    if (!lookups.length) return;

    const candidatesByJob = new Map();
    const fileTitles = [];
    const seenTitles = new Set();
    lookups.forEach((lookup) => {
      const key = normalWikiTitle(lookup.fileTitle);
      const candidates = candidatesByJob.get(lookup.job) || [];
      candidates.push(key);
      candidatesByJob.set(lookup.job, candidates);
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        fileTitles.push(lookup.fileTitle);
      }
    });

    const images = new Map();
    for (const chunk of chunks(fileTitles, CONFIG.wikiBatchSize)) {
      let json = null;
      try {
        json = await fetchImageInfo(endpoint, chunk);
      } catch (error) {
        break;
      }

      Object.values(json.query?.pages || {}).forEach((page) => {
        const imageUrl = page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url;
        if (!imageUrl) return;
        images.set(normalWikiTitle(page.title), {
          url: imageUrl,
          source: `${endpoint.name} File`,
        });
      });
    }

    candidatesByJob.forEach((candidates, job) => {
      if (found.has(job.key)) return;
      const image = candidates.map((key) => images.get(key)).find(Boolean);
      if (!image) return;
      found.set(job.key, image);
      if (onResult) onResult(job, image, false);
    });
  }

  function predictableFileIconLookups(jobs) {
    const seen = new Set();
    const lookups = [];

    jobs
      .filter((job) => job.kind === "support" || job.kind === "item" || job.kind === "skill")
      .forEach((job) => {
        iconLookupCandidateTitles(job.title, job.kind).forEach((title) => {
          predictableFileIconTitles(title, job.kind).forEach((fileTitle) => {
            const key = `${job.key}:${normalWikiTitle(fileTitle)}`;
            if (seen.has(key)) return;
            seen.add(key);
            lookups.push({ job, fileTitle });
          });
        });
      });

    return lookups;
  }

  function predictableFileIconTitles(title, kind) {
    if (kind === "support") return supportInventoryIconFileTitles(title);
    if (kind === "skill") return [inventoryIconFileTitle(title), skillIconFileTitle(title)];
    return [inventoryIconFileTitle(title)];
  }

  function supportInventoryIconFileTitles(title) {
    const titles = [inventoryIconFileTitle(title)];
    const clean = cleanTitle(title);
    if (!/\s+(?:III|II|I)$/i.test(clean)) {
      titles.push(inventoryIconFileTitle(`${clean} I`));
    }
    return titles;
  }

  function inventoryIconFileTitle(title) {
    return `File:${cleanTitle(title).replace(/\s+/g, "_")}_inventory_icon.png`;
  }

  function skillIconFileTitle(title) {
    return `File:${cleanTitle(title).replace(/\s+/g, "_")}_skill_icon.png`;
  }

  async function fetchImageInfo(endpoint, fileTitles) {
    return fetchJsonWithRetry(wikiApiUrl(endpoint, {
      action: "query",
      titles: fileTitles.join("|"),
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: String(CONFIG.iconThumbWidth),
    }));
  }

  async function queryExistingTitles(endpoint, jobs) {
    const titles = [];
    const seen = new Set();
    jobs.forEach((job) => {
      iconLookupCandidateTitles(job.title, job.kind).forEach((title) => {
        if (title.includes("|")) return;
        const key = normalWikiTitle(title);
        if (seen.has(key)) return;
        seen.add(key);
        titles.push(title);
      });
    });

    const existing = new Set();
    for (const chunk of chunks(titles, CONFIG.wikiBatchSize)) {
      let json = null;
      try {
        json = await fetchJsonWithRetry(wikiApiUrl(endpoint, {
          action: "query",
          redirects: "1",
          titles: chunk.join("|"),
        }));
      } catch (error) {
        return null;
      }

      const renames = new Map();
      (json.query?.normalized || []).forEach((entry) => renames.set(entry.from, entry.to));
      (json.query?.redirects || []).forEach((entry) => renames.set(entry.from, entry.to));

      const existingPages = new Set();
      Object.values(json.query?.pages || {}).forEach((page) => {
        if (page.missing === undefined && page.pageid) existingPages.add(page.title);
      });

      chunk.forEach((title) => {
        let target = title;
        for (let hop = 0; hop < 3 && renames.has(target); hop += 1) {
          target = renames.get(target);
        }
        if (existingPages.has(target)) existing.add(normalWikiTitle(title));
      });
    }

    return existing;
  }

  function normalWikiTitle(title) {
    return cleanTitle(title).replace(/_/g, " ").toLowerCase();
  }

  function chunks(values, size) {
    const result = [];
    for (let index = 0; index < values.length; index += size) {
      result.push(values.slice(index, index + size));
    }
    return result;
  }

  async function queryWikiIcon(endpoint, job, existingTitles) {
    let lastError = null;

    for (const title of iconLookupCandidateTitles(job.title, job.kind)) {
      const pageExists = !existingTitles || existingTitles.has(normalWikiTitle(title));
      try {
        const image = await queryWikiPageImage(endpoint, title, job.kind, pageExists);
        if (image) return image;
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError) throw lastError;
    return null;
  }

  async function queryWikiPageImage(endpoint, title, kind, pageExists) {
    if (kind === "passive" || (kind === "ascendancy" && !validAscendancyClassTitle(title))) {
      const passiveIcon = await queryWikiPassiveIcon(endpoint, title);
      if (passiveIcon) return passiveIcon;
    }

    if (!pageExists) return null;

    const json = await fetchJsonWithRetry(wikiApiUrl(endpoint, {
      action: "parse",
      redirects: "1",
      prop: "text",
      page: title,
    }));
    const html = json.parse?.text?.["*"];
    if (!html) return null;

    const parsed = new DOMParser().parseFromString(html, "text/html");
    const image = selectWikiImage(parsed, title, kind);
    const src = image?.getAttribute("src");
    if (!src) return null;

    return {
      url: new URL(src, endpoint.api).toString(),
      source: endpoint.name,
    };
  }

  async function queryWikiPassiveIcon(endpoint, title) {
    const iconFile = await queryWikiPassiveIconFile(endpoint, title);
    if (!iconFile) return null;

    const json = await fetchJsonWithRetry(wikiApiUrl(endpoint, {
      action: "query",
      titles: iconFile,
      prop: "imageinfo",
      iiprop: "url",
    }));
    const pages = Object.values(json.query?.pages || {});
    const page = pages.find((value) => value.imageinfo?.[0]?.url);
    if (!page) return null;

    return {
      url: page.imageinfo[0].url,
      source: `${endpoint.name} Cargo`,
    };
  }

  async function queryWikiPassiveIconFile(endpoint, title) {
    const escapedTitle = `"${String(title || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    const json = await fetchJsonWithRetry(wikiApiUrl(endpoint, {
      action: "cargoquery",
      tables: "passive_skills",
      fields: "name,icon",
      where: `name=${escapedTitle}`,
      limit: "1",
    }));
    return json.cargoquery?.[0]?.title?.icon || "";
  }

  function selectWikiImage(parsed, title, kind) {
    const container = parsed.querySelector(".infobox-page-container") || parsed;
    const images = Array.from(container.querySelectorAll("img"));
    const titled = images.filter((image) => imageMatchesTitle(image, title));

    if (kind === "ascendancy") {
      return (
        titled.find((image) => /portrait/i.test(imageSrc(image))) ||
        images.find((image) => /portrait/i.test(imageSrc(image))) ||
        titled.find(isRealWikiImage) ||
        null
      );
    }

    if (kind === "skill") {
      return (
        titled.find((image) => imageSrc(image).includes("_inventory_icon")) ||
        inventoryImage(container) ||
        titled.find((image) => imageSrc(image).includes("_skill_icon")) ||
        container.querySelector("img[src*='_skill_icon']") ||
        images.find(isRealWikiImage) ||
        null
      );
    }

    if (kind === "support") {
      return (
        titled.find((image) => imageSrc(image).includes("_inventory_icon")) ||
        inventoryImage(container) ||
        titled.find(isRealWikiImage) ||
        null
      );
    }

    return (
      titled.find((image) => imageSrc(image).includes("_inventory_icon")) ||
      inventoryImage(container) ||
      container.querySelector(".item-icon img") ||
      titled.find((image) => imageSrc(image).includes("_skill_icon")) ||
      container.querySelector("img[src*='_skill_icon']") ||
      images.find(isRealWikiImage) ||
      null
    );
  }

  function inventoryImage(container) {
    return (
      container.querySelector(".itembox-tab.-selected img") ||
      container.querySelector(".images img[src*='_inventory_icon']") ||
      container.querySelector("img[src*='_inventory_icon']")
    );
  }

  function imageSrc(image) {
    return image?.getAttribute("src") || "";
  }

  function isRealWikiImage(image) {
    return !WIKI_PLACEHOLDER_IMAGE.test(imageSrc(image));
  }

  function imageMatchesTitle(image, title) {
    const needle = cleanTitle(title).toLowerCase().replace(/\s+/g, " ");
    const raw = [imageSrc(image), image.getAttribute("alt"), image.getAttribute("title")]
      .filter(Boolean)
      .join(" ");

    let haystack = raw;
    try {
      haystack = decodeURIComponent(raw);
    } catch (error) {
      haystack = raw;
    }

    return haystack.replace(/[_-]+/g, " ").toLowerCase().includes(needle);
  }
