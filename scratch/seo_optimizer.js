const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/DELL/Desktop/pulse-website';
const files = fs.readdirSync(rootDir);
const htmlFiles = files.filter(f => f.endsWith('.html') && !f.includes('broken'));

// SEO Metadata mapping for specific main pages
const SPECIAL_PAGES = {
  'index.html': {
    title: "Medical Equipment Manufacturer India | Pulse MedTech",
    desc: "Pulse is India's medical OEM manufacturing critical care, cardiac, renal, rehabilitation & aesthetics devices. ISO 13485 certified. Pan-India service support.",
    keywords: "medical equipment manufacturer India, medical OEM India, ISO 13485 certified medical devices, critical care equipment India, hospital equipment supplier India, Pulse MedTech",
    ogTitle: "Medical Equipment Manufacturer India | Pulse MedTech",
    ogDesc: "ISO 13485 certified medical OEM. Critical care, cardiac, renal, rehabilitation & aesthetics devices. Pan-India service within 72 hours.",
    ogImage: "https://www.pulseio.in/image/Banner/banner-1.webp",
    ogUrl: "https://www.pulseio.in/",
    ogType: "website",
    canonical: "https://www.pulseio.in/",
    h1: "Engineered in India, Built for the world."
  },
  'critical-care.html': {
    title: "Critical Care Equipment India — ICU & Ventilators | Pulse",
    desc: "Pulse critical care range: ventilators, patient monitors, anaesthesia workstations & syringe pumps. ISO 13485 certified. Trusted across India. Get a demo today.",
    keywords: "critical care equipment India, ICU equipment manufacturer, ventilator India, patient monitor India, anaesthesia machine India, syringe pump manufacturer, hospital ICU equipment",
    ogTitle: "Critical Care Equipment India | Pulse",
    ogDesc: "ICU ventilators, patient monitors, anaesthesia workstations & syringe pumps. ISO certified. Pan-India delivery & service.",
    ogImage: "https://www.pulseio.in/image/Banner/banner-2.webp",
    ogUrl: "https://www.pulseio.in/critical-care.html",
    ogType: "website",
    canonical: "https://www.pulseio.in/critical-care.html",
    h1: "Critical Care Medical Equipment India"
  },
  'critical-sh320-ventilator.html': {
    title: "SH320 ICU Ventilator — Mechanical Ventilation India | Pulse",
    desc: "Pulse SH320 mechanical ventilator for ICU & critical care. Advanced modes, compact design, ISO 13485 & CE certified. Available pan-India with 72-hr service support.",
    keywords: "SH320 ventilator, ICU ventilator India, mechanical ventilator, hospital ventilator, critical care ventilator, ventilator manufacturer India, Pulse SH320",
    ogTitle: "SH320 ICU Ventilator India | Pulse MedTech",
    ogDesc: "Advanced mechanical ventilator. ISO 13485 & CE certified. Pan-India support within 72 hours.",
    ogImage: "https://www.pulseio.in/image/PULSE Ventilator.png",
    ogUrl: "https://www.pulseio.in/critical-sh320-ventilator.html",
    ogType: "product",
    canonical: "https://www.pulseio.in/critical-sh320-ventilator.html",
    h1: "SH320 ICU Ventilator"
  },
  'renal-care.html': {
    title: "Dialysis Machines & Renal Care Equipment India | Pulse",
    desc: "Pulse renal care: haemodialysis machines, tubing sets, fistula needles & consumables. ISO certified. Reliable supply across India. Request pricing today.",
    keywords: "dialysis machine India, haemodialysis equipment, renal care equipment manufacturer, dialysis consumables India, fistula needle, kidney dialysis machine, Pulse renal care",
    ogTitle: "Dialysis Machines & Renal Care Equipment India | Pulse",
    ogDesc: "Haemodialysis machines, tubing sets & fistula needles. ISO certified. Pan-India supply & service.",
    ogImage: "https://www.pulseio.in/image/Portfolio/renal-care.webp",
    ogUrl: "https://www.pulseio.in/renal-care.html",
    ogType: "website",
    canonical: "https://www.pulseio.in/renal-care.html",
    h1: "Dialysis & Renal Care Equipment India"
  },
  'cardiac-care.html': {
    title: "Cardiac Care Devices — Stents & PTCA Balloons India | Pulse",
    desc: "Pulse cardiac range: drug eluting stents, PTCA balloons (SC, NC, CTO), guidewires, sheaths & manifolds. CE & ISO certified. Trusted by cath labs across India.",
    keywords: "drug eluting stent India, PTCA balloon catheter, cardiac stent manufacturer India, coronary guidewire, cath lab equipment India, angioplasty balloon India, Pulse cardiac care",
    ogTitle: "Cardiac Care Devices — Stents & PTCA India | Pulse",
    ogDesc: "Drug eluting stents, PTCA balloons, guidewires & sheaths. CE & ISO certified. Used in cath labs across India.",
    ogImage: "https://www.pulseio.in/image/Portfolio/cardiac-care.webp",
    ogUrl: "https://www.pulseio.in/cardiac-care.html",
    ogType: "website",
    canonical: "https://www.pulseio.in/cardiac-care.html",
    h1: "Cardiac Care Devices — Stents & PTCA India"
  },
  'aesthetics.html': {
    title: "Aesthetic Medical Devices — HIFU & Laser India | Pulse",
    desc: "Pulse aesthetics: HIFU skin tightening, diode laser hair removal & non-surgical aesthetic devices. CE certified. For clinics & dermatology centres across India.",
    keywords: "aesthetic medical device India, HIFU machine India, diode laser hair removal India, non surgical aesthetic device, dermatology equipment India, skin tightening machine, Pulse aesthetics",
    ogTitle: "Aesthetic Devices — HIFU & Laser India | Pulse",
    ogDesc: "HIFU, diode laser & non-surgical aesthetic devices. CE certified. For clinics & dermatology centres across India.",
    ogImage: "https://www.pulseio.in/image/Portfolio/aesthetics.webp",
    ogUrl: "https://www.pulseio.in/aesthetics.html",
    ogType: "website",
    canonical: "https://www.pulseio.in/aesthetics.html",
    h1: "Aesthetic Medical Devices India"
  },
  'rehabilitation.html': {
    title: "Electric Wheelchairs & Rehab Equipment India | Pulse",
    desc: "Pulse rehabilitation: electric wheelchairs, power chairs & mobility aids. ISO & CE certified. Lightweight, foldable, joystick-controlled. Pan-India delivery.",
    keywords: "electric wheelchair India, power wheelchair India, rehabilitation equipment India, foldable electric wheelchair, mobility aid India, lightweight wheelchair India, Pulse rehabilitation",
    ogTitle: "Electric Wheelchairs & Rehabilitation Equipment India | Pulse",
    ogDesc: "Foldable electric wheelchairs & power chairs. ISO & CE certified. Lightweight & joystick-controlled. Pan-India delivery.",
    ogImage: "https://www.pulseio.in/image/Portfolio/rehabilitation.webp",
    ogUrl: "https://www.pulseio.in/rehabilitation.html",
    ogType: "website",
    canonical: "https://www.pulseio.in/rehabilitation.html",
    h1: "Electric Wheelchairs & Rehabilitation Equipment India"
  },
  'hospital-setup.html': {
    title: "Hospital Setup Equipment — OT & ER Solutions India | Pulse",
    desc: "Complete hospital setup by Pulse: OT & ER equipment, laparoscopy systems, medical lasers, AEDs & more. Turnkey solutions for new & expanding hospitals across India.",
    keywords: "hospital setup India, OT equipment India, operation theatre setup, ER equipment India, laparoscopy system India, AED defibrillator India, hospital turnkey setup, Pulse hospital setup",
    ogTitle: "Hospital Setup Equipment — OT & ER India | Pulse",
    ogDesc: "Turnkey OT & ER setups, laparoscopy, AEDs & medical lasers. Complete hospital equipment solutions across India.",
    ogImage: "https://www.pulseio.in/image/Portfolio/hospital-setup.webp",
    ogUrl: "https://www.pulseio.in/hospital-setup.html",
    ogType: "website",
    canonical: "https://www.pulseio.in/hospital-setup.html",
    h1: "Hospital Setup Equipment — OT & ER India"
  },
  // Rehab Products
  'rehab-motion-pro-6001.html': {
    title: "Motion Pro 6001 Power Wheelchair India | Pulse",
    desc: "Pulse Motion Pro Model 6001 heavy-duty foldable power wheelchair. Joystick control, long-range battery, all-terrain. ISO & CE certified. Buy in India.",
    keywords: "Motion Pro 6001, power wheelchair India, heavy duty electric wheelchair, foldable power wheelchair India, joystick wheelchair, Pulse Motion Pro",
    canonical: "https://www.pulseio.in/rehab-motion-pro-6001.html",
    h1: "Motion Pro 6001 Power Wheelchair",
    category: "Rehabilitation",
    ogType: "product"
  },
  'rehab-xtrion-6013a.html': {
    title: "Xtrion 6013A Electric Wheelchair India | Pulse",
    desc: "Pulse Xtrion 6013A compact electric wheelchair. Foldable aluminium frame, Bluetooth, FM radio, 20km range, 100kg capacity. ISO & CE certified. Buy in India.",
    keywords: "Xtrion 6013A, electric wheelchair India, compact foldable wheelchair, bluetooth wheelchair India, aluminium wheelchair, Pulse Xtrion",
    canonical: "https://www.pulseio.in/rehab-xtrion-6013a.html",
    h1: "Xtrion 6013A Electric Wheelchair",
    category: "Rehabilitation",
    ogType: "product"
  },
  'rehab-innovax-6016a.html': {
    title: "Innovax 6016A Power Wheelchair 150kg India | Pulse",
    desc: "Pulse Innovax 6016A electric wheelchair. 150kg capacity, shock absorbers, turn signals, lithium battery 24V, 20km+ range. ISO & CE certified. India delivery.",
    keywords: "Innovax 6016A, heavy duty wheelchair India, 150kg electric wheelchair, shock absorbing wheelchair, turn signal wheelchair, Pulse Innovax",
    canonical: "https://www.pulseio.in/rehab-innovax-6016a.html",
    h1: "Innovax 6016A Power Wheelchair",
    category: "Rehabilitation",
    ogType: "product"
  },
  'rehab-aerodrive-6019.html': {
    title: "Aerodrive 6019 Electric Wheelchair India | Pulse",
    desc: "Pulse Aerodrive 6019 premium power wheelchair. Lightweight aluminium frame, dual motors, smart joystick. ISO & CE certified. For clinics & daily use across India.",
    keywords: "Aerodrive 6019, premium electric wheelchair India, dual motor wheelchair, aluminium frame wheelchair, smart joystick wheelchair, Pulse Aerodrive",
    canonical: "https://www.pulseio.in/rehab-aerodrive-6019.html",
    h1: "Aerodrive 6019 Electric Wheelchair",
    category: "Rehabilitation",
    ogType: "product"
  },
  'rehab-joylite-9005.html': {
    title: "Joylite 9005 Lightweight Electric Wheelchair India | Pulse",
    desc: "Pulse Joylite Model 9005 ultra-lightweight foldable electric wheelchair. Extended battery, travel-friendly design. ISO & CE certified. Daily mobility in India.",
    keywords: "Joylite 9005, lightweight electric wheelchair India, ultra lightweight wheelchair, foldable travel wheelchair, portable power chair India, Pulse Joylite",
    canonical: "https://www.pulseio.in/rehab-joylite-9005.html",
    h1: "Joylite 9005 Lightweight Electric Wheelchair",
    category: "Rehabilitation",
    ogType: "product"
  },
  'rehab-joylite-9006.html': {
    title: "Joylite 9006 Electric Wheelchair 12Ah India | Pulse",
    desc: "Pulse Joylite 9006 electric wheelchair. 12Ah battery, 250W dual motors, 10km+ range, 100kg capacity, foldable frame. ISO & CE certified. Buy online India.",
    keywords: "Joylite 9006, electric wheelchair 12ah India, 250w electric wheelchair, folding electric wheelchair India, Joylite 2 wheelchair, Pulse Joylite 9006",
    canonical: "https://www.pulseio.in/rehab-joylite-9006.html",
    h1: "Joylite 9006 Electric Wheelchair",
    category: "Rehabilitation",
    ogType: "product"
  },
  'rehab-autofold-smartride.html': {
    title: "Autofold Smartride Auto-Folding Wheelchair India | Pulse",
    desc: "Pulse Autofold Smartride one-touch auto-folding electric wheelchair. Travel-compact, joystick control, ISO & CE certified. Perfect for travel in India.",
    keywords: "auto folding wheelchair India, Autofold Smartride, one touch fold wheelchair, travel electric wheelchair India, smart folding wheelchair, Pulse Autofold",
    canonical: "https://www.pulseio.in/rehab-autofold-smartride.html",
    h1: "Autofold Smartride Auto-Folding Electric Wheelchair",
    category: "Rehabilitation",
    ogType: "product"
  }
};

