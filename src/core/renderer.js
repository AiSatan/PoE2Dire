  const iconImageQueue = [];
  const iconImageCache = new Map();
  let activeIconImageRequests = 0;

  function renderPatchPage(doc, sourceRoot, patch) {
    doc.getElementById("PoE2Dire-root")?.remove();

    const page = el("main", "pdp-page", [
      renderHero(patch),
      el("div", "pdp-shell", patch.sections.map((section) => renderSection(doc, section))),
    ]);

    const mount = doc.createElement("div");
    mount.id = "PoE2Dire-root";
    mount.append(renderTopButton(doc), page);

    doc.body.classList.add("pdp-body");
    applyViewport(doc);
    hideOriginalPage(doc);
    doc.body.prepend(mount);
    sourceRoot.classList.add("pdp-hidden-source");
    renderWikiStatusPill(doc);
  }

  function destroyPatchPage(doc) {
    state.renderRunId += 1;
    state.iconStatus = null;
    state.retryWaitMs = 0;
    doc.getElementById("PoE2Dire-root")?.remove();
    doc.getElementById("PoE2Dire-style")?.remove();
    restoreViewport(doc);
    doc.body.classList.remove("pdp-body");
    Array.from(doc.querySelectorAll(".pdp-hidden-original")).forEach((node) => {
      node.classList.remove("pdp-hidden-original");
    });
    Array.from(doc.querySelectorAll(".pdp-hidden-source")).forEach((node) => {
      node.classList.remove("pdp-hidden-source");
    });
  }

  function hideOriginalPage(doc) {
    Array.from(doc.body.children).forEach((child) => {
      if (child.id === "PoE2Dire-root" || child.matches("script,style")) return;
      child.classList.add("pdp-hidden-original");
    });
  }

  function applyViewport(doc) {
    if (!state.viewport) {
      const existing = doc.querySelector("meta[name='viewport']");
      state.viewport = {
        node: existing,
        content: existing?.getAttribute("content") || "",
        created: !existing,
      };
    }

    const meta = state.viewport.node || doc.createElement("meta");
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", "width=device-width, initial-scale=1");
    if (!meta.parentNode) doc.head.append(meta);
    state.viewport.node = meta;
  }

  function restoreViewport(doc) {
    if (!state.viewport) return;

    if (state.viewport.created) {
      state.viewport.node?.remove();
    } else if (state.viewport.node?.parentNode) {
      state.viewport.node.setAttribute("content", state.viewport.content);
    } else {
      const meta = doc.createElement("meta");
      meta.setAttribute("name", "viewport");
      meta.setAttribute("content", state.viewport.content);
      doc.head.append(meta);
    }
    state.viewport = null;
  }

  function renderTopButton(doc) {
    const button = el("button", "pdp-top-button", "TOP");
    button.type = "button";
    button.setAttribute("aria-label", "Go back to top");
    button.addEventListener("click", () => {
      doc.defaultView.scrollTo({ top: 0, behavior: "smooth" });
    });
    return button;
  }

  function renderHero(patch) {
    return el("header", "pdp-hero", [
      el("div", "pdp-hero-inner", [
        el("div", "pdp-eyebrow", patch.eyebrow),
        el("h1", "pdp-version", patch.version),
      ]),
    ]);
  }

  function renderSection(doc, section) {
    const groups = orderedSectionGroups(section);
    return el("section", "pdp-section", [
      el("h2", "pdp-section-title", section.displayTitle),
      el("div", "pdp-section-body", groups.map((group) => renderGroup(doc, section, group))),
    ]);
  }

  function orderedSectionGroups(section) {
    if (!isEntitySection(section.title)) return section.groups;

    const general = [];
    const entities = [];
    for (const group of section.groups) {
      if (group.title === section.title) general.push(group);
      else entities.push(group);
    }
    return general.concat(entities);
  }

  function renderGroup(doc, section, group) {
    if (isEntitySection(section.title) && group.title === section.title) {
      return renderGeneralList(doc, group);
    }

    if (!isEntitySection(section.title)) {
      return renderSubsection(doc, group);
    }

    return renderEntityGroup(doc, group);
  }

  function renderGeneralList(doc, group) {
    return el("div", "pdp-general-list", [
      el("h3", "pdp-subsection-title", "General Changes"),
      el("ul", "pdp-changes", group.items.map((item) => el("li", "", renderChangeItem(doc, item)))),
    ]);
  }

  function renderSubsection(doc, group) {
    const children = [
      el("h3", "pdp-subsection-title", group.title),
    ];
    if (group.blocks.length) {
      group.blocks.forEach((block) => {
        children.push(renderUpdateBlock(doc, block));
      });
    } else {
      children.push(el("ul", "pdp-changes", group.items.map((item) => el("li", "", renderChangeItem(doc, item)))));
    }
    return el("div", "pdp-subsection", children);
  }

  function renderUpdateBlock(doc, block) {
    return el("div", "pdp-update-block", [
      el("div", "pdp-list-label", block.label),
      el("ul", "pdp-changes pdp-update-changes", block.items.map((item) => el("li", "", renderChangeItem(doc, item)))),
    ]);
  }

  function renderEntityGroup(doc, group) {
    const icon = renderIcon(group);
    const meta = el("div", "pdp-group-meta", groupLabel(group));
    const title = el("div", "pdp-group-title", group.title);
    const items = el("ul", "pdp-changes", group.items.map((item) => el("li", "", renderChangeItem(doc, item))));
    const article = el("article", "pdp-group", [icon, el("div", "pdp-group-body", [title, meta, items])]);
    article.tabIndex = 0;
    article.dataset.pdpIconKey = iconDomKey(group);
    article.dataset.pdpDetailsTitle = group.wikiTitle || group.title;
    article.dataset.pdpDetailsKind = group.iconKind || "general";
    return article;
  }

  function renderWikiStatusPill(doc) {
    const root = doc.getElementById("PoE2Dire-root");
    if (!root) return;

    const status = wikiStatusContent();
    if (!status) {
      doc.getElementById("PoE2Dire-wiki-status")?.remove();
      return;
    }

    let pill = doc.getElementById("PoE2Dire-wiki-status");
    if (!pill) {
      pill = el("div", "pdp-wiki-status");
      pill.id = "PoE2Dire-wiki-status";
      pill.setAttribute("role", "status");
      pill.setAttribute("aria-live", "polite");
      root.append(pill);
    }

    pill.className = status.modifier ? `pdp-wiki-status ${status.modifier}` : "pdp-wiki-status";
    pill.textContent = status.text;
  }

  function wikiStatusContent() {
    if (state.retryWaitMs > 1500) {
      return {
        text: `Wiki is busy, retrying in ${Math.ceil(state.retryWaitMs / 1000)}s…`,
        modifier: "pdp-wiki-status-wait",
      };
    }

    const status = state.iconStatus;
    if (!status) return null;

    if (!status.done) {
      return { text: `Loading wiki icons… ${status.settled}/${status.total}`, modifier: "" };
    }

    if (status.failed) {
      const noun = status.failed === 1 ? "icon" : "icons";
      return {
        text: `Couldn't load ${status.failed} ${noun} from the wiki, will retry next visit.`,
        modifier: "pdp-wiki-status-error",
      };
    }

    return null;
  }

  function updatePatchIcons(doc, patch) {
    const root = doc.getElementById("PoE2Dire-root");
    if (!root) return false;

    const groups = new Map(
      patch.sections
        .flatMap((section) => section.groups)
        .map((group) => [iconDomKey(group), group])
    );

    root.querySelectorAll(".pdp-group[data-pdp-icon-key]").forEach((article) => {
      const group = groups.get(article.dataset.pdpIconKey || "");
      if (!group) return;

      const oldIcon = article.querySelector(".pdp-icon");
      const nextState = iconStateClass(group, !group.icon);
      const nextUrl = group.icon || CONFIG.fallbackIcon || "";
      if (oldIcon?.dataset.pdpIconState === nextState && oldIcon.dataset.pdpIconUrl === nextUrl) return;

      oldIcon?.replaceWith(renderIcon(group));
    });

    return true;
  }

  function iconDomKey(group) {
    return [
      group.iconKind || "general",
      normalKey(group.wikiTitle || group.title),
      normalKey(group.title),
    ].join(":");
  }

  function groupLabel(group) {
    if (group.iconKind === "item") return "ITEM";
    if (group.iconKind === "skill") return "SKILL";
    if (group.iconKind === "support") return "SUPPORT";
    if (group.iconKind === "ascendancy") return "ASCENDANCY";
    if (group.iconKind === "passive") return passiveLabel(group);
    if (group.iconKind === "monster") return "MONSTER";
    return "UPDATE";
  }

  function passiveLabel(group) {
    const text = `${group.title} ${group.items.map(changeText).join(" ")}`;
    if (/\bkeystone\b/i.test(text)) return "KEYSTONE";
    if (/\bnotable\b/i.test(text)) return "NOTABLE";
    return "PASSIVE";
  }

  function renderIcon(group) {
    const box = el("div", `pdp-icon pdp-icon-${group.iconKind}`);
    const isFallback = !group.icon;
    const icon = group.icon || CONFIG.fallbackIcon;
    if (icon) {
      const finalClass = iconStateClass(group, isFallback);
      box.dataset.pdpIconState = finalClass;
      box.dataset.pdpIconUrl = icon;
      box.classList.add(initialIconStateClass(finalClass));
      const img = el("img", "", "");
      img.alt = "";
      img.loading = "eager";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      setIconImageSrc(img, box, group.title, icon, CONFIG.fallbackIcon, finalClass);
      box.append(img);
    } else {
      box.textContent = iconInitials(group.title);
    }
    return box;
  }

  function setIconImageSrc(img, box, title, icon, fallbackIcon, finalClass) {
    renderableIconUrlWithFallbacks(icon)
      .then((src) => {
        img.onload = () => setIconStateClass(box, finalClass);
        img.onerror = () => {
          if (icon !== fallbackIcon && fallbackIcon) {
            showFallbackIcon(img, box, title, fallbackIcon);
            return;
          }
          showIconInitials(img, box, title);
        };
        img.src = src;
      })
      .catch(() => {
        if (icon !== fallbackIcon && fallbackIcon) {
          showFallbackIcon(img, box, title, fallbackIcon);
          return;
        }
        showIconInitials(img, box, title);
      });
  }

  async function renderableIconUrlWithFallbacks(url) {
    let lastError = null;

    for (const candidate of wikiImageUrlCandidates(url)) {
      try {
        return await renderableIconUrl(candidate);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Image proxy failed");
  }

  async function renderableIconUrl(url, priority) {
    if (!isWikiImageUrl(url)) return url;

    const api = extensionApi();
    if (!api?.runtime?.id || !api.runtime.sendMessage) {
      const userscriptRequest = userscriptXmlHttpRequest();
      if (!userscriptRequest) return url;
      return cachedWikiImageProxy(userscriptRequest, url, fetchWikiImageViaUserscript, priority);
    }

    return cachedWikiImageProxy(api, url, fetchWikiImageViaExtension, priority);
  }

  function cachedWikiImageProxy(proxy, url, fetchImage, priority) {
    const cached = iconImageCache.get(url);
    if (cached) return cached;

    const request = queueWikiImageProxy(proxy, url, fetchImage, priority).catch((error) => {
      iconImageCache.delete(url);
      throw error;
    });
    iconImageCache.set(url, request);
    return request;
  }

  function queueWikiImageProxy(proxy, url, fetchImage, priority) {
    return new Promise((resolve, reject) => {
      const job = { proxy, url, fetchImage, resolve, reject };
      if (priority) iconImageQueue.unshift(job);
      else iconImageQueue.push(job);
      drainIconImageQueue();
    });
  }

  function drainIconImageQueue() {
    const limit = Math.max(1, Number(CONFIG.wikiImageConcurrency) || 1);
    while (activeIconImageRequests < limit && iconImageQueue.length) {
      const job = iconImageQueue.shift();
      activeIconImageRequests += 1;
      job.fetchImage(job.proxy, job.url)
        .then(job.resolve, job.reject)
        .finally(() => {
          activeIconImageRequests -= 1;
          drainIconImageQueue();
        });
    }
  }

  function fetchWikiImageViaExtension(api, url) {
    return fetchWikiImageWithRetry(async () => {
      try {
        return await api.runtime.sendMessage({ type: "poe2dire:fetch-image", url });
      } catch (error) {
        return {
          ok: false,
          status: 0,
          statusText: error.message || "Network Error",
          retryAfter: "",
        };
      }
    });
  }

  function fetchWikiImageViaUserscript(request, url) {
    return fetchWikiImageWithRetry(() => userscriptImageDataUrl(request, url));
  }

  async function fetchWikiImageWithRetry(fetchImage) {
    let lastResponse = null;

    for (let attempt = 0; attempt <= CONFIG.network.retries; attempt += 1) {
      const response = await fetchImage();
      if (response?.ok && response.dataUrl) return response.dataUrl;

      lastResponse = response || { status: 0, statusText: "Network Error", retryAfter: "" };
      if (attempt === CONFIG.network.retries || !isRetryableWikiResponse(lastResponse)) break;

      const delayMs = retryDelayMs(lastResponse, attempt);
      if (delayMs > CONFIG.network.maxRetryDelayMs) break;
      await retryWait(delayMs);
    }

    throw new Error(lastResponse?.statusText || "Image proxy failed");
  }

  function userscriptImageDataUrl(request, url) {
    return requestViaUserscript(
      request,
      {
        method: "GET",
        url,
        responseType: "arraybuffer",
        timeout: 30000,
      },
      formatUserscriptImageResponse
    );
  }

  function formatUserscriptImageResponse(response) {
    const headers = response?.responseHeaders || "";
    const contentType = userscriptHeader(headers, "content-type");
    const cfMitigated = userscriptHeader(headers, "cf-mitigated");
    const retryAfter = userscriptHeader(headers, "retry-after");
    const status = Number(response?.status) || 0;
    const statusText = response?.statusText || (status ? "OK" : "Network Error");
    const isImage = contentType.toLowerCase().startsWith("image/");
    const mediaStatus = statusForMedia(status, statusText, isImage);

    if (!(status >= 200 && status < 300) || !isImage) {
      return {
        proxied: true,
        ok: false,
        status: mediaStatus.status,
        statusText: mediaStatus.statusText,
        retryAfter,
        cfMitigated,
        contentType,
      };
    }

    return {
      proxied: true,
      ok: true,
      status,
      statusText,
      retryAfter,
      cfMitigated,
      contentType,
      dataUrl: `data:${contentType};base64,${base64Encode(new Uint8Array(response.response))}`,
    };
  }

  function base64Encode(bytes) {
    let binary = "";
    for (let index = 0; index < bytes.length; index += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    }
    return btoa(binary);
  }

  function isWikiImageUrl(url) {
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

  function wikiImageUrlCandidates(url) {
    const urls = [url];
    const original = originalWikiImageUrl(url);
    if (original && original !== url) urls.push(original);
    return urls;
  }

  function originalWikiImageUrl(url) {
    try {
      const parsed = new URL(url);
      if (!isWikiImageUrl(url)) return "";

      const match = parsed.pathname.match(/^\/images\/thumb\/([^/]+\/[^/]+\/[^/]+)\/[^/]+$/);
      if (!match) return "";

      parsed.pathname = `/images/${match[1]}`;
      return parsed.toString();
    } catch (error) {
      return "";
    }
  }

  function showIconInitials(img, box, title) {
    img.remove();
    box.textContent = iconInitials(title);
  }

  function showFallbackIcon(img, box, title, fallbackIcon) {
    box.dataset.pdpIconState = "pdp-icon-default";
    box.dataset.pdpIconUrl = fallbackIcon;
    setIconStateClass(box, "pdp-icon-default");
    renderableIconUrl(fallbackIcon)
      .then((src) => {
        img.onload = () => setIconStateClass(box, "pdp-icon-default");
        img.onerror = () => showIconInitials(img, box, title);
        img.src = src;
      })
      .catch(() => showIconInitials(img, box, title));
  }

  function iconInitials(title) {
    const words = cleanTitle(title).split(/\s+/).filter(Boolean);
    return (words[0]?.[0] || "P") + (words[1]?.[0] || "");
  }

  function iconStateClass(group, isFallback) {
    if (!isFallback) return "pdp-icon-resolved";
    if (group.source === "missing") return "pdp-icon-missing";
    if (group.source === "default") return "pdp-icon-default";
    if (!state.wikiDone) return "pdp-icon-pending";
    return "pdp-icon-default";
  }

  function initialIconStateClass(finalClass) {
    return finalClass === "pdp-icon-resolved" ? "pdp-icon-pending" : finalClass;
  }

  function setIconStateClass(box, nextClass) {
    box.classList.remove("pdp-icon-pending", "pdp-icon-resolved", "pdp-icon-missing", "pdp-icon-default");
    box.classList.add(nextClass);
  }

  function changeText(item) {
    return typeof item === "string" ? item : item?.text || "";
  }

  function renderChangeItem(doc, item) {
    const text = changeText(item);
    const links = typeof item === "string" ? [] : item?.links || [];
    const fragment = doc.createDocumentFragment();

    splitByLinks(text, links).forEach((segment) => {
      if (segment.href) {
        const anchor = el("a", "", highlightChange(doc, segment.text));
        anchor.href = segment.href;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        fragment.append(anchor);
      } else {
        fragment.append(highlightChange(doc, segment.text));
      }
    });

    return fragment;
  }

  function splitByLinks(text, links) {
    const segments = [];
    let cursor = 0;

    (links || []).forEach((link) => {
      if (!link?.text || !link.href || link.text.length < 2) return;
      const index = text.indexOf(link.text, cursor);
      if (index < 0) return;
      if (index > cursor) segments.push({ text: text.slice(cursor, index) });
      segments.push({ text: link.text, href: link.href });
      cursor = index + link.text.length;
    });

    if (cursor < text.length || !segments.length) segments.push({ text: text.slice(cursor) });
    return segments;
  }

  function highlightChange(doc, text) {
    const fragment = doc.createDocumentFragment();
    const regex = /[+-]?\d+(?:\.\d+)?(?:-[+-]?\d+(?:\.\d+)?)?%?/g;
    let lastIndex = 0;
    for (const match of text.matchAll(regex)) {
      fragment.append(doc.createTextNode(text.slice(lastIndex, match.index)));
      fragment.append(el("span", "pdp-num", match[0]));
      lastIndex = match.index + match[0].length;
    }
    fragment.append(doc.createTextNode(text.slice(lastIndex)));
    return fragment;
  }

  function injectStyles(doc) {
    if (doc.getElementById("PoE2Dire-style")) return;
    if (!CORE_STYLES) return;

    const style = doc.createElement("style");
    style.id = "PoE2Dire-style";
    style.textContent = CORE_STYLES;
    doc.head.append(style);
  }
