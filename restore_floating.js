const fs = require('fs');

const howItWorks = fs.readFileSync('c:/Users/DELL/Desktop/pulse-website/how-it-works.html', 'utf8');
const quality = fs.readFileSync('c:/Users/DELL/Desktop/pulse-website/quality.html', 'utf8');

const floatingMatch = howItWorks.match(/<!-- FLOATING CONTACT -->[\s\S]*?<\/script>\s*<\/body>/);
if (floatingMatch) {
  const newQuality = quality.replace(/<\/body>\s*<\/html>/, floatingMatch[0] + '\n</html>');
  fs.writeFileSync('c:/Users/DELL/Desktop/pulse-website/quality.html', newQuality, 'utf8');
  console.log('Restored floating contact to quality.html');
} else {
  console.log('Could not find floating contact block in how-it-works.html');
}
