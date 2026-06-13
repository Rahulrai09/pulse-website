const fs = require('fs');

const htmlPath = 'c:/Users/DELL/Desktop/pulse-website/life-at-pulse.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// The mobile CSS to add
const mobileCSS = `
  @media (max-width: 640px) {
    /* LEADERSHIP */
    .leader-grid { grid-template-columns: 1fr !important; }
    .leader-card { width: 100% !important; box-sizing: border-box; }
    .leader-img img { object-fit: cover !important; object-position: center top !important; }
    
    /* CULTURE */
    .values-grid { grid-template-columns: 1fr !important; }
    .value-card { width: 100% !important; box-sizing: border-box; }
    
    /* PHOTO STRIP */
    .pulse-photo-strip { padding: 20px 0 !important; }
    .pulse-strip-track {
      display: inline-flex !important;
      animation: marquee-strip 30s linear infinite !important;
    }
    .pulse-strip-track img {
      width: 100vw !important;
      height: auto !important;
      max-height: 300px;
      object-fit: cover;
    }
    
    /* CTA */
    .cta { padding: 60px 20px !important; }
    .cta-btns { flex-direction: column !important; width: 100% !important; }
    .cta-btn-primary, .cta-btn-secondary { width: 100% !important; box-sizing: border-box !important; }
    .roles-dropdown { width: 100% !important; }
    .roles-dropdown-panel { width: 100% !important; min-width: unset !important; left: 0 !important; transform: none !important; }
  }
`;

// Insert the CSS right before </style> in the head
const styleEnd = html.indexOf('</style>');
html = html.substring(0, styleEnd) + mobileCSS + html.substring(styleEnd);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log("Updated life-at-pulse.html");
