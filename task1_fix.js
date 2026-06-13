const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Desktop/pulse-website';
const filePath = path.join(dir, 'hospital-setup.html');
let content = fs.readFileSync(filePath, 'utf8');

const productsMatch = content.match(/const PRODUCTS = (\[[\s\S]*?\]);\s*const GROUPS/);
if (productsMatch) {
  let productsStr = productsMatch[1];
  let products = eval(`(${productsStr})`);

  let newFilterHTML = '<div class="filter-group">\n        <h4>Product Type</h4>\n';
  products.forEach(p => {
    newFilterHTML += `        <label class="filter-option"><input type="checkbox" value="${p.name.replace(/"/g, '&quot;')}"> ${p.name}</label>\n`;
  });
  newFilterHTML += '      </div>';

  const filterGroupRegex = /<div class="filter-group">\s*<h4>Product Type<\/h4>[\s\S]*?<\/div>/;
  content = content.replace(filterGroupRegex, newFilterHTML);
  content = content.replace(/p\.type === c/g, 'p.name === c || p.type === c');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated filters in hospital-setup.html');
} else {
  console.log('PRODUCTS array not found.');
}
