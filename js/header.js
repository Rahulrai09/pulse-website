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
        .mobile-search-item {
          display: block;
          padding: 12px 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
      }
      @media (min-width: 769px) {
        .mobile-search-item {
          display: none !important;
        }
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
        <div class="mobile-search-item">
          <input type="text"
            id="mobile-search-bar"
            placeholder="Search..."
            style="width:100%; padding:10px 14px; border-radius:6px;
                   border:none; font-size:14px; margin-top:4px;"
          />
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
                                        "image": "image/Critical%20care/Anesthesia%20Workstation.png",
                                        "href": "critical-anesthesia-workstation.html"
                              },
                              {
                                        "name": "Vital ZEC3 ECG Machine",
                                        "image": "image/Critical%20care/ECG%20Machine%203%20Channel.png",
                                        "href": "critical-vital-zec3.html"
                              },
                              {
                                        "name": "Vital ZEC6 ECG Machine",
                                        "image": "image/Critical%20care/6%20Channel%20ECG%20Machine.png",
                                        "href": "critical-vital-zec6.html"
                              },
                              {
                                        "name": "Vital ZEC12 ECG Machine",
                                        "image": "image/Critical%20care/12%20Channel%20ECG%20Machine.png",
                                        "href": "critical-vital-zec12.html"
                              },
                              {
                                        "name": "Vital ZPM5 Patient Monitor",
                                        "image": "image/Critical%20care/Pateint%20monitor.png",
                                        "href": "critical-vital-zpm5.html"
                              },
                              {
                                        "name": "Vital ZPM7 Patient Monitor",
                                        "image": "image/Critical%20care/7%20Para%20Pateint%20Monitor.png",
                                        "href": "critical-vital-zpm7.html"
                              },
                              {
                                        "name": "Vital ZIP1 Infusion Pump",
                                        "image": "image/Critical%20care/Infusion%20pump.png",
                                        "href": "critical-vital-zip1.html"
                              },
                              {
                                        "name": "Vital ZSP1 Syringe Pump",
                                        "image": "image/Critical%20care/Syringe%20Pump.png",
                                        "href": "critical-vital-zsp1.html"
                              }
                    ]
          },
          "Renal Care": {
                    "label": "RENAL CARE",
                    "products": [
                              {
                                        "name": "PDM-6000",
                                        "image": "image/Renal%20care/PDM-6000%20Precision%20Haemodialysis%20System.png",
                                        "href": "renal-pdm-6000.html"
                              },
                              {
                                        "name": "PD-Canova",
                                        "image": "image/Renal%20care/PD%20-%20Canova.png",
                                        "href": "renal-pd-canova.html"
                              },
                              {
                                        "name": "PD-Linepro",
                                        "image": "image/Renal%20care/PD%20-%20Linepro.png",
                                        "href": "renal-pd-linepro.html"
                              },
                              {
                                        "name": "Dialysers",
                                        "image": "image/Renal%20care/Dialysers.png",
                                        "href": "renal-dialysers.html"
                              },
                              {
                                        "name": "PD-Cath",
                                        "image": "image/Renal%20care/PD%20-%20Cath.png",
                                        "href": "renal-pd-cath.html"
                              },
                              {
                                        "name": "PD-TP",
                                        "image": "image/Renal%20care/PD%20TP.png",
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
          "Aesthetics": {
                    "label": "AESTHETICS",
                    "products": [
                              {
                                        "name": "Wavelength Pro X",
                                        "image": "image/Aesthetics%20images/Wavelength%20pro%20x.png",
                                        "href": "aesthetics-wavelength-pro-x.html"
                              },
                              {
                                        "name": "Pi-Code",
                                        "image": "image/Aesthetics%20images/Pi-Code.png",
                                        "href": "aesthetics-pi-code.html"
                              },
                              {
                                        "name": "Code Factor",
                                        "image": "image/Aesthetics%20images/Code%20Factor.png",
                                        "href": "aesthetics-code-factor.html"
                              },
                              {
                                        "name": "Nodd",
                                        "image": "image/Aesthetics%20images/Nodd.png",
                                        "href": "aesthetics-nodd.html"
                              },
                              {
                                        "name": "HYDRAFRAC",
                                        "image": "image/Aesthetics%20images/Hydrafrac.png",
                                        "href": "aesthetics-hydrafrac.html"
                              },
                              {
                                        "name": "Cool Shape",
                                        "image": "image/Aesthetics%20images/Cool%20Shape.png",
                                        "href": "aesthetics-cool-shape.html"
                              },
                              {
                                        "name": "Em Code",
                                        "image": "image/Aesthetics%20images/Em%20Code.png",
                                        "href": "aesthetics-em-code.html"
                              },
                              {
                                        "name": "Bbl Super IPL+DPL",
                                        "image": "image/Aesthetics%20images/BBL%20Super%20IDL%20%2B%20Dpl.png",
                                        "href": "aesthetics-bbl-super-ipl-dpl.html"
                              },
                              {
                                        "name": "Visage",
                                        "image": "image/Aesthetics%20images/Visage.png",
                                        "href": "aesthetics-visage.html"
                              },
                              {
                                        "name": "Excimer",
                                        "image": "image/Aesthetics%20images/Excimer.png",
                                        "href": "aesthetics-excimer.html"
                              },
                              {
                                        "name": "Em-Ma",
                                        "image": "image/Aesthetics%20images/EM-MA.png",
                                        "href": "aesthetics-em-ma.html"
                              },
                              {
                                        "name": "Skin Analyzer",
                                        "image": "image/Aesthetics%20images/skin-analyzer.png",
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
                    if (img   && this.dataset.image) img.src         = this.dataset.image;
                    if (label && this.dataset.label) label.textContent = this.dataset.label;
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
                        if (img) img.src = firstLink.dataset.image;
                        if (label) label.textContent = firstLink.dataset.label;
                    }
                });
            });
            
            // Initialize default state to Critical Care on page load
            setActiveCategory('Critical Care');
            const firstLink = colProductsEl.querySelector('.sub-product-link');
            if (firstLink) {
                const img = document.querySelector('.featured-product-img');
                const label = document.querySelector('.featured-product-label');
                if (img) img.src = firstLink.dataset.image;
                if (label) label.textContent = firstLink.dataset.label;
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
      'concentrate','bicarbonate','acid concentrate'
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
      'cath lab','catheterization'
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
      'non surgical','non-invasive','body shaping'
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
      'disability','functional restoration'
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
      'hospital equipment','icu setup','ward setup'
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

// Mobile search input
const mobileSearch = document.getElementById('mobile-search-bar');
if (mobileSearch) {
  mobileSearch.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSearch(this.value);
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
            if (img   && this.dataset.image) img.src         = this.dataset.image;
            if (label && this.dataset.label) label.textContent = this.dataset.label;
          });
        });
    }
});
