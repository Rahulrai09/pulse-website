const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Desktop/pulse-website';
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const jsFiles = fs.readdirSync(path.join(dir, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f);
const allFiles = [...htmlFiles, ...jsFiles];

let replaceCount = 0;

allFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace Rehab & Therapy with Rehabilitation
  // Use regex to catch case insensitive and different spacing if needed, but exact match is fine.
  content = content.replace(/Rehab & Therapy/g, 'Rehabilitation');
  content = content.replace(/REHAB & THERAPY/g, 'REHABILITATION');
  
  // Specific case for index.html Portfolio section
  if (file === 'index.html') {
    // just in case "Rehab & Therapy" was missed
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Task 2: Updated ${file}`);
    replaceCount++;
  }
});
console.log(`Task 2: Replaced in ${replaceCount} files.`);
