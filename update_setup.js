const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Desktop/pulse-website';

// --- PART B: CREATE modular-operation-theatre.html ---
const templatePath = path.join(dir, 'ot-light-four-reflector.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

const data = {
  slug: 'modular-operation-theatre.html',
  title: 'Modular Operation Theatre',
  subtitle: 'ISO-Certified Turnkey OT Construction',
  tag: 'Modular OT',
  image: 'Modular ot theatre.png',
  desc: 'A fully integrated, ISO-certified modular operating theatre solution designed for infection control, workflow efficiency, and clinical performance. Built to international OT standards with laminar airflow, hermetic doors, and complete systems integration for any surgical specialty.',
  features: [
    'ISO-certified modular OT construction',
    'Laminar ceiling with HEPA filtration for infection-free environment',
    'Wall and ceiling cladding systems (PVC/HPL/Aluminium)',
    'Hermetic sliding and swing doors with vision panels',
    'Pass boxes (mechanical and electrical interlock options)',
    'Scrub sinks with elbow/sensor operation',
    'Surgeon control panels (lighting, temperature, gas)',
    'Full HVAC compliance — positive pressure zoning',
    'Integrated medical gas outlets at OT head panel',
    'LED OT lights mounting provisions',
    'Customizable layout for General Surgery, Orthopaedics, Cardiac, Neuro, and more'
  ],
  specs: [
    ['Construction', 'Modular panel system (flush-finish, zero-joint walls)'],
    ['Air Changes', 'Minimum 20 ACH (up to 40 ACH in ultra-clean zones)'],
    ['Filtration', 'HEPA H14 (99.995% efficiency)'],
    ['Pressure', '+15 to +25 Pa positive pressure'],
    ['Temperature Control', '18°C – 26°C (±1°C)'],
    ['Humidity Control', '40% – 60% RH'],
    ['Lighting', '500–1,000 lux (general); OT light separately mounted'],
    ['Standards', 'NABH, ASHRAE 170, IS 13947, HTM 03-01']
  ],
  waUrl: 'https://wa.me/919071101108?text=Hi%2C%20I%20would%20like%20to%20request%20the%20brochure%20for%20Modular%20Operation%20Theatre'
};

let html = templateHtml;
html = html.replace(/<title>.*?<\/title>/, `<title>${data.title} | Pulse Medical</title>`);
html = html.replace(/(<a href="hospital-setup\.html"[^>]*>Hospital Setup<\/a> ›\s*)([^<]+)/, `$1\n        ${data.title}\n      `);
const encodedImage = `image/Hospital%20Furniture/${encodeURIComponent(data.image).replace(/%20/g, '%20')}`;
html = html.replace(/<img src="[^"]+" alt="[^"]+"/g, `<img src="${encodedImage}" alt="${data.title}"`);
html = html.replace(/OT LIGHTS \| Hospital Setup/, `${data.tag.toUpperCase()} | Hospital Setup`);
html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, `<h1 style="font-size:2rem; color:#0f1f4b; line-height:1.2; margin-bottom:16px;">\n            ${data.title}\n          </h1>`);
html = html.replace(/<p style="color:#555; font-size:1rem; line-height:1\.8; margin-bottom:24px;">[\s\S]*?<\/p>/, `<p style="color:#555; font-size:1rem; line-height:1.8; margin-bottom:24px;">\n            ${data.desc}\n          </p>`);
html = html.replace(/<p style="font-weight:600; color:#1B2F6E; margin-bottom:32px;">.*?<\/p>/, `<p style="font-weight:600; color:#1B2F6E; margin-bottom:32px;">${data.subtitle}</p>`);
html = html.replace(/<a href="https:\/\/wa\.me\/919071101108\?text=[^"]+"[^>]*>[\s\S]*?<\/a>/, `<a href="${data.waUrl}" target="_blank" style="border:2px solid #1B2F6E; color:#1B2F6E; padding:14px 32px; border-radius:6px; font-weight:600; text-decoration:none; font-size:15px;">\n              Request Brochure on WhatsApp\n            </a>`);

const featuresHtml = data.features.map(f => `<li style="padding:8px 12px; background:#f7f9fc; border-radius:6px; color:#444; font-size:0.9rem; display:flex; align-items:flex-start; gap:8px;"><span style="color:#E87722; font-weight:700;">✓</span>${f}</li>`).join('\n            ');
html = html.replace(/<ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:8px;">[\s\S]*?<\/ul>/, `<ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:8px;">\n            ${featuresHtml}\n          </ul>`);

const trs = data.specs.map((s, i) => {
  const bg = i % 2 === 0 ? '#f9f9f9' : '#fff';
  return `<tr style="background:${bg};">
            <td style="padding:12px; border:1px solid #eee; font-weight:500; color:#555; width:30%;">${s[0]}</td>
            <td style="padding:12px; border:1px solid #eee; color:#333;">${s[1]}</td>
          </tr>`;
}).join('\n          ');
html = html.replace(/<tbody>[\s\S]*?<\/tbody>/, `<tbody>\n          ${trs}\n        </tbody>`);

fs.writeFileSync(path.join(dir, data.slug), html, 'utf8');
console.log('Created ' + data.slug);


// --- PART A & C: UPDATE hospital-setup.html ---
const setupPath = path.join(dir, 'hospital-setup.html');
let setupHtml = fs.readFileSync(setupPath, 'utf8');

const arrayStart = setupHtml.indexOf('const PRODUCTS = [');
const arrayEnd = setupHtml.indexOf('];', arrayStart);
const arrayStr = setupHtml.substring(arrayStart + 'const PRODUCTS = '.length, arrayEnd + 1);

let products = eval(arrayStr);

products.forEach(p => {
  if (p.name.includes('Modular Operation Theatre')) {
    p.img = "image/Hospital%20Furniture/Modular%20ot%20theatre.png";
    p.slug = "modular-operation-theatre.html";
  }
  if (p.name.includes('OT Light — Four Reflector') || p.name.includes('OT Light - Four Reflector')) {
    p.img = "image/Hospital%20Furniture/OT%20Light%20-%20Four%20Reflector%20(SingleDouble).png";
    p.slug = "ot-light-four-reflector.html";
  }
  if (p.name.includes('OT Light — Premium Globus Dome') || p.name.includes('OT Light - Premium Globus Dome')) {
    p.img = "image/Hospital%20Furniture/OT%20Light%20-%20Premium%20Globus%20Dome.png";
    p.slug = "ot-light-premium-globus-dome.html";
  }
});

const newArrayStr = JSON.stringify(products, null, 2).replace(/"([^"]+)":/g, '$1:');
setupHtml = setupHtml.substring(0, arrayStart + 'const PRODUCTS = '.length) + newArrayStr + setupHtml.substring(arrayEnd + 1);

fs.writeFileSync(setupPath, setupHtml, 'utf8');
console.log('Updated hospital-setup.html');
