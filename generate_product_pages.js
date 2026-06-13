const fs = require('fs');

const categories = [
    { file: 'critical-care.html', title: 'Critical Care' },
    { file: 'renal-care.html', title: 'Renal Care' },
    { file: 'cardiac-care.html', title: 'Cardiac Care' },
    { file: 'aesthetics.html', title: 'Aesthetics' },
    { file: 'rehabilitation.html', title: 'Rehab & Therapy' },
    { file: 'hospital-setup.html', title: 'Hospital Setup' }
];

const templateHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__PRODUCT_NAME__ | Pulse Medical</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/header.css">
  <link rel="stylesheet" href="css/footer.css">
</head>
<body>

  <div id="global-header"></div>

  <!-- HERO SECTION -->
  <section style="background:#f7f9fc; padding:60px 0 0;">
    <div style="max-width:1200px; margin:0 auto; padding:0 24px;">

      <!-- Breadcrumb -->
      <p style="font-size:13px; color:#888; margin-bottom:32px;">
        <a href="index.html" style="color:#888; text-decoration:none;">HOME</a> ›
        <a href="__CATEGORY_URL__" style="color:#888; text-decoration:none;">__CATEGORY_TITLE__</a> ›
        __PRODUCT_NAME__
      </p>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:60px; align-items:start; padding-bottom:60px;">

        <!-- Left: Product Image -->
        <div style="background:#fff; border-radius:12px; padding:32px; box-shadow:0 2px 12px rgba(0,0,0,0.06); display:flex; justify-content:center; align-items:center;">
          <img src="__PRODUCT_IMG__" alt="__PRODUCT_NAME__" style="width:100%; object-fit:contain; max-height:420px;">
        </div>

        <!-- Right: Product Info -->
        <div>
          <p style="color:#F07C2A; font-size:12px; font-weight:700; letter-spacing:2px; margin-bottom:8px; text-transform:uppercase;">
            __PRODUCT_CATEGORY__
          </p>
          <h1 style="font-size:2rem; color:#0f1f4b; line-height:1.2; margin-bottom:16px;">
            __PRODUCT_NAME__
          </h1>
          <p style="color:#555; font-size:1rem; line-height:1.8; margin-bottom:24px;">
            __PRODUCT_DESC__
          </p>

          <!-- Feature Tags -->
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:32px;">
            __PRODUCT_TAGS__
          </div>

          <!-- CTA Buttons -->
          <div style="display:flex; gap:16px; flex-wrap:wrap;">
            <a href="__CONTACT_LINK__" target="_blank" style="background:#1B2F6E; color:#fff; padding:14px 32px; border-radius:6px; font-weight:600; text-decoration:none; font-size:15px;">
              Contact Us
            </a>
            <a href="#" download style="border:2px solid #1B2F6E; color:#1B2F6E; padding:14px 32px; border-radius:6px; font-weight:600; text-decoration:none; font-size:15px;">
              ↓ Download Brochure
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SPECIFICATIONS TABLE -->
  <section style="padding:60px 0; background:#fff;">
    <div style="max-width:1200px; margin:0 auto; padding:0 24px;">
      <h2 style="color:#0f1f4b; font-size:1.6rem; margin-bottom:32px;">
        Key Specifications
      </h2>
      <table style="width:100%; border-collapse:collapse; font-size:15px; border:1px solid #eee;">
        <tbody>
          __SPEC_ROWS__
        </tbody>
      </table>
    </div>
  </section>

  <!-- BACK LINK -->
  <div style="max-width:1200px; margin:0 auto; padding:0 24px 60px;">
    <a href="__CATEGORY_URL__" style="color:#1B2F6E; font-weight:600; text-decoration:none;">
      ← Back to __CATEGORY_TITLE__
    </a>
  </div>

  <div id="global-footer"></div>
  <script src="js/header.js"></script>
  <script src="js/footer.js"></script>

</body>
</html>`;

function getSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

for (const cat of categories) {
    let content = fs.readFileSync(cat.file, 'utf8');
    
    // Extract PRODUCTS array using regex
    const regex = /const PRODUCTS = (\[[\s\S]*?\]);\s*const PER_PAGE/m;
    const match = content.match(regex);
    if (!match) {
        console.log("Could not find PRODUCTS array in " + cat.file);
        continue;
    }
    
    let products = [];
    try {
        const arrayStr = match[1];
        eval('products = ' + arrayStr);
    } catch (e) {
        console.error("Error evaluating products in " + cat.file + ": " + e);
        continue;
    }

    // Generate individual files
    for (const p of products) {
        const slug = getSlug(p.name);
        const fileName = slug + '.html';
        
        let tagsHtml = p.specs.map(s => '<span style="background:#eef1f6; color:#333; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:500;">' + s + '</span>').join('\n            ');
        
        let specRowsHtml = p.specs.map((s, i) => '          <tr style="background:' + (i % 2 === 0 ? '#f9f9f9' : '#fff') + ';">\n            <td style="padding:16px; border:1px solid #eee; font-weight:500; color:#555;">Feature ' + (i+1) + '</td>\n            <td style="padding:16px; border:1px solid #eee; color:#333;">' + s + '</td>\n          </tr>').join('\n');

        let contactLink = p.link && p.link !== '#' ? p.link : 'https://wa.me/919071101108?text=' + encodeURIComponent('Hi, I am interested in ' + p.name);

        let html = templateHTML
            .replace(/__PRODUCT_NAME__/g, p.name)
            .replace(/__CATEGORY_URL__/g, cat.file)
            .replace(/__CATEGORY_TITLE__/g, cat.title)
            .replace(/__PRODUCT_IMG__/g, p.img)
            .replace(/__PRODUCT_CATEGORY__/g, p.category)
            .replace(/__PRODUCT_DESC__/g, p.desc)
            .replace(/__PRODUCT_TAGS__/g, tagsHtml)
            .replace(/__CONTACT_LINK__/g, contactLink)
            .replace(/__SPEC_ROWS__/g, specRowsHtml);

        fs.writeFileSync(fileName, html);
    }
    
    const oldLinkCode = "'product-detail.html?id='+encodeURIComponent(p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''))";
    const newLinkCode = "p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '.html'";
    
    if (content.includes(oldLinkCode)) {
        content = content.split(oldLinkCode).join(newLinkCode);
        fs.writeFileSync(cat.file, content);
        console.log("Updated links in " + cat.file + " and generated " + products.length + " product pages.");
    } else {
        console.log("Could not find link string to replace in " + cat.file);
    }
}
