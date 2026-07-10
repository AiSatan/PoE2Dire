  const SOURCE_ROOT_SELECTORS = [
    "table.forumPostListTable tr.newsPost td[colspan] > .content",
    "table.forumPostListTable tr.staff > td.content-container > .content",
    "table.forumPostListTable tr:first-child td[colspan] > .content",
    "table.forumPostListTable tr:first-child td.content-container > .content",
    "table.forumPostListTable td[colspan] > .content",
    "table.forumPostListTable td.content-container > .content",
    ".forum-table-container .content",
  ];

  function isAllowedForumUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.origin === "https://www.pathofexile.com" && parsed.pathname.startsWith("/forum/");
    } catch (error) {
      return false;
    }
  }

  function findSourceRoot(doc) {
    for (const selector of SOURCE_ROOT_SELECTORS) {
      const node = Array.from(doc.querySelectorAll(selector)).find(isPatchPostBody);
      if (node) return node;
    }

    return null;
  }

  function isPatchPostBody(node) {
    const text = textOf(node);
    if (!text) return false;

    return Boolean(node.querySelector("h1,h2,h3,h4,h5,li"));
  }

  function collectTokens(root) {
    const tokens = [];
    const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME"]);
    walk(root);
    return compactTokens(tokens);

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        pushTextLines(node.textContent, "text", node.parentElement);
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE || skipTags.has(node.tagName)) {
        return;
      }

      if (node.matches("ul,ol") && isTocList(node)) {
        pushTocToken(node);
        return;
      }

      if (node.matches("h1,h2,h3,h4,h5")) {
        pushToken("heading", textOf(node), node);
        return;
      }

      if (node.matches("li")) {
        pushToken("li", textOf(node), node);
        return;
      }

      if (node.matches("strong,b") && !node.closest("li")) {
        pushToken("strong", textOf(node), node);
        return;
      }

      if (node.matches("img")) {
        const src = node.currentSrc || node.src;
        if (src) tokens.push({ type: "image", text: node.alt || "", image: src, links: [] });
        return;
      }

      Array.from(node.childNodes).forEach(walk);
    }

    function pushTocToken(node) {
      const entries = Array.from(node.querySelectorAll("a[href]"))
        .map((anchor) => ({ text: cleanText(anchor.textContent) }))
        .filter((entry) => entry.text);
      if (entries.length) tokens.push({ type: "toc", text: "", image: "", links: [], entries });
    }

    function pushToken(type, text, element) {
      const clean = cleanText(text);
      if (!clean || clean === "Return to top") return;
      tokens.push({
        type,
        text: clean,
        image: firstImage(element),
        links: linksOf(element),
      });
    }

    function pushTextLines(text, type, parent) {
      if (parent && parent.closest("li,h1,h2,h3,h4,h5,script,style,noscript")) return;
      const href = safeLinkHref(parent?.closest?.("a[href]"));
      cleanText(text)
        .split("\n")
        .map(cleanText)
        .filter((line) => line && line !== "Return to top")
        .forEach((line) => tokens.push({
          type,
          text: line,
          image: "",
          links: href ? [{ text: line, href }] : [],
        }));
    }
  }

  function isTocList(node) {
    const anchors = Array.from(node.querySelectorAll("a[href]"));
    if (!anchors.length) return false;
    if (!anchors.every((anchor) => (anchor.getAttribute("href") || "").includes("#"))) return false;

    const listText = cleanText(node.textContent).replace(/\s+/g, " ");
    const linkText = anchors.map((anchor) => cleanText(anchor.textContent)).join(" ").replace(/\s+/g, " ");
    return listText === linkText;
  }

  function linksOf(element) {
    if (!element?.querySelectorAll) return [];
    return Array.from(element.querySelectorAll("a[href]"))
      .map((anchor) => ({ text: cleanText(anchor.textContent), href: safeLinkHref(anchor) }))
      .filter((link) => link.text && link.href);
  }

  function safeLinkHref(anchor) {
    const href = anchor?.href || "";
    return /^https?:\/\//i.test(href) ? href : "";
  }

  function compactTokens(tokens) {
    const result = [];
    for (const token of tokens) {
      const last = result[result.length - 1];
      if (last && last.type === token.type && last.text === token.text) continue;
      if (last && last.type === "text" && token.type === "text") {
        last.text = joinTextTokens(last.text, token.text);
        last.links = (last.links || []).concat(token.links || []);
        continue;
      }
      result.push(token);
    }
    return result;
  }

  function joinTextTokens(left, right) {
    if (/^[.,;:!?]/.test(right)) return `${left}${right}`;
    return `${left} ${right}`;
  }

  function firstImage(element) {
    const image = element?.querySelector?.("img");
    return image?.currentSrc || image?.src || "";
  }
