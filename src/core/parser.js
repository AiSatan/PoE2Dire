  const SECTION_ALIASES = {
    "Ascendancy Changes": "Hero Updates",
    "Skill Changes": "Ability Updates",
    "Support Changes": "Support Updates",
    "Unique Item Changes": "Unique Item Updates",
    "Item Changes": "Item Updates",
    "Monster Changes": "Monster Updates",
  };

  const ENTITY_SECTION_PATTERN = /Ascendancy|Skill|Support|Unique|Item|Monster|Passive/i;

  function parsePatch(tokens) {
    const titleToken = tokens.find((token) => /Content Update|Patch Notes/i.test(token.text));
    const title = titleToken ? titleToken.text : document.title.replace(" - Forum - Path of Exile", "");
    const version = title.match(/\b\d+\.\d+\.\d+[a-z]?\b/i)?.[0] || "Patch";

    const patch = {
      title,
      version,
      eyebrow: "Gameplay Update",
      sections: [],
      toc: [],
    };

    let currentSection = null;
    let currentGroup = null;
    const introTokens = [];

    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index];
      if (token.type === "toc") {
        if (!currentSection) patch.toc.push(...(token.entries || []));
        continue;
      }
      if (token === titleToken || token.type === "image") continue;
      if (token.text === title || token.text === "Table of Contents") continue;

      // Some update sections repeat their own title as a visual separator.
      if (isPatchUpdateTitle(token.text) && currentSection && isPatchUpdateSection(currentSection.title)) {
        currentGroup = null;
        continue;
      }

      // Real headings and standalone bold labels are the two section styles
      if (isMainSection(token)) {
        currentSection = addSection(patch, token.text, token.image);
        currentGroup = null;
        continue;
      }

      if (token.type === "strong" && shouldStartSectionFromStrong(token, currentSection)) {
        currentSection = addSection(patch, token.text, token.image);
        currentGroup = null;
        continue;
      }

      // No-section hotfix posts are stored here, then split into changes + notes at the end.
      if (!currentSection) {
        if (token.type === "li" || token.type === "text") {
          introTokens.push(token);
        }
        continue;
      }

      if (token.type === "text" && isTrailingNote(tokens, index, currentSection)) {
        currentSection = addSection(patch, "Notes", "");
        currentGroup = findOrAddGroup(currentSection, "Patch Notes", token.image, token.text);
        currentGroup.items.push(changeItem(formatChange(token.text, ""), token));
        continue;
      }

      // "Updates to Patch Notes" has date groups and nested Old/New/Updated labels.
      if (isPatchUpdateSection(currentSection.title)) {
        if (isUpdateDateTitle(token.text)) {
          currentGroup = findOrAddGroup(currentSection, token.text, token.image);
          continue;
        }

        if (/^Spoiler$/i.test(token.text)) {
          continue;
        }

        if (isPatchUpdateLabel(token.text)) {
          currentGroup = currentGroup || findOrAddGroup(currentSection, "Patch Notes Update", token.image);
          currentGroup.blocks.push({ label: token.text, items: [] });
          continue;
        }

        if (token.type === "li" || token.type === "text") {
          currentGroup = currentGroup || findOrAddGroup(currentSection, "Patch Notes Update", token.image);
          addUpdateItem(currentGroup, changeItem(formatChange(token.text, ""), token));
          continue;
        }
      }

      if (token.type === "heading" || token.type === "strong") {
        currentGroup = addGroup(currentSection, token.text, token.image);
        continue;
      }

      // Normal patch lines become either one general group or entity-specific cards.
      if (token.type === "li" || token.type === "text") {
        const ascendancyClass = isAscendancySection(currentSection.title)
          ? validAscendancyClassTitle(token.text)
          : "";
        if (ascendancyClass) {
          currentGroup = findOrAddGroup(currentSection, ascendancyClass, token.image, token.text);
          currentGroup.iconKind = "ascendancy";
          currentGroup.wikiTitle = ascendancyClass;
          continue;
        }

        const entitySection = isEntitySection(currentSection.title);
        const entity = entitySection ? extractEntityTitle(token.text, currentSection.title) : "";
        const split = currentGroup?.iconKind === "ascendancy" && isAscendancySection(currentSection.title)
          ? false
          : shouldSplitEntry(currentSection.title, entity);
        const targetGroup = split
          ? findOrAddGroup(currentSection, entity || currentSection.title, token.image, token.text)
          : currentGroup || findOrAddGroup(currentSection, currentSection.title, token.image, token.text);

        targetGroup.items.push(changeItem(formatChange(token.text, targetGroup.title), token));
        if (entity && !targetGroup.wikiTitle) targetGroup.wikiTitle = entity;
      }
    }

    if (patch.sections.length && introTokens.length) {
      const section = addSection(patch, "Overview", "", "start");
      const group = addGroup(section, "Patch Notes", "");
      group.items.push(...introTokens.map((token) => changeItem(token.text, token)));
    }

    if (!patch.sections.length && introTokens.length) {
      let noteStart = introTokens.length;
      while (noteStart > 0 && introTokens[noteStart - 1].type === "text") {
        noteStart -= 1;
      }

      const section = addSection(patch, "General Updates", "");
      const group = addGroup(section, "Patch Notes", "");
      group.items.push(...introTokens.slice(0, noteStart).map((token) => changeItem(token.text, token)));

      if (noteStart < introTokens.length) {
        const notes = addSection(patch, "Notes", "");
        const notesGroup = addGroup(notes, "Patch Notes", "");
        notesGroup.items.push(...introTokens.slice(noteStart).map((token) => changeItem(token.text, token)));
      }
    }

    patch.sections.forEach((section) => {
      section.groups = section.groups.filter(groupHasItems);
    });
    patch.sections = patch.sections.filter((section) => section.groups.length > 0);
    return patch;
  }

  function addSection(patch, title, image, position) {
    const section = {
      title,
      displayTitle: SECTION_ALIASES[title] || title,
      groups: [],
    };
    if (position === "start") patch.sections.unshift(section);
    else patch.sections.push(section);
    return section;
  }

  function addGroup(section, title, image, hint) {
    const group = {
      title: cleanTitle(title),
      wikiTitle: cleanTitle(title),
      iconKind: classifyGroup(section.title, title, hint),
      icon: image || "",
      source: image ? "source" : "",
      blocks: [],
      items: [],
    };
    section.groups.push(group);
    return group;
  }

  function findOrAddGroup(section, title, image, hint) {
    const clean = cleanTitle(title);
    const existing = section.groups.find((group) => normalKey(group.title) === normalKey(clean));
    if (existing) {
      if (image && !existing.icon) {
        existing.icon = image;
        existing.source = "source";
      }
      if (hint) existing.iconKind = strongerIconKind(existing.iconKind, classifyGroup(section.title, title, hint));
      return existing;
    }
    return addGroup(section, clean, image, hint);
  }

  function isEntitySection(title) {
    return ENTITY_SECTION_PATTERN.test(title);
  }

  function isAscendancySection(title) {
    return /Ascendancy/i.test(title);
  }

  function isMainSection(token) {
    if (token.type !== "heading") return false;
    return /changes|updates|fixes|balance|league|endgame|campaign|content|features/i.test(token.text);
  }

  function isPatchUpdateTitle(text) {
    return /^Updates to Patch Notes$/i.test(cleanText(text));
  }

  function isPatchUpdateSection(title) {
    return isPatchUpdateTitle(title);
  }

  function isUpdateDateTitle(text) {
    return /^Updates for (?:\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})$/i.test(cleanText(text));
  }

  function isPatchUpdateLabel(text) {
    return /^(?:(?:Updated|New|Removed) Patch Notes:|Old:|New:)$/i.test(cleanText(text));
  }

  function shouldStartSectionFromStrong(token, currentSection) {
    if (isPatchUpdateLabel(token.text) || isUpdateDateTitle(token.text)) return false;
    if (!currentSection) return true;
    if (isPatchUpdateSection(currentSection.title)) return false;
    if (isEntitySection(currentSection.title)) return false;
    return true;
  }

  function isTrailingNote(tokens, index, currentSection) {
    if (isPatchUpdateSection(currentSection.title)) return false;

    for (let i = index + 1; i < tokens.length; i += 1) {
      if (tokens[i].type !== "image") return false;
    }

    return true;
  }

  function changeItem(text, token) {
    return { text, links: token.links || [] };
  }

  function addUpdateItem(group, item) {
    const block = group.blocks[group.blocks.length - 1];
    if (block) {
      block.items.push(item);
      return;
    }
    group.items.push(item);
  }

  function groupHasItems(group) {
    return group.items.length > 0 || group.blocks.some((block) => block.items.length > 0);
  }

  function shouldSplitEntry(sectionTitle, entity) {
    return isEntitySection(sectionTitle) && Boolean(entity);
  }

  function extractEntityTitle(text, sectionTitle) {
    if (isAscendancySection(sectionTitle)) {
      const ascendancy = validAscendancyClassTitle(text);
      if (ascendancy) return ascendancy;
    }

    const patterns = [
      /^New Unique item:\s*(.+)$/i,
      /^Added (?:the )?(?:new )?(.+?) (?:Skill|Support Gem|Support Gems|Strength Support Gems)\b/i,
      /^The (.+?) Unique\b/i,
      /^The (.+?) Skill Gem\b/i,
      /^The (.+? Support)\b/i,
      /^Totems using (.+?) no longer\b/i,
      /^([A-Z][A-Za-z' -]{2,45}),\s+(?:granted|triggered) by\b/i,
      /^(.+?):\s+/,
      /^([A-Z][A-Za-z' -]{2,45}) now\b/,
      /^([A-Z][A-Za-z' -]{2,45}) no longer\b/,
      /^([A-Z][A-Za-z' -]{2,45}) has\b/,
      /^([A-Z][A-Za-z' -]{2,45}) can\b/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return validEntityTitle(match[1]);
    }

    if (/Skill Changes|Support Changes/.test(sectionTitle)) {
      const skill = text.match(/^([A-Z][A-Za-z' -]+?)(?:,| and | previously | now | no longer | can )/);
      if (skill) return validEntityTitle(skill[1]);
    }

    return "";
  }

  function validEntityTitle(value) {
    const title = cleanTitle(value);
    if (!title || title.length > 64) return "";
    if (title.split(/\s+/).length > 8) return "";
    if (/^(the wording|the following|there(?:\b| (?:are|is))|some\b|by |when |while |if |you\b|npcs?\b|a new|an? existing|existing|this|these|all|skills?)\b/i.test(title)) return "";
    if (/\b(?:is|can|will|that|found)$/i.test(title)) return "";
    return title;
  }

  function formatChange(text, title) {
    let change = cleanText(text);
    if (title && change.toLowerCase().startsWith(title.toLowerCase() + ":")) {
      change = cleanText(change.slice(title.length + 1));
    }
    if (/^The /i.test(change) && title && change.toLowerCase().startsWith(("The " + title).toLowerCase())) {
      change = cleanText(change.slice(title.length + 4));
    }
    return sentenceCaseChange(stripLeadingEntityDescriptor(change));
  }

  function stripLeadingEntityDescriptor(change) {
    return cleanText(change.replace(/^(?:Skill Gem|Support Gem|Transfigured Gem|Gem)\s+(?=now\b|has\b|requires\b|no longer\b|can\b|deals\b|is\b)/i, ""));
  }

  function sentenceCaseChange(change) {
    return change.replace(/^([a-z])/, (letter) => letter.toUpperCase());
  }
