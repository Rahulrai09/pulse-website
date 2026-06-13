const fs = require('fs');
const path = 'c:/Users/DELL/Desktop/pulse-website/quality.html';
let content = fs.readFileSync(path, 'utf8');

// The file got messed up after <div class="tf reveal reveal-delay-1">
// We will replace everything from <!-- COMPLIANCE PROCESS --> to the end of the file with the correct structure.

const index = content.indexOf('<!-- COMPLIANCE PROCESS -->');
if (index === -1) {
  console.log("Could not find <!-- COMPLIANCE PROCESS -->");
  process.exit(1);
}

const cleanContent = content.substring(0, index);

const correctEnd = `<!-- COMPLIANCE PROCESS -->
<section id="process" style="background: var(--body-alt); border-top: 1px solid var(--border);">
  <div class="section-label reveal">The Pulse Guarantee</div>
  <div class="section-title-ayr reveal">
    <span class="t-dark">Quality Built Into</span><br>
    <span class="t-blue">Every Step</span>
  </div>
  
  <div class="trust-features">
    <div class="tf reveal">
      <div class="tf-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
      <div>
        <h4>Compliance-First Sourcing</h4>
        <p>Before any product is added to the Pulse portfolio, the OEM's manufacturing facility and the specific device model undergo a rigorous audit to verify all claimed certifications are valid and up-to-date.</p>
      </div>
    </div>
    <div class="tf reveal reveal-delay-1">
      <div class="tf-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
      <div>
        <h4>Consistent Quality Control</h4>
        <p>We mandate multi-point quality checks during the manufacturing process. From raw material inspection to final calibration, we ensure there is zero quality variance between the demo unit and the final delivered product.</p>
      </div>
    </div>
    <div class="tf reveal reveal-delay-2">
      <div class="tf-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg></div>
      <div>
        <h4>Responsive Local Support & Traceability</h4>
        <p>Every piece of equipment is serialized and tracked. Should an issue arise, our on-ground service teams are immediately notified with full diagnostic histories, ensuring rapid response and minimal clinical downtime.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section id="cta">
  <div class="cta-content reveal">
    <div class="section-label">Trust in Quality</div>
    <h2>Procure with Absolute Confidence</h2>
    <p>Eliminate compliance risks and clinical downtime. Equip your facility with internationally certified hardware supported by our dedicated team.</p>
  </div>
</section>

<!-- GLOBAL FOOTER -->
<div id="global-footer"></div>
<script src="js/footer.js"></script>

<script>
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  reveals.forEach(el => obs.observe(el));

  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));
</script>

</body>
</html>`;

fs.writeFileSync(path, cleanContent + correctEnd, 'utf8');
console.log('Fixed quality.html');
