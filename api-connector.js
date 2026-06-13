/**
 * Pulse Medical — API Connector
 * Connects frontend to Django admin backend
 * Add <script src="/api-connector.js"></script>
 * to any page that needs live admin data
 */

const PulseAPI = {

  BASE: 'http://localhost:8000',

  async get(endpoint) {
    try {
      const res = await fetch(this.BASE + endpoint, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (e) {
      console.warn('PulseAPI:', e.message);
      return null;
    }
  },

  async post(endpoint, data) {
    try {
      const res = await fetch(this.BASE + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e) {
      console.warn('PulseAPI POST:', e.message);
      return null;
    }
  },

  // ── PRODUCTS ───────────────────────────
  async getProducts(category = null) {
    const url = category
      ? `/api/products/?category=${category}`
      : '/api/products/';
    return await this.get(url);
  },

  async getFeaturedProduct() {
    return await this.get('/api/products/featured/');
  },

  async getProduct(slug) {
    return await this.get(`/api/products/${slug}/`);
  },

  // ── BLOG ───────────────────────────────
  async getBlogs() {
    return await this.get('/api/blog/');
  },

  async getBlog(slug) {
    return await this.get(`/api/blog/${slug}/`);
  },

  // ── FORMS ──────────────────────────────
  async submitForm(type, data) {
    return await this.post('/api/submit/', {
      form_type: type, ...data
    });
  },

  // ── CONTENT ────────────────────────────
  async getContent(section = null) {
    const url = section
      ? `/api/content/${section}/`
      : '/api/content/';
    return await this.get(url);
  },

  // ── FORM HELPERS ───────────────────────

  // Call this on your demo form submit
  async handleDemoForm(formData) {
    const result = await this.submitForm('demo', {
      name:             formData.name,
      email:            formData.email,
      phone:            formData.phone || '',
      organization:     formData.organization || '',
      message:          formData.message || '',
      product_interest: formData.product || ''
    });
    return result;
  },

  // Call this on quote form submit
  async handleQuoteForm(formData) {
    return await this.submitForm('quote', {
      name:             formData.name,
      email:            formData.email,
      phone:            formData.phone || '',
      organization:     formData.organization || '',
      message:          formData.message || '',
      product_interest: formData.product || ''
    });
  },

  // Call this on contact form submit
  async handleContactForm(formData) {
    return await this.submitForm('contact', {
      name:    formData.name,
      email:   formData.email,
      phone:   formData.phone || '',
      message: formData.message || ''
    });
  },
};

// Auto-connect forms if they exist on the page
document.addEventListener('DOMContentLoaded', async function() {

  // ── WIRE UP ALL FORMS AUTOMATICALLY ──
  const formMap = {
    '#demo-form':    'demo',
    '#quote-form':   'quote',
    '#contact-form': 'contact',
    '#support-form': 'support',
    '.demo-form':    'demo',
    '.quote-form':   'quote',
    '.contact-form': 'contact',
  };

  Object.entries(formMap).forEach(([selector, type]) => {
    const form = document.querySelector(selector);
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());

      // Show loading state
      const btn = form.querySelector(
        'button[type="submit"], input[type="submit"]');
      const originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }

      const result = await PulseAPI.submitForm(type, {
        name:             data.name || data.full_name || '',
        email:            data.email || '',
        phone:            data.phone || data.mobile || '',
        organization:     data.organization ||
                          data.hospital ||
                          data.company || '',
        message:          data.message || data.query || '',
        product_interest: data.product ||
                          data.product_interest || ''
      });

      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
      }

      if (result && result.success) {
        // Show success
        const success = document.createElement('div');
        success.style.cssText = `
          background:#ecfdf5;color:#065f46;
          border:1px solid #10b981;border-radius:8px;
          padding:12px 16px;margin-top:12px;
          font-size:14px;font-weight:500;
        `;
        success.textContent =
          '✅ Thank you! We will get back to you shortly.';
        form.appendChild(success);
        form.reset();
        setTimeout(() => success.remove(), 5000);
      } else {
        const err = document.createElement('div');
        err.style.cssText = `
          background:#fef2f2;color:#991b1b;
          border:1px solid #ef4444;border-radius:8px;
          padding:12px 16px;margin-top:12px;
          font-size:14px;
        `;
        err.textContent =
          '❌ Something went wrong. Please try again.';
        form.appendChild(err);
        setTimeout(() => err.remove(), 4000);
      }
    });
  });

  // ── LOAD FEATURED PRODUCT IN NAV ──────
  const featuredSlot = document.querySelector(
    '[data-api="featured-product"]');
  if (featuredSlot) {
    const p = await PulseAPI.getFeaturedProduct();
    if (p) {
      const title = featuredSlot.querySelector(
        '[data-field="name"]');
      const img = featuredSlot.querySelector(
        '[data-field="image"]');
      const link = featuredSlot.querySelector(
        '[data-field="link"]');
      if (title) title.textContent = p.name;
      if (img && p.image_url) img.src = p.image_url;
      if (link) link.href =
        `/product-detail.html?id=${p.slug}`;
    }
  }

});

// Export for manual use
window.PulseAPI = PulseAPI;
