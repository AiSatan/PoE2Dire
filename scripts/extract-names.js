const fs = require("fs");
const path = require("path");

const OUTPUT = path.join(__dirname, "..", "src", "core", "entity-names-data.js");
const REQUEST_DELAY_MS = 750;
const USER_AGENT = "PoE2Dire name extractor (https://github.com/aisatan/PoE2Dire)";

const LANGUAGES = {
  br: "pt",
  ru: "ru",
  th: "th",
  de: "de",
  fr: "fr",
  es: "sp",
  jp: "jp",
};

const PATTERNS = {
  gem: /<a class="gem_[a-z]+"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g,
  ascendancy: /<a class="[A-Za-z]+" data-hover="[^"]*Ascendancy[^"]*" href="([^"]+)"[^>]*>([^<]+)<\/a>/g,
  bloodline: /<div class="flex-grow-1 ms-2"><a href="([^"]+)">([^<]+)<\/a><\/div>/g,
};

const SOURCES = {
  poe1: {
    host: "https://poedb.tw",
    pages: [
      ["Skill_Gems", "gem", "skill"],
      ["Support_Gems", "gem", "support"],
      ["Transfigured_Gems", "gem", "skill"],
      ["Ascendancy_class", "ascendancy", "ascendancy"],
      ["Bloodline_Ascendancy_class", "bloodline", "ascendancy"],
    ],
  },
  poe2: {
    host: "https://poe2db.tw",
    pages: [
      ["Skill_Gems", "gem", "skill"],
      ["Support_Gems", "gem", "support"],
      ["Spirit_Gems", "gem", "skill"],
      ["Ascendancy_class", "ascendancy", "ascendancy"],
    ],
  },
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  const data = {};

  for (const [game, source] of Object.entries(SOURCES)) {
    const english = await readGame(source, "us", game);
    console.log(`${game}: ${english.size} english names`);

    data[game] = {};
    for (const [subdomain, code] of Object.entries(LANGUAGES)) {
      const localized = await readGame(source, code, game);
      const pairs = joinNames(english, localized);
      if (!pairs.size) {
        console.warn(`${game}/${subdomain}: nothing matched, skipped`);
        continue;
      }
      data[game][subdomain] = pairs;
      console.log(`${game}/${subdomain}: ${pairs.size} names`);
    }
  }

  fs.writeFileSync(OUTPUT, render(data));
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT)} (${Math.round(fs.statSync(OUTPUT).size / 1024)} KB)`);
}

async function readGame(source, code, game) {
  const names = new Map();

  for (const [page, pattern, kind] of source.pages) {
    const html = await fetchPage(`${source.host}/${code}/${page}`);
    let found = 0;

    for (const match of html.matchAll(PATTERNS[pattern])) {
      found += 1;
      const slug = normalizeSlug(match[1]);
      const name = decodeEntities(match[2]).trim();
      if (!slug || !name || names.has(slug)) continue;
      names.set(slug, { name, kind });
    }

    if (!found) console.warn(`  ${game}/${code}/${page}: pattern "${pattern}" matched nothing`);
  }

  return names;
}

function normalizeSlug(href) {
  return decodeURIComponent(String(href || "")).replace(/^\/?[a-z]{2}\//, "").replace(/^\//, "");
}

function joinNames(english, localized) {
  const pairs = new Map();

  localized.forEach((entry, slug) => {
    const source = english.get(slug);
    if (!source) return;

    [entry.name, source.name].forEach((name) => {
      const key = name.toLowerCase();
      if (key && !pairs.has(key)) pairs.set(key, [source.name, source.kind]);
    });
  });

  return pairs;
}

async function fetchPage(url) {
  await delay(REQUEST_DELAY_MS);
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
  return response.text();
}

function render(data) {
  const games = Object.entries(data).map(([game, languages]) => {
    const blocks = Object.entries(languages).map(([subdomain, pairs]) => {
      const lines = Array.from(pairs.entries())
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([key, value]) => `      ${JSON.stringify(key)}: ${JSON.stringify(value)},`);
      return `    ${subdomain}: {\n${lines.join("\n")}\n    },`;
    });
    return `  ${game}: {\n${blocks.join("\n")}\n  },`;
  });

  return `  const ENTITY_NAME_DATA = {\n${games.join("\n")}\n  };\n`;
}

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (entity, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (entity, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
