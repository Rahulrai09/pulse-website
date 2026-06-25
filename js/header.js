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



      /* --- Mobile Banner Fixes --- */

      @media (max-width: 767px) {

        .ann-bar {

          padding: 6px 12px !important;

          min-height: auto !important;

          height: auto !important;

        }

        .ann-track {

          flex-wrap: wrap !important;

          justify-content: center !important;

          align-items: center !important;

          text-align: center !important;

          gap: 4px !important;

          animation: none !important;

        }

        .ann-item, .ann-item a {

          white-space: normal !important;

          overflow: visible !important;

          text-overflow: unset !important;

          font-size: 12px !important;

          line-height: 1.4 !important;

          display: inline !important;

        }

      }

      @media (max-width: 400px) {

        .ann-item, .ann-item a {

          font-size: 11px !important;

        }

      }

      .dropdown-more-btn {

        display: inline-block;

        margin-top: 12px;

        padding: 6px 16px;

        border: 1px solid rgba(255,255,255,0.4);

        border-radius: 4px;

        color: #ffffff;

        font-size: 13px;

        text-decoration: none;

        transition: background 0.2s;

      }

      .dropdown-more-btn:hover {

        background: rgba(255,255,255,0.1);

      }

      

      @media (max-width: 768px) {

        .mobile-search-item { display: none !important; }

        .mob-search-btn {

          display: flex;

          align-items: center;

          justify-content: center;

          background: none;

          border: none;

          cursor: pointer;

          padding: 6px;

          color: #fff;

        }

        .mob-search-overlay {

          display: none;

          position: absolute;

          top: 100%; left: 0; right: 0;

          background: #1B2F6E;

          padding: 14px 16px;

          z-index: 9999;

          align-items: center;

          gap: 10px;

        }

        .mob-search-overlay.open { display: flex; }

        .mob-search-overlay input {

          flex: 1;

          padding: 10px 14px;

          border-radius: 6px;

          border: none;

          font-size: 15px;

          outline: none;

        }

        .mob-search-overlay button {

          background: none;

          border: none;

          color: #fff;

          font-size: 22px;

          cursor: pointer;

          padding: 4px 8px;

        }

      }

      @media (min-width: 769px) {

        .mobile-search-item { display: none !important; }

        .mob-search-btn { display: none !important; }

        .mob-search-overlay { display: none !important; }

      }

      .contact-modal-overlay { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; align-items:center; justify-content:center; }

      .contact-modal-overlay.open { display:flex; }

      .contact-modal { background:#fff; border-radius:12px; padding:40px; width:90%; max-width:480px; position:relative; }

      .contact-modal h2 { font-size:1.4rem; font-weight:700; color:#1c2b5e; margin-bottom:8px; }

      .contact-modal p { color:#666; font-size:0.9rem; margin-bottom:24px; }

      .contact-modal input { width:100%; padding:12px 16px; border:1px solid #ddd; border-radius:8px; margin-bottom:16px; font-size:0.95rem; font-family:'Inter',sans-serif; box-sizing:border-box; }

      .contact-modal input:focus { outline:none; border-color:#1c2b5e; }

      .contact-modal .submit-btn { width:100%; padding:14px; background:#1c2b5e; color:#fff; border:none; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer; }

      .contact-modal .submit-btn:hover { background:#F07C2A; }

      .contact-modal .whatsapp-btn { display:none; width:100%; padding:14px; background:#25D366; color:#fff; border:none; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer; margin-top:12px; text-align:center; text-decoration:none; }

      .contact-modal .whatsapp-btn.show { display:block; }

      .contact-modal-close { position:absolute; top:16px; right:20px; font-size:1.4rem; cursor:pointer; color:#999; background:none; border:none; }

      .contact-success { display:none; text-align:center; padding:20px 0; }

      .contact-success.show { display:block; }

      .contact-form-fields.hide { display:none; }

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

      <nav id="main-nav" style="position:relative;">

      <a href="index.html" class="nav-logo">

        <img src="image/pulse-logo.png" alt="Pulse">

      </a>

      <ul class="nav-links">

        <li><a href="about.html">About Us</a></li>

        <li><a href="index.html#why-pulse">Why Pulse</a></li>

        <li><a href="index.html#excellence">How It Works</a></li>

        <li class="nav-item-mega" id="products-mega-li">

          <a href="#" class="mega-trigger" style="display:flex;align-items:center;">Products <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-left:4px;"><polyline points="6 9 12 15 18 9"/></svg></a>

          <div class="mega-menu" id="products-mega-menu">

            <div class="products-dropdown">

              <!-- COLUMN 1: Categories -->

              <div class="col-categories">

                <p class="col-label">BY CATEGORY</p>

                <div class="category-row active" data-cat="Critical Care" data-href="critical-care.html">

                  <a href="critical-care.html" class="category-name">Critical Care</a>

                  <span class="chevron">&#8964;</span>

                </div>

                <div class="category-row" data-cat="Renal Care" data-href="renal-care.html">

                  <a href="renal-care.html" class="category-name">Renal Care</a>

                  <span class="chevron">&#8964;</span>

                </div>

                <div class="category-row" data-cat="Cardiac Care" data-href="cardiac-care.html">

                  <a href="cardiac-care.html" class="category-name">Cardiac Care</a>

                  <span class="chevron">&#8964;</span>

                </div>

                <div class="category-row" data-cat="Surgical" data-href="surgical.html">

                  <a href="surgical.html" class="category-name">Surgical</a>

                  <span class="chevron">&#8964;</span>

                </div>

                <div class="category-row" data-cat="Aesthetics" data-href="aesthetics.html">

                  <a href="aesthetics.html" class="category-name">Aesthetics</a>

                  <span class="chevron">&#8964;</span>

                </div>

                <div class="category-row" data-cat="Rehabilitation" data-href="rehabilitation.html">

                  <a href="rehabilitation.html" class="category-name">Rehabilitation</a>

                  <span class="chevron">&#8964;</span>

                </div>

                <div class="category-row" data-cat="Hospital Setup" data-href="hospital-setup.html">

                  <a href="hospital-setup.html" class="category-name">Hospital Setup</a>

                  <span class="chevron">&#8964;</span>

                </div>

              </div>

              <!-- COLUMN 2: Sub-products flyout -->

              <div class="col-products" id="mega-col-products">

                <p class="col-label" id="mega-col-products-label">CRITICAL CARE</p>

                <a href="product-detail.html?id=sh320" class="sub-product-link dropdown-product-link" data-image="image/PULSE Ventilator.png" data-label="Pulse SH320 ICU Ventilator">&#8594; Pulse SH320 ICU Ventilator</a>

                <a href="product-detail.html?id=patient-monitor" class="sub-product-link dropdown-product-link" data-image="image/Portfolio/critical-care.jpg" data-label="Patient Monitor Pro">&#8594; Patient Monitor Pro</a>

                <a href="product-detail.html?id=infusion-pump" class="sub-product-link dropdown-product-link" data-image="image/Portfolio/critical-care.jpg" data-label="Infusion Pump Series">&#8594; Infusion Pump Series</a>

                <a href="product-detail.html?id=anaesthesia" class="sub-product-link dropdown-product-link" data-image="image/Portfolio/critical-care.jpg" data-label="Anaesthesia Workstation">&#8594; Anaesthesia Workstation</a>

                <a href="product-detail.html?id=syringe-pump" class="sub-product-link dropdown-product-link" data-image="image/Portfolio/critical-care.jpg" data-label="Syringe Pump">&#8594; Syringe Pump</a>

                <a href="critical-care.html" class="dropdown-more-btn">More &rarr;</a>

              </div>

              <!-- COLUMN 3: Featured product -->

              <div class="col-featured">

                <p class="col-label">MOST FEATURED PRODUCT</p>

                <div class="featured-card">

                  <div class="fc-img"><img src="image/Hospital Furniture/OT Light - Four Reflector (SingleDouble).png" alt="OT Light — Four Reflector" style="width:100%; height:100%; object-fit:contain;" class="featured-product-img"></div>

                  <h6 class="featured-product-label" style="color: #ffffff;">OT Light — Four Reflector</h6>

                  <a href="critical-sh320-ventilator.html" class="fc-link">View Product &rarr;</a>

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

              <a href="https://wa.me/919071101108" target="_blank" rel="noopener noreferrer" class="cd-item">

                <div class="cd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>

                <div class="cd-text">

                  <div class="cd-title">Call Us</div>

                  <div class="cd-sub">+91 90711 01108</div>

                </div>

              </a>

              <a href="https://mail.google.com/mail/?view=cm&to=Info@pulseio.in" target="_blank" rel="noopener noreferrer" class="cd-item">

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

      <div style="display:flex;align-items:center;gap:4px;margin-left:auto;">

        <!-- Mobile search icon -->

        <button class="mob-search-btn" id="mob-search-btn" aria-label="Search">

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

        </button>

        <!-- Hamburger button -->

        <button class="hamburger" id="hamburger-btn" aria-label="Open menu">

          <span></span>

          <span></span>

          <span></span>

        </button>

      </div>



      <!-- Slide-down mobile menu -->

      <div class="mobile-menu" id="mobileMenu">

        <button class="mobile-menu-close" id="mobile-menu-close">&times;</button>

        <a href="about.html">About Us</a>

        <a href="index.html#why-pulse">Why Pulse</a>

        <a href="index.html#excellence">How It Works</a>

        <div class="mob-nav-item">

          <button class="mob-products-toggle" id="mob-products-toggle" aria-expanded="false">

            Products

            <span class="mob-chevron">&#8964;</span>

          </button>

          <div class="mob-products-submenu" id="mobProductsMenu">

            <a href="critical-care.html">Critical Care</a>

            <a href="renal-care.html">Renal Care</a>

            <a href="cardiac-care.html">Cardiac Care</a>

            <a href="aesthetics.html">Aesthetics</a>

             <a href="rehabilitation.html">Rehabilitation</a>

            <a href="hospital-setup.html">Hospital Setup</a>

          </div>

        </div>

        <a href="quality.html">Quality</a>

        <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 10px 0;"></div>

        <a href="https://wa.me/919071101108" target="_blank" rel="noopener noreferrer">Call Support</a>

        <a href="https://mail.google.com/mail/?view=cm&to=Info@pulseio.in" target="_blank" rel="noopener noreferrer">Email Us</a>

      </div>



      <!-- Mobile search overlay -->

      <div class="mob-search-overlay" id="mob-search-overlay">

        <input type="text" id="mob-search-input" placeholder="Search products, pages…" autocomplete="off">

        <button id="mob-search-close" aria-label="Close">&times;</button>

      </div>

    <div class="contact-modal-overlay" id="contact-modal-overlay">

      <div class="contact-modal">

        <button class="contact-modal-close" id="contact-modal-close">&times;</button>

        <h2>Get in Touch</h2>

        <p>Fill the form below and we'll connect with you on WhatsApp.</p>

        <div class="contact-form-fields" id="contact-form-fields">

          <input type="text" id="cf-name" placeholder="Your Name *" required />

          <input type="tel" id="cf-contact" placeholder="Contact Number *" required />



          <button class="submit-btn" id="cf-submit">Submit</button>

        </div>

        <div class="contact-success" id="contact-success">

          <p style="color:#1c2b5e;font-weight:600;font-size:1.1rem;">Thank you! We received your details.</p>

          <p style="color:#666;font-size:0.9rem;">Click below to chat with us on WhatsApp.</p>

          <a class="whatsapp-btn show" id="cf-whatsapp-btn" href="#" target="_blank">&#128172; Chat on WhatsApp</a>

        </div>

      </div>

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



        // -- PRODUCTS MEGA MENU: Category hover logic --

        const categoryData = {

          "Critical Care": {

                    "label": "CRITICAL CARE",

                    "products": [

                              {

                                        "name": "SH320 ICU Ventilator",

                                        "image": "image/PULSE Ventilator.png",

                                        "href": "critical-sh320-ventilator.html"

                              },

                              {

                                        "name": "Anesthesia Workstation",

                                        "image": "image/Critical%20care/anesthesia-workstation-transparent.png",

                                        "href": "critical-anesthesia-workstation.html"

                              },

                              {

                                        "name": "Vital ZEC3 ECG Machine",

                                        "image": "image/Critical%20care/ecg-machine-3-channel-transparent.png",

                                        "href": "critical-vital-zec3.html"

                              },

                              {

                                        "name": "Vital ZEC6 ECG Machine",

                                        "image": "image/Critical%20care/6-channel-ecg-machine-transparent.png",

                                        "href": "critical-vital-zec6.html"

                              },

                              {

                                        "name": "Vital ZEC12 ECG Machine",

                                        "image": "image/Critical%20care/12-channel-ecg-machine-transparent.png",

                                        "href": "critical-vital-zec12.html"

                              },

                              {

                                        "name": "Vital ZPM5 Patient Monitor",

                                        "image": "image/Critical%20care/patient-monitor-transparent.png",

                                        "href": "critical-vital-zpm5.html"

                              },

                              {

                                        "name": "Vital ZPM7 Patient Monitor",

                                        "image": "image/Critical%20care/7-para-patient-monitor-transparent.png",

                                        "href": "critical-vital-zpm7.html"

                              },

                              {

                                        "name": "Vital ZIP1 Infusion Pump",

                                        "image": "image/Critical%20care/infusion-pump-transparent.png",

                                        "href": "critical-vital-zip1.html"

                              },

                              {

                                        "name": "Vital ZSP1 Syringe Pump",

                                        "image": "image/Critical%20care/syringe-pump-transparent.png",

                                        "href": "critical-vital-zsp1.html"

                              }

                    ]

          },

          "Renal Care": {

                    "label": "RENAL CARE",

                    "products": [

                              {

                                        "name": "PDM-6000",

                                        "image": "image/Renal%20care/pdm-6000-precision-haemodialysis-system-transparent.png",

                                        "href": "renal-pdm-6000.html"

                              },

                              {

                                        "name": "PD-Canova",

                                        "image": "image/Renal%20care/pd-canova-transparent.png",

                                        "href": "renal-pd-canova.html"

                              },

                              {

                                        "name": "PD-Linepro",

                                        "image": "image/Renal%20care/pd-linepro-transparent.png",

                                        "href": "renal-pd-linepro.html"

                              },

                              {

                                        "name": "Dialysers",

                                        "image": "image/Renal%20care/dialysers-transparent.png",

                                        "href": "renal-dialysers.html"

                              },

                              {

                                        "name": "PD-Cath",

                                        "image": "image/Renal%20care/pd-cath-transparent.png",

                                        "href": "renal-pd-cath.html"

                              },

                              {

                                        "name": "PD-TP",

                                        "image": "image/Renal%20care/pd-tp-transparent.png",

                                        "href": "renal-pd-tp.html"

                              }

                    ]

          },

          "Cardiac Care": {

                    "label": "CARDIAC CARE",

                    "products": [

                              {

                                        "name": "Optima Inflation Device Kit",

                                        "image": "image/Cardiac%20care/Optima%20Inflation%20Device%20Kit.png",

                                        "href": "cardiac-optima-inflation-kit.html"

                              },

                              {

                                        "name": "Optima Manifolds",

                                        "image": "image/Cardiac%20care/Optima%20Manifolds.png",

                                        "href": "cardiac-optima-manifolds.html"

                              },

                              {

                                        "name": "AcuSafe Blunt Needle System",

                                        "image": "image/Cardiac%20care/AcuSafe%20Blunt%20Needle%20Access%20System.png",

                                        "href": "cardiac-acusafe-blunt-needle.html"

                              },

                              {

                                        "name": "Sirova Sirolimus Stent",

                                        "image": "image/Cardiac%20care/Sirova%20Sirolimus%20Stent.png",

                                        "href": "cardiac-sirova-stent.html"

                              },

                              {

                                        "name": "Evera Everolimus Stent",

                                        "image": "image/Cardiac%20care/Evera%20Everolimus%20Stent.png",

                                        "href": "cardiac-evera-stent.html"

                              },

                              {

                                        "name": "GuideX Guidewires",

                                        "image": "image/Cardiac%20care/GuideX%20Guidewires.png",

                                        "href": "cardiac-guidex-guidewires.html"

                              },

                              {

                                        "name": "AcuSafe Micro-Access Kits",

                                        "image": "image/Cardiac%20care/AcuSafe%20Micro-Access%20Introducer%20Kits.png",

                                        "href": "cardiac-acusafe-micro-access.html"

                              }

                    ]

          },

          "Surgical": {

                    "label": "SURGICAL",

                    "products": [

                              {

                                        "name": "CircumEase Stapler",

                                        "image": "image/Circumease/circumease-3.jpg",

                                        "href": "surgical-circumease-stapler.html"

                              }

                    ]

                  },

          "Aesthetics": {

                    "label": "AESTHETICS",

                    "products": [

                              {

                                        "name": "Wavelength Pro X",

                                        "image": "image/Aesthetics%20images/wavelength-pro-x-transparent.png",

                                        "href": "aesthetics-wavelength-pro-x.html"

                              },

                              {

                                        "name": "Pi-Code",

                                        "image": "image/Aesthetics%20images/pi-code-transparent.png",

                                        "href": "aesthetics-pi-code.html"

                              },

                              {

                                        "name": "Code Factor",

                                        "image": "image/Aesthetics%20images/code-factor-transparent.png",

                                        "href": "aesthetics-code-factor.html"

                              },

                              {

                                        "name": "Nodd",

                                        "image": "image/Aesthetics%20images/nodd-transparent.png",

                                        "href": "aesthetics-nodd.html"

                              },

                              {

                                        "name": "HYDRAFRAC",

                                        "image": "image/Aesthetics%20images/hydrafrac-transparent.png",

                                        "href": "aesthetics-hydrafrac.html"

                              },

                              {

                                        "name": "Cool Shape",

                                        "image": "image/Aesthetics%20images/cool-shape-transparent.png",

                                        "href": "aesthetics-cool-shape.html"

                              },

                              {

                                        "name": "Em Code",

                                        "image": "image/Aesthetics%20images/em-code-transparent.png",

                                        "href": "aesthetics-em-code.html"

                              },

                              {

                                        "name": "Bbl Super IPL+DPL",

                                        "image": "image/Aesthetics%20images/bbl-super-ipl-dpl-transparent.png",

                                        "href": "aesthetics-bbl-super-ipl-dpl.html"

                              },

                              {

                                        "name": "Visage",

                                        "image": "image/Aesthetics%20images/visage-transparent.png",

                                        "href": "aesthetics-visage.html"

                              },

                              {

                                        "name": "Excimer",

                                        "image": "image/Aesthetics%20images/excimer-transparent.png",

                                        "href": "aesthetics-excimer.html"

                              },

                              {

                                        "name": "Em-Ma",

                                        "image": "image/Aesthetics%20images/em-ma-transparent.png",

                                        "href": "aesthetics-em-ma.html"

                              },

                              {

                                        "name": "Skin Analyzer",

                                        "image": "image/Aesthetics%20images/skin-analyzer-transparent.png",

                                        "href": "aesthetics-skin-analyzer.html"

                              }

                    ]

          },

          "Rehabilitation": {

                    "label": "REHABILITATION",

                    "products": [

                              {

                                        "name": "Pulse Motion Pro 1 Electric Wheelchair",

                                        "image": "image/Rehabiliation/6001 Motion Pro 1.png",

                                        "href": "rehab-motion-pro-6001.html"

                              },

                              {

                                        "name": "Pulse Xtrion Electric Wheelchair",

                                        "image": "image/Rehabiliation/6013A xtrion.png",

                                        "href": "rehab-xtrion-6013a.html"

                              },

                              {

                                        "name": "Pulse Innovax Electric Wheelchair",

                                        "image": "image/Rehabiliation/6016A Innovax.png",

                                        "href": "rehab-innovax-6016a.html"

                              },

                              {

                                        "name": "Pulse Aerodrive 1 Electric Wheelchair",

                                        "image": "image/Rehabiliation/6019 Aerodrive 1.png",

                                        "href": "rehab-aerodrive-6019.html"

                              },

                              {

                                        "name": "Pulse Joylite 1 Electric Wheelchair",

                                        "image": "image/Rehabiliation/9005 Joylite 1.png",

                                        "href": "rehab-joylite-9005.html"

                              },

                              {

                                        "name": "Pulse Joylite 2 Electric Wheelchair",

                                        "image": "image/Rehabiliation/9006 Joylite 2.png",

                                        "href": "rehab-joylite-9006.html"

                              },

                              {

                                        "name": "Autofold Smartride 2 Electric Wheelchair",

                                        "image": "image/Rehabiliation/Autofold Smartride 2.png",

                                        "href": "rehab-autofold-smartride.html"

                              }

                    ]

          },

          "Hospital Setup": {

                    "label": "HOSPITAL SETUP",

                    "products": [

                              {

                                        "name": "ICU Bed — Five Functional Electric",

                                        "image": "image/Hospital Furniture/ChatGPT Image May 28, 2026, 04_09_07 PM.png",

                                        "href": "hospital-icu-bed-5func-electric-deluxe.html"

                              },

                              {

                                        "name": "Modular Operation Theatre",

                                        "image": "image/Hospital Furniture/Modular ot theatre.png",

                                        "href": "hospital-modular-ot.html"

                              },

                              {

                                        "name": "OT Light — Four Reflector",

                                        "image": "image/Hospital Furniture/OT Light - Four Reflector (SingleDouble).png",

                                        "href": "hospital-ot-light-four-reflector.html"

                              },

                              {

                                        "name": "OT Light — Premium Globus Dome",

                                        "image": "image/Hospital Furniture/OT Light - Premium Globus Dome.png",

                                        "href": "hospital-ot-light-globus-dome.html"

                              },

                              {

                                        "name": "OT Examination Light",

                                        "image": "image/Hospital Furniture/OT Examination Light.png",

                                        "href": "hospital-ot-examination-light.html"

                              },

                              {

                                        "name": "Medical Gas Pipeline System",

                                        "image": "image/Hospital Furniture/ChatGPT Image May 28, 2026, 04_10_39 PM.png",

                                        "href": "hospital-medical-gas-pipeline.html"

                              }

                    ]

          }

};



        const colProductsEl = document.getElementById('mega-col-products');

        const colProductsLabelEl = document.getElementById('mega-col-products-label');

        const categoryRows = document.querySelectorAll('.category-row');

        const megaLi = document.getElementById('products-mega-li');



        function setActiveCategory(catName) {

            const data = categoryData[catName];

            if (!data || !colProductsEl || !colProductsLabelEl) return;

            

            let catHref = '#';

            categoryRows.forEach(row => {

                row.classList.toggle('active', row.dataset.cat === catName);

                if (row.dataset.cat === catName) catHref = row.dataset.href;

            });

            

            colProductsLabelEl.textContent = data.label;

            colProductsEl.querySelectorAll('.sub-product-link, .dropdown-more-btn').forEach(l => l.remove());

            data.products.forEach(p => {

                const a = document.createElement('a');

                a.href = p.href;

                a.className = 'sub-product-link dropdown-product-link';

                

                a.dataset.image = p.image || ('image/Portfolio/' + catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') + '.jpg');

                a.dataset.label = p.name;

                a.textContent = '\u2192 ' + p.name;

                

                a.addEventListener('mouseenter', function () {

                    const img   = document.querySelector('.featured-product-img');

                    const label = document.querySelector('.featured-product-label');

                    const link  = document.querySelector('.fc-link');

                    if (img   && this.dataset.image) img.src         = this.dataset.image;

                    if (label && this.dataset.label) label.textContent = this.dataset.label;

                    if (link) link.href = p.href;

                });

                

                colProductsEl.appendChild(a);

            });

            

            const moreBtn = document.createElement('a');

            moreBtn.href = catHref;

            moreBtn.className = 'dropdown-more-btn';

            moreBtn.innerHTML = 'More &rarr;';

            colProductsEl.appendChild(moreBtn);

            colProductsEl.style.animation = 'none';

            colProductsEl.offsetHeight;

            colProductsEl.style.animation = '';

        }



        if (categoryRows.length && colProductsEl) {

            categoryRows.forEach(row => {

                row.addEventListener('mouseenter', () => {

                    setActiveCategory(row.dataset.cat);

                    const firstLink = colProductsEl.querySelector('.sub-product-link');

                    if (firstLink) {

                        const img = document.querySelector('.featured-product-img');

                        const label = document.querySelector('.featured-product-label');

                        const link = document.querySelector('.fc-link');

                        if (img) img.src = firstLink.dataset.image;

                        if (label) label.textContent = firstLink.dataset.label;

                        if (link) link.href = firstLink.getAttribute('href');

                    }

                });

            });

            

            // Initialize default state to Critical Care on page load

            setActiveCategory('Critical Care');

            const firstLink = colProductsEl.querySelector('.sub-product-link');

            if (firstLink) {

                const img = document.querySelector('.featured-product-img');

                const label = document.querySelector('.featured-product-label');

                const link = document.querySelector('.fc-link');

                if (img) img.src = firstLink.dataset.image;

                if (label) label.textContent = firstLink.dataset.label;

                if (link) link.href = firstLink.getAttribute('href');

            }

        }



        // Delayed hover dropdown toggle logic for Products Mega Menu

        const megaTrigger = megaLi ? megaLi.querySelector('.mega-trigger') : null;

        const megaMenu = document.getElementById('products-mega-menu');

        let hideTimer;



        const showDropdown = () => {

            clearTimeout(hideTimer);

            if (megaLi) megaLi.classList.add('open');

        };



        const hideDropdown = () => {

            if (megaLi) {

                megaLi.classList.remove('open');

                setActiveCategory('Critical Care'); // Reset active category when menu closes

            }

        };



        if (megaTrigger && megaMenu) {

            megaTrigger.addEventListener('mouseenter', showDropdown);

            megaTrigger.addEventListener('mouseleave', () => {

                hideTimer = setTimeout(hideDropdown, 150);

            });

            megaMenu.addEventListener('mouseenter', showDropdown);

            megaMenu.addEventListener('mouseleave', () => {

                hideTimer = setTimeout(hideDropdown, 150);

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



        // Unified Search Logic

const searchMap = [

  // ── PRODUCT-LEVEL SEARCH ENTRIES ────────────────

  // CRITICAL CARE PRODUCTS

  { keywords: ['ventilator','sh320','icu ventilator','sh-320','breathing machine','turbine ventilator','pulse ventilator'], url: 'critical-sh320-ventilator.html' },

  { keywords: ['anesthesia workstation','anaesthesia workstation','anesthesia machine','anaesthesia machine','a-station'], url: 'critical-anesthesia-workstation.html' },

  { keywords: ['zec3','ecg 3 channel','3 channel ecg','ecg machine 3','vital zec3'], url: 'critical-vital-zec3.html' },

  { keywords: ['zec6','ecg 6 channel','6 channel ecg','ecg machine 6','vital zec6'], url: 'critical-vital-zec6.html' },

  { keywords: ['zec12','ecg 12 channel','12 channel ecg','12 lead ecg','ecg machine 12','vital zec12'], url: 'critical-vital-zec12.html' },

  { keywords: ['zpm5','patient monitor 5','5 para monitor','5 parameter monitor','vital zpm5'], url: 'critical-vital-zpm5.html' },

  { keywords: ['zpm7','patient monitor 7','7 para monitor','7 parameter monitor','vital zpm7'], url: 'critical-vital-zpm7.html' },

  { keywords: ['zip1','infusion pump','iv pump','volumetric pump','vital zip1'], url: 'critical-vital-zip1.html' },

  { keywords: ['zsp1','syringe pump','vital zsp1'], url: 'critical-vital-zsp1.html' },



  // RENAL CARE PRODUCTS

  { keywords: ['dialyser','dialysers','high efficiency dialyser','toxin removal'], url: 'renal-dialysers.html' },

  { keywords: ['canova','av fistula needle','fistula needle','pd canova'], url: 'renal-pd-canova.html' },

  { keywords: ['pd cath','haemodialysis catheter','pd-cath','dialysis catheter'], url: 'renal-pd-cath.html' },

  { keywords: ['linepro','pd linepro','blood tubing set','blood circuit'], url: 'renal-pd-linepro.html' },

  { keywords: ['pd tp','transducer protector','tp transducer','pd-tp'], url: 'renal-pd-tp.html' },

  { keywords: ['pdm 6000','pdm-6000','haemodialysis system','dialysis machine','precision haemodialysis'], url: 'renal-pdm-6000.html' },



  // CARDIAC CARE PRODUCTS

  { keywords: ['sirova','sirolimus stent','sirolimus eluting stent'], url: 'cardiac-sirova-stent.html' },

  { keywords: ['evera','everolimus stent','everolimus eluting stent'], url: 'cardiac-evera-stent.html' },

  { keywords: ['guidex','guidex guidewire','coronary guidewire'], url: 'cardiac-guidex-guidewires.html' },

  { keywords: ['optima inflation','inflation kit','inflation device kit','optima inflation kit'], url: 'cardiac-optima-inflation-kit.html' },

  { keywords: ['optima manifold','cardiac manifold','optima manifolds'], url: 'cardiac-optima-manifolds.html' },

  { keywords: ['acusafe blunt needle','blunt needle access','cardiac blunt needle'], url: 'cardiac-acusafe-blunt-needle.html' },

  { keywords: ['micro access introducer','acusafe micro access','micro access kit'], url: 'cardiac-acusafe-micro-access.html' },

  { keywords: ['introducer kits venous','venous access kit','acusafe introducer'], url: 'cardiac-acusafe-introducer-kits.html' },

  { keywords: ['aed','swm11089','automatic external defibrillator','aed device'], url: 'cardiac-aed-swm11089.html' },

  { keywords: ['defibrillator monitor','swm11090','cardiac defibrillator','manual defibrillator'], url: 'cardiac-defibrillator-monitor-swm11090.html' },

  { keywords: ['optima pressure monitoring','pressure monitoring lines'], url: 'optima-pressure-monitoring-lines.html' },

  { keywords: ['ptca kit','y connector','y-connector set','ptca y connector'], url: 'optima-ptca-kit-y-connector-set.html' },

  { keywords: ['radial compression band','radial artery compression','compression band'], url: 'optima-radial-artery-compression-band.html' },

  { keywords: ['high pressure injection','1200psi','injection lines'], url: 'high-pressure-injection-lines-1200psi.html' },

  { keywords: ['acusafe iv catheter','iv cannula','iv catheter cannula'], url: 'acusafe-iv-catheter-cannula.html' },



  // AESTHETICS PRODUCTS

  { keywords: ['bbl','super ipl','dpl','ipl dpl','bbl super'], url: 'aesthetics-bbl-super-ipl-dpl.html' },

  { keywords: ['code factor','codefactor'], url: 'aesthetics-code-factor.html' },

  { keywords: ['cool shape','coolshape','cryolipolysis machine'], url: 'aesthetics-cool-shape.html' },

  { keywords: ['em code','emcode'], url: 'aesthetics-em-code.html' },

  { keywords: ['em ma','emma'], url: 'aesthetics-em-ma.html' },

  { keywords: ['excimer','excimer laser'], url: 'aesthetics-excimer.html' },

  { keywords: ['hydrafrac','hydra frac'], url: 'aesthetics-hydrafrac.html' },

  { keywords: ['laser machine range','aesthetics laser'], url: 'aesthetics-laser-machine-range.html' },

  { keywords: ['nodd'], url: 'aesthetics-nodd.html' },

  { keywords: ['pi code','picode'], url: 'aesthetics-pi-code.html' },

  { keywords: ['skin analyzer','skin analyser'], url: 'aesthetics-skin-analyzer.html' },

  { keywords: ['visage'], url: 'aesthetics-visage.html' },

  { keywords: ['wavelength pro','wavelength pro x'], url: 'aesthetics-wavelength-pro-x.html' },

  { keywords: ['body contouring system','contouring system'], url: 'body-contouring-systems.html' },

  { keywords: ['hair restoration system','hair restoration'], url: 'hair-restoration-systems.html' },

  { keywords: ['skin rejuvenation','rejuvenation device'], url: 'skin-rejuvenation-devices.html' },



  // REHABILITATION PRODUCTS

  { keywords: ['aerodrive wheelchair','aerodrive 6019','aerodrive'], url: 'rehab-aerodrive1-wheelchair.html' },

  { keywords: ['autofold smartride','smartride wheelchair','autofold'], url: 'rehab-autofold-smartride2-wheelchair.html' },

  { keywords: ['innovax','innovax wheelchair'], url: 'rehab-innovax-6016a.html' },

  { keywords: ['joylite wheelchair','joylite 9005','joylite'], url: 'rehab-joylite1-wheelchair.html' },

  { keywords: ['motion pro wheelchair','motionpro','motion pro 6001'], url: 'rehab-motionpro1-wheelchair.html' },

  { keywords: ['xtrion wheelchair','xtrion 6013'], url: 'rehab-xtrion-6013a.html' },

  { keywords: ['cervtract','traction unit','cervical traction unit'], url: 'pulse-cervtract-traction-unit.html' },

  { keywords: ['combistim','4 channel stimulator','neuromuscular stimulator'], url: 'pulse-combistim-4-channel.html' },

  { keywords: ['kneeflex','cpm machine','knee cpm','continuous passive motion'], url: 'pulse-kneeflex-cpm-machine.html' },

  { keywords: ['rollator walker','rollator','pulse rollator'], url: 'pulse-rollator-walker.html' },

  { keywords: ['softlaser','soft laser','830nm laser'], url: 'pulse-softlaser-830nm.html' },

  { keywords: ['us therapy','ultrasound therapy','3mhz therapy','physiotherapy ultrasound'], url: 'pulse-us-therapy-3mhz.html' },

  { keywords: ['folding wheelchair with cushion'], url: 'folding-wheelchair-with-cushion.html' },



  // HOSPITAL SETUP PRODUCTS

  { keywords: ['icu bed 3 function','3 function electric bed','3 func icu bed'], url: 'hospital-icu-bed-3func-electric.html' },

  { keywords: ['icu bed 5 function deluxe','5 func deluxe icu bed'], url: 'hospital-icu-bed-5func-electric-deluxe.html' },

  { keywords: ['icu bed 5 function premium','5 func premium icu bed'], url: 'hospital-icu-bed-5func-electric-premium.html' },

  { keywords: ['manual icu bed','5 func manual deluxe','manual icu'], url: 'hospital-icu-bed-5func-manual-deluxe.html' },

  { keywords: ['fowler bed electric','electric fowler bed'], url: 'hospital-fowler-bed-electric.html' },

  { keywords: ['semi fowler electric','semi fowler bed'], url: 'hospital-semi-fowler-electric.html' },

  { keywords: ['lite fowler','lite fowler ms bed'], url: 'lite-fowler-ms-bed.html' },

  { keywords: ['ldrp bed','labour delivery recovery'], url: 'ldrp-bed.html' },

  { keywords: ['lite ldrp bed'], url: 'lite-ldrp-bed.html' },

  { keywords: ['pediatric bed','paediatric bed'], url: 'pediatric-bed.html' },

  { keywords: ['plus lite semi fowler pp','pp bed'], url: 'plus-lite-semi-fowler-pp-bed.html' },

  { keywords: ['electric bed sideboards','icu bed sideboards'], url: 'electric-bed-with-sideboards-icu-range.html' },

  { keywords: ['manual bed sideboards'], url: 'manual-bed-with-sideboards-icu-range.html' },

  { keywords: ['delivery table hydraulic','hydraulic delivery table'], url: 'hospital-delivery-table-hydraulic.html' },

  { keywords: ['delivery table electric','electric delivery table'], url: 'hospital-delivery-table-electric-manual.html' },

  { keywords: ['stretcher trolley','hospital stretcher'], url: 'hospital-stretcher-trolley-ms-ss.html' },

  { keywords: ['autoclave','sterilizer','hospital autoclave'], url: 'hospital-autoclaves-sterilizers.html' },

  { keywords: ['modular ot','modular operation theatre'], url: 'hospital-modular-ot.html' },

  { keywords: ['ot light premium camera','camera ot light'], url: 'hospital-ot-light-premium-camera.html' },

  { keywords: ['four reflector ot light','4 reflector ot light'], url: 'hospital-ot-light-four-reflector.html' },

  { keywords: ['globus dome ot light','globus dome'], url: 'hospital-ot-light-globus-dome.html' },

  { keywords: ['butterfly ot light'], url: 'butterfly-ot-light.html' },

  { keywords: ['double dome ot light'], url: 'double-dome-ot-light.html' },

  { keywords: ['single dome ot light'], url: 'single-dome-ot-light.html' },

  { keywords: ['examination light','ot examination light'], url: 'hospital-ot-examination-light.html' },

  { keywords: ['c-arm ot table','c arm table','carm ot table'], url: 'hospital-ot-table-carm-hydraulic.html' },

  { keywords: ['electric ot table','electric manual ot table'], url: 'hospital-ot-table-electric-manual-deluxe.html' },

  { keywords: ['hydraulic ot table','general hydraulic ot table'], url: 'hospital-ot-table-general-hydraulic.html' },

  { keywords: ['crash cart','ss crash cart'], url: 'hospital-crash-cart.html' },

  { keywords: ['emergency trolley','hydraulic emergency trolley'], url: 'hospital-emergency-trolley-hydraulic.html' },

  { keywords: ['rapid neo ert','ert trolley','emergency response trolley'], url: 'rapid-neo-ert-emergency-response-trolley.html' },

  { keywords: ['emergency cart'], url: 'emergency-cart.html' },

  { keywords: ['baby warmer','infant warmer'], url: 'hospital-baby-warmer.html' },

  { keywords: ['medical gas pipeline','gas pipeline'], url: 'hospital-medical-gas-pipeline.html' },

  { keywords: ['ss instrument trolley','instrument trolleys'], url: 'hospital-ss-instrument-trolleys.html' },

  { keywords: ['instrument trolley bowl','dressing trolley','bowl and bucket'], url: 'instrument-trolley-bowl-and-bucket-dressing-trolley.html' },

  { keywords: ['instrument trolley'], url: 'instrument-trolley.html' },

  { keywords: ['medicine trolley'], url: 'medicine-trolley.html' },

  { keywords: ['medicine cart'], url: 'medicine-cart.html' },

  { keywords: ['hospital wheelchair'], url: 'hospital-wheelchair.html' },

  { keywords: ['circumease','circumcision kit','disposable circumcision','circumcision'], url: 'surgical-circumease-stapler.html' },

  { keywords: ['blood donation chair'], url: 'blood-donation-chair.html' },

  { keywords: ['overbed table','ob table'], url: 'ob-table-overbed-table.html' },

  { keywords: ['sliding glass door'], url: 'sliding-glass-door-unit.html' },

  { keywords: ['soil linen trolley','linen trolley'], url: 'soil-linen-trolley.html' },

  { keywords: ['saline stand','ss saline stand'], url: 'ss-saline-stand.html' },

  { keywords: ['round stool'], url: 'round-stool.html' },

  { keywords: ['square stool'], url: 'square-stool.html' },

  { keywords: ['double step stool'], url: 'double-step-stool.html' },

  { keywords: ['locker drawer cabinet','locker'], url: 'locker-1-drawer-1-cabinet.html' },

  { keywords: ['filing cabinet','vertical filing cabinet'], url: 'vfc-vertical-filing-cabinet.html' },

  { keywords: ['mattress','hospital mattress'], url: 'mattress.html' },

  { keywords: ['bookcase'], url: 'bookcase.html' },

  { keywords: ['modesty screen','3 fold screen'], url: '3-fold-modesty-screen.html' },

  { keywords: ['stretcher on trolley'], url: 'stretcher-on-trolley.html' },



  // ── CRITICAL CARE ──────────────────────────────

  { keywords: [

      'critical care','critical','icu','intensive care',

      'ventilator','icu ventilator','sh320','breathing machine',

        'turbine ventilator','transport ventilator','neonatal ventilator',

      'patient monitor','monitor','vital signs','spo2','ecg',

        'nibp','etco2','ibp','temp','multiparameter',

      'infusion pump','iv pump','drip pump','volumetric pump',

        'flowsync',

      'syringe pump','syringe',

      'anaesthesia','anesthesia','anaesthesia machine',

        'anaesthesia workstation','a-station',

      'ecg machine','ecg monitor','cardioview','12 lead ecg'

    ],

    url: 'critical-care.html'

  },



  // ── RENAL CARE ─────────────────────────────────

  { keywords: [

      'renal','renal care','kidney','nephrology',

      'dialysis','haemodialysis','hemodialysis','dialyser',

      'crrt','continuous renal replacement',

      'fistula','av fistula','fistula needle',

      'dialysis machine','pdm','pdm-6000',

      'blood circuit','tubing set','dialysis tubing',

      'catheter','haemodialysis catheter','pd-cath',

      'transducer','pd-tp','accessory','dialysis accessory',

      'concentrate','bicarbonate','acid concentrate',

      'blood tubing','linepro','pd linepro','canova',

      'transducer protector','tp transducer','pd tp'

    ],

    url: 'renal-care.html'

  },



  // ── CARDIAC CARE ───────────────────────────────

  { keywords: [

      'cardiac','cardiac care','heart','cardiology',

      'stent','drug eluting stent','des','coronary stent',

      'ptca','ptca balloon','angioplasty balloon',

      'balloon catheter','sc balloon','nc balloon','cto balloon',

      'guidewire','coronary guidewire',

      'introducer','sheath','introducer sheath',

      'manifold','cardiac manifold',

      'syringe','cardiac syringe','introducer syringe',

      'cath lab','catheterization',

      'defibrillator','aed','automatic external defibrillator',

      'cardiac defibrillator','inflation kit','inflation device',

      'radial compression','compression band','blunt needle',

      'introducer kit','venous access','high pressure line',

      'injection line'

    ],

    url: 'cardiac-care.html'

  },



  // ── AESTHETICS ─────────────────────────────────

  { keywords: [

      'aesthetics','aesthetic','aesthetics device',

      'skin','skin care','skin treatment',

      'laser','laser therapy','diode laser',

      'hifu','ultrasound body','body contouring',

      'rf','radiofrequency','rf skin tightening',

      'cryolipolysis','fat freeze','coolsculpting',

      'ipl','intense pulsed light','photorejuvenation',

      'dermapen','microneedling','skin needling',

      'beauty','slimming','wellness','anti-aging',

      'non surgical','non-invasive','body shaping',

      'hair restoration','hair transplant','prp','cool shape',

      'em code','em ma','pi code','visage','nodd',

      'wavelength','excimer','hydrafrac','bbl','code factor',

      'skin analyzer'

    ],

    url: 'aesthetics.html'

  },



  // ── REHABILITATION ────────────────────────────

  { keywords: [

      'rehab','rehabilitation','rehab device',

      'therapy','physiotherapy','physio',

      'mobility','mobility aid','walking aid',

      'muscle recovery','muscle stimulation','ems',

      'tens','nerve stimulation','pain relief',

      'cpmp','compression','lymphedema',

      'tilt table','standing frame','gait trainer',

      'ortho','orthopedic','joint recovery',

      'occupational therapy','stroke recovery',

      'disability','functional restoration',

      'wheelchair','power wheelchair','manual wheelchair',

      'rollator','walker','zimmer frame','cpm','cpm machine',

      'knee cpm','kneeflex','cervical traction','traction unit',

      'traction','softlaser','combistim','tens machine',

      'tens unit','electrical stimulation','ultrasound therapy',

      'us therapy'

    ],

    url: 'rehabilitation.html'

  },



  // ── HOSPITAL SETUP ─────────────────────────────

  { keywords: [

      'hospital setup','hospital','setup','ot setup',

      'operation theatre','operation theater','ot','ot table',

      'laparoscopy','laparoscopic','endoscopy','surgical camera',

      'medical laser','surgical laser','co2 laser',

      'aed','defibrillator','automated external defibrillator',

      'er','emergency room','er setup','emergency setup',

      'ot light','surgical light','examination light',

      'suction machine','electrosurgical','esu',

      'hospital equipment','icu setup','ward setup',

      'hospital bed','icu bed','fowler bed','semi fowler',

      'ldrp bed','pediatric bed','electric bed','manual bed',

      'delivery table','labour bed','stretcher','stretcher trolley',

      'autoclave','sterilizer','modular ot','crash cart',

      'emergency trolley','medicine trolley','instrument trolley',

      'saline stand','stool','round stool','locker','filing cabinet',

      'overbed table','baby warmer','infant warmer','medical gas',

      'gas pipeline','trolley','medicine cart','emergency cart'

    ],

    url: 'hospital-setup.html'

  },



  // ── ABOUT ──────────────────────────────────────

  { keywords: [

      'about','about us','about pulse','company',

      'who we are','our story','team','founders',

      'vision','mission','history','management'

    ],

    url: 'about.html'

  },



  // ── QUALITY & COMPLIANCE ───────────────────────

  { keywords: [

      'quality','compliance','quality compliance',

      'iso','iso 13485','ce','ce mark','ce marking',

      'fda','fda 510k','cdsco','bis','mdr 2017',

      'md13','certification','certified',

      'regulatory','standards','testing'

    ],

    url: 'quality.html'

  },



  // ── SERVICE SUPPORT ────────────────────────────

  { keywords: [

      'service','service support','support',

      'amc','annual maintenance','cmc',

      'maintenance','repair','spare parts',

      'installation','commissioning','on-site service',

      'remote support','service engineer',

      'training','healthcare training','after sales'

    ],

    url: 'service-support.html'

  },



  // ── CONTACT / DEMO / QUOTE ─────────────────────

  { keywords: [

      'contact','contact us','reach us','reach out',

      'demo','request demo','book demo',

      'quote','get quote','pricing','price',

      'call','call back','phone','whatsapp',

      'email','enquiry','inquiry','sales'

    ],

    url: 'index.html#contact'

  },



  // ── WHY PULSE ──────────────────────────────────

  { keywords: [

      'why pulse','why choose','benefits','advantage',

      'features','value','cost','affordable',

      'made in india','homegrown','domestic'

    ],

    url: 'index.html#why-pulse'

  },



  // ── HOW IT WORKS ───────────────────────────────

  { keywords: [

      'how it works','process','how pulse works',

      'engineering','manufacture','delivery','lifecycle',

      'r&d','research','development','stage'

    ],

    url: 'index.html#excellence'

  },

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

];



// ── SEARCH HANDLER ─────────────────────────────

function handleSearch(query) {

  const q = query.trim().toLowerCase();

  if (!q) return;



  const match = searchMap.find(item =>

    item.keywords.some(k =>

      q.includes(k) || k.includes(q)

    )

  );



  window.location.href = match

    ? match.url

    : 'about.html'; // default fallback

}



// ── WIRE TO BOTH DESKTOP & MOBILE ──────────────

// Desktop search input

const desktopSearch = document.getElementById('nav-search-input');

if (desktopSearch) {

  desktopSearch.addEventListener('keydown', function(e) {

    if (e.key === 'Enter') handleSearch(this.value);

  });

}



// Mobile search icon + overlay

const mobSearchBtn = document.getElementById('mob-search-btn');

const mobSearchOverlay = document.getElementById('mob-search-overlay');

const mobSearchInput = document.getElementById('mob-search-input');

const mobSearchClose = document.getElementById('mob-search-close');



if (mobSearchBtn && mobSearchOverlay) {

  mobSearchBtn.addEventListener('click', () => {

    mobSearchOverlay.classList.add('open');

    setTimeout(() => { if (mobSearchInput) mobSearchInput.focus(); }, 100);

  });

}

if (mobSearchClose && mobSearchOverlay) {

  mobSearchClose.addEventListener('click', () => {

    mobSearchOverlay.classList.remove('open');

    if (mobSearchInput) mobSearchInput.value = '';

  });

}

if (mobSearchInput) {

  mobSearchInput.addEventListener('keydown', function(e) {

    if (e.key === 'Enter') {

      handleSearch(this.value);

      mobSearchOverlay.classList.remove('open');

    }

    if (e.key === 'Escape') {

      mobSearchOverlay.classList.remove('open');

      this.value = '';

    }

  });

}



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

        // Mobile Products Accordion

        const mobProductsToggle = document.getElementById('mob-products-toggle');

        const mobProductsMenu = document.getElementById('mobProductsMenu');

        if (mobProductsToggle && mobProductsMenu) {

            mobProductsToggle.addEventListener('click', (e) => {

                e.stopPropagation();

                const isOpen = mobProductsMenu.classList.contains('open');

                mobProductsMenu.classList.toggle('open');

                mobProductsToggle.setAttribute('aria-expanded', String(!isOpen));

                const chevron = mobProductsToggle.querySelector('.mob-chevron');

                if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';

            });

        }



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

        }

        

        // Hover image swap in product dropdown

        document.querySelectorAll('.dropdown-product-link').forEach(link => {

          link.addEventListener('mouseenter', function () {

            const img   = document.querySelector('.featured-product-img');

            const label = document.querySelector('.featured-product-label');

            const fcLink = document.querySelector('.fc-link');

            if (img   && this.dataset.image) img.src         = this.dataset.image;

            if (label && this.dataset.label) label.textContent = this.dataset.label;

            if (fcLink) fcLink.href = this.getAttribute('href');

          });

        });



        // Contact Modal

        const contactOverlay = document.getElementById('contact-modal-overlay');

        const contactClose = document.getElementById('contact-modal-close');

        const cfSubmit = document.getElementById('cf-submit');

        const contactSuccess = document.getElementById('contact-success');

        const contactFormFields = document.getElementById('contact-form-fields');



        // Close modal

        if (contactClose) {

          contactClose.addEventListener('click', () => contactOverlay.classList.remove('open'));

        }

        contactOverlay.addEventListener('click', (e) => {

          if (e.target === contactOverlay) contactOverlay.classList.remove('open');

        });



        // Submit form

        if (cfSubmit) {

          cfSubmit.addEventListener('click', () => {

            const name = document.getElementById('cf-name').value.trim();

            const contact = document.getElementById('cf-contact').value.trim();





            if (!name || !contact) {

              alert('Please fill all fields.');

              return;

            }



            // Save to Google Sheets

            const payload = JSON.stringify({ formType: 'contact', name: name, contact: contact, source: 'Contact Us Form' });








            fetch('https://script.google.com/macros/s/AKfycbzglVLuVMPcXPwyK-fsUyNb0Uk0xqrMv-BPQHxT4jZJ72LEzVFZOxZB5e8umfJ7XTQpAQ/exec', {

              method: 'POST',

              body: payload,
              mode: 'no-cors'


            });



            // Build WhatsApp message

            const msg = `Hi PULSE! I'm ${name}. My contact is ${contact}. I'd like to know more about your products.`;

            const waUrl = `https://wa.me/919071101108?text=${encodeURIComponent(msg)}`;

            document.getElementById('cf-whatsapp-btn').href = waUrl;



            // Show success

            contactFormFields.classList.add('hide');

            contactSuccess.classList.add('show');

          });

        }

    }

});



// ── SEARCH SUGGESTIONS ──

setTimeout(function(){

  var searchInput = document.getElementById('nav-search-input');

  if (!searchInput) return;



  // Create suggestions dropdown

  var suggestBox = document.createElement('div');

  suggestBox.id = 'search-suggestions';

  suggestBox.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:9999;max-height:320px;overflow-y:auto;display:none;';

  // position handled by CSS

  searchInput.parentNode.appendChild(suggestBox);



  // Build suggestions list from searchMap

  function getSuggestions(query) {

    if (!query || query.length < 2) return [];

    var q = query.toLowerCase().trim();

    var results = [];

    var seen = {};

    if (typeof searchMap !== 'undefined') {

      searchMap.forEach(function(entry) {

        var matched = false;

        var label = '';

        if (entry.keywords) {

          entry.keywords.forEach(function(k) {

            if (k.toLowerCase().indexOf(q) !== -1 && !matched) {

              matched = true;

              label = k.charAt(0).toUpperCase() + k.slice(1);

            }

          });

        }

        if (matched && !seen[entry.url]) {

          seen[entry.url] = true;

          results.push({ label: label, url: entry.url });

        }

      });

    }

    return results.slice(0, 6);

  }



  function renderSuggestions(query) {

    var items = getSuggestions(query);

    if (!items.length) { suggestBox.style.display = 'none'; return; }

    suggestBox.innerHTML = '';

    items.forEach(function(item) {

      var div = document.createElement('div');

      div.style.cssText = 'padding:10px 16px;cursor:pointer;font-size:14px;color:#0d1b2a;display:flex;align-items:center;gap:8px;border-bottom:1px solid #f0f0f0;';

      div.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' + item.label;

      div.addEventListener('mouseenter', function(){ this.style.background='#f8f9fc'; });

      div.addEventListener('mouseleave', function(){ this.style.background=''; });

      div.addEventListener('mousedown', function(e){

        e.preventDefault();

        window.location.href = item.url;

      });

      suggestBox.appendChild(div);

    });

    suggestBox.style.display = 'block';

  }



  searchInput.addEventListener('input', function() {

    renderSuggestions(this.value);

  });

  searchInput.addEventListener('keydown', function(e) {

    if (e.key === 'Escape') { suggestBox.style.display = 'none'; }

  });

  document.addEventListener('click', function(e) {

    if (!suggestBox.contains(e.target) && e.target !== searchInput) {

      suggestBox.style.display = 'none';

    }

  });

  searchInput.addEventListener('focus', function() {

    if (this.value.length >= 2) renderSuggestions(this.value);

  });

}, 300);

