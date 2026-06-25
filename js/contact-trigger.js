function initContactTrigger() {
  const modal = document.getElementById('contact-modal-overlay');
  if (!modal) {
    setTimeout(initContactTrigger, 500);
    return;
  }
  document.querySelectorAll('a').forEach(function(btn) {
    const text = btn.textContent.trim();
    if (text === 'Contact Us' || text === 'Contact us') {
      if (btn.closest('footer')) return;
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('open');
      });
    }
  });
}
document.addEventListener('DOMContentLoaded', initContactTrigger);
