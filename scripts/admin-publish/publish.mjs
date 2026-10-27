// Publish from the Pulse admin panel to the website files.
// Runs in GitHub Actions (see .github/workflows/publish-from-admin.yml) when someone clicks
// "Publish to website" in the admin panel. Reads the public data from Supabase and updates:
//   1. <title>, meta description, Open Graph and Twitter tags on every page (Page SEO)
//      and every product page (product SEO fields)
//   2. product page content: summary, tags, brochure link, photo gallery, spec tables, key features
//   2b. NEW products (Active + "Create a page on the website" ticked): a full page, plus category grid,
//       menu, site search, sitemap and web address entries
//   3. js/faq-data.js (site search + chatbot answers) from the FAQs table
// It only edits values that changed, never blanks a field, and refuses to run if the data
// looks incomplete. Usage: node scripts/admin-publish/publish.mjs [--dry-run]
import fs from "node:fs";
import path from "node:path";
import { syncProduct } from "./products.mjs";
import { placement, missing, buildPage, register, fullName } from "./newpages.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const SB_URL = "https://vyknmwrcvfnpbcrjugik.supabase.co";
const SB_KEY = "sb_publishable_An5cioRIYrYkii-Z7QFVgg_FPFpJZ_6"; // public, read-only for visitors
const SITE = "https://www.pulseio.in";
const DRY = process.argv.includes("--dry-run");
const FIXTURE = process.env.PUBLISH_FIXTURE; // local testing: JSON file instead of Supabase

const log = [];
const changed = new Set();
const warn = [];

