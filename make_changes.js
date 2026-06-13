const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Desktop/pulse-website';

// --- PART B: ADD 3 NEW PRODUCT DETAIL PAGES ---
const templatePath = path.join(dir, 'hospital-icu-bed-5func-electric-premium.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

const pagesData = [
  {
    slug: 'ot-light-four-reflector.html',
    title: 'OT Light — Four Reflector',
    subtitle: 'Single & Double Dome Surgical Illumination',
    tag: 'OT Lights',
    image: 'OT Light - Four Reflector (SingleDouble).png',
    desc: 'The Four Reflector OT Light delivers powerful, shadow-free illumination for surgical environments. Available in single and double dome configurations, it provides consistent, true-colour light output to support precise surgical procedures across specialties.',
    features: [
      'Shadow-free, uniform illumination across the surgical field',
      'Available in single and double dome configurations',
      'True-colour rendering for accurate tissue differentiation',
      'Adjustable light intensity and focus',
      'Cool beam technology — minimal heat emission',
      'Ceiling-mounted with 360° rotational arm',
      'Sterilizable handle for in-field adjustments',
      'Long-life LED light source'
    ],
    specs: [
      ['Configuration', 'Single Dome / Double Dome'],
      ['Light Source', 'High-efficiency LED'],
      ['Colour Temperature', '4,000K – 4,500K (daylight white)'],
      ['Illuminance', 'Up to 160,000 lux (double dome)'],
      ['Colour Rendering Index (CRI)', '≥ 95'],
      ['Heat Emission', '< 10% infrared'],
      ['Mounting', 'Ceiling-mounted, spring-balanced arm'],
      ['Rotation', '360° horizontal / ±180° vertical'],
      ['Sterilizable Handle', 'Yes'],
      ['Power Supply', '220–240V AC, 50Hz']
    ],
    waUrl: 'https://wa.me/919071101108?text=Hi%2C%20I%20would%20like%20to%20request%20the%20brochure%20for%20OT%20Light%20Four%20Reflector'
  },
  {
    slug: 'ot-light-premium-globus-dome.html',
    title: 'OT Light — Premium Globus Dome',
    subtitle: 'High-Intensity Dome Surgical Light',
    tag: 'OT Lights',
    image: 'OT Light - Premium Globus Dome.png',
    desc: 'The Premium Globus Dome OT Light offers exceptional light depth and uniformity for complex surgical procedures. Its advanced dome design maximises field illumination while minimising shadows and glare, ensuring optimal visibility throughout every operation.',
    features: [
      'Deep-cavity illumination with minimal shadow effect',
      'Premium globus dome design for wide-field coverage',
      'High colour fidelity for accurate tissue identification',
      'Adjustable focus — spot to flood light pattern',
      'Smooth, ergonomic arm movement for precise positioning',
      'Built-in backup LED module for uninterrupted operation',
      'Touch-control panel with memory presets',
      'Sterilizable detachable handle'
    ],
    specs: [
      ['Light Source', 'High-power LED module'],
      ['Colour Temperature', '4,000K – 4,800K (adjustable)'],
      ['Illuminance', 'Up to 180,000 lux'],
      ['Colour Rendering Index (CRI)', '≥ 97'],
      ['Light Field Diameter', '180–340 mm (adjustable)'],
      ['Depth of Illumination', '≥ 1,200 mm'],
      ['Sterilizable Handle', 'Yes'],
      ['Mounting', 'Ceiling-mounted, double-arm suspension'],
      ['Power Supply', '220–240V AC, 50Hz'],
      ['Backup', 'Integrated LED backup module']
    ],
    waUrl: 'https://wa.me/919071101108?text=Hi%2C%20I%20would%20like%20to%20request%20the%20brochure%20for%20OT%20Light%20Premium%20Globus%20Dome'
  },
  {
    slug: 'ot-examination-light.html',
    title: 'OT Examination Light',
    subtitle: 'Precision Examination & Procedure Illumination',
    tag: 'OT Lights',
    image: 'OT Examination Light.png',
    desc: 'Designed for examination rooms, minor procedure areas, and outpatient settings, the OT Examination Light delivers bright, focused, shadow-free illumination for accurate clinical assessments and minor surgical procedures.',
    features: [
      'Bright, focused beam for clinical examinations and minor procedures',
      'Shadow-free illumination for clear field visibility',
      'Cool white LED for natural tissue colour rendering',
      'Flexible arm with multi-angle positioning',
      'Mobile floor stand or wall-mount options',
      'Stepless dimmer for adjustable intensity',
      'Lightweight and easy to manoeuvre',
      'Energy-efficient LED with long operational life'
    ],
    specs: [
      ['Light Source', 'LED'],
      ['Colour Temperature', '4,000K – 4,500K'],
      ['Illuminance', 'Up to 50,000 lux'],
      ['Colour Rendering Index (CRI)', '≥ 93'],
      ['Mounting Options', 'Mobile floor stand / wall-mounted'],
      ['Arm Reach', 'Adjustable multi-joint arm'],
      ['Dimmer', 'Stepless 10–100%'],
      ['Power Supply', '220–240V AC, 50Hz'],
      ['Weight (Stand)', 'Approx. 8 kg']
    ],
    waUrl: 'https://wa.me/919071101108?text=Hi%2C%20I%20would%20like%20to%20request%20the%20brochure%20for%20OT%20Examination%20Light'
  }
];

function generatePage(data) {
  let html = templateHtml;

  // 1. Title tag
  html = html.replace(/<title>.*?<\/title>/, `<title>${data.title} | Pulse Medical</title>`);

  // 2. Breadcrumb
  html = html.replace(/(<a href="hospital-setup\.html"[^>]*>Hospital Setup<\/a> ›\s*)([^<]+)/, `$1\n        ${data.title}\n      `);

  // 3. Image
  const encodedImage = `image/Hospital%20Furniture/${encodeURIComponent(data.image).replace(/%20/g, '%20')}`;
  html = html.replace(/<img src="[^"]+" alt="[^"]+"/g, `<img src="${encodedImage}" alt="${data.title}"`);

  // 4. Subtitle / Tag
  html = html.replace(/ICU BEDS \| Hospital Setup/, `${data.tag.toUpperCase()} | Hospital Setup`);

  // 5. H1 Title
  html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, `<h1 style="font-size:2rem; color:#0f1f4b; line-height:1.2; margin-bottom:16px;">\n            ${data.title}\n          </h1>`);

  // 6. Description
  html = html.replace(/<p style="color:#555; font-size:1rem; line-height:1\.8; margin-bottom:24px;">[\s\S]*?<\/p>/, `<p style="color:#555; font-size:1rem; line-height:1.8; margin-bottom:24px;">\n            ${data.desc}\n          </p>`);

  // 7. Feature Tags (just keep the template ones or clear them, I'll clear them and put subtitle)
  // Or I can just put the subtitle there. Let's put the subtitle as a single tag or just text.
  html = html.replace(/<!-- Feature Tags -->[\s\S]*?<!-- CTA Buttons -->/, `<!-- Feature Tags -->\n          <p style="font-weight:600; color:#1B2F6E; margin-bottom:32px;">${data.subtitle}</p>\n\n          <!-- CTA Buttons -->`);

  // 8. Brochure WhatsApp Button
  html = html.replace(/<a href="https:\/\/wa\.me\/919071101108\?text=[^"]+"[^>]*>[\s\S]*?<\/a>/, `<a href="${data.waUrl}" target="_blank" style="border:2px solid #1B2F6E; color:#1B2F6E; padding:14px 32px; border-radius:6px; font-weight:600; text-decoration:none; font-size:15px;">\n              Request Brochure on WhatsApp\n            </a>`);

  // 9. Key Features lists
  // The template has two div columns with ul lists. Let's replace the whole grid.
  const featuresHtml = data.features.map(f => `<li style="padding:8px 12px; background:#f7f9fc; border-radius:6px; color:#444; font-size:0.9rem; display:flex; align-items:flex-start; gap:8px;"><span style="color:#E87722; font-weight:700;">✓</span>${f}</li>`).join('\n            ');
  const keyFeaturesBlock = `<div style="display:grid; grid-template-columns:1fr; gap:24px; margin-bottom:40px;">
        <div>
          <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:8px;">
            ${featuresHtml}
          </ul>
        </div>
      </div>`;
  html = html.replace(/<div style="display:grid; grid-template-columns:repeat\(auto-fit, minmax\(280px, 1fr\)\); gap:24px; margin-bottom:40px;">[\s\S]*?<\/div>\s*<\/div>\s*<h2/, `${keyFeaturesBlock}\n\n      <h2`);

  // 10. Tech Specs Table
  const trs = data.specs.map((s, i) => {
    const bg = i % 2 === 0 ? '#f9f9f9' : '#fff';
    return `<tr style="background:${bg};">
            <td style="padding:12px; border:1px solid #eee; font-weight:500; color:#555; width:30%;">${s[0]}</td>
            <td style="padding:12px; border:1px solid #eee; color:#333;">${s[1]}</td>
          </tr>`;
  }).join('\n          ');
  html = html.replace(/<tbody>[\s\S]*?<\/tbody>/, `<tbody>\n          ${trs}\n        </tbody>`);

  // 11. Fix the "Back to" link to go to hospital-setup.html
  html = html.replace(/<a href="critical-care\.html"/, '<a href="hospital-setup.html"');

  fs.writeFileSync(path.join(dir, data.slug), html, 'utf8');
  console.log('Created ' + data.slug);
}

