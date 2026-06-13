const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/DELL/Desktop/pulse-website';
const reportJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/seo_audit_report.json'), 'utf8'));

let md = `# SEO Audit Report\n\n`;
md += `This report lists the current SEO tags found on all **${reportJson.length}** HTML files in the project root.\n\n`;

reportJson.forEach((item, index) => {
  md += `## ${index + 1}. [${item.file}](file:///${rootDir}/${item.file})\n\n`;
  md += `- **Title**: \`${item.title}\`\n`;
  md += `- **Meta Description**: \`${item.description}\`\n`;
  md += `- **Keywords**: \`${item.keywords}\`\n`;
  md += `- **H1 Tag(s)**:\n`;
  item.h1s.forEach(h1 => {
    md += `  - \`${h1}\`\n`;
  });
  md += `- **Canonical Link**: \`${item.canonical}\`\n`;
  
  md += `- **Open Graph Tags**:\n`;
  if (item.ogTags === 'N/A') {
    md += `  - \`N/A\`\n`;
  } else {
    for (const [prop, val] of Object.entries(item.ogTags)) {
      md += `  - \`og:${prop}\`: \`${val}\`\n`;
    }
  }

  md += `- **Structured Data (Schema)**:\n`;
  if (item.schemas === 'N/A') {
    md += `  - \`N/A\`\n`;
  } else {
    md += `  \`\`\`json\n  ${JSON.stringify(item.schemas, null, 2).replace(/\n/g, '\n  ')}\n  \`\`\`\n`;
  }
  md += `\n---\n\n`;
});

fs.writeFileSync('C:/Users/DELL/.gemini/antigravity/brain/9be47bbc-ea37-49df-9ee7-434a2bd54af2/seo_audit_report.md', md);
console.log('Markdown report generated at C:/Users/DELL/.gemini/antigravity/brain/9be47bbc-ea37-49df-9ee7-434a2bd54af2/seo_audit_report.md');