// Excluded general informational/nav files from optimization
const EXCLUDED_FILES = new Set([
  'about.html', 'quality.html', 'service-support.html', 'privacy-policy.html', 
  'terms-and-conditions.html', 'categories.html', 'blog.html', 'news.html', 
  'our-people.html', 'life-at-pulse.html', 'innovation.html', 'articles.html', 
  'how-it-works.html', 'why-pulse.html', 'page.html', 'blog-post.html', 
  'blog-placeholder.html', 'banner-animation.html', 'blog-pulse-4million.html', 
  'blog-zuvio-amtz.html'
]);

// Category Pages Set
const CATEGORY_PAGES = new Set([
  'critical-care.html',
  'renal-care.html',
  'cardiac-care.html',
  'aesthetics.html',
  'rehabilitation.html',
  'hospital-setup.html',
  'diagnostic-imaging.html',
  'laboratory.html',
  'ot-surgical.html',
  'patient-monitoring.html'
]);

// Helper to determine category based on file prefix or contents
function inferCategory(file, content) {
  const f = file.toLowerCase();
  if (f.startsWith('critical-') || f === 'critical-care.html' || f.includes('ventilator') || f.includes('anesthesia') || f.includes('ecg-machine') || f.includes('infusion-pump') || f.includes('patient-monitor') || f.includes('syringe-pump')) {
    return 'Critical Care';
  }
  if (f.startsWith('renal-') || f === 'renal-care.html' || f.includes('dialysis') || f.includes('dialysers') || f.includes('fistula-needles') || f.includes('blood-tubing') || f.includes('transducer-protectors')) {
    return 'Renal Care';
  }
  if (f.startsWith('cardiac-') || f === 'cardiac-care.html' || f.includes('stent') || f.includes('guidewires') || f.includes('optima-') || f.includes('acusafe-')) {
    return 'Cardiac Care';
  }
  if (f.startsWith('aesthetics-') || f === 'aesthetics.html' || f.includes('wavelength-pro-x') || f.includes('pi-code') || f.includes('hifu') || f.includes('laser') || f.includes('body-contouring') || f.includes('hair-restoration') || f.includes('skin-rejuvenation')) {
    return 'Aesthetics';
  }
  if (f.startsWith('rehab-') || f === 'rehabilitation.html' || f.includes('wheelchair') || f.includes('traction-unit') || f.includes('combistim') || f.includes('cpm-machine') || f.includes('walker') || f.includes('softlaser') || f.includes('us-therapy')) {
    return 'Rehabilitation';
  }
  if (f === 'hospital-setup.html') {
    return 'Hospital Setup';
  }
  if (f === 'diagnostic-imaging.html') {
    return 'Diagnostic Imaging';
  }
  if (f === 'laboratory.html') {
    return 'Laboratory';
  }
  if (f === 'ot-surgical.html') {
    return 'OT & Surgical';
  }
  if (f === 'patient-monitoring.html') {
    return 'Patient Monitoring';
  }
  return 'Hospital Setup'; // Default fallback
}

