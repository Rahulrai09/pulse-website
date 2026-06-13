document.addEventListener('DOMContentLoaded', function() {
    const headerHTML = `
    <!-- ANNOUNCEMENT BAR -->
    <style>
      .ann-bar {
        background: var(--ann-bg, #1e2f6b);
        padding: 9px 5%;
        text-align: center;
        overflow: hidden;
      }
      .ann-track {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex-wrap: nowrap;
        animation: none !important;
      }
    </style>
    <div class="ann-bar">
      <div class="ann-track">
        <span class="ann-item">
          ET: Pulse raises $4M seed round led by 
          3one4 Capital &nbsp;—&nbsp;
          <a href="blog-pulse-4million.html"
             style="color:#E87722;font-weight:700;
                    text-decoration:none;">
            Read More →
          </a>
        </span>
      </div>
    </div>

    <!-- NAV -->
    <nav id="main-nav">
      <a href="index.html" class="nav-logo">
        <img src="image/pulse-logo.png" alt="Pulse">
      </a>
      <ul class="nav-links">
        <li><a href="about.html">About Us</a></li>
        <li><a href="index.html#why-pulse">Why Pulse</a></li>
        <li><a href="index.html#how-it-works">How It Works</a></li>
        <li class="nav-item-mega">
          <a href="#" class="mega-trigger" style="display:flex;align-items:center;">Products <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-left:4px;"><polyline points="6 9 12 15 18 9"/></svg></a>
          <div class="mega-menu">
            <div class="mega-grid">
              <div class="mega-col">
                <h5>BY CATEGORY</h5>
                <ul>
                  <li><a href="critical-care.html">Critical Care</a></li>
                  <li><a href="renal-care.html">Renal Care</a></li>
                  <li><a href="cardiac-care.html">Cardiac Care</a></li>
                  <li><a href="aesthetics.html">Aesthetics</a></li>
                  <li><a href="rehabilitation.html">Rehab &amp; Therapy</a></li>
                  <li><a href="hospital-setup.html">Hospital Setup</a></li>
                </ul>
              </div>
              <div class="mega-col mega-featured">
                <h5>MOST FEATURED PRODUCT</h5>
                <div class="featured-card">
                  <div class="fc-img"><img src="image/PULSE Ventilator.png" alt="Pulse SH320" style="width:100%; height:100%; object-fit:contain;"></div>
                  <h6>Pulse SH320 ICU Ventilator</h6>
                  <a href="product-detail.html" class="fc-link">View Product &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li><a href="quality.html">Quality</a></li>
        <li class="nav-search-wrapper">
          <button class="nav-search-btn" id="nav-search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <div class="nav-search-bar" id="nav-search-bar">
            <input type="text" id="nav-search-input" placeholder="Search products, pages…" autocomplete="off" aria-label="Search site">
            <button class="nav-search-close" id="nav-search-close" aria-label="Close search">&times;</button>
          </div>
        </li>
        <div class="nav-sep"></div>
        <li>
          <a href="#" class="nav-cta" id="nav-contact-btn">Contact Us</a>
          <div class="contact-dropdown" id="nav-contact-dropdown">
            <div class="contact-dropdown-arrow"></div>
            <div class="cd-grid">
              <a href="tel:+919071101108" class="cd-item">
                <div class="cd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <div class="cd-text">
                  <div class="cd-title">Call Us</div>
                  <div class="cd-sub">+91 90711 01108</div>
                </div>
              </a>
              <a href="mailto:Info@pulseio.in" class="cd-item">
                <div class="cd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                <div class="cd-text">
                  <div class="cd-title">Email Us</div>
                  <div class="cd-sub">Info@pulseio.in</div>
                </div>
              </a>
              <a href="#" class="cd-item" id="cd-demo-btn">
                <div class="cd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                <div class="cd-text">
                  <div class="cd-title">Request a Demo</div>
                  <div class="cd-sub">Book a free demo</div>
                </div>
              </a>
              <a href="#" class="cd-item" id="cd-quote-btn">
                <div class="cd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 5v4"/><circle cx="12" cy="3" r="2"/><path d="M6 15v-2a6 6 0 0 1 12 0v2"/></svg></div>
                <div class="cd-text">
                  <div class="cd-title">Get a Quote</div>
                  <div class="cd-sub">Get custom pricing</div>
                </div>
              </a>
            </div>
          </div>
        </li>
      </ul>
      <!-- Hamburger button -->
      <button class="hamburger" id="hamburger-btn" aria-label="Open menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Slide-down mobile menu -->
      <div class="mobile-menu" id="mobileMenu">
        <button class="mobile-menu-close" id="mobile-menu-close">&times;</button>
        <a href="about.html">About Us</a>
        <a href="index.html#why-pulse">Why Pulse</a>
        <a href="index.html#how-it-works">How It Works</a>
        <a href="products.html">Products</a>
        <a href="quality.html">Quality</a>
        <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 10px 0;"></div>
        <a href="tel:+919071101108">Call Support</a>
        <a href="mailto:Info@pulseio.in">Email Us</a>
      </div>
    </nav>
    `;

    const headerContainer = document.getElementById('global-header');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;

        // Nav Scroll Effect
        const nav = document.getElementById('main-nav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Contact Dropdown Toggle
        const contactBtn = document.getElementById('nav-contact-btn');
        const contactDropdown = document.getElementById('nav-contact-dropdown');
        if (contactBtn && contactDropdown) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                contactDropdown.classList.toggle('open');
            });
            document.addEventListener('click', () => {
                contactDropdown.classList.remove('open');
            });
            contactDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Modal triggers in dropdown
        const demoBtn = document.getElementById('cd-demo-btn');
        const quoteBtn = document.getElementById('cd-quote-btn');

        if (demoBtn) {
            demoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                contactDropdown.classList.remove('open');
                const demoModal = document.getElementById('demo-modal-overlay');
                if (demoModal) demoModal.classList.add('open');
            });
        }
        if (quoteBtn) {
            quoteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                contactDropdown.classList.remove('open');
                const quoteModal = document.getElementById('quote-modal-overlay');
                if (quoteModal) quoteModal.classList.add('open');
            });
        }

        // Mobile Menu
        const hamburger = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileClose = document.getElementById('mobile-menu-close');

        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
            });
        }
        if (mobileClose && mobileMenu) {
            mobileClose.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        }
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });

        // ── Inline Search Bar ──
        const searchBtn = document.getElementById('nav-search-btn');
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

            // Simple site search — navigates to matching pages
            const searchablePages = [
                { title: 'About Us', url: 'about.html', keywords: 'about pulse edge company mission' },
                { title: 'Products', url: 'products.html', keywords: 'products ventilators monitors infusion pumps devices' },
                { title: 'Quality', url: 'quality.html', keywords: 'quality certifications iso standards' },
                { title: 'Diagnostic Imaging', url: 'diagnostic-imaging.html', keywords: 'diagnostic imaging x-ray ultrasound mri ct scan' },
                { title: 'OT Surgical', url: 'ot-surgical.html', keywords: 'ot surgical operation theatre lights tables' },
                { title: 'Patient Monitoring', url: 'patient-monitoring.html', keywords: 'patient monitor vital signs ecg spo2' },
                { title: 'Laboratory', url: 'laboratory.html', keywords: 'laboratory lab analyser reagents hematology' },
                { title: 'Critical Care', url: 'critical-care.html', keywords: 'critical care icu ventilator' },
                { title: 'Cardiac Care', url: 'cardiac-care.html', keywords: 'cardiac care ecg defibrillator' },
                { title: 'Rehabilitation', url: 'rehabilitation.html', keywords: 'rehabilitation physiotherapy recovery' },
                { title: 'Renal Care', url: 'renal-care.html', keywords: 'renal care dialysis kidney' },
                { title: 'Aesthetics', url: 'aesthetics.html', keywords: 'aesthetics laser skin cosmetic derma' },
                { title: 'Hospital Setup', url: 'hospital-setup.html', keywords: 'hospital setup turnkey planning' },
                { title: 'News', url: 'news.html', keywords: 'news articles updates press releases' },
                { title: 'Blog', url: 'blog.html', keywords: 'blog pulse insights articles' },
                { title: 'Contact Us', url: 'index.html', keywords: 'contact call email demo quote' },
            ];

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const q = searchInput.value.trim().toLowerCase();
                    if (!q) return;
                    const match = searchablePages.find(p =>
                        p.title.toLowerCase().includes(q) || p.keywords.includes(q)
                    );
                    if (match) {
                        window.location.href = match.url;
                    } else {
                        // Fallback — go to products page with search query
                        window.location.href = 'products.html';
                    }
                }
            });
        }
    }
});
