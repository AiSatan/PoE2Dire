const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const PACKAGES_DIR = path.join(DIST, "packages");

const packageJson = require(path.join(ROOT, "package.json"));
const shouldPack = process.argv.includes("--pack");

const PROJECT_NAME = packageJson.name;

const TARGETS = ["chrome", "firefox"];

const CORE_FILE = `${PROJECT_NAME}-core.js`;
const BOOKMARKLET_FILE = `${PROJECT_NAME}-bookmarklet.js`;
const USERSCRIPT_FILE = `${PROJECT_NAME}.user.js`;
const CORE_CSS_FILE = "styles.css";
const PRIVACY_PAGE_FILE = "privacy.html";

const CORE_FRAGMENTS = [
  "config.js",
  "source.js",
  "parser.js",
  "icon-store.js",
  "icon-requests.js",
  "icon-names.js",
  "wiki-icon-source.js",
  "icons.js",
  "renderer.js",
  "utils.js",
  "index.js",
];

const EXTENSION_FILES = [
  ["core/styles.css", "core/styles.css"],
  ["extension/background.js", "background.js"],
  ["extension/type-search.js", "extension/type-search.js"],
  ["extension/type-search.css", "extension/type-search.css"],
];

function main() {
  // Start from a clean generated output directory.
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  for (const target of TARGETS) {
    buildTarget(target);
  }

  // The phone bookmarklet & userscripts are need the core CSS embedded in the generated JS.
  const css = fs.readFileSync(path.join(SRC, "core", CORE_CSS_FILE), "utf8");
  const bookmarkletPath = path.join(DIST, "gist", BOOKMARKLET_FILE);
  fs.mkdirSync(path.dirname(bookmarkletPath), { recursive: true });
  fs.writeFileSync(bookmarkletPath, buildCoreBundle(css));

  const typeSearchCss = fs.readFileSync(path.join(SRC, "extension", "type-search.css"), "utf8");
  const userscriptPath = path.join(DIST, "userscript", USERSCRIPT_FILE);
  fs.mkdirSync(path.dirname(userscriptPath), { recursive: true });
  fs.writeFileSync(userscriptPath, buildUserscript(`${css}\n${typeSearchCss}`));

  copyFile(
    path.join(SRC, "pages", PRIVACY_PAGE_FILE),
    path.join(DIST, "gist", PRIVACY_PAGE_FILE)
  );

  if (shouldPack) {
    for (const target of TARGETS) {
      writeZip(
        path.join(PACKAGES_DIR, `${PROJECT_NAME}-${target}.zip`),
        path.join(DIST, target)
      );
    }
  }
}

function buildTarget(target) {
  const targetRoot = path.join(DIST, target);
  fs.mkdirSync(path.join(targetRoot, "core"), { recursive: true });

  const manifest = JSON.parse(
    fs.readFileSync(path.join(SRC, "targets", target, "manifest.json"), "utf8")
  );

  manifest.version = packageJson.version;

  fs.writeFileSync(
    path.join(targetRoot, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  fs.writeFileSync(path.join(targetRoot, "core", CORE_FILE), buildCoreBundle(""));

  for (const [from, to] of EXTENSION_FILES) {
    copyFile(path.join(SRC, from), path.join(targetRoot, to));
  }

  copyDir(path.join(SRC, "assets"), path.join(targetRoot, "assets"));

  const licensePath = path.join(ROOT, "LICENSE");

  if (fs.existsSync(licensePath)) {
    copyFile(licensePath, path.join(targetRoot, "LICENSE"));
  }
}

function buildCoreBundle(styles) {
  const parts = CORE_FRAGMENTS.map((file) => {
    return fs.readFileSync(path.join(SRC, "core", file), "utf8").trimEnd();
  });

  return [
    "(() => {",
    "  \"use strict\";",
    "",
    `  const CORE_STYLES = ${JSON.stringify(styles)};`,
    "",
    parts.join("\n\n"),
    "})();",
    "",
  ].join("\n");
}

function buildUserscript(styles) {
  const typeSearch = fs.readFileSync(path.join(SRC, "extension", "type-search.js"), "utf8").trimEnd();
  return [
    userscriptHeader(),
    buildCoreBundle(styles),
    typeSearch,
    "",
  ].join("\n");
}

function userscriptHeader() {
  return [
    "// ==UserScript==",
    `// @name        ${PROJECT_NAME}`,
    "// @namespace   https://github.com/aisatan/PoE2Dire",
    `// @version     ${packageJson.version}`,
    "// @description Render Path of Exile patch notes in a Dota-style format.",
    "// @match       https://www.pathofexile.com/forum/*",
    "// @run-at      document-idle",
    "// @grant       GM_xmlhttpRequest",
    "// @grant       GM_registerMenuCommand",
    "// @connect     www.poe2wiki.net",
    "// @connect     www.poewiki.net",
    "// ==/UserScript==",
    "",
  ].join("\n");
}

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyDir(source, target);
    } else {
      copyFile(source, target);
    }
  }
}

function writeZip(zipPath, sourceDir) {
  fs.mkdirSync(path.dirname(zipPath), { recursive: true });
  fs.rmSync(zipPath, { force: true });

  const result = spawnSync("zip", ["-qr", zipPath, "."], {
    cwd: sourceDir,
    encoding: "utf8",
  });

  if (result.error?.code === "ENOENT") {
    throw new Error("zip command not found.");
  }

  if (result.status !== 0) {
    throw new Error(result.stderr || `zip failed for ${sourceDir}`);
  }
}

main();
