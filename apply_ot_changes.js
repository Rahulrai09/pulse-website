const fs = require('fs');

// --- PART A: Update header.js ---
const headerPath = 'c:/Users/DELL/Desktop/pulse-website/js/header.js';
let headerJS = fs.readFileSync(headerPath, 'utf8');

// The current featured product block we observed:
/*
<div class="fc-img"><img src="image/Hospital Furniture/Modular ot theatre.png" alt="Modular Operation Theatre" style="width:100%; height:100%; object-fit:contain;" class="featured-product-img"></div>
<h6 class="featured-product-label" style="color: #ffffff;">Modular Operation Theatre</h6>
<a href="modular-operation-theatre.html" class="fc-link">View Product &rarr;</a>
*/

headerJS = headerJS.replace(
  /<div class="fc-img"><img src="image\/Hospital Furniture\/Modular ot theatre\.png" alt="Modular Operation Theatre" style="width:100%; height:100%; object-fit:contain;" class="featured-product-img"><\/div>\s*<h6 class="featured-product-label" style="color: #ffffff;">Modular Operation Theatre<\/h6>\s*<a href="modular-operation-theatre\.html" class="fc-link">View Product &rarr;<\/a>/,
  `<div class="fc-img"><img src="image/Hospital Furniture/OT Light - Four Reflector (SingleDouble).png" alt="OT Light — Four Reflector" style="width:100%; height:100%; object-fit:contain;" class="featured-product-img"></div>
                  <h6 class="featured-product-label" style="color: #ffffff;">OT Light — Four Reflector</h6>
                  <a href="ot-light-four-reflector.html" class="fc-link">View Product &rarr;</a>`
);

fs.writeFileSync(headerPath, headerJS, 'utf8');
console.log("Updated header.js");

// --- PART B & C: Update hospital-setup.html ---
const setupPath = 'c:/Users/DELL/Desktop/pulse-website/hospital-setup.html';
let setupHtml = fs.readFileSync(setupPath, 'utf8');

const arrayStart = setupHtml.indexOf('const PRODUCTS = [');
const arrayEnd = setupHtml.indexOf('];', arrayStart);
const arrayStr = setupHtml.substring(arrayStart + 'const PRODUCTS = '.length, arrayEnd + 1);

let products = eval(arrayStr);

// Fix the image for OT Light - Premium Globus Dome
let globusIndex = -1;
let fourReflectorIndex = -1;
let modularOtIndex = -1;

for (let i = 0; i < products.length; i++) {
  if (products[i].name.includes('Premium Globus Dome')) {
    products[i].img = "image/Hospital%20Furniture/OT%20Light%20-%20Premium%20Globus%20Dome.png";
    globusIndex = i;
  }
  if (products[i].name.includes('Four Reflector')) {
    fourReflectorIndex = i;
  }
  if (products[i].name.includes('Modular Operation Theatre')) {
    modularOtIndex = i;
  }
}

// Move both OT Light cards immediately after Modular Operation Theatre
if (modularOtIndex !== -1 && fourReflectorIndex !== -1 && globusIndex !== -1) {
  // Extract both items from the array
  // Make sure we get them by their objects, not index, because removing one changes indices
  const globusItem = products[globusIndex];
  const fourRefItem = products[fourReflectorIndex];
  
  // Remove them
  products = products.filter(p => p.name !== globusItem.name && p.name !== fourRefItem.name);
  
  // Re-find the Modular OT index since array changed
  modularOtIndex = products.findIndex(p => p.name.includes('Modular Operation Theatre'));
  
  // Insert them immediately after Modular OT (so index + 1)
  // We want Four Reflector first, then Globus Dome
  products.splice(modularOtIndex + 1, 0, fourRefItem, globusItem);
}

const newArrayStr = JSON.stringify(products, null, 2).replace(/"([^"]+)":/g, '$1:');
setupHtml = setupHtml.substring(0, arrayStart + 'const PRODUCTS = '.length) + newArrayStr + setupHtml.substring(arrayEnd + 1);

fs.writeFileSync(setupPath, setupHtml, 'utf8');
console.log("Updated hospital-setup.html");
