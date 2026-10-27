// Updates the content of an existing product page from its admin-panel record.
// Each part is either updated in the page's own markup style or skipped with a note, never guessed:
//   summary (paragraph under the title), tags, brochure link, photo gallery,
//   spec tables (row edits inside existing sections) and the key-features list.
// Edits are spliced into the original file, so untouched parts of the page stay byte-for-byte the same.
import { parse } from "parse5";

const SITE = "https://www.pulseio.in";
const SKIP_H2 = /frequently asked|\bfaqs?\b|you may also|setting up a whole|got questions|related|talk to|get a quote|why pulse/i;

/* ---------- tree helpers ---------- */
function* walk(n) { yield n; for (const c of n.childNodes || []) yield* walk(c); if (n.content) yield* walk(n.content); }
const isEl = (n) => !!n.tagName;
const attr = (n, k) => n.attrs?.find((a) => a.name === k)?.value;
const hasClass = (n, c) => (attr(n, "class") || "").split(/\s+/).includes(c);
const text = (n) => { let s = ""; for (const x of walk(n)) if (x.nodeName === "#text") s += x.value; return s; };
const tidy = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const same = (a, b) => String(a ?? "").replace(/\s+/g, "") === String(b ?? "").replace(/\s+/g, "");
const kids = (n) => (n.childNodes || []).filter(isEl);
const nextEl = (n) => { const sib = n.parentNode.childNodes; for (let i = sib.indexOf(n) + 1; i < sib.length; i++) if (isEl(sib[i])) return sib[i]; return null; };
const within = (n, tag) => { for (let p = n.parentNode; p; p = p.parentNode) if (p.tagName === tag) return p; return null; };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");
const loc = (n) => n.sourceCodeLocation;
const inner = (n) => [loc(n).startTag.endOffset, loc(n).endTag.startOffset];

// Image/brochure paths: the site writes /image/Critical care/x.jpg; the admin stores full encoded URLs.
const toPath = (u) => { if (!u) return ""; let s = String(u); if (s.startsWith(SITE)) s = s.slice(SITE.length); try { s = decodeURI(s); } catch { /* keep */ } return s.startsWith("http") ? s : "/" + s.replace(/^\.?\/+/, ""); };
const forPage = (u) => toPath(u); // site-relative for our own files, full URL for Supabase uploads