async function fetchAll(table, query) {
  if (FIXTURE) return JSON.parse(fs.readFileSync(FIXTURE, "utf8"))[table] || [];
  const out = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?${query}`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, Range: `${from}-${from + 999}`, "Range-Unit": "items" },
    });
    if (!res.ok) throw new Error(`Could not read ${table}: ${res.status} ${await res.text()}`);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < 1000) return out;
  }
}

/* ---------- HTML helpers ---------- */
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", middot: "·", copy: "©", reg: "®", trade: "™", times: "×", deg: "°", rarr: "→", larr: "←", bull: "•", eacute: "é" };
const decode = (s) => String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return NAMED[e.toLowerCase()] ?? m;
});
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const norm = (s) => decode(s).replace(/\s+/g, " ").trim();

// Replace the content="" of the first <meta> in <head> whose attribute attr="key". Returns [html, changed].
function setMeta(html, attr, key, value) {
  const head = html.split(/<\/head>/i)[0];
  const re = new RegExp(`<meta\\b[^>]*\\b${attr}\\s*=\\s*["']${key.replace(/[.:]/g, "\\$&")}["'][^>]*>`, "i");
  const m = head.match(re);
  if (!m) return [html, false];
  const tag = m[0];
  const cm = tag.match(/\bcontent\s*=\s*("([^"]*)"|'([^']*)')/i);
  if (!cm) return [html, false];
  const cur = cm[2] ?? cm[3] ?? "";
  if (norm(cur) === norm(value)) return [html, false];
  const newTag = tag.replace(cm[0], `content="${escAttr(value)}"`);
  return [html.replace(tag, newTag), true];
}
function setTitle(html, value) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m || norm(m[1]) === norm(value)) return [html, false];
  return [html.replace(m[0], `<title>${escText(value)}</title>`), true];
}
// Pages that redirect to a DIFFERENT page are skipped. Redirects to their own clean address
// (e.g. /critical-care/icu-ventilator.html -> /critical-care/icu-ventilator/, /index.html -> /) are fine.
const selfUrls = (f) => f === "index.html" ? ["/"] : ["/" + f.replace(/\.html$/, "/"), "/" + f.replace(/\.html$/, "")];
const REDIRECTED = new Set((JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8")).redirects || [])
  .map((r) => [r.source.replace(/^\//, ""), r.destination]).filter(([src, dst]) => /\.html$/.test(src) && !selfUrls(src).includes(dst)).map(([src]) => src));
function applySeo(file, { title, description, image }) {
  if (REDIRECTED.has(file)) { warn.push(`${file}: this page now redirects elsewhere, skipped (you can delete it from Page SEO)`); return; }
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) { warn.push(`${file}: file not found, skipped`); return; }
  let html = fs.readFileSync(abs, "utf8"), any = false, c;
  const parts = [];
  if (title && title.trim()) {
    [html, c] = setTitle(html, title.trim()); if (c) parts.push("title");
    for (const [a, k] of [["property", "og:title"], ["name", "twitter:title"]]) { [html, c] = setMeta(html, a, k, title.trim()); any ||= c; }
    any ||= parts.includes("title");
    if (title.trim().length > 65) warn.push(`${file}: title is ${title.trim().length} characters (Google shows about 60)`);
  }
  if (description && description.trim()) {
    let d = false;
    for (const [a, k] of [["name", "description"], ["property", "og:description"], ["name", "twitter:description"]]) { [html, c] = setMeta(html, a, k, description.trim()); d ||= c; }
    if (d) parts.push("description"); any ||= d;
    if (description.trim().length > 165) warn.push(`${file}: description is ${description.trim().length} characters (Google shows about 155)`);
  }
  if (image && image.trim()) {
    let i = false;
    for (const [a, k] of [["property", "og:image"], ["name", "twitter:image"]]) { [html, c] = setMeta(html, a, k, image.trim()); i ||= c; }
    if (i) parts.push("share image"); any ||= i;
  }
  if (!any) return;
  if (/<\/html>/i.test(fs.readFileSync(abs, "utf8")) && !/<\/html>/i.test(html)) throw new Error(`${file}: page structure changed unexpectedly, stopping`);
  if (!DRY) fs.writeFileSync(abs, html);
  changed.add(file);
  log.push(`SEO  ${file}: ${parts.join(", ") || "social tags"}`);
}

/* ---------- 1. Page SEO ---------- */
const pages = await fetchAll("website_pages", "select=file_path,meta_title,meta_description,og_image_url&order=file_path");
if (pages.length < 30) throw new Error(`Only ${pages.length} pages came back from the database (expected 60+). Stopping so nothing is wiped.`);
for (const p of pages) {
  const file = String(p.file_path || "").replace(/^\/+/, "");
  if (!/^[a-z0-9-]+\.html$/i.test(file)) { warn.push(`Page SEO: "${p.file_path}" is not a top-level page file, skipped`); continue; }
  applySeo(file, { title: p.meta_title, description: p.meta_description, image: p.og_image_url });
}

/* ---------- 2. Product pages: content (summary, tags, brochure, photos, specs, features) + SEO ---------- */
const products = await fetchAll("products", "select=slug,name,short_description,brochure_url,seo_title,seo_description,specifications,featured_image,create_page,categories(slug,name),product_images(image_url,alt_text,display_order)&status=eq.active&order=slug");
if (products.length < 30) throw new Error(`Only ${products.length} products came back (expected 60+). Stopping.`);
const TEMPLATE = fs.readFileSync(path.join(ROOT, "pulse-page-generator/template.html"), "utf8");
const pageUrl = (p) => {
  if (p.specifications?.page_url) return p.specifications.page_url;
  const pl = placement(p);
  return p.create_page && pl && fs.existsSync(path.join(ROOT, pl.file)) ? SITE + pl.url : null;
};
const firstImg = (p) => ([...(p.product_images || [])].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]?.image_url) || p.featured_image;
for (const p of products) {
  if (!pageUrl(p) && p.create_page) {
    const miss = missing(p);
    if (miss.length) { warn.push(`"${p.name}": website page not created yet. Still needed: ${miss.join("; ")}`); continue; }
    const pl = placement(p);
    const related = products.filter((o) => o !== p && o.categories?.slug === p.categories?.slug && pageUrl(o) && firstImg(o)).slice(0, 3)
      .map((o) => ({ url: pageUrl(o).replace(SITE, ""), name: fullName(o), img: firstImg(o) }));
    const html = buildPage(TEMPLATE, p, related);
    if (DRY) { changed.add(pl.file); log.push(`NEW  ${pl.file}: page would be created (check only)`); continue; }
    fs.writeFileSync(path.join(ROOT, pl.file), html);
    const reg = register(ROOT, p, warn);
    changed.add(pl.file); reg.forEach((r) => changed.add(r));
    log.push(`NEW  ${pl.file}: page created${reg.length ? `, added to ${reg.join(", ")}` : ""}`);
  }
  const url = pageUrl(p);
  if (!url) { warn.push(`Product "${p.name}" has no website page yet (new product): tick "Create a page on the website" to publish it`); continue; }
  const m = url.match(/^https:\/\/www\.pulseio\.in\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/);
  if (!m) { warn.push(`Product "${p.name}": unexpected page link ${url}, skipped`); continue; }
  const file = `${m[1]}/${m[2]}.html`, abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) { warn.push(`${file}: file not found, skipped`); continue; }
  const before = fs.readFileSync(abs, "utf8");
  const r = syncProduct(before, p);
  r.notes.forEach((n) => warn.push(`${p.name}: ${n}`));
  if (r.html !== before) {
    if (/<\/html>/i.test(before) && !/<\/html>/i.test(r.html)) throw new Error(`${file}: page structure changed unexpectedly, stopping`);
    if (!DRY) fs.writeFileSync(abs, r.html);
    changed.add(file);
    log.push(`PAGE ${file}: ${r.done.join(", ")}`);
  }
  applySeo(file, { title: p.seo_title, description: p.seo_description });
}

/* ---------- 3. FAQ data (site search + chatbot) ---------- */
const faqFile = path.join(ROOT, "js/faq-data.js");
const before = fs.readFileSync(faqFile, "utf8");
const oldCount = (before.match(/"q":/g) || []).length;
const faqs = await fetchAll("faqs", "select=question,answer,page_url,display_order&is_active=eq.true&order=display_order.asc,created_at.asc");
if (faqs.length < Math.floor(oldCount * 0.6)) throw new Error(`Only ${faqs.length} FAQs came back but the site has ${oldCount}. Stopping so FAQs aren't lost.`);
const rel = (u) => (u || "").startsWith(SITE) ? u.slice(SITE.length) || "/" : (u || "");
const noPage = faqs.filter((f) => !f.page_url);
if (noPage.length) warn.push(`${noPage.length} FAQ(s) have no "Page it belongs to" link and were left out: ${noPage.slice(0, 5).map((f) => `"${f.question.slice(0, 50)}"`).join(", ")}`);
const data = faqs.filter((f) => f.page_url && f.question?.trim() && f.answer?.trim()).map((f) => ({ q: f.question.trim(), a: f.answer.trim(), u: rel(f.page_url) }));
const after = `window.PULSE_FAQ_DATA = ${JSON.stringify(data)};`;
if (after !== before.trim()) {
  if (!DRY) fs.writeFileSync(faqFile, after);
  changed.add("js/faq-data.js");
  log.push(`FAQ  js/faq-data.js: ${oldCount} → ${data.length} questions`);
}

/* ---------- report ---------- */
const summary = [
  `## Publish from admin ${DRY ? "(dry run)" : ""}`,
  changed.size ? `**${changed.size} file(s) updated**` : "**No changes: the website already matches the admin panel.**",
  ...log.map((l) => `- ${l}`),
  ...(warn.length ? ["", "### Notes", ...warn.map((w) => `- ${w}`)] : []),
].join("\n");
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed.size}\n`);
// GitHub annotations: the admin panel's Publish page reads these to show what happened.
if (process.env.GITHUB_ACTIONS) {
  const clean = (t) => String(t).replace(/%/g, "%25").replace(/\r?\n/g, "%0A");
  const what = log.map((l) => l.replace(/^(SEO|PAGE|FAQ|NEW)\s+/, "")).slice(0, 25).join("\n");
  console.log(`::notice title=Publish result::${clean((changed.size ? `${changed.size} file(s) updated${DRY ? " (check only, nothing saved)" : ""}` : "No changes needed") + (what ? "\n" + what : ""))}`);
  const useful = warn.filter((w) => !/characters \(Google|redirects elsewhere|has no website page yet/.test(w));
  if (useful.length) console.log(`::warning title=Publish notes::${clean(useful.slice(0, 25).join("\n"))}`);
}
