// Step 3 of "Publish to website": create a full page for a NEW product added in the admin panel,
// and register it everywhere the site lists products: category grid + product pills, the header
// mega menu, site search, sitemap.xml and the clean-URL routes in vercel.json.
// A page is only created when the product is Active, "Create a page on the website" is ticked,
// and it has the minimum content (summary, a photo, and features or specs).
import fs from "node:fs";
import path from "node:path";

const SITE = "https://www.pulseio.in";
// category slug in the database -> folder and listing page on the website
const FOLDER = { "critical-care": "critical-care", "renal-care": "renal-care", "cardiac-care": "cardiac-care", aesthetics: "aesthetics", "ivd-diagnostics": "ivd-diagnostics", "hospital-setup": "hospital-setup", surgical: "surgical-care" };
const LISTING = { surgical: "surgical.html" };
const MENU_KEY = { "critical-care": "Critical Care", "renal-care": "Renal Care", "cardiac-care": "Cardiac Care", surgical: "Surgical", "hospital-setup": "Hospital Setup" };

const h = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const js = (s) => JSON.stringify(String(s ?? ""));
export const fullName = (p) => (/^pulse\b/i.test(p.name.trim()) ? p.name.trim() : `Pulse ${p.name.trim()}`);
const shortName = (p) => fullName(p).replace(/^Pulse\s+/i, "");
const images = (p) => {
  const g = [...(p.product_images || [])].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)).filter((i) => i.image_url);
  if (g.length) return g.map((i) => ({ url: i.image_url, alt: i.alt_text || fullName(p) }));
  return p.featured_image ? [{ url: p.featured_image, alt: fullName(p) }] : [];
};
const absUrl = (u) => (/^https?:\/\//.test(u) ? u : SITE + encodeURI(u.startsWith("/") ? u : "/" + u));

export function placement(p) {
  const cat = p.categories?.slug;
  const folder = FOLDER[cat];
  if (!folder) return null;
  return { cat, folder, file: `${folder}/${p.slug}.html`, url: `/${folder}/${p.slug}/`, listing: LISTING[cat] || `${cat}.html`, catName: p.categories?.name || "Products" };
}

// What's missing before a page can be made (empty list = ready)
export function missing(p) {
  const out = [];
  const s = p.specifications || {};
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug || "")) out.push("a valid URL slug (lowercase letters, numbers and dashes)");
  if (!placement(p)) out.push(`a website category (\"${p.categories?.name || "none"}\" has no product section on the website)`);
  if ((p.short_description || "").trim().length < 40) out.push("a short description (at least 40 characters)");
  if (!images(p).length) out.push("at least one photo");
  if ((s.features || []).filter(Boolean).length < 3 && (s.specs || []).filter((x) => x?.label && x?.value).length < 2) out.push("at least 3 key features or 2 specification rows");
  return out;
}

function specsSection(specs) {
  const groups = [];
  for (const r of specs.filter((x) => x?.label && x?.value)) {
    const g = (r.group || "Technical Specifications").trim();
    let cur = groups.find((x) => x.name === g);
    if (!cur) groups.push((cur = { name: g, rows: [] }));
    cur.rows.push(r);
  }
  return groups.map((g) => `      <h2 style="color:#0f1f4b; font-size:1.6rem; margin-bottom:28px;">${h(g.name)}</h2>
      <table style="width:100%; border-collapse:collapse; font-size:15px; border:1px solid #eee; margin-bottom:32px;">
        <tbody>
${g.rows.map((s, i) => `          <tr style="background:${i % 2 === 0 ? "#f9f9f9" : "#fff"};">
            <td style="padding:12px; border:1px solid #eee; font-weight:500; color:#555; width:30%;">${h(s.label)}</td>
            <td style="padding:12px; border:1px solid #eee; color:#333;">${h(s.value)}</td>
          </tr>`).join("\n")}
        </tbody>
      </table>`).join("\n");
}

