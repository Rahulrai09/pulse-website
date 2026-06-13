const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/DELL/Desktop/pulse-website/quality.html';
let content = fs.readFileSync(filePath, 'utf8');

const checkSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

const newGridHTML = `<div class="cert-grid">
    <div class="cert-card reveal">
      <div class="cert-title">${checkSvg} ISO 13485</div>
      <p class="cert-desc">Comprehensive quality management system standard specifically for medical device manufacturing.</p>
    </div>
    
    <div class="cert-card reveal reveal-delay-1">
      <div class="cert-title">${checkSvg} CE Mark</div>
      <p class="cert-desc">Indicates conformity with health, safety, and environmental protection standards for products sold within the EEA.</p>
    </div>
    
    <div class="cert-card reveal reveal-delay-2">
      <div class="cert-title">${checkSvg} BIS / CDSCO</div>
      <p class="cert-desc">Certified by the Bureau of Indian Standards and Central Drugs Standard Control Organisation for safe domestic distribution.</p>
    </div>
    
    <div class="cert-card reveal">
      <div class="cert-title">${checkSvg} ISO 9001</div>
      <p class="cert-desc">International standard specifying requirements for a robust and consistent quality management system.</p>
    </div>
    
    <div class="cert-card reveal reveal-delay-1">
      <div class="cert-title">${checkSvg} MDR 2017</div>
      <p class="cert-desc">Compliant with the Medical Device Rules 2017 ensuring the highest safety and clinical efficacy standards.</p>
    </div>
    
    <div class="cert-card reveal reveal-delay-2">
      <div class="cert-title">${checkSvg} MD13</div>
      <p class="cert-desc">Valid manufacturing license ensuring full compliance with Indian medical device manufacturing regulations and stringent quality control.</p>
    </div>
    
    <div class="cert-card reveal">
      <div class="cert-title">${checkSvg} DL20B</div>
      <p class="cert-desc">Licensed distributor certification ensuring authorized supply chain compliance for medical devices in the Indian healthcare market.</p>
    </div>
  </div>`;

// We need to replace everything from <div class="cert-grid"> to the end of it.
// Looking at the file, the grid is followed by </section>
const gridRegex = /<div class="cert-grid">[\s\S]*?<\/section>/;

content = content.replace(gridRegex, newGridHTML + '\n</section>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed cert grid in quality.html');
