// PULSE Public Website — Supabase Client
// This is the ANON/PUBLIC key — safe for client-side use.
// RLS policies on Supabase restrict what anonymous users can do (INSERT only on form_submissions).
(function () {
  'use strict';
  const SUPABASE_URL = 'https://lgymrvtunpkntfmkddhl.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_dzQUy7N0BpQjMzVJcOvYVg_lhNqK3UB';

  if (!window.supabase || !window.supabase.createClient) {
    console.error('[pulse-forms] Supabase JS not loaded. Forms will not work.');
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /**
   * Unified form submission handler
   * @param {Object} payload - The form data
   * @returns {Promise<{success: boolean, error: any}>}
   */
  async function submitForm(payload) {
    try {
      // Ensure basic fields exist
      const data = {
        form_type: payload.form_type || 'contact',
        name: payload.name || null,
        email: payload.email || null,
        phone: payload.phone || null,
        message: payload.message || null,
        source_page: payload.source_page || window.location.href,
        metadata: payload.metadata || {},
        status: 'new',
        created_at: new Date().toISOString()
      };

      const { error } = await sb.from('form_submissions').insert([data]);
      if (error) throw error;
      
      return { success: true };
    } catch (err) {
      console.error('[pulse-forms] Submission failed:', err);
      return { success: false, error: err };
    }
  }

  window.PulsePublic = { sb, submitForm };
})();
