(async function () {
  'use strict';

  // ── Auth & Access Control ──
  const ctx = await window.PulseAdmin.requireAdmin();
  if (!ctx) return;

  const { sb } = window.PulseAdmin;
  const adminRole = ctx.admin.role;

  // CRITICAL: Only super_admin can access this page
  if (adminRole !== 'super_admin') {
    console.error('Access denied: super_admin only');
    window.location.href = 'dashboard.html';
    return;
  }

  // Populate user box
  document.getElementById('userName').textContent = ctx.admin.full_name || ctx.admin.email;
  document.getElementById('userRole').textContent = adminRole.replace(/_/g, ' ');

  // ── State ──
  let users = [];
  let auditLogs = [];
  let auditPage = 0;
  const AUDIT_PAGE_SIZE = 25;
  let auditTotal = 0;

  // ── DOM Refs ──
  const usersTableBody = document.getElementById('usersTableBody');
  const auditTableBody = document.getElementById('auditTableBody');
  const inviteModal = document.getElementById('inviteModal');
  const inviteModalOverlay = document.getElementById('inviteModalOverlay');
  const confirmModal = document.getElementById('confirmModal');
  const confirmOverlay = document.getElementById('confirmOverlay');

  // ── Tabs ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.tab-btn.active').classList.remove('active');
      document.querySelector('.tab-content.active').classList.remove('active');
      btn.classList.add('active');
      document.getElementById('tab' + btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1)).classList.add('active');
      if (btn.dataset.tab === 'audit') loadAuditLogs();
    });
  });

  // ── User Management ──
  async function loadUsers() {
    usersTableBody.innerHTML = '<tr><td colspan="6" class="loading-bar">Loading team...</td></tr>';
    
    const { data, error } = await sb
      .from('admins')
      .select('*')
      .order('role', { ascending: true })
      .order('email', { ascending: true });

    if (error) {
      console.error('Load users error:', error);
      usersTableBody.innerHTML = `<tr><td colspan="6" class="loading-bar" style="color:red">Error: ${error.message}</td></tr>`;
      return;
    }

    users = data;
    renderUsers();
  }

  function renderUsers() {
    if (users.length === 0) {
      usersTableBody.innerHTML = '<tr><td colspan="6" class="loading-bar">No admin users found.</td></tr>';
      return;
    }

    usersTableBody.innerHTML = users.map(user => {
      const initials = (user.full_name || user.email).split(' ').map(n => n[0]).join('').substring(0, 2);
      const isMe = user.id === ctx.session.user.id;
      const lastLogin = user.last_login ? formatRelativeTime(user.last_login) : 'Never';
      const invitedDate = user.invited_at ? new Date(user.invited_at).toLocaleDateString() : '—';
      
      return `
        <tr>
          <td>
            <div class="user-cell">
              <div class="user-avatar role-${user.role}">${initials}</div>
              <div class="user-info">
                <span class="name">${esc(user.full_name || 'Admin User')}</span>
                <span class="email">${esc(user.email)}</span>
              </div>
            </div>
          </td>
          <td><span class="badge-role badge-${user.role}">${user.role.replace(/_/g, ' ')}</span></td>
          <td>
            <div class="status-indicator">
              <span class="status-dot ${user.is_active ? 'active' : 'inactive'}"></span>
              ${user.is_active ? 'Active' : 'Inactive'}
            </div>
          </td>
          <td><span class="td-date" title="${user.last_login || ''}">${lastLogin}</span></td>
          <td><span class="td-date" title="Invited on ${user.invited_at || ''}">${invitedDate}</span></td>
          <td>
            <div class="action-btns">
              ${isMe ? '' : `
                <button class="btn-icon" title="Change Role" onclick="window.changeUserRole('${user.id}', '${user.email}', '${user.role}')">
                  <i class="ti ti-settings"></i>
                </button>
                <button class="btn-icon btn-delete" title="Revoke Access" onclick="window.revokeAccess('${user.id}', '${user.email}')">
                  <i class="ti ti-trash"></i>
                </button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ── Invite Admin ──
  document.getElementById('btnInviteOpen').addEventListener('click', () => {
    inviteModal.classList.add('open');
    inviteModalOverlay.classList.add('open');
  });

  document.getElementById('inviteModalClose').addEventListener('click', closeInviteModal);
  document.getElementById('inviteCancel').addEventListener('click', closeInviteModal);
  inviteModalOverlay.addEventListener('click', closeInviteModal);

  function closeInviteModal() {
    inviteModal.classList.remove('open');
    inviteModalOverlay.classList.remove('open');
    document.getElementById('inviteForm').reset();
    document.getElementById('inviteMsg').innerHTML = '';
  }

  document.getElementById('inviteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('inviteEmail').value.trim();
    const role = document.getElementById('inviteRole').value;
    const submitBtn = document.getElementById('btnInviteSubmit');
    const msg = document.getElementById('inviteMsg');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // 1. Call RPC for invitation logic
      const { data, error: rpcError } = await sb.rpc('invite_admin_user', {
        target_email: email,
        target_role: role,
        invited_by_id: ctx.session.user.id
      });

      if (rpcError) throw rpcError;

      // 2. Log Action
      await logAudit('invite_admin', 'admin_user', null, email, { role });

      msg.innerHTML = `<div class="msg-info" style="background:#dcfce7; color:#166534;">Invitation sent to ${email}</div>`;
      setTimeout(() => {
        closeInviteModal();
        loadUsers();
      }, 1500);

    } catch (err) {
      console.error('Invite error:', err);
      msg.innerHTML = `<div class="msg-error">${err.message}</div>`;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Invitation';
    }
  });

  // ── Change Role ──
  window.changeUserRole = async (id, email, currentRole) => {
    const newRole = prompt(`Change role for ${email}?\nCurrent: ${currentRole}\nEnter new role (editor or viewer):`, currentRole === 'editor' ? 'viewer' : 'editor');
    if (!newRole || newRole === currentRole) return;
    if (!['editor', 'viewer'].includes(newRole)) {
      alert('Invalid role. Please use "editor" or "viewer".');
      return;
    }

    if (!confirm(`Confirm change ${email} to ${newRole.toUpperCase()}?`)) return;

    const { error } = await sb.from('admins').update({ role: newRole }).eq('id', id);
    if (error) {
      alert('Error updating role: ' + error.message);
      return;
    }

    await logAudit('change_role', 'admin_user', id, email, { from: currentRole, to: newRole });
    loadUsers();
    alert('Role updated successfully.');
  };

  // ── Revoke Access ──
  window.revokeAccess = async (id, email) => {
    // Safety check: Don't revoke last super_admin
    if (users.filter(u => u.role === 'super_admin').length <= 1) {
      const target = users.find(u => u.id === id);
      if (target && target.role === 'super_admin') {
        alert('Cannot revoke the only Super Admin. Please promote another user first.');
        return;
      }
    }

    if (!confirm(`Are you sure you want to remove ${email}? They will immediately lose all access to the admin panel.`)) return;

    const { error } = await sb.from('admins').delete().eq('id', id);
    if (error) {
      alert('Error revoking access: ' + error.message);
      return;
    }

    await logAudit('revoke_access', 'admin_user', id, email);
    loadUsers();
    alert('Access revoked for ' + email);
  };

  // ── Audit Log ──
  async function loadAuditLogs() {
    auditTableBody.innerHTML = '<tr><td colspan="5" class="loading-bar">Loading logs...</td></tr>';
    
    const action = document.getElementById('auditFilterAction').value;
    const dateFrom = document.getElementById('auditFilterDateFrom').value;
    const dateTo = document.getElementById('auditFilterDateTo').value;
    const search = document.getElementById('auditFilterSearch').value.trim();

    let query = sb.from('audit_log').select('*', { count: 'exact' });

    if (action) query = query.eq('action', action);
    if (dateFrom) query = query.gte('created_at', dateFrom + 'T00:00:00');
    if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59');
    if (search) query = query.ilike('actor_email', `%${search}%`);

    const from = auditPage * AUDIT_PAGE_SIZE;
    const to = from + AUDIT_PAGE_SIZE - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Audit load error:', error);
      auditTableBody.innerHTML = '<tr><td colspan="5" class="loading-bar" style="color:red">Error loading logs</td></tr>';
      return;
    }

    auditLogs = data;
    auditTotal = count || 0;
    renderAuditLogs();
    renderAuditPagination();
  }

  function renderAuditLogs() {
    if (auditLogs.length === 0) {
      auditTableBody.innerHTML = '<tr><td colspan="5" class="loading-bar">No audit entries found.</td></tr>';
      return;
    }

    auditTableBody.innerHTML = auditLogs.map(log => `
      <tr>
        <td class="td-date">${new Date(log.created_at).toLocaleString()}</td>
        <td style="font-size:13px;">${esc(log.actor_email)}</td>
        <td><span class="action-label action-${log.action}">${formatAction(log.action)}</span></td>
        <td style="font-size:13px;">${esc(log.target_label || '—')}</td>
        <td class="td-metadata" onclick="alert(JSON.stringify(${JSON.stringify(log.metadata)}, null, 2))">
          ${JSON.stringify(log.metadata)}
        </td>
      </tr>
    `).join('');
  }

  function renderAuditPagination() {
    const totalPages = Math.ceil(auditTotal / AUDIT_PAGE_SIZE);
    const pag = document.getElementById('auditPagination');
    if (totalPages <= 1) {
      pag.style.display = 'none';
      return;
    }

    pag.style.display = 'flex';
    document.getElementById('auditPaginationInfo').textContent = `Showing ${auditPage * AUDIT_PAGE_SIZE + 1}–${Math.min((auditPage + 1) * AUDIT_PAGE_SIZE, auditTotal)} of ${auditTotal}`;
    
    const btns = document.getElementById('auditPaginationBtns');
    btns.innerHTML = `
      <button ${auditPage === 0 ? 'disabled' : ''} id="auditPrev">←</button>
      <button ${auditPage >= totalPages - 1 ? 'disabled' : ''} id="auditNext">→</button>
    `;

    document.getElementById('auditPrev')?.addEventListener('click', () => { if (auditPage > 0) { auditPage--; loadAuditLogs(); } });
    document.getElementById('auditNext')?.addEventListener('click', () => { if (auditPage < totalPages - 1) { auditPage++; loadAuditLogs(); } });
  }

  // ── Filter Events ──
  document.getElementById('auditFilterAction').addEventListener('change', () => { auditPage = 0; loadAuditLogs(); });
  document.getElementById('auditFilterDateFrom').addEventListener('change', () => { auditPage = 0; loadAuditLogs(); });
  document.getElementById('auditFilterDateTo').addEventListener('change', () => { auditPage = 0; loadAuditLogs(); });
  document.getElementById('auditFilterSearch').addEventListener('input', debounce(() => { auditPage = 0; loadAuditLogs(); }, 400));

  // ── Helpers ──
  async function logAudit(action, targetType, targetId, targetLabel, metadata = {}) {
    await sb.from('audit_log').insert({
      actor_id: ctx.session.user.id,
      actor_email: ctx.admin.email,
      action,
      target_type: targetType,
      target_id: targetId,
      target_label: targetLabel,
      metadata,
      ip_address: null // Can be added if using a server-side proxy
    });
  }

  function formatAction(action) {
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  function formatRelativeTime(iso) {
    const d = new Date(iso);
    const diff = new Date() - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
  }

  function esc(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // Set active link and badge in sidebar (already partially handled by requireAdmin)
  const badge = document.getElementById('newBadge');
  if (badge) {
    const { count } = await sb.from('form_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new');
    if (count > 0) badge.textContent = count > 99 ? '99+' : count;
  }

  // ── Init ──
  loadUsers();

})();
