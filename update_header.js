const fs = require('fs');
const path = require('path');

const headerPath = 'c:/Users/DELL/Desktop/pulse-website/js/header.js';
let headerJS = fs.readFileSync(headerPath, 'utf8');

// 1. Update the featured product HTML
// Current:
// <div class="fc-img"><img src="image/PULSE Ventilator.png" alt="Pulse SH320" style="width:100%; height:100%; object-fit:contain;" class="featured-product-img"></div>
// <h6 class="featured-product-label" style="color: #ffffff;">Pulse SH320 ICU Ventilator</h6>
// <a href="product-detail.html" class="fc-link">View Product &rarr;</a>

headerJS = headerJS.replace(
  /<div class="fc-img"><img src="image\/PULSE Ventilator\.png" alt="Pulse SH320" style="width:100%; height:100%; object-fit:contain;" class="featured-product-img"><\/div>\s*<h6 class="featured-product-label" style="color: #ffffff;">Pulse SH320 ICU Ventilator<\/h6>\s*<a href="product-detail\.html" class="fc-link">View Product &rarr;<\/a>/,
  `<div class="fc-img"><img src="image/Hospital Furniture/Modular ot theatre.png" alt="Modular Operation Theatre" style="width:100%; height:100%; object-fit:contain;" class="featured-product-img"></div>
                  <h6 class="featured-product-label" style="color: #ffffff;">Modular Operation Theatre</h6>
                  <a href="modular-operation-theatre.html" class="fc-link">View Product &rarr;</a>`
);

// 2. Update the Hospital Setup array
const newHospitalSetupArray = `"Hospital Setup": {
                    "label": "HOSPITAL SETUP",
                    "products": [
                              {
                                        "name": "ICU Bed — Five Functional Electric",
                                        "image": "image/Hospital Furniture/ChatGPT Image May 28, 2026, 04_09_07 PM.png",
                                        "href": "hospital-setup.html"
                              },
                              {
                                        "name": "Modular Operation Theatre",
                                        "image": "image/Hospital Furniture/Modular ot theatre.png",
                                        "href": "modular-operation-theatre.html"
                              },
                              {
                                        "name": "OT Light — Four Reflector",
                                        "image": "image/Hospital Furniture/OT Light - Four Reflector (SingleDouble).png",
                                        "href": "ot-light-four-reflector.html"
                              },
                              {
                                        "name": "OT Light — Premium Globus Dome",
                                        "image": "image/Hospital Furniture/OT Light - Premium Globus Dome.png",
                                        "href": "ot-light-premium-globus-dome.html"
                              },
                              {
                                        "name": "OT Examination Light",
                                        "image": "image/Hospital Furniture/OT Examination Light.png",
                                        "href": "ot-examination-light.html"
                              },
                              {
                                        "name": "Medical Gas Pipeline System",
                                        "image": "image/Hospital Furniture/ChatGPT Image May 28, 2026, 04_10_39 PM.png",
                                        "href": "hospital-setup.html"
                              }
                    ]
          }`;

// The original array started at `"Hospital Setup": {` and ended before the outer `};`
const hsStart = headerJS.indexOf('"Hospital Setup": {');
if (hsStart !== -1) {
  // Find the end of this object. We know it ends with `] \n          }`
  const hsEndStr = ']\n          }';
  const hsEnd = headerJS.indexOf(hsEndStr, hsStart);
  if (hsEnd !== -1) {
    headerJS = headerJS.substring(0, hsStart) + newHospitalSetupArray + headerJS.substring(hsEnd + hsEndStr.length);
  } else {
    console.log("Could not find end of Hospital Setup object");
  }
} else {
  console.log("Could not find start of Hospital Setup object");
}

fs.writeFileSync(headerPath, headerJS, 'utf8');
console.log("header.js updated successfully.");
