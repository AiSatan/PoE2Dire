  let gemOrderSource = null;
  let gemOrderKeys = null;

  function gemNamesFor(title, version) {
    const subdomain = String(location.hostname || "").split(".")[0];
    const game = prefersPoe2Wiki({ title, version }) ? "poe2" : "poe1";
    return (GEM_NAME_DATA[game] || {})[subdomain] || null;
  }

  function findGemEntity(text, names) {
    if (!names) return null;

    const line = cleanText(text);
    const haystack = line.toLowerCase();

    for (const key of gemNameOrder(names)) {
      const at = haystack.indexOf(key);
      if (at < 0 || !isGemMatch(line, haystack, at, key.length)) continue;

      const found = names[key];
      return { localized: line.slice(at, at + key.length), title: found[0], kind: found[1] };
    }

    return null;
  }

  function gemNameOrder(names) {
    if (gemOrderSource !== names) {
      gemOrderSource = names;
      gemOrderKeys = Object.keys(names).sort((left, right) => right.length - left.length);
    }
    return gemOrderKeys;
  }

  function isGemMatch(line, haystack, at, length) {
    const first = line[at];
    if (!isCasedLetter(first)) return true;
    if (first === first.toLowerCase()) return false;

    const before = at > 0 ? haystack[at - 1] : "";
    const after = at + length < haystack.length ? haystack[at + length] : "";
    return !isLetter(before) && !isLetter(after);
  }

  function isLetter(character) {
    return Boolean(character) && /\p{L}/u.test(character);
  }

  function isCasedLetter(character) {
    return isLetter(character) && character.toLowerCase() !== character.toUpperCase();
  }
