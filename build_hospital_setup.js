const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Desktop/pulse-website';
const criticalCarePath = path.join(dir, 'critical-care.html');
const templateDetailPath = path.join(dir, 'critical-anesthesia-workstation.html');
const hospitalSetupPath = path.join(dir, 'hospital-setup.html');

const products = [
  {
    name: "ICU Bed — Five Functional Electric (Premium)",
    tag: "ICU BEDS",
    slug: "hospital-icu-bed-5func-electric-premium.html",
    desc: "Motorised five-function premium hospital ICU bed with ABS head/foot boards, 4-section ABS railings with degree indicator, 5-inch twin centre locking castor wheels, and CPR system.",
    specs: ["5 Functions", "Motorised", "CPR System"],
    cert: ["iso", "ce", "cdsco"],
    app: "icu",
    type: "ICU Beds"
  },
  {
    name: "ICU Bed — Five Functional Electric (Deluxe)",
    tag: "ICU BEDS",
    slug: "hospital-icu-bed-5func-electric-deluxe.html",
    desc: "Five-function electric ICU bed with CRCA pipe frame, ABS moulded head/foot panels, ABS side safety railing, and electric actuator positioning. Overall size 220×100×60–80 cm.",
    specs: ["5 Functions", "Electric Actuator", "ABS Railing"],
    cert: ["iso", "ce"],
    app: "icu",
    type: "ICU Beds"
  },
  {
    name: "ICU Bed — Five Functional Manual (Deluxe)",
    tag: "ICU BEDS",
    slug: "hospital-icu-bed-5func-manual-deluxe.html",
    desc: "Five-function manual ICU bed with crank mechanism, CRCA pipe frame, ABS safety side railing, and one SS IV rod. Overall size 220×100×60–80 cm.",
    specs: ["5 Functions", "Crank Mechanism", "SS IV Rod"],
    cert: ["iso"],
    app: "icu",
    type: "ICU Beds"
  },
  {
    name: "ICU Bed — Three Functional Electric",
    tag: "ICU BEDS",
    slug: "hospital-icu-bed-3func-electric.html",
    desc: "Three-function electric ICU bed with ABS moulded panels, ABS side railing, electric actuator, and 5-inch special casters with brakes.",
    specs: ["3 Functions", "Electric", "ABS Railing"],
    cert: ["iso", "ce"],
    app: "icu",
    type: "ICU Beds"
  },
  {
    name: "Fowler Bed Electric",
    tag: "ICU BEDS",
    slug: "hospital-fowler-bed-electric.html",
    desc: "Electrically operated Fowler bed with motor and remote back-rest/knee-rest control, ABS moulded panels, aluminium collapsible side safety railing, and 4-inch casters.",
    specs: ["Electric", "Remote Control", "Collapsible Railing"],
    cert: ["iso"],
    app: "ward",
    type: "ICU Beds"
  },
  {
    name: "Semi Fowler Bed Electric",
    tag: "ICU BEDS",
    slug: "hospital-semi-fowler-electric.html",
    desc: "Semi Fowler electric bed with motor and remote back-rest operation, ABS moulded head/foot panels, overall size 220×100×60–80 cm.",
    specs: ["Electric", "Semi Fowler", "ABS Panels"],
    cert: ["iso"],
    app: "ward",
    type: "ICU Beds"
  },
  {
    name: "OT Table — Electric + Manual Top Slide (Deluxe)",
    tag: "OT TABLES",
    slug: "hospital-ot-table-electric-manual-deluxe.html",
    desc: "Five-sectional stainless steel radio translucent top OT table with remote control, electric actuator, top slide with six functions, and chair position for seating operations.",
    specs: ["6 Functions", "Remote Control", "Radiolucent Top"],
    cert: ["iso", "ce"],
    app: "ot",
    type: "OT Tables"
  },
  {
    name: "OT Table — C-Arm Hydraulic",
    tag: "OT TABLES",
    slug: "hospital-ot-table-carm-hydraulic.html",
    desc: "C-arm compatible OT table with hydraulic and mechanical operation, centric base of high quality stainless steel, interchangeable leg and head sections, and inbuilt kidney bridge.",
    specs: ["C-Arm Compatible", "Hydraulic", "SS Construction"],
    cert: ["iso"],
    app: "ot",
    type: "OT Tables"
  },
  {
    name: "OT Table — General Hydraulic",
    tag: "OT TABLES",
    slug: "hospital-ot-table-general-hydraulic.html",
    desc: "Five-sectional stainless steel OT table with heavy-duty hydraulic pump, durable floor locking system, and eccentrically positioned top for C-arm image intensifier access.",
    specs: ["Hydraulic", "5 Sections", "C-Arm Access"],
    cert: ["iso"],
    app: "ot",
    type: "OT Tables"
  },
  {
    name: "Delivery Table — Electric & Manual",
    tag: "LABOUR & DELIVERY",
    slug: "hospital-delivery-table-electric-manual.html",
    desc: "Obstetric and gynaecological delivery table with electric actuator height/back-section adjustment, three-section MS pipe top with cushion mattress, and telescopic IV rod.",
    specs: ["Electric + Manual", "OB/GYN", "SS Telescopic IV Rod"],
    cert: ["iso", "ce"],
    app: "delivery",
    type: "Labour & Delivery"
  },
  {
    name: "Delivery Table — Hydraulic Deluxe",
    tag: "LABOUR & DELIVERY",
    slug: "hospital-delivery-table-hydraulic.html",
    desc: "Three-sectional stainless steel top delivery table with pneumatic pump Trendelenburg, U-cut middle section for leg slide, and SS hand grips.",
    specs: ["Hydraulic", "Trendelenburg", "SS Top"],
    cert: ["iso"],
    app: "delivery",
    type: "Labour & Delivery"
  },
  {
    name: "OT Light — Premium with Camera HD",
    tag: "OT LIGHTS",
    slug: "hospital-ot-light-premium-camera.html",
    desc: "Premium OT light with integrated HD camera, 12–30 cm focusing, adjustable light diameter 50mm, and optional battery backup. Ceiling mounted with surgical-grade illumination.",
    specs: ["HD Camera", "12–30cm Focus", "Battery Backup Optional"],
    cert: ["iso", "ce"],
    app: "ot",
    type: "OT Lights"
  },
  {
    name: "OT Light — Premium Globus Dome",
    tag: "OT LIGHTS",
    slug: "hospital-ot-light-globus-dome.html",
    desc: "Premium globus dome OT light with 48 LEDs, 180,000 lux intensity, adjustable focus, and power life of more than 50,000 hours.",
    specs: ["48 LED", "180,000 Lux", "50,000+ Hrs Life"],
    cert: ["iso", "ce"],
    app: "ot",
    type: "OT Lights"
  },
  {
    name: "OT Light — Four Reflector (Single/Double)",
    tag: "OT LIGHTS",
    slug: "hospital-ot-light-four-reflector.html",
    desc: "Four reflector economical OT light with 78 LEDs, 180,000 lux adjustable focus, and power life of more than 50,000 hours. Available in single and double dome configurations.",
    specs: ["78 LED", "180,000 Lux", "Single/Double Dome"],
    cert: ["iso"],
    app: "ot",
    type: "OT Lights"
  },
  {
    name: "OT Examination Light",
    tag: "OT LIGHTS",
    slug: "hospital-ot-examination-light.html",
    desc: "Mobile examination light in 3W/7W/9W/18W variants, 100mm light diameter, LED average 50,000 hours, and 80–100mm spot diameter.",
    specs: ["Mobile", "3W–18W", "50,000 Hrs LED"],
    cert: ["iso"],
    app: "er",
    type: "OT Lights"
  },
  {
    name: "Stretcher Trolley MS & SS",
    tag: "STRETCHERS & TROLLEYS",
    slug: "hospital-stretcher-trolley-ms-ss.html",
    desc: "Standard MS and SS stretcher trolley for patient transport across hospital departments.",
    specs: ["MS & SS", "Hospital Transport", "Standard"],
    cert: ["iso"],
    app: "er",
    type: "Stretchers & Trolleys"
  },
  {
    name: "Emergency Patient Trolley (Hydraulic)",
    tag: "STRETCHERS & TROLLEYS",
    slug: "hospital-emergency-trolley-hydraulic.html",
    desc: "Hydraulic emergency patient trolley designed for rapid patient transport in emergency and trauma settings.",
    specs: ["Hydraulic", "Emergency", "Rapid Transport"],
    cert: ["iso", "ce"],
    app: "er",
    type: "Stretchers & Trolleys"
  },
  {
    name: "Wheelchair (Indian & Imported)",
    tag: "WHEELCHAIRS & MOBILITY",
    slug: "hospital-wheelchair.html",
    desc: "Wheelchairs available in Indian and imported variants for patient mobility across hospital environments.",
    specs: ["Indian & Imported", "Patient Mobility", "Standard"],
    cert: ["iso"],
    app: "ward",
    type: "Wheelchairs & Mobility"
  },
  {
    name: "SS Instrument Trolleys",
    tag: "SS TROLLEYS & CARTS",
    slug: "hospital-ss-instrument-trolleys.html",
    desc: "Stainless steel instrument trolleys in multiple configurations — All SS, Three Shelf, Box Type MS and SS — with customization available. Size D457×W609×H762mm.",
    specs: ["All SS", "Customizable", "Multiple Variants"],
    cert: ["iso"],
    app: "ot",
    type: "SS Trolleys & Carts"
  },
  {
    name: "Crash Cart with Drawers",
    tag: "SS TROLLEYS & CARTS",
    slug: "hospital-crash-cart.html",
    desc: "Emergency crash cart available with ABS drawers and SS drawers for storing resuscitation medications and equipment at point of care.",
    specs: ["ABS & SS Variants", "Emergency", "Point-of-Care"],
    cert: ["iso", "ce"],
    app: "er",
    type: "SS Trolleys & Carts"
  },
  {
    name: "Autoclaves & Sterilizers",
    tag: "AUTOCLAVES & STERILIZERS",
    slug: "hospital-autoclaves-sterilizers.html",
    desc: "Complete range of autoclaves — SS & Aluminium portable, vertical, and horizontal configurations — from 12L to 180L capacity in non-electric and electrical variants.",
    specs: ["12L–180L", "Vertical & Horizontal", "Electric & Non-Electric"],
    cert: ["iso", "ce"],
    app: "lab",
    type: "Autoclaves & Sterilizers"
  },
  {
    name: "Baby Warmer Range",
    tag: "BABY WARMERS",
    slug: "hospital-baby-warmer.html",
    desc: "Infant radiant warmers from Regular to Premium N-400 series. Features air/skin servo control, dual digital display, self-test system, and LED phototherapy option.",
    specs: ["Servo Controlled", "N-102 to N-400", "NICU Ready"],
    cert: ["iso", "ce", "cdsco"],
    app: "nicu",
    type: "Baby Warmers"
  },
  {
    name: "Medical Gas Pipeline System",
    tag: "MEDICAL GAS SYSTEMS",
    slug: "hospital-medical-gas-pipeline.html",
    desc: "Complete medical gas pipeline solutions including manifold systems, bed head panels (Lumipan, Silk-H, Critrunk), power columns, pendants, and vacuum regulators.",
    specs: ["Full Pipeline", "Bed Head Panels", "Pendants & Columns"],
    cert: ["iso", "ce", "cdsco"],
    app: "icu",
    type: "Medical Gas Systems"
  },
  {
    name: "Modular Operation Theatre",
    tag: "MODULAR OT",
    slug: "hospital-modular-ot.html",
    desc: "ISO-certified modular OT construction with laminar ceiling, wall/ceiling systems, hermetic doors, pass boxes, scrub sinks, surgeon control panels, and full HVAC compliance.",
    specs: ["ISO Certified", "Laminar Flow", "Full Turnkey"],
    cert: ["iso", "ce"],
    app: "ot",
    type: "Modular OT"
  }
];

