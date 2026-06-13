const fs = require('fs');

const aboutContent = fs.readFileSync('about.html', 'utf8');
const headEnd = aboutContent.indexOf('<style>');
const headContent = aboutContent.substring(0, headEnd);

const styleContent = `<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #0a1e40; background: #fff; line-height: 1.6; overflow-x: hidden; }

  /* HERO */
  .legal-hero {
    position: relative;
    min-height: 300px;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: #1B2F6E;
  }
  .legal-hero-content {
    position: relative;
    z-index: 2;
    padding: 120px 5% 40px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    color: #fff;
  }
  .legal-hero-eyebrow {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #a4bdfc;
    display: block;
    margin-bottom: 12px;
  }
  .legal-hero-content h1 {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 20px;
  }
  .legal-hero-updated {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  /* CONTENT */
  .legal-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 5%;
    color: #333;
  }
  .legal-content h2 {
    font-size: 1.5rem;
    color: #1B2F6E;
    margin-top: 40px;
    margin-bottom: 16px;
  }
  .legal-content h3 {
    font-size: 1.1rem;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .legal-content p {
    margin-bottom: 16px;
  }
  .legal-content ul {
    margin-left: 20px;
    margin-bottom: 20px;
  }
  .legal-content li {
    margin-bottom: 8px;
  }
</style>
</head>
<body>

<div id="global-header"></div>
`;

const footerContent = `
<div id="global-footer"></div>
<script src="js/header.js"></script>
<script src="js/footer.js"></script>
</body>
</html>`;

const privacyPolicyHTML = headContent.replace('<title>About Pulse | Built for the Future of Indian Healthcare</title>', '<title>Privacy Policy \u2014 PULSE</title>') + styleContent + `
<!-- HERO -->
<section class="legal-hero">
  <div class="legal-hero-content">
    <span class="legal-hero-eyebrow">LEGAL</span>
    <h1>Privacy Policy</h1>
    <div class="legal-hero-updated">Last Updated: 04/12/2025</div>
  </div>
</section>

<!-- CONTENT -->
<section class="legal-content">
  <p>PULSE ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit www.pulseio.in.</p>

  <h2>1. Information We Collect</h2>
  <h3>A. Personal Information (Provided by You)</h3>
  <ul>
    <li>Name</li>
    <li>Email address</li>
    <li>Phone number</li>
    <li>Company name</li>
    <li>Inquiry or form details</li>
  </ul>

  <h3>B. Automatically Collected Information</h3>
  <ul>
    <li>IP address</li>
    <li>Browser type</li>
    <li>Device information</li>
    <li>Pages viewed</li>
    <li>Cookies and tracking data</li>
  </ul>

  <h2>2. How We Use Your Information</h2>
  <ul>
    <li>Respond to inquiries or service requests</li>
    <li>Improve Website performance and user experience</li>
    <li>Send updates, newsletters, or marketing communication (with consent)</li>
    <li>Analyze Website traffic and usage trends</li>
    <li>Ensure security and prevent fraudulent activity</li>
  </ul>

  <h2 id="cookies">3. Cookies & Tracking Technologies</h2>
  <p>We use cookies to enhance user experience, understand how visitors use the Website, and improve performance and personalization. You may disable cookies through your browser settings.</p>

  <h2>4. Sharing of Information</h2>
  <p>We do not sell your personal information. We may share data only with:</p>
  <ul>
    <li>Trusted third-party service providers (analytics, hosting, CRM)</li>
    <li>Regulatory authorities, if required by law</li>
    <li>Internal teams within PULSE for operational purposes</li>
  </ul>

  <h2>5. Data Security</h2>
  <p>We implement technical and organizational measures to protect your personal information. No system is completely secure.</p>

  <h2>6. Your Rights</h2>
  <p>You may have the right to:</p>
  <ul>
    <li>Access your personal data</li>
    <li>Request correction of inaccurate data</li>
    <li>Request deletion of your data</li>
    <li>Withdraw consent for marketing communication</li>
  </ul>
  <p>Contact us at Info@pulseio.in to exercise your rights.</p>

  <h2>7. Retention of Data</h2>
  <p>We retain personal information only as long as necessary to fulfill the purpose collected, comply with legal obligations, and resolve disputes.</p>

  <h2>8. Third-Party Links</h2>
  <p>This Website may contain links to external sites. We are not responsible for their content or privacy practices.</p>

  <h2>9. Children's Privacy</h2>
  <p>Our Website is not intended for individuals under 18. We do not knowingly collect personal information from minors.</p>

  <h2>10. Updates to This Policy</h2>
  <p>We may update this Privacy Policy periodically. Updates will be posted on this page with the revised date.</p>
</section>
` + footerContent;

