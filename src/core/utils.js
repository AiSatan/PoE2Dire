  const ASCENDANCY_CLASS_NAMES = new Set([
    "Acolyte of Chayula",
    "Ancestral Commander",
    "Antiquarian",
    "Architect of Chaos",
    "Aristocrat",
    "Ascendant",
    "Assassin",
    "Aul Bloodline",
    "Behemoth",
    "Berserker",
    "Blind Prophet",
    "Blood Mage",
    "Bog Shaman",
    "Breachlord Bloodline",
    "Catarina Bloodline",
    "Champion",
    "Chaos Bloodline",
    "Chieftain",
    "Chronomancer",
    "Daughter of Oshabi",
    "Deadeye",
    "Delirious Bloodline",
    "Elementalist",
    "Farrul Bloodline",
    "Gambler",
    "Gemling Legionnaire",
    "Gladiator",
    "Guardian",
    "Harbinger",
    "Herald",
    "Hierophant",
    "Infernalist",
    "Inquisitor",
    "Invoker",
    "Juggernaut",
    "Lich",
    "Lycia Bloodline",
    "Nameless Bloodline",
    "Necromancer",
    "Occultist",
    "Olroth Bloodline",
    "Oshabi Bloodline",
    "Paladin",
    "Pathfinder",
    "Polytheist",
    "Puppeteer",
    "Reliquarian",
    "Saboteur",
    "Saresh Bloodline",
    "Scavenger",
    "Servant of Arakaali",
    "Slayer",
    "Smith of Kitava",
    "Stormweaver",
    "Surfcaster",
    "Titan",
    "Trickster",
    "Warbringer",
    "Warden",
    "Warden of the Maji",
    "Warlock of the Mists",
    "Whisperer",
    "Wildspeaker",
    "Wildwood Primalist",
    "Witchhunter",
  ].map((title) => cleanText(cleanTitle(title)).toLowerCase()));

  function isIconCandidate(group) {
    if (!["item", "skill", "support", "monster", "ascendancy", "passive"].includes(group.iconKind)) return false;
    if (!["ascendancy", "passive"].includes(group.iconKind) && /passive|cluster|notable|keystone/i.test(group.wikiTitle)) return false;
    if ((group.iconKind === "skill" || group.iconKind === "support") && /^The\s+/i.test(group.wikiTitle)) return false;
    if (/\band\b/i.test(group.wikiTitle) && !romanTierBaseTitle(group.wikiTitle)) return false;
    if (/\b(?:are|is|can|has|have|now|was|were|be|being|an item)$/i.test(group.wikiTitle)) return false;
    if (!group.wikiTitle || group.wikiTitle.length > 64) return false;
    if (group.items.length > 20) return false;
    return !/changes|updates|league|endgame|content|features|passive tree/i.test(group.wikiTitle);
  }

  function strongerIconKind(current, next) {
    const priority = { item: 5, skill: 5, support: 5, monster: 4, ascendancy: 3, passive: 3, bug: 2, general: 1 };
    const currentPriority = priority[current] || 1;
    const nextPriority = priority[next] || 1;

    if (nextPriority > currentPriority) return next;
    return current;
  }

  async function mapWithConcurrency(values, limit, fn) {
    const queue = values.slice();
    const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
      while (queue.length) {
        const value = queue.shift();
        await fn(value);
      }
    });
    await Promise.all(workers);
  }

  function classify(text) {
    if (/ascendancy|class|hero/i.test(text)) return "ascendancy";
    if (/passive|tree|notable|keystone|cluster/i.test(text)) return "passive";
    if (/support/i.test(text)) return "support";
    if (/skill|ability|spell|attack|vaal gem/i.test(text)) return "skill";
    if (/unique|item|rune|idol|currency|armour|weapon|ring|amulet|glove|boot|helmet|jewel/i.test(text)) return "item";
    if (/monster|boss|enemy|delirium|breach|ritual/i.test(text)) return "monster";
    if (/bug|fix/i.test(text)) return "bug";
    return "general";
  }

  function classifyGroup(sectionTitle, title, hint) {
    const sectionKind = classify(sectionTitle);
    if (sectionKind !== "general") return sectionKind;

    const titleKind = classifyLocalEntity(title);
    if (titleKind !== "general") return titleKind;

    return classifyLocalEntity(hint || "");
  }

  function classifyLocalEntity(text) {
    if (/ascendancy|hero/i.test(text)) return "ascendancy";
    if (/support/i.test(text)) return "support";
    if (/timeless jewel notable|\bnotable\b.*\bpassive\b|\bkeystone\b.*\bpassive\b|cluster jewel notable|\bclusters?\b/i.test(text)) return "passive";
    if (/skill gem|support gem|ability|spell|attack/i.test(text)) return "skill";
    if (/unique|item|rune|idol|currency|armour|weapon|ring|amulet|glove|boot|helmet|jewel|flask|belt|talisman|bow|mace|sword|axe|staff|wand|quiver|shield/i.test(text)) return "item";
    if (/passive|tree|notable|keystone/i.test(text)) return "passive";
    if (/monster|boss|enemy|delirium|breach|ritual/i.test(text)) return "monster";
    if (/bug|fix/i.test(text)) return "bug";
    return "general";
  }

  function validAscendancyClassTitle(value) {
    const title = cleanTitle(value);
    const key = cleanText(title).toLowerCase();

    if (ASCENDANCY_CLASS_NAMES.has(key)) return title;
    return "";
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
  }

  function cleanTitle(value) {
    return cleanText(value)
      .replace(/^The\s+(.+?)\s+Unique\b.*$/i, "$1")
      .replace(/\s+Unique\s+(?:Ring|Bow|Mace|Helmet|Gloves|Boots|Body Armour|Focus|Jewel|Amulet).*$/i, "")
      .replace(/\s+(?:Skill|Skill Gem|Skill Gems|Support Gem|Support Gems|Notable Passive Skill|Keystone Passive Skill|Notable Passive|Keystone Passive)$/i, "")
      .replace(/\s*\(.*?\)\s*/g, "")
      .replace(/\s+are$/i, "")
      .trim();
  }

  function textOf(node) {
    const text = node?.innerText || node?.textContent || "";
    return cleanText(text);
  }

  function normalKey(value) {
    const title = cleanTitle(value);
    return title.toLowerCase();
  }

  function unique(values) {
    const cleaned = values.map(cleanTitle).filter(Boolean);
    return Array.from(new Set(cleaned));
  }

  function el(tag, className, children) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (children == null) return node;
    if (Array.isArray(children)) {
      children.filter(Boolean).forEach((child) => node.append(child));
    } else if (children instanceof Node) {
      node.append(children);
    } else {
      node.textContent = String(children);
    }
    return node;
  }
