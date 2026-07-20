  let entityOrderSource = null;
  let entityOrderKeys = null;

  function entityNamesFor(title, version) {
    const subdomain = String(location.hostname || "").split(".")[0];
    const game = prefersPoe2Wiki({ title, version }) ? "poe2" : "poe1";
    return (ENTITY_NAME_DATA[game] || {})[subdomain] || null;
  }

  function findNamedEntity(text, names) {
    if (!names) return null;

    const line = cleanText(text);
    const haystack = line.toLowerCase();

    for (const key of entityNameOrder(names)) {
      const at = haystack.indexOf(key);
      if (at < 0 || !isEntityMatch(line, haystack, at, key.length)) continue;

      const found = names[key];
      return { localized: line.slice(at, at + key.length), title: found[0], kind: found[1] };
    }

    return null;
  }

  function entityNameOrder(names) {
    if (entityOrderSource !== names) {
      entityOrderSource = names;
      entityOrderKeys = Object.keys(names).sort((left, right) => right.length - left.length);
    }
    return entityOrderKeys;
  }

  function isEntityMatch(line, haystack, at, length) {
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
