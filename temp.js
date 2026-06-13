const fs = require('fs');
let content = fs.readFileSync('js/header.js', 'utf8');

const newCode = `// Unified Search Logic
        const searchMap = [
          // Critical Care keywords
          { keywords: ['ventilator','icu','sh320','breathing','vent'],
            url: 'critical-care.html' },
          { keywords: ['patient monitor','monitor','spo2','ecg','nibp','temp'],
            url: 'critical-care.html' },
          { keywords: ['infusion pump','infusion','iv pump','drip'],
            url: 'critical-care.html' },
          { keywords: ['syringe pump','syringe'],
            url: 'critical-care.html' },
          { keywords: ['anaesthesia','anesthesia','anaesthesia machine'],
            url: 'critical-care.html' },
          { keywords: ['critical','critical care'],
            url: 'critical-care.html' },

          // Renal Care keywords
          { keywords: ['dialysis','haemodialysis','hemodialysis','renal',
                       'crrt','fistula','dialyser','nephrology','kidney'],
            url: 'renal-care.html' },

          // Cardiac Care keywords
          { keywords: ['cardiac','heart','stent','ptca','balloon',
                       'guidewire','sheath','manifold','cardio'],
            url: 'cardiac-care.html' },

          // Aesthetics keywords
          { keywords: ['aesthetic','aesthetics','skin','laser','derma',
                       'dermatology','beauty','slimming','wellness','body'],
            url: 'aesthetics.html' },

          // Rehab & Therapy keywords
          { keywords: ['rehab','rehabilitation','therapy','physio',
                       'physiotherapy','mobility','muscle','recovery','ortho'],
            url: 'rehabilitation.html' },

          // Hospital Setup keywords
          { keywords: ['hospital setup','ot setup','operation theatre',
                       'laparoscopy','aed','er','emergency room','surgical setup'],
            url: 'hospital-setup.html' },

          // Other pages
          { keywords: ['about','company','who we are','team'],
            url: 'about.html' },
          { keywords: ['quality','compliance','iso','certification','ce mark'],
            url: 'quality.html' },
          { keywords: ['contact','demo','quote','call','reach'],
            url: 'index.html#contact' },
          { keywords: ['service','support','amc','maintenance'],
            url: 'service-support.html' }
        ];

        function handleSearch(query) {
          const q = query.trim().toLowerCase();
          if (!q) return;

          const match = searchMap.find(item =>
            item.keywords.some(k => q.includes(k) || k.includes(q))
          );

          // Always redirect to a category — NEVER to products.html
          window.location.href = match ? match.url : 'critical-care.html';
        }

        const mobileSearchBar = document.getElementById('mobile-search-bar');
        if (mobileSearchBar) {
            mobileSearchBar.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') handleSearch(this.value);
            });
        }`;

// 1. Completely strip out the old block from `// Unified Search Logic` down to `if (hamburger && mobileMenu)`
// We replace it with newCode
const regexOldUnified = /\/\/\s*Unified Search Logic[\s\S]*?(?=if \(hamburger && mobileMenu\))/;
content = content.replace(regexOldUnified, newCode + '\n\n        ');

// 2. We also need to strip out the old "Simple site search" block which wasn't removed properly earlier
// This block starts at `// Simple site search` and goes down to the end of the `searchBtn` if block.
// Let's replace the `searchBtn` block entirely from `const searchBtn` down to the end of `if (searchBtn && searchBar)` block
const regexOldDesktop = /const searchBtn = document\.getElementById\('nav-search-btn'\);[\s\S]*?\}\);\s*\}/;
const replacementDesktop = `const searchBtn = document.getElementById('nav-search-btn');
        const searchBar = document.getElementById('nav-search-bar');
        const searchInput = document.getElementById('nav-search-input');
        const searchClose = document.getElementById('nav-search-close');

        if (searchBtn && searchBar) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                searchBar.classList.toggle('open');
                if (searchBar.classList.contains('open')) {
                    searchInput.focus();
                }
            });

            if (searchClose) {
                searchClose.addEventListener('click', () => {
                    searchBar.classList.remove('open');
                    searchInput.value = '';
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchBar.classList.contains('open')) {
                    searchBar.classList.remove('open');
                    searchInput.value = '';
                }
            });

            // Desktop search binding
            if (searchInput) {
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') handleSearch(searchInput.value);
                });
            }
        }`;
content = content.replace(regexOldDesktop, replacementDesktop);

fs.writeFileSync('js/header.js', content);
console.log('Search Logic Replaced Successfully!');
