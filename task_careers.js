const fs = require('fs');
const path = require('path');

const footerPath = 'c:/Users/DELL/Desktop/pulse-website/js/footer.js';
const lifePath = 'c:/Users/DELL/Desktop/pulse-website/life-at-pulse.html';

// 1. Update footer.js
if (fs.existsSync(footerPath)) {
  let fContent = fs.readFileSync(footerPath, 'utf8');

  // Change Careers link
  fContent = fContent.replace(
    '<li><a href="#">Careers</a></li>',
    '<li><a href="#" onclick="document.getElementById(\'careers-modal-overlay\').classList.add(\'open\'); return false;">Careers</a></li>'
  );

  const careersModalHTML = `
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
                <div style="font-weight:600; font-size:1.1rem;">+91 9899554722</div>
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
`;
  
  if (!fContent.includes('id="careers-modal-overlay"')) {
    fContent = fContent.replace('    <!-- GLOBAL MODALS -->', '    <!-- GLOBAL MODALS -->\n' + careersModalHTML);
  }

  // Add ESC key listener globally
  if (!fContent.includes('Escape')) {
    fContent += `\n    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.pulse-modal-overlay.open').forEach(m => m.classList.remove('open'));
      }
    });\n`;
  }
  
  // Add openCareerModal global function
  if (!fContent.includes('openCareerModal')) {
    fContent += `\n    window.openCareerModal = function(roleName) {
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
    };\n`;
  }

  // Init form
  if (!fContent.includes('initForm(\'careers-form\'')) {
    fContent = fContent.replace("initForm('quote-form', 'quote');", "initForm('quote-form', 'quote');\n        initForm('careers-form', 'career');");
  }

  fs.writeFileSync(footerPath, fContent, 'utf8');
  console.log('Updated footer.js');
}

// 2. Update life-at-pulse.html
if (fs.existsSync(lifePath)) {
  let lContent = fs.readFileSync(lifePath, 'utf8');
  
  // Replace links inside the roles-dropdown-panel
  const linkRegex = /<a class="role-link" href="https:\/\/wa\.me\/919071101108" target="_blank" rel="noopener noreferrer">([^<]+)<\/a>/g;
  lContent = lContent.replace(linkRegex, (match, roleName) => {
    return '<a class="role-link" href="#" onclick="openCareerModal(\'' + roleName + '\'); return false;">' + roleName + '</a>';
  });
  
  // Also update "Contact Us" button
  lContent = lContent.replace(
    '<a href="index.html#contact" class="cta-btn-secondary">Contact Us</a>',
    '<a href="#" onclick="openCareerModal(\'\'); return false;" class="cta-btn-secondary">Contact Us</a>'
  );

  fs.writeFileSync(lifePath, lContent, 'utf8');
  console.log('Updated life-at-pulse.html');
}