// --- 1. Generate hospital-setup.html from critical-care.html ---
let ccContent = fs.readFileSync(criticalCarePath, 'utf8');

// Replace Hero Section Content
ccContent = ccContent.replace(/<title>.*?<\/title>/, '<title>Hospital Setup | Pulse Medical</title>');
ccContent = ccContent.replace(/image\/Portfolio\/critical-care\.webp/g, 'image/Portfolio/hospital-setup.webp'); // Assuming this exists or falls back
ccContent = ccContent.replace(/Critical Care/g, 'Hospital Setup');
ccContent = ccContent.replace(/ICU-grade ventilators, patient monitors, infusion pumps, anaesthesia machines and syringe pumps — engineered for precision in high-acuity clinical environments\./, 'Comprehensive hospital setup solutions ranging from modular OTs and medical gas pipelines to premium ICU beds, OT lights, and essential medical furniture.');
ccContent = ccContent.replace(/critical-care\.html/g, 'hospital-setup.html');

// Replace Filter Sidebar
const filterSidebarHtml = `<aside class="filter-sidebar">
      <h3>Filter Products</h3>

      <div class="filter-group">
        <h4>Product Type</h4>
        <label class="filter-option"><input type="checkbox" value="ICU Beds"> ICU Beds</label>
        <label class="filter-option"><input type="checkbox" value="OT Tables"> OT Tables</label>
        <label class="filter-option"><input type="checkbox" value="Labour & Delivery"> Labour & Delivery</label>
        <label class="filter-option"><input type="checkbox" value="OT Lights"> OT Lights</label>
        <label class="filter-option"><input type="checkbox" value="Stretchers & Trolleys"> Stretchers & Trolleys</label>
        <label class="filter-option"><input type="checkbox" value="Wheelchairs & Mobility"> Wheelchairs & Mobility</label>
        <label class="filter-option"><input type="checkbox" value="SS Trolleys & Carts"> SS Trolleys & Carts</label>
        <label class="filter-option"><input type="checkbox" value="Autoclaves & Sterilizers"> Autoclaves & Sterilizers</label>
        <label class="filter-option"><input type="checkbox" value="Baby Warmers"> Baby Warmers</label>
        <label class="filter-option"><input type="checkbox" value="Anesthesia Machines"> Anesthesia Machines</label>
        <label class="filter-option"><input type="checkbox" value="Medical Gas Systems"> Medical Gas Systems</label>
        <label class="filter-option"><input type="checkbox" value="Modular OT"> Modular OT</label>
        <label class="filter-option"><input type="checkbox" value="Nursing Station & Admin"> Nursing Station & Admin</label>
        <label class="filter-option"><input type="checkbox" value="Instrument Sets"> Instrument Sets</label>
        <label class="filter-option"><input type="checkbox" value="Diagnostic Equipment"> Diagnostic Equipment</label>
        <label class="filter-option"><input type="checkbox" value="Defibrillators & AEDs"> Defibrillators & AEDs</label>
      </div>

      <div class="filter-group">
        <h4>Application</h4>
        <label class="filter-option"><input type="checkbox" value="ot"> Operation Theatre</label>
        <label class="filter-option"><input type="checkbox" value="icu"> ICU / CCU</label>
        <label class="filter-option"><input type="checkbox" value="er"> Emergency Room</label>
        <label class="filter-option"><input type="checkbox" value="delivery"> Labour & Delivery</label>
        <label class="filter-option"><input type="checkbox" value="ward"> General Ward</label>
        <label class="filter-option"><input type="checkbox" value="lab"> Laboratory</label>
        <label class="filter-option"><input type="checkbox" value="nicu"> Neonatal Care</label>
      </div>

      <div class="filter-group">
        <h4>Certification</h4>
        <label class="filter-option"><input type="checkbox" value="iso"> ISO 13485</label>
        <label class="filter-option"><input type="checkbox" value="ce"> CE Marked</label>
        <label class="filter-option"><input type="checkbox" value="cdsco"> CDSCO</label>
      </div>

      <button class="filter-clear" onclick="clearFilters()">Clear All Filters</button>
    </aside>`;

