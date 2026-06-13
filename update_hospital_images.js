const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Desktop/pulse-website';

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

for (const [slug, imgFile] of Object.entries(mapping)) {
  const filePath = path.join(dir, slug);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // URL encode the filename
    const encodedFile = encodeURIComponent(imgFile).replace(/%20/g, '%20'); 
    // encodeURIComponent encodes spaces as %20. We also need to be careful about commas.
    // wait, encodeURIComponent encodes comma as %2C. The user says:
    // "ChatGPT Image May 28, 2026, 04_09_07 PM.png" becomes "image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_07%20PM.png"
    // so encodeURIComponent is perfect.
    
    const newSrc = `image/Hospital%20Furniture/${encodeURIComponent(imgFile)}`;
    
    // We want to replace the image src in the Product Image block.
    // In our template, it's something like: src="image/pulse-logo.png"
    // Let's use a regex to find the img inside the left product image div.
    content = content.replace(/<img src="[^"]+" alt="[^"]+" style="width:100%; object-fit:contain; max-height:420px;">/, (match) => {
      return match.replace(/src="[^"]+"/, `src="${newSrc}"`);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${slug}`);
  }
}