pagesData.forEach(generatePage);

// --- PART C: UPDATE hospital-setup.html PRODUCT CARDS ---
const setupPath = path.join(dir, 'hospital-setup.html');
let setupHtml = fs.readFileSync(setupPath, 'utf8');

// I will find the PRODUCTS array, and modify it. 
// I will replace the 4 old OT lights with the 3 new ones to be safe and clean.
// The old OT lights:
// - hospital-ot-light-premium-camera.html
// - hospital-ot-light-globus-dome.html
// - hospital-ot-light-four-reflector.html
// - hospital-ot-examination-light.html

// Wait, the easiest way to manipulate the PRODUCTS array is to parse it, modify it, and stringify it back.
// But it's inside a script tag.
const arrayStart = setupHtml.indexOf('const PRODUCTS = [');
const arrayEnd = setupHtml.indexOf('];', arrayStart);
const arrayStr = setupHtml.substring(arrayStart + 'const PRODUCTS = '.length, arrayEnd + 1);

// We can safely eval it since it's just an array of objects.
let products = eval(arrayStr);

// Remove the old OT lights (slugs starting with hospital-ot-light or hospital-ot-examination)
products = products.filter(p => !p.slug.includes('ot-light') && !p.slug.includes('ot-examination'));

// Append the 3 new OT lights
products.push({
  name: "OT Light — Four Reflector",
  slug: "ot-light-four-reflector.html",
  category: "OT LIGHTS",
  type: "OT Lights",
  app: "ot",
  cert: ["iso", "ce"],
  tag: "OT LIGHTS",
  tagColor: "orange",
  desc: "The Four Reflector OT Light delivers powerful, shadow-free illumination for surgical environments. Available in single and double dome configurations.",
  specs: ["Single/Double Dome", "160,000 lux", "Shadow-free"],
  img: "image/Hospital%20Furniture/OT%20Light%20-%20Four%20Reflector%20(SingleDouble).png"
});

