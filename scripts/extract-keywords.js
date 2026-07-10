const fs = require("fs");
const path = require("path");

const OUTPUT = path.join(__dirname, "..", "src", "core", "keywords-data.js");
const EXCLUDED = new Set([
  "contents",
  "see also",
  "references",
  "external links",
  "navigation",
  "notes",
  "version history",
]);
const MAX_DESCRIPTION_LENGTH = 420;

const sourcePath = process.argv[2];
if (!sourcePath) {
  console.error("Usage: node scripts/extract-keywords.js <saved-keyword-wiki-page.html>");
  process.exit(1);
}

const html = fs.readFileSync(sourcePath, "utf8");

const headingPattern = /<h([2-4])[^>]*>.*?<span class="mw-headline"[^>]*>([\s\S]*?)<\/span>/g;
const headings = [];
let match;
while ((match = headingPattern.exec(html))) {
  headings.push({
    term: textOf(match[2]),
    start: match.index,
    end: match.index + match[0].length,
  });
}

const keywords = new Map();
headings.forEach((heading, index) => {
  const term = heading.term;
  if (!term || EXCLUDED.has(term.toLowerCase())) return;

  const sliceEnd = index + 1 < headings.length ? headings[index + 1].start : html.length;
  const description = firstParagraph(html.slice(heading.end, sliceEnd));
  if (!description) return;

  const key = term.toLowerCase();
  if (!keywords.has(key)) keywords.set(key, [term, description]);
});

if (!keywords.size) {
  console.error("No keywords found. Is this a saved copy of the wiki Keyword page?");
  process.exit(1);
}

const lines = Array.from(keywords.entries())
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, entry]) => `    ${JSON.stringify(key)}: [${JSON.stringify(entry[0])}, ${JSON.stringify(entry[1])}],`);

fs.writeFileSync(OUTPUT, `  const KEYWORD_DATA = {\n${lines.join("\n")}\n  };\n`);
console.log(`Extracted ${keywords.size} keywords to ${path.relative(process.cwd(), OUTPUT)}`);

function firstParagraph(slice) {
  const pattern = /<p[^>]*>([\s\S]*?)<\/p>/g;
  let paragraph;
  while ((paragraph = pattern.exec(slice))) {
    const text = textOf(paragraph[1]);
    if (text) return truncate(text, MAX_DESCRIPTION_LENGTH);
  }
  return "";
}

function textOf(fragment) {
  return decodeEntities(fragment.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?')\]])/g, "$1")
    .replace(/([(['])\s+/g, "$1")
    .replace(/\s+('s\b)/g, "$1")
    .trim();
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

function truncate(text, limit) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
