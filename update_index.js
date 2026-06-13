const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Step 3: Add preload for hero banner
const preloadTag = '<link rel="preload" as="image" href="image/Banner/Banner 1.png" fetchpriority="high">';
if (!html.includes('rel="preload" as="image" href="image/Banner/Banner 1.png"')) {
  // Insert before </head>
  html = html.replace('</head>', `  ${preloadTag}\n</head>`);
}

// Step 2: Add lazy loading to <img> tags
// Regex to match <img> tags
const imgRegex = /<img\s+[^>]*>/gi;

html = html.replace(imgRegex, (match) => {
  // Check if it already has loading="eager" or fetchpriority="high"
  if (match.includes('loading="eager"') || match.includes('fetchpriority="high"')) {
    return match;
  }
  
  // Also keep the first hero banner eager. Let's say any banner image.
  if (match.includes('Banner 1.png') || match.includes('hero')) {
    // If it's the hero, add eager just to be sure if not present
    if (!match.includes('loading=')) {
      return match.replace('<img ', '<img loading="eager" fetchpriority="high" ');
    }
    return match;
  }
  
  // Otherwise, add loading="lazy" if not already present
  if (!match.includes('loading=')) {
    return match.replace('<img ', '<img loading="lazy" ');
  }
  
  return match;
});

fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html updated successfully.');