products.push({
  name: "OT Light — Premium Globus Dome",
  slug: "ot-light-premium-globus-dome.html",
  category: "OT LIGHTS",
  type: "OT Lights",
  app: "ot",
  cert: ["iso", "ce"],
  tag: "OT LIGHTS",
  tagColor: "orange",
  desc: "The Premium Globus Dome OT Light offers exceptional light depth and uniformity for complex surgical procedures with a built-in backup module.",
  specs: ["Globus Dome", "180,000 lux", "LED Backup"],
  img: "image/Hospital%20Furniture/OT%20Light%20-%20Premium%20Globus%20Dome.png"
});

products.push({
  name: "OT Examination Light",
  slug: "ot-examination-light.html",
  category: "OT LIGHTS",
  type: "OT Lights",
  app: "er",
  cert: ["iso", "ce"],
  tag: "OT LIGHTS",
  tagColor: "orange",
  desc: "Designed for examination rooms, minor procedure areas, and outpatient settings, the OT Examination Light delivers bright, focused, shadow-free illumination.",
  specs: ["50,000 lux", "Mobile/Wall Mount", "Stepless Dimmer"],
  img: "image/Hospital%20Furniture/OT%20Examination%20Light.png"
});

// Format the array nicely
const newArrayStr = JSON.stringify(products, null, 2).replace(/"([^"]+)":/g, '$1:');

setupHtml = setupHtml.substring(0, arrayStart + 'const PRODUCTS = '.length) + newArrayStr + setupHtml.substring(arrayEnd + 1);

fs.writeFileSync(setupPath, setupHtml, 'utf8');
console.log('Updated hospital-setup.html with 3 new OT Light cards');
