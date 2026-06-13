const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/DELL/Desktop/pulse-website';
const files = fs.readdirSync(rootDir);
const htmlFiles = files.filter(f => f.endsWith('.html') && !f.includes('broken'));

const auditResults = [];

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Title tag
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'N/A';

  // 2. Meta description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
                    content.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : 'N/A';

  // 3. Meta keywords
  const kwMatch = content.match(/<meta\s+name=["']keywords["']\s+content=["']([\s\S]*?)["']/i) ||
                  content.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']keywords["']/i);
  const keywords = kwMatch ? kwMatch[1].trim() : 'N/A';

  // 4. H1 tag(s)
  const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1s = h1Matches.map(m => m[1].replace(/<[^>]*>/g, '').trim());

  // 5. Canonical link
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : 'N/A';

  // 6. Open Graph tags
  const ogMatches = [...content.matchAll(/<meta\s+property=["']og:([^"']+)["']\s+content=["']([^"']*)["']/gi)];
  const ogTags = {};
  ogMatches.forEach(m => {
    ogTags[m[1]] = m[2].trim();
  });

  // 7. Structured Data / Schema
  const schemaMatches = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  const schemas = schemaMatches.map(m => {
    try {
      return JSON.parse(m[1].trim());
    } catch (e) {
      return 'Invalid JSON-LD';
    }
  });

  auditResults.push({
    file,
    title,
    description,
    keywords,
    h1s: h1s.length ? h1s : ['N/A'],
    canonical,
    ogTags: Object.keys(ogTags).length ? ogTags : 'N/A',
    schemas: schemas.length ? schemas : 'N/A'
  });
});

fs.writeFileSync(path.join(rootDir, 'scratch/seo_audit_report.json'), JSON.stringify(auditResults, null, 2));
console.log(`Audited ${htmlFiles.length} HTML files. Report written to scratch/seo_audit_report.json.`);
