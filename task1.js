const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Desktop/pulse-website';
const categoryFiles = [
  'critical-care.html',
  'renal-care.html',
  'cardiac-care.html',
  'aesthetics.html',
  'rehabilitation.html',
  'hospital-setup.html'
];

categoryFiles.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Extract products array
  const productsMatch = content.match(/const PRODUCTS = (\[[\s\S]*?\]);\s*(?:const PER_PAGE|let filtered)/);
  if (!productsMatch) {
    console.log(`Could not find PRODUCTS array in ${file}`);
    return;
  }
  
  let productsStr = productsMatch[1];
  let products;
  try {
    products = eval(`(${productsStr})`);
  } catch (e) {
    console.log(`Failed to parse PRODUCTS in ${file}: ${e.message}`);
    return;
  }

  // Generate new Product Type filter HTML
  let newFilterHTML = '<div class="filter-group">\n        <h4>Product Type</h4>\n';
  products.forEach(p => {
    // We can use p.type or p.name. The prompt says "show the actual product names".
    // If we change the value to p.type, it will match `p.type === c`.
    // But since there might be multiple products with the same type, wait...
    // The prompt says "Replace the current generic filter labels with real product names found on each respective listing page."
    // If I just put one checkbox per product:
    newFilterHTML += `        <label class="filter-option"><input type="checkbox" value="${p.name.replace(/"/g, '&quot;')}"> ${p.name}</label>\n`;
  });
  newFilterHTML += '      </div>';

  // Replace the first filter-group (Product Type)
  const filterGroupRegex = /<div class="filter-group">\s*<h4>Product Type<\/h4>[\s\S]*?<\/div>/;
  content = content.replace(filterGroupRegex, newFilterHTML);

  // Update filter logic: p.type === c -> p.name === c || p.type === c
  // Actually the logic is: p.type === c || p.app === c || (p.cert && p.cert.includes(c))
  content = content.replace(/p\.type === c/g, 'p.name === c || p.type === c');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated filters in ${file}`);
});
