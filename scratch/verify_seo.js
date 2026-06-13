const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/DELL/Desktop/pulse-website';
const files = fs.readdirSync(rootDir);
const htmlFiles = files.filter(f => f.endsWith('.html') && !f.includes('broken'));

const EXCLUDED_FILES = new Set([
  'about.html', 'quality.html', 'service-support.html', 'privacy-policy.html', 
  'terms-and-conditions.html', 'categories.html', 'blog.html', 'news.html', 
  'our-people.html', 'life-at-pulse.html', 'innovation.html', 'articles.html', 
  'how-it-works.html', 'why-pulse.html', 'page.html', 'blog-post.html', 
  'blog-placeholder.html', 'banner-animation.html', 'blog-pulse-4million.html', 
  'blog-zuvio-amtz.html'
]);

let totalFilesChecked = 0;
let totalFailures = 0;

htmlFiles.forEach(file => {
  if (EXCLUDED_FILES.has(file)) return;
  totalFilesChecked++;

  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const fileFailures = [];

  // 1. Title verification
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    fileFailures.push("Missing <title> tag");
  } else {
    const title = titleMatch[1].trim();
    if (title.length > 60) {
      fileFailures.push(`Title length ${title.length} exceeds 60 characters: "${title}"`);
    }
    if (!title.includes('| Pulse') && !title.includes('| Pulse MedTech')) {
      fileFailures.push(`Title missing brand "| Pulse" or "| Pulse MedTech"`);
    }
  }

  // 2. Meta description verification
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=(["'])([\s\S]*?)\1/i);
  if (!descMatch) {
    fileFailures.push("Missing meta description tag");
  } else {
    const desc = descMatch[2].trim();
    if (desc.length < 150 || desc.length > 165) {
      fileFailures.push(`Meta description length ${desc.length} is not between 150-160 (or slightly over due to ellipsis): "${desc}"`);
    }
  }

  // 3. Canonical link verification
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=(["'])([\s\S]*?)\1/i);
  if (!canonicalMatch) {
    fileFailures.push("Missing canonical link");
  } else {
    const canonical = canonicalMatch[2].trim();
    const expected = `https://www.pulseio.in/${file === 'index.html' ? '' : file}`;
    if (canonical !== expected) {
      fileFailures.push(`Incorrect canonical URL: expected "${expected}", got "${canonical}"`);
    }
  }

  // 4. Open Graph tags verification
  const ogProps = ['og:title', 'og:description', 'og:url', 'og:type', 'og:image'];
  ogProps.forEach(prop => {
    const propMatch = content.match(new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=(["'])(.*?)\\1`, 'i'));
    if (!propMatch) {
      fileFailures.push(`Missing Open Graph property: ${prop}`);
    }
  });

  // 5. Robots: index, follow verification
  const robotsMatch = content.match(/<meta\s+name=["']robots["']\s+content=(["'])index,\s*follow\1/i);
  if (!robotsMatch) {
    fileFailures.push("Missing robots index, follow meta tag");
  }

  // 6. Exactly 1 H1 verification
  const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1Matches.length !== 1) {
    fileFailures.push(`Found ${h1Matches.length} <h1> tags instead of exactly 1`);
  }

  // 7. Alt tags on all images verification
  const imgMatches = [...content.matchAll(/<img\s+([^>]*?)>/gi)];
  imgMatches.forEach((m, idx) => {
    const attrs = m[1];
    const altMatch = attrs.match(/alt=(["'])(.*?)\1/i);
    if (!altMatch || !altMatch[2].trim()) {
      fileFailures.push(`Image #${idx + 1} is missing a descriptive alt attribute: ${m[0]}`);
    }
  });

  // 8. Structured Data / Schema verification
  const schemaMatches = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  if (schemaMatches.length === 0) {
    fileFailures.push("Missing JSON-LD structured data schema");
  }

  // 9. Breadcrumbs verification (Category/Product pages)
  if (file !== 'index.html') {
    const breadcrumbNav = content.includes('aria-label="breadcrumb"');
    if (!breadcrumbNav) {
      fileFailures.push("Missing visible breadcrumb navigation (<nav aria-label=\"breadcrumb\">)");
    }
  }

  if (fileFailures.length > 0) {
    totalFailures += fileFailures.length;
    console.log(`FAIL: ${file}`);
    fileFailures.forEach(f => console.log(`  - ${f}`));
  }
});

console.log(`\nVerification complete. Checked ${totalFilesChecked} files. Found ${totalFailures} failures.`);
if (totalFailures === 0) {
  console.log("SUCCESS: All optimized files conform perfectly to SEO criteria!");
}
process.exit(totalFailures === 0 ? 0 : 1);