export function buildPage(tpl, p, related) {
  const pl = placement(p), s = p.specifications || {}, imgs = images(p), name = fullName(p);
  const tags = (s.tags || []).filter(Boolean), feats = (s.features || []).filter(Boolean);
  const thumbs = imgs.slice(0, 4).map((im, i) => `            <img src="${h(im.url)}" alt="${h(im.alt)}"${i === 0 ? ' class="active"' : ""} onclick="pgSetMain(this)">`).join("\n");
  const rel = related.map((r) => `    <a href="${r.url}" style="display:flex; flex-direction:column; align-items:center; text-align:center; background:#fff; border:1px solid #eee; border-radius:12px; padding:20px 16px; text-decoration:none; color:inherit; flex:1; min-width:180px; max-width:220px;">
      <img src="${h(r.img)}" alt="${h(r.name)}" style="width:100px; height:100px; object-fit:contain; margin-bottom:12px;">
      <span style="font-size:0.9rem; font-weight:600; color:#0f1f4b; line-height:1.3;">${h(r.name)}</span>
      <span style="font-size:0.8rem; color:#F07C2A; margin-top:8px; font-weight:500;">View Product →</span>
    </a>`).join("\n");
  const canonical = SITE + pl.url;
  const map = {
    "{{META_DESCRIPTION}}": h((p.seo_description || p.short_description).trim()),
    "{{CANONICAL_URL}}": canonical,
    "{{PAGE_TITLE}}": h((p.seo_title || `${name} | Pulse`).trim()),
    "{{JSONLD_NAME}}": JSON.stringify(name).slice(1, -1),
    "{{JSONLD_DESCRIPTION}}": JSON.stringify(p.short_description.trim()).slice(1, -1),
    "{{JSONLD_IMAGE}}": absUrl(imgs[0].url),
    "{{CATEGORY_NAME}}": h(pl.catName),
    "{{CATEGORY_LISTING_URL}}": `${SITE}/${pl.listing}`,
    "{{CATEGORY_LISTING_PATH}}": `/${pl.listing}`,
    "{{PRODUCT_NAME_FULL}}": h(name),
    "{{GALLERY_THUMBS_HTML}}": thumbs,
    "{{MAIN_IMAGE_SRC}}": h(imgs[0].url),
    "{{EYEBROW_TEXT}}": h(pl.catName),
    "{{PRODUCT_DESCRIPTION}}": h(p.short_description.trim()),
    "{{TAGS_HTML}}": tags.map((t) => `            <span style="background:#eef1f6; color:#333; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:500;">${h(t)}</span>`).join("\n"),
    "{{WHATSAPP_NUMBER}}": "919071101108",
    "{{QUOTE_URL}}": `/request-a-quote.html?product=${encodeURIComponent(name)}`,
    "{{WHATSAPP_BROCHURE_TEXT}}": encodeURIComponent(`Hi, I would like to request the brochure for ${name}`),
    "{{FEATURES_HTML}}": feats.map((f) => `        <li style="padding:12px 16px; background:#f7f9fc; border-radius:8px; color:#444; font-size:0.95rem; display:flex; align-items:flex-start; gap:10px;"><span style="color:#E87722; font-weight:700; flex-shrink:0;">✓</span>${h(f)}</li>`).join("\n"),
    "{{RELATED_PRODUCTS_HTML}}": rel,
  };
  let out = tpl;
  // features and specs blocks are optional; replace the template's single spec table with grouped tables
  out = out.replace(/      <h2[^>]*>Technical Specifications<\/h2>\s*<table[\s\S]*?<\/table>/, specsSection(s.specs || []));
  if (!feats.length) out = out.replace(/      <h2[^>]*>Key Features<\/h2>\s*<ul[\s\S]*?<\/ul>\n?/, "");
  if (!related.length) out = out.replace(/  <!-- RELATED PRODUCTS -->[\s\S]*?<\/section>\n/, "");
  if (!tags.length) out = out.replace(/          <!-- Feature Tags -->\s*<div[^>]*>\s*\{\{TAGS_HTML\}\}\s*<\/div>\n/, "");
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);
  if (/\{\{[A-Z_]+\}\}/.test(out)) throw new Error(`${pl.file}: template placeholder left unfilled`);
  return out;
}

/* ---------- registrations (each is skipped if the product is already there) ---------- */
function insertBefore(text, marker, add, from = 0) {
  const i = text.indexOf(marker, from);
  return i < 0 ? null : text.slice(0, i) + add + text.slice(i);
}

