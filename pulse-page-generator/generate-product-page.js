// Generates a static product page HTML file from data already in your
// Supabase `products` table — the same data your admin panel writes to.
//
// Usage:
//   node generate-product-page.js <product-slug>
//
// Example:
//   node generate-product-page.js pulse-sirova
//
// Output:
//   Writes a file at ../<category-slug>/<product-slug>/index.html
//   (relative to this script — adjust OUTPUT_ROOT below if your
//   pulse-website repo lives somewhere else).

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ---- Config ---------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '919071101108';

// Where generated pages get written. If this script sits inside your
// pulse-website repo (e.g. in a /scripts folder), '..' is usually right.
// Adjust this if you place the script elsewhere.
const OUTPUT_ROOT = path.resolve(__dirname, '..');

// ---- Helpers ----------------------------------------------------------

function esc(str = '') {
  return String(str).replace(/"/g, '&quot;');
}

function buildThumbsHtml(images, productNameFull) {
  if (!images.length) return '';

  const MAX_VISIBLE = 4;
  const visible = images.slice(0, MAX_VISIBLE);
  const remaining = images.slice(MAX_VISIBLE);

  let html = visible
    .map(
      (img, i) => `            <img src="${img.image_url}" alt="${esc(img.alt)}" class="${
        i === 0 ? 'active' : ''
      }" onclick="pgSetMain(this)">`
    )
    .join('\n');

  if (remaining.length) {
    const allUrls = images.map((img) => `'${img.image_url}'`).join(',');
    html += `\n            <div class="pg-more-tile" onclick="openGallery([${allUrls}], '${esc(
      productNameFull
    )}')">
              <img src="${remaining[0].image_url}" alt="${esc(productNameFull)} more photos">
              <span>+${remaining.length} more</span>
            </div>`;
  }

  return html;
}

function buildTagsHtml(tags) {
  return tags
    .map(
      (t) =>
        `            <span style="background:#eef1f6; color:#333; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:500;">${esc(
          t
        )}</span>`
    )
    .join('\n');
}

function buildFeaturesHtml(features) {
  return features
    .map(
      (f) =>
        `        <li style="padding:12px 16px; background:#f7f9fc; border-radius:8px; color:#444; font-size:0.95rem; display:flex; align-items:flex-start; gap:10px;"><span style="color:#E87722; font-weight:700; flex-shrink:0;">\u2713</span>${esc(
          f
        )}</li>`
    )
    .join('\n');
}

function buildSpecsTableHtml(specs) {
  return specs
    .map(
      (s, i) => `          <tr style="background:${i % 2 === 0 ? '#f9f9f9' : '#fff'};">
            <td style="padding:12px; border:1px solid #eee; font-weight:500; color:#555; width:30%;">${esc(
              s.label
            )}</td>
            <td style="padding:12px; border:1px solid #eee; color:#333;">${esc(s.value)}</td>
          </tr>`
    )
    .join('\n');
}

function buildRelatedProductsHtml(related, categorySlug) {
  return related
    .map(
      (p) => `    <a href="/${categorySlug}/${p.slug}/" style="display:flex; flex-direction:column; align-items:center; text-align:center; background:#fff; border:1px solid #eee; border-radius:12px; padding:20px 16px; text-decoration:none; color:inherit; transition:box-shadow 0.2s; flex:1; min-width:180px; max-width:220px;">
      <img src="${p.featured_image || ''}" alt="${esc(p.name)}" style="width:100px; height:100px; object-fit:contain; margin-bottom:12px;">
      <span style="font-size:0.9rem; font-weight:600; color:#0f1f4b; line-height:1.3;">${esc(p.name)}</span>
      <span style="font-size:0.8rem; color:#F07C2A; margin-top:8px; font-weight:500;">View Product \u2192</span>
    </a>`
    )
    .join('\n');
}

// ---- Main ---------------------------------------------------------------

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node generate-product-page.js <product-slug>');
    process.exit(1);
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log(`Fetching product "${slug}" from Supabase...`);

  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    console.error('Could not find that product. Check the slug matches what you set in the admin panel.');
    console.error(error?.message);
    process.exit(1);
  }

  const { data: images } = await supabase
    .from('product_images')
    .select('image_url, alt_text')
    .eq('product_id', product.id)
    .order('display_order');

  const galleryImages = (images && images.length ? images : [{ image_url: product.featured_image, alt_text: product.name }])
    .filter((i) => i.image_url)
    .map((i) => ({ image_url: i.image_url, alt: i.alt_text || product.name }));

  const { data: related } = await supabase
    .from('products')
    .select('name, slug, featured_image')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('status', 'active')
    .limit(3);

  const categoryName = product.categories?.name || 'Products';
  const categorySlug = product.categories?.slug || 'products';
  const categoryListingPath = `/${categorySlug}.html`;
  const categoryListingUrl = `https://www.pulseio.in${categoryListingPath}`;
  const canonicalUrl = `https://www.pulseio.in/${categorySlug}/${product.slug}/`;
  const productNameFull = `Pulse ${product.name}`;

  const specifications = product.specifications || {};
  const tags = specifications.tags || [];
  const features = specifications.features || [];
  const specs = specifications.specs || [];

  const brochureText = encodeURIComponent(
    `Hi, I would like to request the brochure for ${productNameFull}`
  );

  let html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');

  const replacements = {
    '{{META_DESCRIPTION}}': esc(
      product.seo_description ||
        `Buy ${productNameFull} from Pulse — India's trusted medical equipment manufacturer. ${categoryName} product engineered and serviced from our facilities.`
    ),
    '{{CANONICAL_URL}}': canonicalUrl,
    '{{PAGE_TITLE}}': esc(product.seo_title || productNameFull),
    '{{JSONLD_NAME}}': esc(productNameFull),
    '{{JSONLD_DESCRIPTION}}': esc(product.short_description || product.description || ''),
    '{{JSONLD_IMAGE}}': galleryImages[0]?.image_url || '',
    '{{CATEGORY_NAME}}': esc(categoryName),
    '{{CATEGORY_LISTING_URL}}': categoryListingUrl,
    '{{CATEGORY_LISTING_PATH}}': categoryListingPath,
    '{{PRODUCT_NAME_FULL}}': esc(productNameFull),
    '{{GALLERY_THUMBS_HTML}}': buildThumbsHtml(galleryImages, productNameFull),
    '{{MAIN_IMAGE_SRC}}': galleryImages[0]?.image_url || '',
    '{{EYEBROW_TEXT}}': esc(categoryName),
    '{{PRODUCT_DESCRIPTION}}': esc(product.short_description || product.description || ''),
    '{{TAGS_HTML}}': buildTagsHtml(tags),
    '{{WHATSAPP_NUMBER}}': WHATSAPP_NUMBER,
    '{{WHATSAPP_BROCHURE_TEXT}}': brochureText,
    '{{FEATURES_HTML}}': buildFeaturesHtml(features),
    '{{SPECS_TABLE_HTML}}': buildSpecsTableHtml(specs),
    '{{RELATED_PRODUCTS_HTML}}': buildRelatedProductsHtml(related || [], categorySlug),
  };

  for (const [token, value] of Object.entries(replacements)) {
    html = html.split(token).join(value);
  }

  const outputDir = path.join(OUTPUT_ROOT, categorySlug);
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${product.slug}.html`);
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log(`\nDone. Page written to:\n  ${outputPath}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Preview it locally with a static server (see README) — opening`);
  console.log(`     the file directly won't show the site's real header/footer styling.`);
  console.log(`  2. git add, commit, and push it to your pulse-website repo.`);
  console.log(`  3. If it's a new product, also add it to whatever file drives`);
  console.log(`     the ${categorySlug}.html listing page's product grid.`);
}

main();
