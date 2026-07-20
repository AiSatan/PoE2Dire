  const ANNOTATED_NAME = /([\p{L}])\s*[(（]\s*([A-Z][A-Za-z'’\-]*(?:\s+[A-Za-z'’\-]+)*)\s*[)）]/gu;
  const LATIN_SCRIPT = /\p{Script=Latin}/u;

  let entityOrderSource = null;
  let entityOrderKeys = null;

  function findAnnotatedEntity(text) {
    const line = cleanText(text);

    for (const match of line.matchAll(ANNOTATED_NAME)) {
      if (LATIN_SCRIPT.test(match[1])) continue;

      const at = match.index + match[1].length;
      const localized = (line.slice(0, at).match(/[^\s(（)）,、。]+$/) || [""])[0];
      return { localized: localized || match[2], title: match[2] };
    }

    return null;
  }

  function knownEntityKind(title, names) {
    const found = names ? names[String(title).toLowerCase()] : null;
    return found ? found[1] : "item";
  }

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