export function syncProduct(html, p) {
  const doc = parse(html, { sourceCodeLocationInfo: true });
  const all = [...walk(doc)];
  const els = all.filter(isEl);
  const edits = [], done = [], notes = [];
  const edit = (start, end, rep) => { if (html.slice(start, end) !== rep) edits.push([start, end, rep]); };
  const spec = p.specifications || {};
  const h1 = els.find((e) => e.tagName === "h1");
  if (!h1) return { html, done, notes: ["no page title found, skipped"] };

  /* 1. summary paragraph under the title */
  const hero = nextEl(h1);
  if (p.short_description?.trim()) {
    if (hero?.tagName === "p") {
      if (!same(text(hero), p.short_description)) {
        const [a, b] = inner(hero), cur = html.slice(a, b);
        if (kids(hero).length) notes.push("summary had links or bold text; replaced with your plain text");
        edit(a, b, cur.match(/^\s*/)[0] + esc(p.short_description.trim()) + cur.match(/\s*$/)[0]);
        done.push("summary");
      }
    } else {
      const firstP = els.find((e) => e.tagName === "p" && loc(e).startOffset > loc(h1).startOffset);
      if (!firstP || !same(text(firstP), p.short_description)) notes.push("this page's layout has no standard summary paragraph, so the summary was not updated");
    }
  }

  /* 2. tags */
  const tagsNote = all.find((n) => n.nodeName === "#comment" && /Feature Tags/i.test(n.data) && loc(n).startOffset > loc(h1).startOffset);
  const tagBox = tagsNote ? nextEl(tagsNote) : null;
  const want = (spec.tags || []).map(tidy).filter(Boolean);
  if (tagBox && kids(tagBox).length && kids(tagBox).every((k) => k.tagName === "span")) {
    const spans = kids(tagBox), have = spans.map((s) => tidy(text(s)));
    if (want.length && (have.length !== want.length || have.some((h, i) => !same(h, want[i])))) {
      const t0 = html.slice(loc(spans[0]).startOffset, loc(spans[0]).endOffset);
      const [ia, ib] = inner(spans[0]); const open = html.slice(loc(spans[0]).startOffset, ia), close = html.slice(ib, loc(spans[0]).endOffset);
      const gap = spans.length > 1 ? html.slice(loc(spans[0]).endOffset, loc(spans[1]).startOffset) : "\n" + (html.slice(0, loc(spans[0]).startOffset).match(/[ \t]*$/)[0]);
      edit(loc(spans[0]).startOffset, loc(spans.at(-1)).endOffset, want.map((t) => open + esc(t) + close).join(gap));
      void t0; done.push("tags");
    } else if (!want.length && have.length) notes.push("tags are empty in the admin, so the page's tags were kept");
  }

  /* 3. brochure link */
  const bro = els.find((e) => e.tagName === "a" && tidy(text(e)) === "Download Brochure");
  if (p.brochure_url) {
    if (bro && loc(bro).attrs?.href) {
      if (toPath(attr(bro, "href")) !== toPath(p.brochure_url)) {
        const h = loc(bro).attrs.href; edit(h.startOffset, h.endOffset, `href="${escAttr(forPage(p.brochure_url))}"`); done.push("brochure");
      }
    } else notes.push("this page's Download Brochure button is switched off, brochure not linked");
  }

  /* 4. photo gallery */
  const imgs = (p.product_images || []).slice().sort((a, b) => a.display_order - b.display_order).filter((i) => i.image_url);
  const gal = els.find((e) => hasClass(e, "pg-gallery"));
  if (imgs.length) {
    if (gal) {
      const thumbsBox = kids(gal).find((k) => hasClass(k, "pg-thumbs"));
      const mainBox = kids(gal).find((k) => hasClass(k, "pg-main"));
      const thumbs = thumbsBox ? kids(thumbsBox).filter((k) => k.tagName === "img") : [];
      const mainImg = mainBox ? [...walk(mainBox)].find((n) => n.tagName === "img") : null;
      const pageList = thumbs.map((t) => [toPath(attr(t, "src")), tidy(attr(t, "alt"))]);
      const dbList = imgs.map((i) => [toPath(i.image_url), tidy(i.alt_text || p.name)]);
      const differs = pageList.length !== dbList.length || pageList.some(([s, a], i) => s !== dbList[i][0] || !same(a, dbList[i][1]));
      if (thumbsBox && thumbs.length && kids(thumbsBox).length === thumbs.length && mainImg && differs) {
        const gap = thumbs.length > 1 ? html.slice(loc(thumbs[0]).endOffset, loc(thumbs[1]).startOffset) : "\n" + html.slice(0, loc(thumbs[0]).startOffset).match(/[ \t]*$/)[0];
        const fn = (attr(thumbs[0], "onclick") || "pgSetMain(this)");
        edit(loc(thumbs[0]).startOffset, loc(thumbs.at(-1)).endOffset,
          imgs.map((im, i) => `<img src="${escAttr(forPage(im.image_url))}" alt="${escAttr(tidy(im.alt_text || p.name))}"${i === 0 ? ' class="active"' : ""} onclick="${escAttr(fn)}">`).join(gap));
        for (const k of ["src", "alt"]) {
          const a = loc(mainImg).attrs?.[k]; const v = k === "src" ? forPage(imgs[0].image_url) : tidy(imgs[0].alt_text || p.name);
          if (a && !(k === "src" ? toPath(attr(mainImg, "src")) === toPath(v) : same(attr(mainImg, "alt"), v))) edit(a.startOffset, a.endOffset, `${k}="${escAttr(v)}"`);
        }
        // keep the Google product image in step with the main photo
        const ld = els.find((e) => e.tagName === "script" && attr(e, "type") === "application/ld+json" && /"@type"\s*:\s*"(Product|MedicalDevice)"/.test(text(e)));
        if (ld && toPath(attr(mainImg, "src")) !== toPath(imgs[0].image_url)) {
          const [a, b] = inner(ld), js = html.slice(a, b), abs = imgs[0].image_url.startsWith("http") ? imgs[0].image_url : SITE + encodeURI(toPath(imgs[0].image_url));
          const nj = js.replace(/("image"\s*:\s*)"[^"]*"/, `$1"${abs}"`); if (nj !== js) edit(a, b, nj);
        }
        done.push(`photos (${imgs.length})`);
      } else if (differs && !(thumbsBox && mainImg)) notes.push("gallery layout not recognised, photos not updated");
    } else {
      const sec = (() => { for (let q = h1.parentNode; q; q = q.parentNode) if (q.tagName === "section") return q; return doc; })();
      const first = [...walk(sec)].find((n) => n.tagName === "img");
      if (!first || toPath(attr(first, "src")) !== toPath(imgs[0].image_url)) notes.push("this page uses a fixed photo layout, so photo changes were not applied");
    }
  }

  /* 5 + 6. spec tables and key-features list (same reading rules as the original import) */
  const h2s = els.filter((e) => e.tagName === "h2");
  const groups = []; const feats = []; // feats: { t, li }
  for (let i = 0; i < h2s.length; i++) {
    const h2 = h2s[i]; if (SKIP_H2.test(tidy(text(h2)))) continue;
    const from = els.indexOf(h2), to = i + 1 < h2s.length ? els.indexOf(h2s[i + 1]) : els.length;
    let title = tidy(text(h2)), rows = [];
    for (let j = from + 1; j < to; j++) {
      const el = els[j];
      if (el.tagName === "h3") { if (rows.length) groups.push({ title, rows }); rows = []; title = tidy(text(el)); }
      else if (el.tagName === "tr") {
        const cells = kids(el).filter((c) => c.tagName === "td" || c.tagName === "th");
        const ct = cells.map((c) => tidy(text(c)));
        if (cells.length >= 2 && ct[0] && ct[1] && !within(el, "thead")) rows.push({ label: ct[0], value: cells.length > 2 ? ct.slice(1).join(" — ") : ct[1], tr: el, n: cells.length });
      } else if (el.tagName === "li" && !within(el, "nav")) {
        const t = tidy(text(el)).replace(/^[✓✔•\- ]+/, "").trim();
        if (t && !feats.some((f) => f.t === t)) feats.push({ t, li: el });
      }
    }
    if (rows.length) groups.push({ title, rows });
  }

  // specs
  const dbGroups = [];
  for (const r of spec.specs || []) { if (!r.label && !r.value) continue; const g = r.group || null; const last = dbGroups.at(-1); if (last && last.title === g) last.rows.push(r); else dbGroups.push({ title: g, rows: [r] }); }
  const rowsSame = (a, b) => a.length === b.length && a.every((r, i) => same(r.label, b[i].label) && same(r.value, b[i].value));
  const pageFlat = groups.flatMap((g) => g.rows), dbFlat = dbGroups.flatMap((g) => g.rows);
  if (!rowsSame(pageFlat, dbFlat) || groups.length !== dbGroups.length) {
    if (!dbFlat.length) { if (pageFlat.length) notes.push("the spec table is empty in the admin, so the page's table was kept"); }
    else if (groups.length !== dbGroups.length || groups.some((g, i) => dbGroups[i].title && !same(g.title, dbGroups[i].title))) {
      notes.push("spec sections were added, removed or renamed; that needs a layout change, so the spec table was not updated");
    } else {
      let ok = true; const pend = [];
      groups.forEach((g, i) => {
        const d = dbGroups[i].rows; if (rowsSame(g.rows, d)) return;
        const tables = [...new Set(g.rows.map((r) => within(r.tr, "table")))];
        const body = tables.length === 1 ? (g.rows[0].tr.parentNode.tagName === "tbody" ? g.rows[0].tr.parentNode : tables[0]) : null;
        const trs = body ? kids(body).filter((k) => k.tagName === "tr") : [];
        if (!body || trs.length !== g.rows.length || g.rows.some((r) => r.n !== 2 || !trs.includes(r.tr))) { ok = false; return; }
        const gap = trs.length > 1 ? html.slice(loc(trs[0]).endOffset, loc(trs[1]).startOffset) : "\n" + html.slice(0, loc(trs[0]).startOffset).match(/[ \t]*$/)[0];
        const tpl = trs.map((tr) => { const [c1, c2] = kids(tr).filter((c) => c.tagName === "td" || c.tagName === "th"); const s = loc(tr).startOffset; const [a1, b1] = inner(c1), [a2, b2] = inner(c2); return (l, v) => html.slice(s, a1) + esc(l) + html.slice(b1, a2) + esc(v) + html.slice(b2, loc(tr).endOffset); });
        pend.push([loc(trs[0]).startOffset, loc(trs.at(-1)).endOffset, d.map((r, k) => tpl[k % tpl.length](r.label || "", r.value || "")).join(gap)]);
      });
      if (ok && pend.length) { pend.forEach(([a, b, r]) => edit(a, b, r)); done.push("specs"); }
      else if (!ok) notes.push("a changed spec section uses a multi-column or mixed table, so specs were not updated");
    }
  }

  // key features
  const wantF = (spec.features || []).map(tidy).filter(Boolean);
  const haveF = feats.map((f) => f.t);
  if (wantF.length && (haveF.length !== wantF.length || haveF.some((h, i) => !same(h, wantF[i])))) {
    const lists = [...new Set(feats.map((f) => f.li.parentNode))];
    const lis = lists.length === 1 ? kids(lists[0]).filter((k) => k.tagName === "li") : [];
    if (lists.length === 1 && lis.length === feats.length && lis.length) {
      // Template = first item: keep its tag, its ✓ mark (if any) and its spacing; swap the words.
      const li = lis[0], s0 = loc(li).startOffset, e0 = loc(li).endOffset, [ia, ib] = inner(li);
      const mark = kids(li)[0] && /^[✓✔•]$/.test(tidy(text(kids(li)[0]))) ? kids(li)[0] : null;
      const ca = mark ? loc(mark).endOffset : ia, body = html.slice(ca, ib);
      const lead = mark ? "" : body.match(/^\s*/)[0], trail = body.match(/\s*$/)[0];
      const strongTpl = kids(li).find((k) => k.tagName === "strong");
      const strongOpen = strongTpl ? html.slice(loc(strongTpl).startOffset, loc(strongTpl).startTag.endOffset) : "";
      const words = (t) => { const m = strongTpl && t.match(/^([^:]{1,40}):\s+(.+)$/); return m ? `${strongOpen}${esc(m[1])}:</strong> ${esc(m[2])}` : esc(t); };
      const gap = lis.length > 1 ? html.slice(e0, loc(lis[1]).startOffset) : "\n" + html.slice(0, s0).match(/[ \t]*$/)[0];
      edit(s0, loc(lis.at(-1)).endOffset, wantF.map((t) => html.slice(s0, ca) + lead + words(t) + trail + html.slice(ib, e0)).join(gap));
      done.push("key features");
    } else if (haveF.length) notes.push("key features are laid out in several blocks on this page, so they were not updated");
    else notes.push("this page has no key-features list, features not shown");
  } else if (!wantF.length && haveF.length) notes.push("key features are empty in the admin, so the page's list was kept");

  /* apply (back to front so offsets stay valid) */
  edits.sort((a, b) => b[0] - a[0]);
  for (let i = 1; i < edits.length; i++) if (edits[i][1] > edits[i - 1][0]) throw new Error(`${p.slug}: overlapping edits, stopping`);
  let out = html;
  for (const [a, b, r] of edits) out = out.slice(0, a) + r + out.slice(b);
  return { html: out, done, notes };
}
