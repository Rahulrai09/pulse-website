// PULSE Website — Google Sheets Form Connector
(function () {
  'use strict';

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzglVLuVMPcXPwyK-fsUyNb0Uk0xqrMv-BPQHxT4jZJ72LEzVFZOxZB5e8umfJ7XTQpAQ/exec';

  async function submitToSheet(payload) {
    try {
      const formData = new FormData();
      formData.append('payload', JSON.stringify(payload));
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });
      const text = await response.text();
      if (text === 'success') {
        return { success: true };
      } else {
        console.error('[pulse-forms] Script returned:', text);
        return { success: false, error: text };
      }
    } catch (err) {
      console.error('[pulse-forms] Submission failed:', err);
      return { success: false, error: err };
    }
  }

  // Demo form submission
  async function submitDemo(data) {
    return submitToSheet({
      formType: 'demo',
      fullName: data.fullName || '',
      mobile: data.mobile || '',
      email: data.email || '',
      hospitalName: data.hospitalName || '',
      city: data.city || '',
      equipmentCategory: data.equipmentCategory || '',
      preferredDate: data.preferredDate || '',
      message: data.message || ''
    });
  }

  // Quote form submission
  async function submitQuote(data) {
    return submitToSheet({
      formType: 'quote',
      fullName: data.fullName || '',
      mobile: data.mobile || '',
      email: data.email || '',
      hospitalName: data.hospitalName || '',
      city: data.city || '',
      equipmentNeeded: data.equipmentNeeded || '',
      quantity: data.quantity || '',
      budgetRange: data.budgetRange || '',
      timeline: data.timeline || ''
    });
  }

  // Job application submission
  async function submitJob(data) {
    const payload = {
      formType: 'job',
      appliedRole: data.appliedRole || '',
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      skillDetails: data.skillDetails || '',
      yearsExperience: data.yearsExperience || '',
      message: data.message || '',
      resumeFileName: data.resumeFileName || '',
      resumeMimeType: data.resumeMimeType || '',
      resumeBase64: data.resumeBase64 || ''
    };
    return submitToSheet(payload);
  }

  // AI Chat lead submission
  async function submitChat(data) {
    return submitToSheet({
      formType: 'chat',
      firstMessage: data.firstMessage || '',
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      userType: data.userType || '',
      category: data.category || '',
      message: data.message || ''
    });
  }

  window.PulsePublic = {
    submitDemo,
    submitQuote,
    submitJob,
    submitChat
  };

})();