const termsHTML = headContent.replace('<title>About Pulse | Built for the Future of Indian Healthcare</title>', '<title>Terms & Conditions \u2014 PULSE</title>') + styleContent + `
<!-- HERO -->
<section class="legal-hero">
  <div class="legal-hero-content">
    <span class="legal-hero-eyebrow">LEGAL</span>
    <h1>Terms & Conditions</h1>
    <div class="legal-hero-updated">Last Updated: 04/12/2025</div>
  </div>
</section>

<!-- CONTENT -->
<section class="legal-content">
  <p>These Terms of Use constitute a legally binding agreement between you and Pulse Innovations ("PULSE") governing your access to and use of www.pulseio.in. By accessing this Website, you agree to be bound by these Terms.</p>

  <h2>1. Acceptance and Scope</h2>
  <p><strong>1.1</strong> These Terms govern all access to and use of the Website.</p>
  <p><strong>1.2</strong> You must be at least 18 years of age and legally competent to enter into a binding agreement.</p>
  <p><strong>1.3</strong> These Terms apply in addition to any other contractual agreements you may have with PULSE.</p>

  <h2>2. Ownership and Intellectual Property Rights</h2>
  <p><strong>2.1</strong> All Website content \u2014 text, graphics, designs, trademarks, product information, software, images \u2014 is the exclusive property of PULSE or its licensors.</p>
  <p><strong>2.2</strong> All content is protected under applicable copyright, trademark, and intellectual property laws.</p>
  <p><strong>2.3</strong> No license is granted to reproduce, modify, or distribute content except as expressly permitted.</p>
  <p><strong>2.4</strong> You may download content solely for personal, non-commercial use with all proprietary notices intact.</p>

  <h2>3. Permitted and Prohibited Use</h2>
  <p><strong>3.1</strong> You may use the Website exclusively for lawful purposes.</p>
  <p><strong>3.2</strong> You agree NOT to:</p>
  <ul>
    <li>Use automated tools or unauthorized mechanisms</li>
    <li>Introduce viruses, malware, or harmful code</li>
    <li>Interfere with the operation or security of the Website</li>
    <li>Misrepresent your identity or provide inaccurate information</li>
    <li>Violate any applicable law or third-party rights</li>
  </ul>
  <p><strong>3.3</strong> PULSE reserves the right to restrict or terminate access for any violation of these Terms.</p>

  <h2>4. Accuracy of Information</h2>
  <p><strong>4.1</strong> PULSE endeavors to maintain accurate and up-to-date information.</p>
  <p><strong>4.2</strong> Information is for general informational purposes only.</p>
  <p><strong>4.3</strong> PULSE may modify or remove content at any time without notice.</p>

  <h2>5. Third-Party Links</h2>
  <p><strong>5.1</strong> The Website may contain links to third-party websites.</p>
  <p><strong>5.2</strong> PULSE does not endorse or assume responsibility for external sites.</p>
  <p><strong>5.3</strong> Accessing third-party sites is at your own discretion.</p>

  <h2>6. Indemnification</h2>
  <p>You agree to indemnify and hold harmless PULSE from any claims, damages, or expenses arising from your breach of these Terms, misuse of the Website, or violation of any law.</p>

  <h2>7. Data Protection and Privacy</h2>
  <p>Your use of the Website is governed by our Privacy Policy. By using the Website, you consent to the practices described therein.</p>

  <h2>8. Changes to the Terms</h2>
  <p>PULSE may modify these Terms at any time. Revised Terms will be posted on this page. Continued use constitutes acceptance.</p>

  <h2>9. Governing Law and Jurisdiction</h2>
  <p>These Terms are governed by the laws of India, without regard to conflict-of-law principles.</p>
</section>
` + footerContent;

fs.writeFileSync('privacy-policy.html', privacyPolicyHTML);
fs.writeFileSync('terms-and-conditions.html', termsHTML);

let footerJS = fs.readFileSync('js/footer.js', 'utf8');
footerJS = footerJS.replace('<a href="#">Cookie Policy</a>', '<a href="privacy-policy.html#cookies">Cookie Policy</a>');
fs.writeFileSync('js/footer.js', footerJS);

console.log('Legal pages created and footer updated.');