ccContent = ccContent.replace(/<aside class="filter-sidebar">[\s\S]*?<\/aside>/, filterSidebarHtml);

// Replace PRODUCTS array
// First build the new JS array
const newProductsJS = `const PRODUCTS = [\n` + products.map(p => {
  return `      {
        name: "${p.name}",
        slug: "${p.slug}",
        category: "${p.tag}",
        type: "${p.type}",
        app: "${p.app}",
        cert: ${JSON.stringify(p.cert)},
        tag: "${p.tag}",
        tagColor: "orange",
        desc: "${p.desc}",
        specs: ${JSON.stringify(p.specs)},
        img: "image/pulse-logo.png"
      }`;
}).join(',\n') + `\n    ];`;

ccContent = ccContent.replace(/const PRODUCTS = \[[\s\S]*?\];\s*(?:const PER_PAGE|let filtered)/, newProductsJS + '\n    const PER_PAGE');

fs.writeFileSync(hospitalSetupPath, ccContent, 'utf8');
console.log('Generated hospital-setup.html');

// --- 2. Generate 24 detail pages ---
const templateDetailContent = fs.readFileSync(templateDetailPath, 'utf8');

products.forEach(p => {
  let pContent = templateDetailContent;

  pContent = pContent.replace(/<title>.*?<\/title>/, `<title>${p.name} | Pulse Medical</title>`);
  
  // Breadcrumbs - "Anesthesia Workstation" -> p.name
  // And "Critical Care" -> "Hospital Setup"
  pContent = pContent.replace(/<a href="critical-care.html"[^>]*>Critical Care<\/a>/g, '<a href="hospital-setup.html" style="color:#888; text-decoration:none;">Hospital Setup</a>');
  // Just generic string replacement for the breadcrumb active item
  pContent = pContent.replace(/<\/a> ›\s*Anesthesia Workstation/g, `</a> ›\n        ${p.name}`);
  
  // Sub-heading "Anesthesia | Critical Care"
  pContent = pContent.replace(/Anesthesia \| Critical Care/g, `${p.tag} | Hospital Setup`);

  // H1 Title
  pContent = pContent.replace(/<h1[^>]*>\s*Anesthesia Workstation\s*<\/h1>/g, `<h1 style="font-size:2rem; color:#0f1f4b; line-height:1.2; margin-bottom:16px;">\n            ${p.name}\n          </h1>`);

  // Description
  pContent = pContent.replace(/A classic anesthesia machine approved globally[\s\S]*?\(AGM\)\./, p.desc);

  // Image - Replace "image/Critical%20care/Anesthesia%20Workstation.png"
  pContent = pContent.replace(/image\/Critical%20care\/Anesthesia%20Workstation\.png/g, 'image/pulse-logo.png');
  pContent = pContent.replace(/alt="Anesthesia Workstation"/g, `alt="${p.name}"`);

  // Feature Tags
  const featureTagsHtml = p.specs.map(s => `<span style="background:#eef1f6; color:#333; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:500;">${s}</span>`).join('\n            ');
  pContent = pContent.replace(/<div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:32px;">[\s\S]*?<\/div>/, `<div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:32px;">\n            ${featureTagsHtml}\n          </div>`);

  // WhatsApp Link
  const encodedName = encodeURIComponent(p.name);
  pContent = pContent.replace(/https:\/\/wa\.me\/919071101108\?text=Hi%2C%20I%20would%20like%20to%20request%20the%20brochure%20for%20Anesthesia%20Workstation/g, `https://wa.me/919071101108?text=Hi%2C%20I%20would%20like%20to%20request%20the%20brochure%20for%20${encodedName}`);

  // Back Link
  pContent = pContent.replace(/← Back to Critical Care/g, '← Back to Hospital Setup');

  fs.writeFileSync(path.join(dir, p.slug), pContent, 'utf8');
  console.log(`Generated detail page: ${p.slug}`);
});

console.log('Complete');
