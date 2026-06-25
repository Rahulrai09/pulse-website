function initContactTrigger() {
  const modal = document.getElementById('contact-modal-overlay');
  if (!modal) {
    setTimeout(initContactTrigger, 300);
    return;
  }
  document.querySelectorAll('a').forEach(function(btn) {
    const text = btn.textContent.trim();
    if (text === 'Contact Us' || text === 'Contact us') {
      if (btn.closest('footer')) return;
      btn.removeAttribute('href');
      btn.removeAttribute('target');
      btn.removeAttribute('rel');
      btn.style.cursor = 'pointer';
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        modal.classList.add('open');
        return false;
      };
    }
  });
}
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initContactTrigger, 600);
});