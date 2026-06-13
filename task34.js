const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Desktop/pulse-website';

// 1. Update quality.html certificates
const qualityPath = path.join(dir, 'quality.html');
if (fs.existsSync(qualityPath)) {
  let qContent = fs.readFileSync(qualityPath, 'utf8');
  
  // Replace FDA 510(k) block with MD13
  const fdaRegex = /<div class="cert-card[^>]*>[\s\S]*?FDA 510\(k\)[\s\S]*?<\/div>\s*<\/div>/;
  const md13Block = `<div class="cert-card reveal reveal-delay-2">
      <div class="cert-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> MD13</div>
      <p class="cert-desc">Valid manufacturing license ensuring full compliance with Indian medical device manufacturing regulations and stringent quality control.</p>
    </div>`;
  qContent = qContent.replace(fdaRegex, md13Block);

  // Replace IEC 60601 block with DL20B
  const iecRegex = /<div class="cert-card[^>]*>[\s\S]*?IEC 60601[\s\S]*?<\/div>\s*<\/div>/;
  const dl20bBlock = `<div class="cert-card reveal reveal-delay-2">
      <div class="cert-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> DL20B</div>
      <p class="cert-desc">Certified under DL20B standards for safety and operational excellence in medical device distribution across the nation.</p>
    </div>`;
  qContent = qContent.replace(iecRegex, dl20bBlock);

  fs.writeFileSync(qualityPath, qContent, 'utf8');
  console.log('Task 3/4: Updated quality.html');
}

// 2. Update text mentions in index.html, blog-pulse-4million.html, header.js
const filesToUpdate = ['index.html', 'blog-pulse-4million.html', 'js/header.js'];
filesToUpdate.forEach(file => {
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) return;
  
  let content = fs.readFileSync(fp, 'utf8');
  const orig = content;
  
  // Replacements
  // "IEC 60601, FDA 510(k)" -> "MD13, DL20B"
  // "FDA 510(k), ISO 9001, IEC 60601" -> "MD13, ISO 9001, DL20B"
  // Let's just do individual replaces safely.
  content = content.replace(/IEC 60601/g, 'MD13');
  content = content.replace(/FDA 510\(k\)/g, 'DL20B');
  content = content.replace(/iec 60601/g, 'md13');
  content = content.replace(/fda 510\(k\)/gi, 'dl20b');

  if (content !== orig) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`Task 3/4: Updated ${file}`);
  }
});