// Helper to clean H1 text to be keyword-rich
function cleanH1Text(h1, category) {
  let text = h1.replace(/—/g, '').replace(/-/g, '').replace(/Model\s+\w+/gi, '').replace(/\s+/g, ' ').trim();
  if (!text.toLowerCase().includes('india')) {
    text = `${text}`;
  }
  return text;
}

// Main optimization loop
htmlFiles.forEach(file => {
  if (EXCLUDED_FILES.has(file)) {
    return; // Touch only index, category and product pages
  }

  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Parse existing content
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const currentTitle = titleMatch ? titleMatch[1].trim() : '';

  // Extract specs from specifications table
  const specs = [];
  const tableMatch = content.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  if (tableMatch) {
    const rows = [...tableMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    rows.forEach(r => {
      const cols = [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
      if (cols.length >= 2) {
        specs.push({ name: cols[0], value: cols[1] });
      }
    });
  }

  // Determine metadata
  let pageMeta = SPECIAL_PAGES[file];
  const category = inferCategory(file, content);
  const isCategory = CATEGORY_PAGES.has(file);
  
  if (!pageMeta) {
    // Dynamically build metadata
    const name = currentTitle.split('|')[0].trim().replace(/\s*—\s*Model\s*\w+/gi, '').split('—')[0].split('-')[0].trim();
    let title = isCategory ? `${name} India | Pulse` : `${name} — ${category} India | Pulse`;
    if (title.length > 60) {
      title = `${name} India | Pulse`;
    }
    if (title.length > 60) {
      title = `${name.substring(0, 48)} | Pulse`;
    }

    let specStr = specs.length > 0 ? ` Features ${specs[0].name.toLowerCase()}: ${specs[0].value.toLowerCase()}.` : '';
    let desc = isCategory
      ? `Pulse ${name} for ${category}. ISO 13485 certified, high-performance medical equipment. Available pan-India. Get a free quote today.`
      : `Pulse ${name} for ${category}.${specStr} ISO 13485 certified, high-performance medical equipment. Available pan-India. Contact us today.`;
      
    if (desc.length > 160) {
      desc = `Pulse ${name} for ${category}. ISO 13485 certified, high-performance medical equipment. Available pan-India. Get a free quote today.`;
    }
    if (desc.length < 150) {
      desc += " Quality healthcare OEM solution.";
    }
    if (desc.length > 160) {
      desc = desc.substring(0, 157) + "...";
    }

    const keywords = `${name}, ${category} India, medical equipment manufacturer, Pulse MedTech`;
    
    pageMeta = {
      title,
      desc,
      keywords,
      canonical: `https://www.pulseio.in/${file}`,
      ogTitle: isCategory ? `${name} India | Pulse` : `${name} — ${category} | Pulse`,
      ogDesc: `ISO 13485 certified ${name} for ${category} by Pulse. Pan-India service support within 72 hours.`,
      ogUrl: `https://www.pulseio.in/${file}`,
      ogType: isCategory ? "website" : "product",
      h1: cleanH1Text(name, category)
    };
  } else {
    // Align ogType
    if (pageMeta.type && !pageMeta.ogType) {
      pageMeta.ogType = pageMeta.type;
    }
    if (isCategory) {
      pageMeta.ogType = "website";
    }
  }

  // Parse main product image for og:image
  const imgMatch = content.match(/<!-- Left: Product Image -->[\s\S]*?<img\s+src=["']([^"']+)["']/i) || 
                   content.match(/<img\s+class=["']cat-hero-img["']\s+src=["']([^"']+)["']/i) ||
                   content.match(/<img\s+src=["']([^"']+)["']/i);
  const ogImg = pageMeta.ogImage || (imgMatch ? `https://www.pulseio.in/${imgMatch[1]}` : "https://www.pulseio.in/image/pulse-logo.png");

  // Build the head block replacing the old one
  const headStart = content.indexOf('<head>');
  const headEnd = content.indexOf('</head>');

  if (headStart !== -1 && headEnd !== -1) {
    const headInner = content.substring(headStart + 6, headEnd);
    
    // Retain existing stylesheets, fonts, and analytics scripts
    const retainLinks = [...headInner.matchAll(/<link\s+(?!rel=["']canonical["']|rel=["']alternate["'])([^>]*?)>/gi)].map(m => m[0]).join('\n  ');
    const retainScripts = [...headInner.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[0]).join('\n  ');

    // Build optimized head
    let newHead = `\n  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageMeta.title}</title>
  <meta name="description" content="${pageMeta.desc}">
  <meta name="keywords" content="${pageMeta.keywords}">
  <link rel="canonical" href="${pageMeta.canonical}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Pulse MedTech">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:title" content="${pageMeta.ogTitle || pageMeta.title}">
  <meta property="og:description" content="${pageMeta.ogDesc || pageMeta.desc}">
  <meta property="og:url" content="${pageMeta.ogUrl || pageMeta.canonical}">
  <meta property="og:type" content="${pageMeta.ogType || 'website'}">
  <meta property="og:image" content="${ogImg}">
  <meta property="og:site_name" content="Pulse MedTech">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageMeta.ogTitle || pageMeta.title}">
  <meta name="twitter:description" content="${pageMeta.ogDesc || pageMeta.desc}">
  <meta name="twitter:image" content="${ogImg}">
  
  <link rel="alternate" hreflang="en-IN" href="${pageMeta.canonical}">
  ${retainLinks}
  ${retainScripts}\n`;

    // Inject schemas
    let schemaMarkup = '';
    if (file === 'index.html') {
      // Organization + WebSite + FAQPage schema
      schemaMarkup = `\n  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.pulseio.in/#organization",
        "name": "Pulse MedTech",
        "url": "https://www.pulseio.in",
        "logo": "https://www.pulseio.in/image/pulse-logo.png",
        "description": "India's integrated medical equipment OEM manufacturing critical care, cardiac, renal, rehabilitation and aesthetics devices.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "27th Main Road, Sector 2, HSR Layout",
          "addressLocality": "Bangalore",
          "addressRegion": "Karnataka",
          "postalCode": "560102",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-90711-01108",
          "contactType": "sales",
          "areaServed": "IN",
          "availableLanguage": "English"
        },
        "sameAs": [
          "https://www.linkedin.com/company/pulsemedtech",
          "https://twitter.com/pulsemedtech",
          "https://www.youtube.com/@pulsemedtech",
          "https://www.instagram.com/pulsemedtech"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.pulseio.in/#website",
        "url": "https://www.pulseio.in",
        "name": "Pulse MedTech",
        "publisher": {
          "@id": "https://www.pulseio.in/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.pulseio.in/?s={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are your products certified and compliant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every product manufactured by Pulse is certified against ISO 13485, CE Mark, BIS/CDSCO, DL20B, ISO 9001, MD13, and MDR 2017 standards."
        }
      },
      {
        "@type": "Question",
        "name": "What is your service and support model?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide on-ground service support across India with a guaranteed 72-hour response time. Our local teams handle installation, preventive maintenance, AMC contracts, and emergency repairs."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get a demo before purchasing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We offer live product demonstrations at your facility or at our showroom. Call us at +91 90711 01108 and our team will schedule a demo within 48 hours."
        }
      },
      {
        "@type": "Question",
        "name": "What is your warranty policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All Pulse products come with a minimum 1-year comprehensive warranty. Extended warranty and AMC packages are available for 2–5 years."
        }
      },
      {
        "@type": "Question",
        "name": "Do you supply to government hospitals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Pulse products are fully compliant with GeM portal requirements and we actively participate in tenders, supplying to public hospitals and medical colleges."
        }
      }
    ]
  }
  </script>`;
    } else if (pageMeta.ogType === 'website') {
      // Category page: ItemList schema
      // Parse category products from current page to list them
      const regex = /["'](rehab-|critical-|cardiac-|renal-|aesthetics-|hospital-)[^"']*?\.html["']/gi;
      const productLinks = [...content.matchAll(regex)]
        .map(m => m[0].substring(1, m[0].length - 1))
        .filter((v, i, a) => a.indexOf(v) === i);

      let itemList = [];
      if (productLinks.length > 0) {
        itemList = productLinks.map((link, idx) => {
          const pName = link.replace(/(rehab-|critical-|cardiac-|renal-|aesthetics-|hospital-)/g, '').replace(/-/g, ' ').replace('.html', '').trim();
          return {
            "@type": "ListItem",
            "position": idx + 1,
            "name": pName.toUpperCase(),
            "url": `https://www.pulseio.in/${link}`
          };
        });
      } else {
        // Parse the static product card elements
        const nameMatches = [...content.matchAll(/class=["']product-name["']>([\s\S]*?)<\/div>/gi)];
        const modelMatches = [...content.matchAll(/class=["']product-model["']>([\s\S]*?)<\/div>/gi)];
        itemList = nameMatches.map((m, idx) => {
          const name = m[1].replace(/<[^>]*>/g, '').trim();
          const model = modelMatches[idx] ? modelMatches[idx][1].replace(/<[^>]*>/g, '').replace(/MODEL:\s*/i, '').trim() : '';
          const fullName = model ? `${name} — ${model}` : name;
          const urlAnchor = model ? `#${model.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : '';
          return {
            "@type": "ListItem",
            "position": idx + 1,
            "name": fullName,
            "url": `https://www.pulseio.in/${file}${urlAnchor}`
          };
        });
      }

      schemaMarkup = `\n  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "${pageMeta.title.split('|')[0].trim()}",
    "description": "${pageMeta.desc}",
    "url": "${pageMeta.canonical}",
    "numberOfItems": ${itemList.length},
    "itemListElement": ${JSON.stringify(itemList, null, 2)}
  }
  </script>`;
    } else if (pageMeta.ogType === 'product') {
      // Product page: Product schema + BreadcrumbList schema
      const addProps = specs.map(s => ({
        "@type": "PropertyValue",
        "name": s.name,
        "value": s.value
      }));

      schemaMarkup = `\n  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${pageMeta.h1}",
    "description": "${pageMeta.desc}",
    "brand": {
      "@type": "Brand",
      "name": "Pulse MedTech"
    },
    "manufacturer": {
      "@id": "https://www.pulseio.in/#organization"
    },
    "category": "${category}",
    "image": "${ogImg}",
    "url": "${pageMeta.canonical}",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@id": "https://www.pulseio.in/#organization"
      }
    },
    "additionalProperty": ${JSON.stringify(addProps, null, 2)}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.pulseio.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "${category}",
        "item": "https://www.pulseio.in/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "${pageMeta.h1}",
        "item": "${pageMeta.canonical}"
      }
    ]
  }
  </script>`;
    }

    newHead += schemaMarkup + '\n';
    content = content.substring(0, headStart + 6) + newHead + content.substring(headEnd);
  }

  // --- H1 Optimization ---
  if (file !== 'index.html') {
    // Find the first H1 and replace it with optimized version keeping styles
    content = content.replace(/<h1([^>]*?)>([\s\S]*?)<\/h1>/i, (match, attrs, oldText) => {
      return `<h1${attrs}>${pageMeta.h1}</h1>`;
    });
  }

  // --- Image Alt Optimization ---
  content = content.replace(/<img\s+([^>]*?)>/gi, (match, attrs) => {
    // Check if alt attribute already exists
    if (/alt=["']/i.test(attrs)) {
      // Replace existing alt with optimized one
      return `<img ${attrs.replace(/alt=["']([^"']*)["']/gi, `alt="Pulse ${pageMeta.h1} ${category} — medical equipment India"`)} >`;
    } else {
      // Append alt attribute
      return `<img alt="Pulse ${pageMeta.h1} ${category} — medical equipment India" ${attrs} >`;
    }
  });

  // --- Breadcrumb Update ---
  if (pageMeta.ogType === 'product' && file !== 'index.html') {
    // Replace p-based breadcrumb with nav-based breadcrumb on product pages
    const breadcrumbRegex = /<p\s+style=["']font-size:13px;\s+color:#888;\s+margin-bottom:32px;["']>([\s\S]*?)<\/p>/i;
    content = content.replace(breadcrumbRegex, () => {
      const catSlug = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') + '.html';
      return `<nav aria-label="breadcrumb" style="font-size:13px; color:#888; margin-bottom:32px;">
        <ol style="display:inline; list-style:none; padding:0; margin:0;">
          <li style="display:inline;"><a href="index.html" style="color:#888; text-decoration:none;">HOME</a></li>
          <li style="display:inline; margin:0 4px;">›</li>
          <li style="display:inline;"><a href="${catSlug}" style="color:#888; text-decoration:none;">${category}</a></li>
          <li style="display:inline; margin:0 4px;">›</li>
          <li style="display:inline; color:#888;" aria-current="page">${pageMeta.h1}</li>
        </ol>
      </nav>`;
    });
  } else if (pageMeta.ogType === 'website' && file !== 'index.html') {
    // Replace div cat-breadcrumb with nav cat-breadcrumb on category pages
    const breadcrumbRegex = /<div\s+class=["']cat-breadcrumb["']>([\s\S]*?)<\/div>/i;
    if (breadcrumbRegex.test(content)) {
      content = content.replace(breadcrumbRegex, () => {
        return `<nav aria-label="breadcrumb" class="cat-breadcrumb">
          <a href="index.html">Home</a>
          <span>›</span>
          <a href="index.html#portfolio">Categories</a>
          <span>›</span>
          ${category}
        </nav>`;
      });
    } else if (!content.includes('aria-label="breadcrumb"')) {
      // For category pages without existing breadcrumb, insert it before the first <h1>
      const breadcrumbHTML = `<nav aria-label="breadcrumb" class="cat-breadcrumb" style="font-size:12px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,0.6); margin-bottom:24px; display:flex; align-items:center; gap:8px;">
        <a href="index.html" style="color:rgba(255,255,255,0.6); text-decoration:none;">Home</a>
        <span style="color:rgba(255,255,255,0.3);">›</span>
        <a href="index.html#portfolio" style="color:rgba(255,255,255,0.6); text-decoration:none;">Categories</a>
        <span style="color:rgba(255,255,255,0.3);">›</span>
        <span style="color:#fff;">${category}</span>
      </nav>`;
      content = content.replace(/<h1>/i, breadcrumbHTML + '\n  <h1>');
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`Optimized file: ${file}`);
});
