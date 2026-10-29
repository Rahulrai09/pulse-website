// PULSE Website — form connector
// Every lead goes to two places at once:
//   1. the team's Google Sheet (as before), and
//   2. the Pulse admin panel (Supabase: enquiries / demo_requests).
// A submission counts as sent if either one accepts it, so a hiccup on one side never loses a lead.
(function () {
  'use strict';

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEYYoGCZDQxvYFy5hFiMuk54RsArVOfx72lpO_7uSarC_8aZ7fqiTv9o2NUJ23HwxgMA/exec';
  // Public (publishable) key: visitors can only ADD a new lead; reading leads needs an admin login.
  const SB_URL = 'https://vyknmwrcvfnpbcrjugik.supabase.co';
  const SB_KEY = 'sb_publishable_An5cioRIYrYkii-Z7QFVgg_FPFpJZ_6';

  async function submitToSheet(payload) {
    try {
      const formData = new FormData();
      formData.append('payload', JSON.stringify(payload));
      const response = await fetch(APPS_SCRIPT_URL, { method: 'POST', body: formData });
      const text = await response.text();
      if (text === 'success') return { success: true };
      console.error('[pulse-forms] Sheet returned:', text);
      return { success: false, error: text };
    } catch (err) {
      console.error('[pulse-forms] Sheet submission failed:', err);
      return { success: false, error: err };
    }
  }

  async function saveToAdmin(table, row) {
    try {
      const clean = {};
      Object.keys(row).forEach(function (k) { const v = row[k]; if (v !== '' && v != null) clean[k] = typeof v === 'string' ? v.slice(0, 4000) : v; });
      const res = await fetch(SB_URL + '/rest/v1/' + table, {
        method: 'POST',
        headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(clean),
        keepalive: true
      });
      if (!res.ok) { console.error('[pulse-forms] Admin save failed:', res.status, await res.text()); return { success: false }; }
      return { success: true };
    } catch (err) {
      console.error('[pulse-forms] Admin save failed:', err);
      return { success: false, error: err };
    }
  }

  async function both(sheetPayload, table, row) {
    const r = await Promise.all([submitToSheet(sheetPayload), saveToAdmin(table, row)]);
    return r[0].success || r[1].success ? { success: true } : { success: false, error: r[0].error || r[1].error };
  }

  const page = () => location.href.split('#')[0];
  const isoDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d : null;
  function customerType(t) {
    t = String(t || '').toLowerCase();
    if (/distribut|dealer|reseller/.test(t)) return 'distributor';
    if (/gov|public sector|psu/.test(t)) return 'government';
    if (/hospital|clinic|doctor|nursing|diagnostic|lab|centre|center|medical|purchase|biomedical|administrator/.test(t)) return 'hospital';
    return t ? 'other' : null;
  }

  // Demo form submission
  async function submitDemo(data) {
    return both(
      { formType: 'demo', fullName: data.fullName || '', mobile: data.mobile || '', email: data.email || '', city: data.city || '', preferredDate: data.preferredDate || '' },
      'demo_requests',
      { name: data.fullName || 'Website visitor', phone: data.mobile, email: data.email, location: data.city, preferred_date: isoDate(data.preferredDate), status: 'pending' }
    );
  }

  // Quote form submission
  async function submitQuote(data) {
    return both(
      { formType: 'quote', fullName: data.fullName || '', mobile: data.mobile || '', email: data.email || '', city: data.city || '', query: data.query || '' },
      'enquiries',
      { name: data.fullName || 'Website visitor', phone: data.mobile, email: data.email, city: data.city, message: (data.query || '') + '\n\nPage: ' + page(), source: 'website-quote', status: 'new' }
    );
  }

  // Detailed contact form (Quality page): name, phone, email, message + organisation details
  async function submitForm(p) {
    const m = p.metadata || {};
    const lines = [p.message || ''];
    if (m.organisation) lines.push('Organisation: ' + m.organisation);
    if (m.designation) lines.push('Role: ' + m.designation);
    if (m.equipment_interested && m.equipment_interested.length) lines.push('Interested in: ' + [].concat(m.equipment_interested).join(', '));
    if (m.budget_range) lines.push('Budget: ' + m.budget_range);
    if (m.timeline) lines.push('Timeline: ' + m.timeline);
    lines.push('Page: ' + (p.source_page || page()));
    const query = lines.filter(Boolean).join('\n');
    return both(
      { formType: 'quote', fullName: p.name || '', mobile: p.phone || '', email: p.email || '', city: m.city || '', query: query },
      'enquiries',
      { name: p.name || 'Website visitor', phone: p.phone, email: p.email, city: m.city, company: m.organisation, message: query, source: 'website-' + (p.form_type || 'contact'), customer_type: customerType(m.designation || m.organisation), status: 'new' }
    );
  }

  // Job application: Google Sheet (as before) + admin panel (Job Applications), with the CV stored privately
  async function uploadResume(file) {
    try {
      if (!file || file.size > 10 * 1024 * 1024) return null;
      const ext = (file.name.split('.').pop() || 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '');
      const types = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
      if (!types[ext]) return null;
      const id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
      const path = 'applications/' + new Date().toISOString().slice(0, 7) + '/' + id + '.' + ext;
      const res = await fetch(SB_URL + '/storage/v1/object/resumes/' + path, {
        method: 'POST',
        headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': file.type || types[ext], 'x-upsert': 'false' },
        body: file
      });
      if (!res.ok) { console.error('[pulse-forms] CV upload failed:', res.status, await res.text()); return null; }
      return path;
    } catch (err) { console.error('[pulse-forms] CV upload failed:', err); return null; }
  }
  async function submitJob(data) {
    const sheet = submitToSheet({
      formType: 'job',
      appliedRole: data.appliedRole || '', name: data.name || '', phone: data.phone || '', email: data.email || '',
      skillDetails: data.skillDetails || '', yearsExperience: data.yearsExperience || '', message: data.message || '',
      resumeFileName: data.resumeFileName || '', resumeMimeType: data.resumeMimeType || '', resumeBase64: data.resumeBase64 || ''
    });
    const admin = (async () => {
      const path = await uploadResume(data.resumeFile);
      return saveToAdmin('job_applications', {
        name: data.name || 'Applicant', phone: data.phone, email: data.email, applied_role: data.appliedRole,
        job_title: data.skillDetails, years_experience: data.yearsExperience, message: data.message,
        resume_path: path, resume_file_name: data.resumeFileName || null, source_page: page(), status: 'new'
      });
    })();
    const r = await Promise.all([sheet, admin]);
    return r[0].success || r[1].success ? { success: true } : { success: false, error: r[0].error || r[1].error };
  }

  // AI chat lead submission
  async function submitChat(data) {
    const msg = [data.category ? 'Topic: ' + data.category : '', data.firstMessage ? 'First message: ' + data.firstMessage : '', data.message || '', 'Page: ' + page()].filter(Boolean).join('\n');
    return both(
      { formType: 'chat', firstMessage: data.firstMessage || '', name: data.name || '', phone: data.phone || '', email: data.email || '', userType: data.userType || '', category: data.category || '', message: data.message || '' },
      'enquiries',
      { name: data.name || 'Chat visitor', phone: data.phone, email: data.email, message: msg, source: 'chatbot', customer_type: customerType(data.userType), status: 'new' }
    );
  }

  // Header "Contact Us" pop-up (name + phone or email). The pop-up still posts to its own Google Sheet; this adds the admin copy.
  async function submitContact(data) {
    const c = String(data.contact || '').trim(), isMail = c.indexOf('@') > 0;
    return saveToAdmin('enquiries', {
      name: data.name || 'Website visitor', phone: isMail ? null : c, email: isMail ? c : null,
      message: 'Product / page: ' + (data.product || '') + '\n\nPage: ' + page(), source: 'contact-us', status: 'new'
    });
  }

  window.PulsePublic = { submitDemo, submitQuote, submitForm, submitJob, submitChat, submitContact };
})();
