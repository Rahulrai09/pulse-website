const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Desktop/pulse-website';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // A good heuristic for a product page: it has "Request Brochure on WhatsApp"
  if (content.includes('Request Brochure on WhatsApp')) {
    const originalContent = content;
    
    // Regex to match the Contact Us button
    const regex = /<a\s+[^>]*?>\s*Contact Us\s*<\/a>/gi;
    
    content = content.replace(regex, (match) => {
      // Don't modify the Contact Us link in the footer or header if it happens to be here,
      // but in this template they are injected via JS. Just in case, check if it's the CTA button.
      // The CTA button has style="...".
      
      let newMatch = match;
      
      // Replace href
      if (/href="[^"]*"/.test(newMatch)) {
        newMatch = newMatch.replace(/href="[^"]*"/, 'href="https://wa.me/919071101108"');
      } else {
        newMatch = newMatch.replace('<a ', '<a href="https://wa.me/919071101108" ');
      }
      
      // Ensure target="_blank"
      if (!/target="_blank"/.test(newMatch)) {
        newMatch = newMatch.replace('<a ', '<a target="_blank" ');
      }
      
      // Ensure rel="noopener noreferrer"
      if (!/rel="[^"]*"/.test(newMatch)) {
        newMatch = newMatch.replace('<a ', '<a rel="noopener noreferrer" ');
      } else if (!/rel=".*?noopener noreferrer.*?"/.test(newMatch)) {
        // If it has rel but not these, it's safer to just replace rel entirely for our purposes
        newMatch = newMatch.replace(/rel="[^"]*"/, 'rel="noopener noreferrer"');
      }
      
      return newMatch;
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Modified: ${file}`);
      modifiedCount++;
    }
  }
}

console.log(`Total files modified: ${modifiedCount}`);
