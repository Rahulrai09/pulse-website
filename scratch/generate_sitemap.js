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

const CATEGORY_PAGES = new Set([
  'critical-care.html', 'renal-care.html', 'cardiac-care.html', 
  'aesthetics.html', 'rehabilitation.html', 'hospital-setup.html'
]);

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// 1. Add index.html
xml += `  <url>
    <loc>https://www.pulseio.in/</loc>
    <lastmod>2026-06-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>\n`;

// 2. Add category pages
htmlFiles.forEach(file => {
  if (file === 'index.html' || EXCLUDED_FILES.has(file)) return;
  
  if (CATEGORY_PAGES.has(file)) {
    xml += `  <url>
    <loc>https://www.pulseio.in/${file}</loc>
    <lastmod>2026-06-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  }
});

// 3. Add product pages
htmlFiles.forEach(file => {
  if (file === 'index.html' || EXCLUDED_FILES.has(file) || CATEGORY_PAGES.has(file)) return;
  
  xml += `  <url>
    <loc>https://www.pulseio.in/${file}</loc>
    <lastmod>2026-06-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

xml += `</urlset>\n`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml);
console.log('sitemap.xml successfully generated in root directory.');
