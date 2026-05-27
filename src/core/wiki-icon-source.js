  const WIKI_PLACEHOLDER_IMAGE = /Questionmark|Help\.svg|Level_up_icon/i;
  const ICON_THUMB_WIDTH = 108;

  async function queryWikiIconSource(endpoint, jobs, onResult) {
    const found = new Map();
    const failed = new Set();

    await queryPredictableFileIcons(endpoint, jobs, found, onResult);

    const remainingJobs = jobs.filter((job) => !found.has(job.key));
    await mapWithConcurrency(remainingJobs, CONFIG.wikiLookupConcurrency, async (job) => {
      try {
        const image = await queryWikiIcon(endpoint, job);
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

    const byFile = new Map();
    const fileTitles = [];
    lookups.forEach((lookup) => {
      const key = normalFileTitle(lookup.fileTitle);
      const existing = byFile.get(key) || [];
      existing.push(lookup.job);
      if (!byFile.has(key)) fileTitles.push(lookup.fileTitle);
      byFile.set(key, existing);
    });

    for (const chunk of chunks(fileTitles, 40)) {
      let json = null;
      try {
        json = await fetchImageInfo(endpoint, chunk);
      } catch (error) {
        return;
      }

      Object.values(json.query?.pages || {}).forEach((page) => {
        const imageUrl = page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url;
        if (!imageUrl) return;

        const image = {
          url: imageUrl,
          source: `${endpoint.name} File`,
        };
        const matchedJobs = byFile.get(normalFileTitle(page.title)) || [];
        matchedJobs.forEach((job) => {
          if (found.has(job.key)) return;
          found.set(job.key, image);
          if (onResult) onResult(job, image, false);
        });
      });
    }
  }

  function predictableFileIconLookups(jobs) {
    const seen = new Set();
    const lookups = [];

    jobs
      .filter((job) => job.kind === "support" || job.kind === "item" || job.kind === "skill")
      .forEach((job) => {
        iconLookupCandidateTitles(job.title, job.kind).forEach((title) => {
          predictableFileIconTitles(title, job.kind).forEach((fileTitle) => {
            const key = `${job.key}:${normalFileTitle(fileTitle)}`;
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
    if (kind === "skill") return [skillIconFileTitle(title), inventoryIconFileTitle(title)];
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
    const url = new URL(endpoint.api);
    url.searchParams.set("origin", "*");
    url.searchParams.set("format", "json");
    url.searchParams.set("action", "query");
    url.searchParams.set("titles", fileTitles.join("|"));
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "url");
    url.searchParams.set("iiurlwidth", String(ICON_THUMB_WIDTH));

    return fetchJsonWithRetry(url.toString());
  }

  function normalFileTitle(title) {
    return cleanTitle(title).replace(/_/g, " ").toLowerCase();
  }

  function chunks(values, size) {
    const result = [];
    for (let index = 0; index < values.length; index += size) {
      result.push(values.slice(index, index + size));
    }
    return result;
  }

  async function queryWikiIcon(endpoint, job) {
    let lastError = null;

    for (const title of iconLookupCandidateTitles(job.title, job.kind)) {
      try {
        const image = await queryWikiPageImage(endpoint, title, job.kind);
        if (image) return image;
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError) throw lastError;
    return null;
  }

  async function queryWikiPageImage(endpoint, title, kind) {
    if (kind === "passive" || (kind === "ascendancy" && !validAscendancyClassTitle(title))) {
      const passiveIcon = await queryWikiPassiveIcon(endpoint, title);
      if (passiveIcon) return passiveIcon;
    }

    const url = new URL(endpoint.api);
    url.searchParams.set("origin", "*");
    url.searchParams.set("format", "json");
    url.searchParams.set("action", "parse");
    url.searchParams.set("redirects", "1");
    url.searchParams.set("prop", "text");
    url.searchParams.set("page", title);

    const json = await fetchJsonWithRetry(url.toString());
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

    const url = new URL(endpoint.api);
    url.searchParams.set("origin", "*");
    url.searchParams.set("format", "json");
    url.searchParams.set("action", "query");
    url.searchParams.set("titles", iconFile);
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "url");

    const json = await fetchJsonWithRetry(url.toString());
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
    const url = new URL(endpoint.api);
    url.searchParams.set("origin", "*");
    url.searchParams.set("format", "json");
    url.searchParams.set("action", "cargoquery");
    url.searchParams.set("tables", "passive_skills");
    url.searchParams.set("fields", "name,icon");
    url.searchParams.set("where", `name=${escapedTitle}`);
    url.searchParams.set("limit", "1");

    const json = await fetchJsonWithRetry(url.toString());
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
        titled.find((image) => imageSrc(image).includes("_skill_icon")) ||
        container.querySelector("img[src*='_skill_icon']") ||
        titled.find((image) => imageSrc(image).includes("_inventory_icon")) ||
        inventoryImage(container) ||
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
