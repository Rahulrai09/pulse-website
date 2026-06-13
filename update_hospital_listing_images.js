const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/DELL/Desktop/pulse-website/hospital-setup.html';

const mapping = {
  'hospital-icu-bed-5func-electric-premium.html': 'ChatGPT Image May 28, 2026, 04_09_07 PM.png',
  'hospital-icu-bed-5func-electric-deluxe.html': 'ChatGPT Image May 28, 2026, 04_09_09 PM.png',
  'hospital-icu-bed-5func-manual-deluxe.html': 'ChatGPT Image May 28, 2026, 04_09_14 PM.png',
  'hospital-icu-bed-3func-electric.html': 'ChatGPT Image May 28, 2026, 04_09_19 PM.png',
  'hospital-fowler-bed-electric.html': 'ChatGPT Image May 28, 2026, 04_09_24 PM.png',
  'hospital-semi-fowler-electric.html': 'Lite Fowler MS Bed.png',
  'hospital-ot-table-electric-manual-deluxe.html': 'ChatGPT Image May 28, 2026, 04_09_28 PM.png',
  'hospital-ot-table-general-hydraulic.html': 'ChatGPT Image May 28, 2026, 04_09_29 PM.png',
  'hospital-ot-table-carm-hydraulic.html': 'ChatGPT Image May 28, 2026, 04_09_31 PM.png',
  'hospital-delivery-table-electric-manual.html': 'ChatGPT Image May 28, 2026, 04_09_38 PM.png',
  'hospital-delivery-table-hydraulic.html': 'ChatGPT Image May 28, 2026, 04_09_34 PM.png',
  'hospital-stretcher-trolley-ms-ss.html': 'ChatGPT Image May 28, 2026, 04_09_46 PM.png',
  'hospital-emergency-trolley-hydraulic.html': 'ChatGPT Image May 28, 2026, 04_10_13 PM.png',
  'hospital-wheelchair.html': 'ChatGPT Image May 28, 2026, 04_10_16 PM.png',
  'hospital-ss-instrument-trolleys.html': 'ChatGPT Image May 28, 2026, 04_10_25 PM.png',
  'hospital-crash-cart.html': 'ChatGPT Image May 28, 2026, 04_10_22 PM.png',
  'hospital-baby-warmer.html': 'ChatGPT Image May 28, 2026, 04_10_39 PM.png'
};

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to replace the `img:` property inside the PRODUCTS array objects
  // The structure is: slug: "...", \n ... \n img: "image/pulse-logo.png"
  
  for (const [slug, imgFile] of Object.entries(mapping)) {
    const encodedImg = `image/Hospital%20Furniture/${encodeURIComponent(imgFile)}`;
    
    // Create a regex to find the specific product object and update its img property
    // We look for `slug: "slugName"` and then the next `img: "image/pulse-logo.png"`
    const regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?img:\\s*)"image/pulse-logo\\.png"`);
    content = content.replace(regex, `$1"${encodedImg}"`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated hospital-setup.html');
}
