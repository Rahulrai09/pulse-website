const fs = require('fs');
let content = fs.readFileSync('js/header.js', 'utf8');

const startMarker = `// Desktop search binding
            if (searchInput) {
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') handleSearch(searchInput.value);
                });
            }
        }`;

const endMarker = `        // Hover image swap in product dropdown`;

if (content.includes(startMarker) && content.includes(endMarker)) {
    const startIdx = content.indexOf(startMarker) + startMarker.length;
    const endIdx = content.indexOf(endMarker);
    
    // We want to delete everything between startIdx and endIdx
    const newContent = content.substring(0, startIdx) + '\n        \n' + content.substring(endIdx);
    fs.writeFileSync('js/header.js', newContent);
    console.log('Fixed successfully!');
} else {
    console.log('Could not find markers');
}
