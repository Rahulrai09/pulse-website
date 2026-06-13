const fs = require('fs');
let content = fs.readFileSync('js/header.js', 'utf8');

const newKeywords = `
  // ── ARTICLES & INSIGHTS ────────────────────────
  { keywords: [
      'article','articles','insights','blog','news',
      'press','media','publication','read more',
      'latest news','updates','announcement'
    ],
    url: 'about.html#insights'
  },

  // ── CAREERS ────────────────────────────────────
  { keywords: [
      'career','careers','jobs','job','hiring',
      'vacancy','vacancies','work with us','join us',
      'join pulse','employment','apply','opening'
    ],
    url: 'about.html#careers'
  },

  // ── INNOVATION & R&D ───────────────────────────
  { keywords: [
      'innovation','r&d','research and development',
      'research','development','technology','patent',
      'new product','pipeline','prototype'
    ],
    url: 'about.html#innovation'
  },

  // ── VISION & MISSION ───────────────────────────
  { keywords: [
      'vision','mission','values','our vision',
      'our mission','purpose','goal','objective'
    ],
    url: 'about.html#vision'
  },

  // ── PRIVACY & LEGAL ────────────────────────────
  { keywords: [
      'privacy','privacy policy','data protection',
      'gdpr','personal data','data collection'
    ],
    url: 'privacy-policy.html'
  },
  { keywords: [
      'terms','terms and conditions','terms of use',
      'legal','agreement','conditions','disclaimer'
    ],
    url: 'terms-and-conditions.html'
  },

  // ── INVESTORS ──────────────────────────────────
  { keywords: [
      'investor','investors','investment','funding',
      '3one4','incubate fund','stride ventures',
      'seed round','raise','fundraise','capital'
    ],
    url: 'about.html'
  },

  // ── DISTRIBUTORS / PARTNERS ────────────────────
  { keywords: [
      'distributor','distributors','dealer','partner',
      'partnership','reseller','channel','franchise',
      'become a distributor','distribution'
    ],
    url: 'index.html#contact'
  },

  // ── GENERAL HOME ───────────────────────────────
  { keywords: [
      'home','homepage','main page','pulse','pulseio',
      'pulse medical','pulse website','back to home'
    ],
    url: 'index.html'
  }
];`;

// 1. Find the end of the searchMap array and inject the new keywords before the closing bracket
const mapEndTarget = '    url: \'index.html#excellence\'\n  }\n];';
if (content.includes(mapEndTarget)) {
    content = content.replace(mapEndTarget, '    url: \'index.html#excellence\'\n  },' + newKeywords);
} else {
    console.log("Could not find the end of searchMap");
}

// 2. Change the fallback URL in handleSearch
const oldFallback = `window.location.href = match\n    ? match.url\n    : 'critical-care.html'; // default fallback`;
const oldFallbackAlternative = `window.location.href = match ? match.url : 'critical-care.html';`;

if (content.includes(oldFallback)) {
    content = content.replace(oldFallback, `window.location.href = match\n    ? match.url\n    : 'about.html'; // default fallback`);
} else if (content.includes(oldFallbackAlternative)) {
    content = content.replace(oldFallbackAlternative, `window.location.href = match ? match.url : 'about.html';`);
} else {
    console.log("Could not find fallback logic");
}

fs.writeFileSync('js/header.js', content);
console.log('Update Complete!');
