// One-time fix: writes correct meta descriptions directly into the live HTML.
// After running this, re-run pull-page-meta.js to sync these into the admin database too.

const fs = require('fs');
const path = require('path');

const SITE_ROOT = __dirname;

// New descriptions, grounded in each page's real headings/content.
// Privacy Policy and Terms & Conditions REPLACE the old "Buy ___ from Pulse" copy-paste text.
const fixes = {
  'why-pulse.html':
    "One partner across every equipment category — engineered for value, built for speed, backed by service you can rely on. See why hospitals choose Pulse.",
  'innovation.html':
    "Inside Pulse's R&D — designing next-generation medical devices with precision engineering at scale and zero compromise on quality or safety.",
  'quality.html':
    "Pulse's quality and regulatory standards — engineered and certified so hospitals and distributors can procure medical equipment with absolute confidence.",
  'life-at-pulse.html':
    "What it's like to work at Pulse — a vision-driven team building India's medical device future. Explore our culture and open opportunities.",
  'our-people.html':
    "Meet the people behind Pulse — the team driving India's medical equipment manufacturing forward, and what it means to build the future with us.",
  'news.html':
    "Latest news, milestones and updates from Pulse — India's integrated medical equipment manufacturer.",
  'service-support.html':
    "Pulse's end-to-end MedTech capabilities — manufacturing, R&D, regulatory & quality assurance, and customer support & training, all under one roof.",
  'categories.html':
    "Browse Pulse's full medical equipment portfolio across critical care, cardiac, renal, rehabilitation, aesthetics and more — one manufacturer, every category.",
  'articles-blogs.html':
    "Deep dives into medical technology, industry trends, and the future of healthcare infrastructure — insights and guides from the Pulse team.",
  'privacy-policy.html':
    "How Pulse collects, uses, and protects your personal data — our privacy practices as India's trusted medical equipment manufacturer.",
  'terms-and-conditions.html':
    "The terms and conditions governing your use of Pulse's website and purchase of medical equipment from India's trusted manufacturer.",
};

function escapeForAttr(str) {
  return str.replace(/"/g, '&quot;');
}

let updated = 0;
let inserted = 0;
let missing = 0;

for (const [file, description] of Object.entries(fixes)) {
  const filePath = path.join(SITE_ROOT, file);

  if (!fs.existsSync(filePath)) {
    console.log(`  [skip] ${file} — file not found`);
    missing++;
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf-8');
  const escaped = escapeForAttr(description);
  const metaRegex = /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i;

  if (metaRegex.test(html)) {
    html = html.replace(metaRegex, `<meta name="description" content="${escaped}">`);
    console.log(`  [replaced] ${file}`);
    updated++;
  } else {
    // No existing meta description tag — insert one right after <title>...</title>
    const titleRegex = /(<title>[\s\S]*?<\/title>)/i;
    if (titleRegex.test(html)) {
      html = html.replace(titleRegex, `$1\n  <meta name="description" content="${escaped}">`);
      console.log(`  [inserted] ${file}`);
      inserted++;
    } else {
      console.log(`  [warning] ${file} — no <title> tag found, could not insert meta description`);
      continue;
    }
  }

  fs.writeFileSync(filePath, html, 'utf-8');
}

console.log(`\nDone. Replaced ${updated}, inserted ${inserted}, missing ${missing}.`);
console.log('Now run: node pull-page-meta.js   (in pulse-page-generator) to sync these into the admin database.');
