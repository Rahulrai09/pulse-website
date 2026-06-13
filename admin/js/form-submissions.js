(async function () {
  'use strict';

  if (!window.PulseAdmin) return;
  const ctx = await window.PulseAdmin.requireAdmin();
  if (!ctx) return;

  const { sb } = window.PulseAdmin;
  const canEdit = ['super_admin', 'editor'].includes(ctx.admin.role);

  const PAGE_SIZE = 20;
  let currentPage = 0;
  let totalCount = 0;
  let activeStatus = '';
  let activeType = '';
  let searchTerm = '';

  const tableBody = document.getElementById('tableBody');
  const pagination = document.getElementById('pagination');
  const paginationInfo = document.getElementById('paginationInfo');
  const paginationBtns = document.getElementById('paginationBtns');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawer = document.getElementById('drawer');
  const drawerBody = document.getElementById('drawerBody');
  const drawerFooter = document.getElementById('drawerFooter');

  // Filters
  document.querySelectorAll('#statusPills button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('#statusPills .active').classList.remove('active');
      btn.classList.add('active');
      activeStatus = btn.dataset.status;
      currentPage = 0;
      loadData();
    });
  });

  document.getElementById('filterType').addEventListener('change', (e) => {
    activeType = e.target.value;
    currentPage = 0;
    loadData();
  });

  document.getElementById('filterSearch').addEventListener('input', debounce((e) => {
    searchTerm = e.target.value.trim();
    currentPage = 0;
    loadData();
  }, 400));

  // Drawer
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  function openDrawer(s) {
    renderDrawer(s);
    drawer.style.right = '0';
    drawerOverlay.style.opacity = '1';
    drawerOverlay.style.pointerEvents = 'auto';
  }

  function closeDrawer() {
    drawer.style.right = '-450px';
    drawerOverlay.style.opacity = '0';
    drawerOverlay.style.pointerEvents = 'none';
  }

  function renderDrawer(s) {
    const date = new Date(s.created_at).toLocaleString();
    drawerBody.innerHTML = `
      <div style="margin-bottom:20px;">
        <label style="font-size:11px; color:#6b7280; font-weight:600; text-transform:uppercase;">Submitted</label>
        <div style="font-size:14px;">${date}</div>
      </div>
      <div style="margin-bottom:20px;">
        <label style="font-size:11px; color:#6b7280; font-weight:600; text-transform:uppercase;">Name</label>
        <div style="font-size:14px; font-weight:500;">${esc(s.name)}</div>
      </div>
      <div style="margin-bottom:20px;">
        <label style="font-size:11px; color:#6b7280; font-weight:600; text-transform:uppercase;">Email</label>
        <div style="font-size:14px;"><a href="mailto:${esc(s.email)}" style="color:#1d3461;">${esc(s.email)}</a></div>
      </div>
      <div style="margin-bottom:20px;">
        <label style="font-size:11px; color:#6b7280; font-weight:600; text-transform:uppercase;">Message</label>
        <div style="font-size:14px; line-height:1.6; background:#f9fafb; padding:12px; border-radius:8px;">${esc(s.message)}</div>
      </div>
      <div style="margin-bottom:20px;">
        <label style="font-size:11px; color:#6b7280; font-weight:600; text-transform:uppercase;">Status</label>
        <select id="drawerStatus" style="width:100%; padding:8px; border-radius:8px; border:1px solid rgba(0,0,0,0.1);" ${!canEdit ? 'disabled' : ''}>
          <option value="new" ${s.status === 'new' ? 'selected' : ''}>New</option>
          <option value="read" ${s.status === 'read' ? 'selected' : ''}>Read</option>
          <option value="replied" ${s.status === 'replied' ? 'selected' : ''}>Replied</option>
          <option value="archived" ${s.status === 'archived' ? 'selected' : ''}>Archived</option>
        </select>
      </div>
    `;

    drawerFooter.innerHTML = '';
    if (canEdit) {
      const btn = document.createElement('button');
      btn.className = 'btn-primary';
      btn.textContent = 'Save Changes';
      btn.onclick = () => saveStatus(s.id);
      drawerFooter.appendChild(btn);
    }
  }

  async function saveStatus(id) {
    const status = document.getElementById('drawerStatus').value;
    const { error } = await sb.from('form_submissions').update({ status }).eq('id', id);
    if (error) alert('Error: ' + error.message);
    else { closeDrawer(); loadData(); }
  }

  async function loadData() {
    tableBody.innerHTML = '<tr><td colspan="6" style="padding:40px; text-align:center;">Loading...</td></tr>';
    let query = sb.from('form_submissions').select('*', { count: 'exact' });

    if (activeStatus) query = query.eq('status', activeStatus);
    if (activeType) query = query.eq('form_type', activeType);
    if (searchTerm) query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);

    const from = currentPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, count, error } = await query.order('created_at', { ascending: false }).range(from, to);

    if (error) { tableBody.innerHTML = `<tr><td colspan="6" style="padding:40px; text-align:center; color:red;">${error.message}</td></tr>`; return; }

    totalCount = count || 0;
    if (!data || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="padding:40px; text-align:center; color:#6b7280;">No results found.</td></tr>';
      pagination.style.display = 'none';
      return;
    }

    tableBody.innerHTML = data.map(row => `
      <tr style="border-bottom:1px solid rgba(0,0,0,0.05); cursor:pointer;" data-id="${row.id}">
        <td style="padding:12px 16px;">${new Date(row.created_at).toLocaleDateString()}</td>
        <td style="padding:12px 16px;"><span style="font-size:11px; padding:2px 6px; background:#f3f4f6; border-radius:4px;">${esc(row.form_type)}</span></td>
        <td style="padding:12px 16px; font-weight:500;">${esc(row.name)}</td>
        <td style="padding:12px 16px;">${esc(row.email)}</td>
        <td style="padding:12px 16px;"><span class="status-pill pill-${row.status}" style="padding:2px 8px; border-radius:12px; font-size:10px; font-weight:600; text-transform:uppercase;">${row.status}</span></td>
        <td style="padding:12px 16px;"><button class="btn-cancel" style="padding:4px 8px; font-size:11px;">View</button></td>
      </tr>
    `).join('');

    tableBody.querySelectorAll('tr[data-id]').forEach(tr => {
      tr.addEventListener('click', () => {
        const s = data.find(d => d.id === tr.dataset.id);
        if (s) openDrawer(s);
      });
    });

    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    if (totalPages <= 1) { pagination.style.display = 'none'; return; }
    pagination.style.display = 'flex';
    paginationInfo.textContent = `Showing ${currentPage * PAGE_SIZE + 1}–${Math.min((currentPage + 1) * PAGE_SIZE, totalCount)} of ${totalCount}`;
    
    let html = `<button class="btn-cancel" ${currentPage === 0 ? 'disabled' : ''} data-page="${currentPage - 1}">Prev</button>`;
    for (let i = 0; i < totalPages; i++) {
      if (i < 3 || i > totalPages - 4 || (i >= currentPage - 1 && i <= currentPage + 1)) {
        html += `<button class="btn-cancel ${i === currentPage ? 'active' : ''}" data-page="${i}" style="${i === currentPage ? 'background:#1d3461; color:#fff;' : ''}">${i + 1}</button>`;
      } else if (i === 3 || i === totalPages - 4) {
        html += '<span style="padding:0 8px;">...</span>';
      }
    }
    html += `<button class="btn-cancel" ${currentPage >= totalPages - 1 ? 'disabled' : ''} data-page="${currentPage + 1}">Next</button>`;
    paginationBtns.innerHTML = html;

    paginationBtns.querySelectorAll('button[data-page]').forEach(btn => {
      btn.onclick = () => { if (btn.disabled) return; currentPage = parseInt(btn.dataset.page); loadData(); };
    });
  }

  function debounce(fn, ms) { let t; return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); }; }
  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  loadData();

})();
