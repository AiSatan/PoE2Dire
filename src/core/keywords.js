  let cachedKeywordMatcher;

  function splitByKeywords(text) {
    const matcher = keywordMatcher();
    if (!matcher) return [{ text }];

    const parts = [];
    let cursor = 0;
    matcher.lastIndex = 0;
    for (const match of text.matchAll(matcher)) {
      const entry = keywordEntryFor(match[0]);
      if (!entry) continue;
      if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index) });
      parts.push({ text: match[0], keyword: entry[0] });
      cursor = match.index + match[0].length;
    }
    if (cursor < text.length || !parts.length) parts.push({ text: text.slice(cursor) });
    return parts;
  }

  function keywordMatcher() {
    if (cachedKeywordMatcher !== undefined) return cachedKeywordMatcher;

    const terms = Object.values(KEYWORD_DATA)
      .map((entry) => entry[0])
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp);

    cachedKeywordMatcher = terms.length
      ? new RegExp(`\\b(?:${terms.join("|")})(?:e?s|e?d|ing)?\\b`, "gi")
      : null;
    return cachedKeywordMatcher;
  }

  function keywordEntryFor(matchText) {
    const lower = matchText.toLowerCase();
    const candidates = [lower];
    ["ing", "es", "ed", "s", "d"].forEach((suffix) => {
      if (lower.endsWith(suffix)) candidates.push(lower.slice(0, -suffix.length));
    });

    for (const candidate of candidates) {
      const entry = KEYWORD_DATA[candidate];
      if (entry) return entry;
    }
    return null;
  }

  function keywordDescription(term) {
    const entry = KEYWORD_DATA[String(term || "").toLowerCase()];
    return entry ? entry[1] : "";
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
