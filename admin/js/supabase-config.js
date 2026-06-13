// PULSE Admin — Supabase configuration
const SUPABASE_URL = 'https://lgymrvtunpkntfmkddhl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dzQUy7N0BpQjMzVJcOvYVg_lhNqK3UB';

const { createClient } = window.supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

// Roles allowed to access the admin panel
const ADMIN_ALLOWED_ROLES = ['super_admin', 'editor', 'viewer'];

async function requireAdmin() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = '/admin/login.html';
    return null;
  }
  const { data: adminRow, error } = await sb
    .from('admins').select('*').eq('id', session.user.id).single();
  if (error || !adminRow) {
    console.error('requireAdmin: query failed or no row', error);
    await sb.auth.signOut();
    window.location.href = '/admin/login.html';
    return null;
  }
  if (!ADMIN_ALLOWED_ROLES.includes(adminRow.role)) {
    console.error('requireAdmin: role "' + adminRow.role + '" not in', ADMIN_ALLOWED_ROLES);
    await sb.auth.signOut();
    alert('Your role (' + adminRow.role + ') does not have admin panel access.');
    window.location.href = '/admin/login.html';
    return null;
  }
  sessionStorage.setItem('admin_role', adminRow.role);
  return { session, admin: adminRow };
}

async function logout() {
  await sb.auth.signOut();
  window.location.href = '/admin/login.html';
}

// Global UI helper to sync sidebar
async function syncSidebar(admin) {
  const sidebarNav = document.getElementById('sidebarNav');
  if (!sidebarNav) return;

  // Update Users link (from users.html to admin-users.html)
  const usersLink = Array.from(sidebarNav.querySelectorAll('a')).find(a => a.getAttribute('href') === 'users.html' || a.getAttribute('href') === 'admin-users.html');
  if (usersLink) {
    usersLink.setAttribute('href', 'admin-users.html');
    // Hide if not super_admin
    if (admin.role !== 'super_admin') {
      usersLink.style.display = 'none';
    }
  }

  // Populate user box if present
  const userName = document.getElementById('userName');
  const userRole = document.getElementById('userRole');
  if (userName) userName.textContent = admin.full_name || admin.email;
  if (userRole) userRole.textContent = admin.role.replace(/_/g, ' ');
}

window.PulseAdmin = { sb, requireAdmin, logout, syncSidebar, ADMIN_ALLOWED_ROLES };
