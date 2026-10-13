/* QA sweep over built HTML in public/. Checks links, headings, meta, alt, placeholders. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "public");

function walk(dir) {
  let files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(p));
    else if (e.name.endsWith(".html")) files.push(p);
  }
  return files;
}

const htmlFiles = walk(OUT);
const problems = [];
const add = (file, msg) => problems.push(`${path.relative(OUT, file).replace(/\\/g, "/")}: ${msg}`);

function fileForPath(urlPath) {
  // returns an existing file for a site path, or null
  let p = urlPath.split("#")[0].split("?")[0];
  if (!p.startsWith("/")) return "SKIP";
  if (p === "/") return fs.existsSync(path.join(OUT, "index.html")) ? "OK" : null;
  const candidates = [];
  if (/\.[a-z0-9]+$/i.test(p)) candidates.push(path.join(OUT, p));
  else {
    candidates.push(path.join(OUT, p, "index.html"));
    candidates.push(path.join(OUT, p.replace(/\/$/, "") + ".html"));
  }
  return candidates.some((c) => fs.existsSync(c)) ? "OK" : null;
}

// collect ids per file for anchor checks
const idsByPath = {};
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  const ids = new Set();
  const re = /\sid="([^"]+)"/g; let m;
  while ((m = re.exec(html))) ids.add(m[1]);
  let sitePath = "/" + path.relative(OUT, f).replace(/\\/g, "/").replace(/index\.html$/, "").replace(/\.html$/, "");
  idsByPath[sitePath] = ids;
}

const PLACEHOLDERS = [/lorem ipsum/i, /\bTODO\b/, /\[CLIENT/i, /\[ADD\]/i, /\[DATE\]/i, /\bplaceholder text\b/i, /\bCompanyName\b/, /<mark>/i, /\[INSERT/i, /\bXXXX\b/];

for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  const sitePath = "/" + path.relative(OUT, f).replace(/\\/g, "/").replace(/index\.html$/, "").replace(/\.html$/, "");

  // title
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) add(f, "missing <title>");

  // meta description
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) add(f, "missing/short meta description");

  // exactly one h1
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) add(f, `expected 1 <h1>, found ${h1s}`);

  // images alt
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  for (const img of imgs) if (!/\salt="/.test(img)) add(f, "img without alt: " + img.slice(0, 70));

  // dead hrefs
  const deadHref = html.match(/href="(#"|"|javascript:[^"]*")/g) || [];
  if (deadHref.length) add(f, `dead/empty href x${deadHref.length}`);

  // placeholders
  for (const re of PLACEHOLDERS) if (re.test(html)) add(f, "placeholder match: " + re);

  // internal links
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (id && !(idsByPath[sitePath] && idsByPath[sitePath].has(id))) add(f, `same-page anchor not found: ${href}`);
      continue;
    }
    const res = fileForPath(href);
    if (res === null) add(f, `broken internal link: ${href}`);
    // cross-page anchor id check
    if (res === "OK" && href.includes("#")) {
      const [p, anchor] = href.split("#");
      const key = p.replace(/index\.html$/, "").replace(/\.html$/, "");
      const normKey = key.endsWith("/") ? key.slice(0, -1) : key;
      const lookup = normKey === "" ? "/" : normKey;
      if (anchor && idsByPath[lookup] && !idsByPath[lookup].has(anchor)) add(f, `cross-page anchor #${anchor} not on ${p}`);
    }
  }
}

if (problems.length === 0) {
  console.log("QA PASS — no issues found across " + htmlFiles.length + " pages.");
} else {
  console.log(`QA found ${problems.length} issue(s) across ${htmlFiles.length} pages:\n`);
  problems.forEach((p) => console.log("  - " + p));
}
