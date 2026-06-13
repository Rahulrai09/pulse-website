(async function () {
  'use strict';

  if (!window.PulseAdmin) return;
  const { sb } = window.PulseAdmin;

  // ── 1. HELPERS ──
  function extractFirstName(email) {
    if (!email) return 'Admin';
    let local = email.split('@')[0];
    local = local.replace(/^\d+/, '');
    local = local.replace(/\d+/g, '');
    const parts = local.split(/[._\-]/);
    const first = parts[0] || local;
    if (!first) return 'Admin';
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  }

  // ── 2. USER PILL & BADGE INIT ──
  async function initUserPill() {
    const { data: { session }, error } = await sb.auth.getSession();
    
    if (!session || error) {
      window.location.href = '/admin/login.html';
      return;
    }
    
    const email = session.user.email || '';
    const firstName = extractFirstName(email);
    const initials  = firstName.slice(0,2).toUpperCase();
    
    const nameEl = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');
    if (nameEl)   nameEl.textContent = firstName;
    if (avatarEl) avatarEl.textContent = initials;

    const greetEl = document.getElementById('greeting-name');
    if (greetEl) greetEl.textContent = firstName;
    
    try {
      const { count } = await sb
        .from('form_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');
      
      const badge = document.getElementById('bell-badge');
      if (badge) {
        if (count > 0) {
          badge.textContent = count > 99 ? '99+' : count;
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }
    } catch(e) { console.warn('[shell] badge:', e); }
  }

  // ── 3. TEMPLATE PATCHING ──
  function patchShell() {
    // TOP NAV
    const nav = document.querySelector('.top-nav');
    if (nav) {
      nav.innerHTML = `
        <a href="/admin/dashboard.html" class="logo-link" aria-label="Pulse Admin home">
          <svg width="110" height="28" viewBox="0 0 220 54" xmlns="http://www.w3.org/2000/svg">
            <text x="2" y="42" font-family="'Segoe UI',Arial,sans-serif" font-weight="900" font-size="44" letter-spacing="-1" fill="#1d3461">P</text>
            <text x="36" y="42" font-family="'Segoe UI',Arial,sans-serif" font-weight="900" font-size="44" letter-spacing="-1" fill="#1d3461">U</text>
            <text x="72" y="42" font-family="'Segoe UI',Arial,sans-serif" font-weight="900" font-size="44" letter-spacing="-1" fill="#1d3461">L</text>
            <text x="102" y="42" font-family="'Segoe UI',Arial,sans-serif" font-weight="900" font-size="44" letter-spacing="-1" fill="#1d3461">S</text>
            <polyline points="138,32 143,32 147,13 152,47 156,7 161,44 166,28 172,28 180,28"
              stroke="#e8821a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="181" y="42" font-family="'Segoe UI',Arial,sans-serif" font-weight="900" font-size="44" letter-spacing="-1" fill="#1d3461">E</text>
          </svg>
        </a>
        <span class="nav-divider"></span>
        <div class="nav-tabs">
          <a href="/admin/dashboard.html" class="nav-tab">Overview</a>
          <a href="/admin/form-submissions.html" class="nav-tab">Submissions</a>
          <a href="/admin/blogs.html" class="nav-tab">Content</a>
        </div>
        <div class="nav-spacer"></div>
        <div class="nav-search">
          <i class="ti ti-search"></i>
          <input type="text" id="nav-search-input" placeholder="Search submissions, blogs…" autocomplete="off" aria-label="Search dashboard">
        </div>
        <button class="nav-icon-btn" id="bell-btn">
          <i class="ti ti-bell"></i>
          <span class="bell-badge" id="bell-badge" style="display:none"></span>
        </button>
        <div class="user-pill" id="user-pill-wrap" onclick="window.shellLogout()">
          <div class="user-avatar" id="user-avatar">--</div>
          <span class="user-name" id="user-name">—</span>
          <i class="ti ti-chevron-down" style="font-size:11px;color:#6b7280"></i>
        </div>
      `;
    }

    // ICON RAIL
    const rail = document.querySelector('.icon-rail');
    if (rail) {
      rail.innerHTML = `
        <a href="/admin/dashboard.html"       class="rail-icon" data-page="dashboard"    title="Dashboard"><i class="ti ti-layout-dashboard"></i></a>
        <a href="/admin/form-submissions.html" class="rail-icon" data-page="form-submissions" title="Submissions"><i class="ti ti-mail"></i></a>
        <a href="/admin/blogs.html"            class="rail-icon" data-page="blogs"        title="Blogs"><i class="ti ti-article"></i></a>
        <a href="/admin/banners.html"          class="rail-icon" data-page="banners"      title="Banners"><i class="ti ti-photo"></i></a>
        <a href="/admin/products.html"         class="rail-icon" data-page="products"     title="Products"><i class="ti ti-box"></i></a>
        <div class="rail-sep"></div>
        <a href="/admin/admin-users.html"      class="rail-icon" data-page="admin-users"  title="Admin Users"><i class="ti ti-users"></i></a>
        <a href="/admin/settings.html"         class="rail-icon" data-page="settings"     title="Settings"><i class="ti ti-settings"></i></a>
        <div class="rail-bottom">
          <button class="rail-icon" id="logout-btn" title="Logout"><i class="ti ti-logout"></i></button>
        </div>
      `;
    }

    // ── ACTIVE STATE — EXACT FILENAME MATCH ONLY ──
    // Get current filename e.g. "dashboard.html", "form-submissions.html", "settings.html"
    const filename = window.location.pathname.split('/').pop() || 'dashboard.html';
    // Strip .html to get page key e.g. "dashboard", "form-submissions", "settings"
    const pageKey = filename.replace('.html', '');

    // Clear all active states first
    document.querySelectorAll('.rail-icon').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    // Set exactly ONE rail icon active — must match data-page exactly
    const activeRail = document.querySelector(\`.rail-icon[data-page="\${pageKey}"]\`);
    if (activeRail) activeRail.classList.add('active');

    // Set top nav tab active — match by href filename
    document.querySelectorAll('.nav-tab').forEach(el => {
      const href = (el.getAttribute('href') || '').split('/').pop();
      if (href === filename) el.classList.add('active');
    });

    // Search
    const searchInput = document.getElementById('nav-search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = e.target.value.trim();
          if (q) window.location.href = `/admin/form-submissions.html?search=${encodeURIComponent(q)}`;
        }
      });
    }

    initUserPill();
  }

  // ── LOGOUT ──
  window.shellLogout = async function() {
    if (confirm('Are you sure you want to sign out?')) {
      await sb.auth.signOut();
      window.location.href = '/admin/login.html';
    }
  };

  patchShell();
  setInterval(initUserPill, 60000);

})();