export function register(ROOT, p, notes) {
  const pl = placement(p), name = fullName(p), img = images(p)[0].url, s = p.specifications || {};
  const done = [];
  const rd = (f) => fs.readFileSync(path.join(ROOT, f), "utf8"), wr = (f, t) => fs.writeFileSync(path.join(ROOT, f), t);

  // 1. category listing page: product grid data + "products in this range" pills
  const lf = pl.listing;
  if (fs.existsSync(path.join(ROOT, lf))) {
    let t = rd(lf), changedL = false;
    if (!t.includes(`slug: "${pl.url}"`)) {
      const obj = `,\n      {\n        name: ${js(name)},\n        slug: ${js(pl.url)},\n        category: ${js(pl.catName.toUpperCase())},\n        type: "new",\n        app: "all",\n        cert: [],\n        tag: ${js((s.tags || [])[0] || shortName(p))},\n        tagColor: "",\n        desc: ${js(p.short_description.trim())},\n        specs: ${JSON.stringify((s.tags || []).slice(0, 3))},\n        img: ${js(img)}\n      }`;
      const m = t.match(/\n\s*\}\s*\n\s*\];\s*\n\s*const PER_PAGE/);
      if (m) { const at = t.indexOf(m[0]) + m[0].indexOf("}") + 1; t = t.slice(0, at) + obj + t.slice(at); changedL = true; }
      else notes.push(`${lf}: product grid not recognised, add "${name}" to it by hand`);
    }
    if (!t.includes(`href="${pl.url}"><span class="cp-thumb">`) && !t.includes(`<li><a href="${pl.url}"`)) {
      // product cards ("Browse the range" section); falls back to the older pill list
      const cards = [...t.matchAll(new RegExp(`<li class="cp-item"><a class="cp-card" href="/${pl.folder}/[a-z0-9-]+/">[\\s\\S]*?</a></li>`, "g"))];
      const pills = [...t.matchAll(new RegExp(`<li><a href="/${pl.folder}/[a-z0-9-]+/" style="([^"]*)">[^<]*</a></li>`, "g"))];
      if (cards.length) {
        const last = cards[cards.length - 1]; const at = last.index + last[0].length;
        t = t.slice(0, at) + `\n        <li class="cp-item"><a class="cp-card" href="${pl.url}"><span class="cp-thumb"><img src="${h(img)}" alt="${h(shortName(p))}" loading="lazy" width="60" height="60"></span><span class="cp-name">${h(shortName(p))}</span><span class="cp-go" aria-hidden="true">&rarr;</span></a></li>` + t.slice(at);
        changedL = true;
      } else if (pills.length) { const last = pills[pills.length - 1]; const at = last.index + last[0].length; t = t.slice(0, at) + `\n        <li><a href="${pl.url}" style="${last[1]}">${h(shortName(p))}</a></li>` + t.slice(at); changedL = true; }
    }
    if (changedL) { wr(lf, t); done.push(lf); }
  } else notes.push(`${lf}: category page not found`);

  // 2. header: mega menu (where the category has one) + site search
  let hj = rd("js/header.js"), hc = false;
  const key = MENU_KEY[pl.cat];
  if (key && !hj.includes(`"href": "${pl.url}"`)) {
    const start = hj.indexOf(`"${key}": {`);
    const prod = start < 0 ? -1 : hj.indexOf(`"products": [`, start);
    if (prod > 0) {
      let depth = 0, i = hj.indexOf("[", prod);
      for (; i < hj.length; i++) { if (hj[i] === "[") depth++; else if (hj[i] === "]" && --depth === 0) break; }
      const close = hj.lastIndexOf("}", i);
      hj = hj.slice(0, close + 1) + `,\n                              {\n                                        "name": ${js(shortName(p))},\n                                        "image": ${js(img)},\n                                        "href": ${js(pl.url)}\n                              }` + hj.slice(close + 1);
      hc = true;
    }
  }
  if (!hj.includes(`url: '${pl.url}'`)) {
    const words = [...new Set([shortName(p).toLowerCase(), name.toLowerCase(), p.slug.replace(/-/g, " "), ...(s.tags || []).slice(0, 2).map((x) => String(x).toLowerCase())])].filter(Boolean);
    const add = `\n  { keywords: [${words.map((w) => `'${w.replace(/\\/g, "").replace(/'/g, "\\'")}'`).join(",")}], url: '${pl.url}' },\n`;
    const r = insertBefore(hj, "\n", add, hj.indexOf("var searchMap = ["));
    if (r && hj.indexOf("var searchMap = [") > 0) { hj = r; hc = true; }
  }
  if (hc) { wr("js/header.js", hj); done.push("menu/search"); }

  // 3. sitemap
  let sm = rd("sitemap.xml");
  if (!sm.includes(`<loc>${SITE}${pl.url}</loc>`)) {
    const today = new Date().toISOString().slice(0, 10);
    sm = sm.replace("</urlset>", `  <url>\n    <loc>${SITE}${pl.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n    <image:image><image:loc>${h(absUrl(img))}</image:loc></image:image>\n  </url>\n</urlset>`);
    wr("sitemap.xml", sm); done.push("sitemap");
  }

  // 4. clean URL: /folder/slug -> /folder/slug/ (redirect) and /folder/slug/ -> file (rewrite)
  const v = JSON.parse(rd("vercel.json"));
  let vc = false;
  const noSlash = pl.url.replace(/\/$/, "");
  if (!v.redirects.some((r) => r.source === noSlash)) { v.redirects.push({ source: noSlash, destination: pl.url, permanent: true }); vc = true; }
  v.rewrites = v.rewrites || [];
  if (!v.rewrites.some((r) => r.source === pl.url)) { v.rewrites.push({ source: pl.url, destination: `/${pl.file}` }); vc = true; }
  if (vc) { wr("vercel.json", JSON.stringify(v, null, 2) + "\n"); done.push("web address"); }
  return done;
}
