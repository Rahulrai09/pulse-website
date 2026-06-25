document.addEventListener('DOMContentLoaded', function() {
  // Open contact modal for all Contact Us buttons except footer
  document.querySelectorAll('a.btn-primary, a.cta-btn-white, a.btn-outline').forEach(function(btn) {
    if (btn.textContent.trim() === 'Contact Us') {
      // Skip footer contact us
      if (btn.closest('footer')) return;
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const modal = document.getElementById('contact-modal-overlay');
        if (modal) modal.classList.add('open');
      });
    }
  });
});
