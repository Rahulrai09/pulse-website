document.addEventListener('DOMContentLoaded', function() {
  var metaPixel = document.createElement('script'); metaPixel.async = true; metaPixel.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(metaPixel); metaPixel.onload = function(){ fbq('init','3413725288776120'); fbq('track','PageView'); }; window.fbq = window.fbq || function(){ (window.fbq.q = window.fbq.q || []).push(arguments); }; window._fbq = window._fbq || window.fbq;
    const footerHTML = `
    <footer class="premium-footer">
      <!-- Pre-Footer Strip -->
      <div class="pf-strip">
        <div class="pf-strip-content">
          <h3>Ready to equip your facility with Made-in-India medical technology?</h3>
          <div class="pf-strip-actions">
            <button class="pf-btn secondary" onclick="document.getElementById('demo-modal-overlay').classList.add('open')">Request a Demo</button>
            <button class="pf-btn primary" onclick="document.getElementById('quote-modal-overlay').classList.add('open')">Get a Quote</button>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="pf-main">
        <div class="pf-grid">
          <!-- Col 1 -->
          <div class="pf-col pf-brand-col">
            <a href="index.html" class="pf-logo">
              <img src="image/pulse-logo-PNG-W.png" alt="Pulse" style="height:44px; width:auto; object-fit:contain; filter:brightness(10);">
            </a>
            <div class="pf-socials">
              <a href="https://www.linkedin.com/company/pulseiomed/" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
              <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg></a>
              <a href="https://www.instagram.com/pulse_medtechmanufacturing/" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            </div>
            <iframe src="https://maps.google.com/maps?q=12.916265,77.651869&z=16&output=embed" width="100%" height="160" style="border:0;border-radius:8px;margin-top:16px;display:block;" allowfullscreen="" loading="lazy"></iframe>
          </div>

          <!-- Col 2 -->
          <div class="pf-col">
            <h5>COMPANY</h5>
            <ul>
              <li><a href="about.html">About Us</a></li>

              <li><a href="articles.html">Articles & Blogs</a></li>
              <li><a href="innovation.html">Innovation & R&D</a></li>
              <li><a href="life-at-pulse.html">Life at Pulse</a></li>
            </ul>
          </div>

          <!-- Col 3 -->
          <div class="pf-col">
            <h5>SOLUTIONS</h5>
            <ul>
              <li><a href="critical-care.html">Critical Care</a></li>
              <li><a href="renal-care.html">Renal Care</a></li>
              <li><a href="cardiac-care.html">Cardiac Care</a></li>
              <li><a href="aesthetics.html">Aesthetics</a></li>
              <li><a href="rehabilitation.html">Rehabilitation</a></li>
              <li><a href="hospital-setup.html">Hospital Setup</a></li>
            </ul>
          </div>

          <!-- Col 4 -->
          <div class="pf-col">
            <h5>SUPPORT</h5>
            <ul>
              <li><a href="#" onclick="document.getElementById('demo-modal-overlay').classList.add('open'); return false;">Request Demo</a></li>
              <li><a href="#" onclick="document.getElementById('quote-modal-overlay').classList.add('open'); return false;">Get a Quote</a></li>
              <li><a href="service-support.html">Service Support</a></li>
            </ul>
          </div>

          <!-- Col 5 -->
          <div class="pf-col pf-contact-col">
            <h5>CONTACT</h5>
            <ul>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> 27th Main Road, Sector 2, HSR Layout, Bangalore, Karnataka 560102</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> <a href="https://wa.me/919071101108" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;">+91 90711 01108</a></li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> <a href="https://mail.google.com/mail/?view=cm&to=Info@pulseio.in" target="_blank" rel="noopener noreferrer">Info@pulseio.in</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pf-bottom">
        <div class="pf-bottom-inner">
          <div class="pf-bottom-left">
            <p>&copy; 2025 Pulse. All rights reserved.</p>
          </div>

          <div class="pf-bottom-right">
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="terms-and-conditions.html">Terms of Use</a>
            <a href="privacy-policy.html#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- GLOBAL MODALS -->

    <style>
      .careers-modal-grid { display: flex; flex-direction: row; min-height:550px; }
      @media(max-width:768px) { .careers-modal-grid { flex-direction: column; } }
    </style>
    <div class="pulse-modal-overlay" id="careers-modal-overlay" style="z-index:99999;">
      <div class="pulse-modal" style="display:flex; max-width:850px; padding:0; overflow-y:auto; overflow-x:hidden; max-height:90vh;" onclick="event.stopPropagation()">
        <button class="pm-close" onclick="document.getElementById('careers-modal-overlay').classList.remove('open')" aria-label="Close" style="position:absolute; right:16px; top:16px; z-index:10; background:none; border:none; color:#1c2b5e; cursor:pointer;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div class="careers-modal-grid" style="width:100%;">
          <!-- Left Panel -->
          <div style="flex:1; background:#1c2b5e; color:#fff; padding:48px 32px; display:flex; flex-direction:column; justify-content:center;">
            <div style="font-size:0.75rem; letter-spacing:0.1em; color:#8a96d9; margin-bottom:12px; font-weight:600;">WANT TO START SOMETHING NEW</div>
            <h3 style="font-size:2rem; font-weight:700; margin-bottom:16px; line-height:1.2; font-family:'Inter',sans-serif;">Ready to engage with us?</h3>
            <p style="color:rgba(255,255,255,0.7); margin-bottom:40px; line-height:1.6; font-size:0.95rem;">Enter your details & we'll be get in touch to discuss your project.</p>
            
            <div style="margin-bottom:24px; display:flex; align-items:center; gap:16px;">
              <div style="background:rgba(255,255,255,0.1); padding:12px; border-radius:50%;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e87722" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
              <div>
                <div style="font-size:0.8rem; color:rgba(255,255,255,0.5);">Call Anytime</div>
                <div style="font-weight:600; font-size:1.1rem;"><a href="https://wa.me/919071101108" target="_blank" style="color:inherit;text-decoration:none;">+91 90711 01108</a></div>
              </div>
            </div>
            
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="background:rgba(255,255,255,0.1); padding:12px; border-radius:50%;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e87722" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
              <div>
                <div style="font-size:0.8rem; color:rgba(255,255,255,0.5);">Write us</div>
                <div style="font-weight:600; font-size:1.1rem;">info@pulseio.in</div>
              </div>
            </div>
          </div>

          <!-- Right Panel -->
          <div class="pm-body" id="careers-body" style="flex:1.4; background:#fff; padding:40px 32px; display:flex; flex-direction:column; justify-content:center;">
            <h4 style="color:#e87722; font-size:1.6rem; font-weight:700; margin-bottom:24px; font-family:'Inter',sans-serif; margin-top:0;">Join Our Team</h4>
            <form id="careers-form">
              <div class="pm-form-group" id="careers-role-group" style="display:none; margin-bottom:12px;">
                <label style="color:#1c2b5e; font-weight:600; font-size:0.85rem;">Applied Role:</label>
                <input type="text" class="pm-input" id="careers-role-input" style="background:#f0f4ff; border-color:#d0d7f0; color:#1c2b5e; font-weight:500;" readonly>
              </div>
              <div class="pm-form-group" style="margin-bottom:12px;"><label style="font-size:0.85rem;">Name</label><input type="text" class="pm-input" required></div>
              <div style="display:flex; gap:16px; margin-bottom:12px;">
                <div class="pm-form-group" style="flex:1; margin-bottom:0;"><label style="font-size:0.85rem;">Phone</label><input type="tel" class="pm-input" required></div>
                <div class="pm-form-group" style="flex:1; margin-bottom:0;"><label style="font-size:0.85rem;">Email</label><input type="email" class="pm-input" required></div>
              </div>
              <div style="display:flex; gap:16px; margin-bottom:12px;">
                <div class="pm-form-group" style="flex:1; margin-bottom:0;"><label style="font-size:0.85rem;">Skill Details</label><input type="text" class="pm-input" required></div>
                <div class="pm-form-group" style="flex:1; margin-bottom:0;"><label style="font-size:0.85rem;">No. of year experience</label><input type="text" class="pm-input" required></div>
              </div>
              <div class="pm-form-group" style="margin-bottom:12px;"><label style="font-size:0.85rem;">Message</label><textarea class="pm-textarea" style="min-height:80px;"></textarea></div>
              <div class="pm-form-group" style="margin-bottom:16px;"><label style="font-size:0.85rem;">Upload Resume</label><input type="file" class="pm-input" accept=".pdf,.doc,.docx" required style="padding:6px; background:#f7f9fc;"></div>
              <button type="submit" class="pm-submit" style="background:#e87722; width:100%; border:none; border-radius:6px; padding:12px; color:#fff; font-weight:600; cursor:pointer;">Send Message &rarr;</button>
            </form>
          </div>
          <div class="pm-success" id="careers-success" style="flex:1.4; background:#fff; align-items:center; justify-content:center; display:none; padding:40px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:48px;height:48px;color:#10b981;margin-bottom:16px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h5 style="font-size:1.4rem; color:#1c2b5e; margin-bottom:8px;">Thank you!</h5><p style="color:#666;">Your application has been received.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="pulse-modal-overlay" id="demo-modal-overlay">
      <div class="pulse-modal" onclick="event.stopPropagation()">
        <div class="pm-header">
          <h4>Book a Free Demo</h4>
          <button class="pm-close" onclick="document.getElementById('demo-modal-overlay').classList.remove('open')" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="pm-body" id="demo-body">
          <form id="demo-form">
            <div class="pm-form-group"><label>Full Name <span style="color:#e53e3e">*</span></label><input type="text" class="pm-input" required></div>
            <div class="pm-form-group"><label>Mobile Number <span style="color:#e53e3e">*</span></label><input type="tel" class="pm-input" required></div>
            <div class="pm-form-group"><label>Email Address</label><input type="email" class="pm-input"></div>
            <div class="pm-form-group"><label>Equipment Needed</label><textarea class="pm-textarea"></textarea></div>
            <div class="pm-form-group"><label>City</label><input type="text" class="pm-input"></div>

            <div class="pm-form-group"><label>Preferred Demo Date</label><input type="date" class="pm-input"></div>
            <div class="pm-form-group"><label>Message</label><textarea class="pm-textarea"></textarea></div>
            <button type="submit" class="pm-submit">Book My Demo &rarr;</button>
          </form>
        </div>
        <div class="pm-success" id="demo-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <h5>Thank you!</h5><p>Our team will confirm your demo within 24 hours.</p>
        </div>
      </div>
    </div>

    <div class="pulse-modal-overlay" id="quote-modal-overlay">
      <div class="pulse-modal" onclick="event.stopPropagation()">
        <div class="pm-header">
          <h4>Get a Custom Quote</h4>
          <button class="pm-close" onclick="document.getElementById('quote-modal-overlay').classList.remove('open')" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="pm-body" id="quote-body">
          <form id="quote-form">
            <div class="pm-form-group"><label>Full Name <span style="color:#e53e3e">*</span></label><input type="text" class="pm-input" required></div>
            <div class="pm-form-group"><label>Mobile Number <span style="color:#e53e3e">*</span></label><input type="tel" class="pm-input" required></div>
            <div class="pm-form-group"><label>Email Address</label><input type="email" class="pm-input"></div>

            <div class="pm-form-group"><label>City</label><input type="text" class="pm-input"></div>
            <div class="pm-form-group"><label>Equipment Needed</label><textarea class="pm-textarea" required></textarea></div>
            <div class="pm-form-group"><label>Quantity Required</label><input type="number" class="pm-input"></div>
            <div class="pm-form-group">
              <label>Budget Range</label>
              <select class="pm-select">
                <option>Under ₹5L</option><option>₹5L–₹20L</option>
                <option>₹20L–₹50L</option><option>₹50L+</option>
              </select>
            </div>
            <div class="pm-form-group">
              <label>Timeline</label>
              <select class="pm-select">
                <option>Immediate</option><option>1–3 Months</option>
                <option>3–6 Months</option><option>Just Exploring</option>
              </select>
            </div>
            <button type="submit" class="pm-submit">Request My Quote &rarr;</button>
          </form>
        </div>
        <div class="pm-success" id="quote-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <h5>Thank you!</h5><p>Our team will send you a detailed quote within 48 hours.</p>
        </div>
      </div>
    </div>
    `;

    const footerContainer = document.getElementById('global-footer');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;

        // Modal Logic
        document.querySelectorAll('.pulse-modal-overlay').forEach(overlay => {
          overlay.addEventListener('click', () => {
            overlay.classList.remove('open');
          });
        });

        // Dynamic dependency injector for Supabase and PulsePublic
        function ensurePulsePublic() {
          return new Promise((resolve) => {
            if (window.PulsePublic && window.PulsePublic.submitDemo) {
              resolve(true);
              return;
            }

            // Helper to load a script dynamically
            function loadScript(src) {
              return new Promise((res, rej) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => res();
                script.onerror = () => rej(new Error(`Failed to load ${src}`));
                document.body.appendChild(script);
              });
            }

            // First check window.supabase
            loadScript('js/pulse-forms.js').then(() => {
              resolve(true);
            }).catch(err => {
              console.error('[footer] Failed to load form dependencies:', err);
              resolve(false);
            });
          });
        }

        // Form Logic
        const initForm = (formId, type) => {
          const form = document.getElementById(formId);
          if (!form) return;
          
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const origText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Sending...';

            // Ensure dependency is loaded
            const loaded = await ensurePulsePublic();
            if (!loaded || !window.PulsePublic || !window.PulsePublic.submitDemo) {
              alert('Sorry, submission service is currently unavailable. Please email Info@pulseio.in');
              btn.disabled = false;
              btn.textContent = origText;
              return;
            }

            let result;
            try {
              if (type === 'demo') {
                result = await window.PulsePublic.submitDemo({
                  fullName: form.querySelector('input[name="fullName"],input[placeholder*="Name"],input[type="text"]')?.value || '',
                  mobile: form.querySelector('input[type="tel"]')?.value || '',
                  email: form.querySelector('input[type="email"]')?.value || '',
                  hospitalName: form.querySelectorAll('input[type="text"]')[1]?.value || '',
                  city: form.querySelectorAll('input[type="text"]')[2]?.value || '',
                  equipmentCategory: form.querySelector('select')?.value || '',
                  preferredDate: form.querySelector('input[type="date"]')?.value || '',
                  message: form.querySelector('textarea')?.value || ''
                });
              } else if (type === 'quote') {
                result = await window.PulsePublic.submitQuote({
                  fullName: form.querySelector('input[type="text"]')?.value || '',
                  mobile: form.querySelector('input[type="tel"]')?.value || '',
                  email: form.querySelector('input[type="email"]')?.value || '',
                  hospitalName: form.querySelectorAll('input[type="text"]')[1]?.value || '',
                  city: form.querySelectorAll('input[type="text"]')[2]?.value || '',
                  equipmentNeeded: form.querySelector('textarea')?.value || '',
                  quantity: form.querySelector('input[type="number"]')?.value || '',
                  budgetRange: form.querySelectorAll('select')[0]?.value || '',
                  timeline: form.querySelectorAll('select')[1]?.value || ''
                });
              } else if (type === 'career') {
                const resumeInput = form.querySelector('input[type="file"]');
                let resumeBase64 = '', resumeFileName = '', resumeMimeType = '';
                if (resumeInput && resumeInput.files && resumeInput.files[0]) {
                  const file = resumeInput.files[0];
                  resumeFileName = file.name;
                  resumeMimeType = file.type;
                  resumeBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result.split(',')[1]);
                    reader.readAsDataURL(file);
                  });
                }
                result = await window.PulsePublic.submitJob({
                  appliedRole: form.querySelector('#careers-role-input')?.value || '',
                  name: form.querySelector('input[type="text"]')?.value || '',
                  phone: form.querySelector('input[type="tel"]')?.value || '',
                  email: form.querySelector('input[type="email"]')?.value || '',
                  skillDetails: form.querySelectorAll('input[type="text"]')[1]?.value || '',
                  yearsExperience: form.querySelectorAll('input[type="text"]')[2]?.value || '',
                  message: form.querySelector('textarea')?.value || '',
                  resumeBase64,
                  resumeFileName,
                  resumeMimeType
                });
              }
              const { success } = result || { success: false };
              if (success) {
                form.closest('.pm-body').style.display = 'none';
                form.closest('.pulse-modal').querySelector('.pm-success').style.display = 'flex';
                setTimeout(() => {
                  form.closest('.pulse-modal-overlay').classList.remove('open');
                  setTimeout(() => {
                    form.closest('.pm-body').style.display = 'flex';
                    form.closest('.pulse-modal').querySelector('.pm-success').style.display = 'none';
                    form.reset();
                  }, 500);
                }, 3000);
              } else {
                alert('Submission failed. Please try again.');
              }
            } catch (err) {
              console.error(err);
              alert('An error occurred.');
            } finally {
              btn.disabled = false;
              btn.textContent = origText;
            }
          });
        };

        initForm('demo-form', 'demo');
        initForm('quote-form', 'quote');
        initForm('careers-form', 'career');
    }

    // --- Mobile Categories Filter Toggle ---
    const sidebar = document.querySelector('.filter-sidebar');
    const catMain = document.querySelector('.cat-main');
    if (sidebar && catMain) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'mob-filter-toggle';
      toggleBtn.innerHTML = '⚙ Filters';
      catMain.insertBefore(toggleBtn, sidebar);
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
});

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.pulse-modal-overlay.open').forEach(m => m.classList.remove('open'));
      }
    });

    window.openCareerModal = function(roleName) {
      const modal = document.getElementById('careers-modal-overlay');
      const roleGroup = document.getElementById('careers-role-group');
      const roleInput = document.getElementById('careers-role-input');
      
      if (roleName) {
        roleInput.value = roleName;
        roleGroup.style.display = 'block';
      } else {
        roleInput.value = '';
        roleGroup.style.display = 'none';
      }
      
      if (modal) {
        modal.classList.add('open');
      }
    };

function initContactTrigger() { var modal = document.getElementById('contact-modal-overlay'); if (!modal) { setTimeout(initContactTrigger, 500); return; } document.querySelectorAll('a').forEach(function(btn) { var text = btn.textContent.trim(); if (text === 'Contact Us' || text === 'Contact us') { if (btn.closest('footer')) return; if (btn.closest('nav')) return; if (btn.id === 'nav-contact-btn') return; btn.removeAttribute('href'); btn.removeAttribute('target'); btn.removeAttribute('rel'); btn.style.cursor = 'pointer'; btn.onclick = function(e) { e.preventDefault(); e.stopPropagation(); modal.classList.add('open'); return false; }; } }); } setTimeout(initContactTrigger, 1500);
