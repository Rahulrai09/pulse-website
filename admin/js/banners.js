/**
 * PHASE 3: BANNERS CRUD WITH STORAGE
 * Logic for managing homepage banners.
 */

(async function () {
  'use strict';

  // --- Auth & Config ---
  const ctx = await window.PulseAdmin.requireAdmin();
  if (!ctx) return;

  const { sb } = window.PulseAdmin;
  const canEdit = ['super_admin', 'editor'].includes(ctx.admin.role);

  // --- DOM Refs ---
  const bannerListEl = document.getElementById('bannerList');
  const emptyStateEl = document.getElementById('emptyState');
  const previewBoxEl = document.getElementById('previewBox');
  const addBtn = document.getElementById('addBannerBtn');
  
  const drawer = document.getElementById('bannerDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerTitle = document.getElementById('drawerTitle');
  const bannerForm = document.getElementById('bannerForm');
  
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const uploadPreview = document.getElementById('uploadPreview');
  const uploadProgress = document.getElementById('uploadProgress');
  
  const toastSave = document.getElementById('toastSave');

  // --- State ---
  let banners = [];
  let editingId = null;
  let uploadedUrl = null;
  let isUploading = false;

  // --- Initialization ---
  init();

  async function init() {
    setupEventListeners();
    await loadBanners();
    initSortable();
  }

  function setupEventListeners() {
    if (addBtn) addBtn.onclick = () => openDrawer();
    if (drawerOverlay) drawerOverlay.onclick = closeDrawer;
    document.getElementById('drawerClose').onclick = closeDrawer;

    // Form inputs for Live Preview
    bannerForm.oninput = updateLivePreview;

    // Image Upload
    uploadZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => handleFileUpload(e.target.files[0]);
    
    uploadZone.ondragover = (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); };
    uploadZone.ondragleave = () => uploadZone.classList.remove('dragover');
    uploadZone.ondrop = (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      handleFileUpload(e.dataTransfer.files[0]);
    };

    // Schedule Toggle
    document.getElementById('scheduleHeader').onclick = () => {
      document.getElementById('scheduleFields').classList.toggle('open');
    };

    // Character Counters
    setupCharCounter('title', 80);
    setupCharCounter('subtitle', 160);

    // Save Form
    bannerForm.onsubmit = handleSave;

    // Preview Toggle (Desktop/Mobile)
    document.querySelectorAll('.preview-toggle button').forEach(btn => {
      btn.onclick = () => {
        document.querySelector('.preview-toggle button.active').classList.remove('active');
        btn.classList.add('active');
        previewBoxEl.style.aspectRatio = btn.dataset.mode === 'mobile' ? '9 / 16' : '16 / 9';
      };
    });
  }

  // --- Data Loading ---
  async function loadBanners() {
    const { data, error } = await sb
      .from('banners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Load Error:', error);
      return;
    }

    banners = data || [];
    renderBanners();
  }

  function renderBanners() {
    if (banners.length === 0) {
      bannerListEl.style.display = 'none';
      emptyStateEl.style.display = 'block';
      return;
    }

    bannerListEl.style.display = 'block';
    emptyStateEl.style.display = 'none';

    bannerListEl.innerHTML = banners.map(b => {
      const status = getBannerStatus(b);
      return `
        <div class="banner-item" data-id="${b.id}">
          <div class="drag-handle ${!canEdit ? 'hide' : ''}"><i class="ti ti-menu-2"></i></div>
          <img src="${b.image_url}" alt="" class="banner-thumb">
          <div class="banner-info">
            <h3>${esc(b.title)}</h3>
            <p>${esc(b.subtitle || '')}</p>
          </div>
          <div class="banner-status">
            <span class="status-pill ${status.class}">${status.label}</span>
            ${b.starts_at || b.ends_at ? `<span class="schedule-text">${formatSchedule(b)}</span>` : ''}
          </div>
          <div class="banner-actions">
            <button class="btn-icon" onclick="window.PulseBanners.edit('${b.id}')" title="Edit"><i class="ti ti-edit"></i></button>
            <button class="btn-icon" onclick="window.PulseBanners.toggleActive('${b.id}', ${!b.is_active})" title="${b.is_active ? 'Deactivate' : 'Activate'}">
              <i class="ti ti-eye${b.is_active ? '-off' : ''}"></i>
            </button>
            <button class="btn-icon btn-delete ${!canEdit ? 'hide' : ''}" onclick="window.PulseBanners.remove('${b.id}')" title="Delete"><i class="ti ti-trash"></i></button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- CRUD Actions ---

  async function handleSave(e) {
    e.preventDefault();
    if (isUploading) return;
    
    const formData = new FormData(bannerForm);
    const payload = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      cta_text: formData.get('cta_text'),
      cta_link: formData.get('cta_link'),
      is_active: formData.get('is_active') === 'on',
      sort_order: parseInt(formData.get('sort_order')) || 0,
      starts_at: formData.get('starts_at') || null,
      ends_at: formData.get('ends_at') || null,
      image_url: uploadedUrl,
      updated_at: new Date().toISOString(),
      updated_by: ctx.session.user.id
    };

    if (!payload.image_url) { alert('Please upload an image.'); return; }

    const saveBtn = bannerForm.querySelector('button[type="submit"]');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    let error;
    if (editingId) {
      ({ error } = await sb.from('banners').update(payload).eq('id', editingId));
    } else {
      payload.created_by = ctx.session.user.id;
      ({ error } = await sb.from('banners').insert([payload]));
    }

    if (error) {
      alert('Save failed: ' + error.message);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Banner';
    } else {
      closeDrawer();
      await loadBanners();
    }
  }

  async function remove(id) {
    if (!confirm('Are you sure you want to delete this banner? This will also remove the image from storage.')) return;
    
    const banner = banners.find(b => b.id === id);
    if (!banner) return;

    // 1. Delete from DB
    const { error } = await sb.from('banners').delete().eq('id', id);
    if (error) { alert('Delete failed: ' + error.message); return; }

    // 2. Delete from Storage
    try {
      const path = banner.image_url.split('/banner-images/')[1];
      if (path) {
        await sb.storage.from('banner-images').remove([path]);
      }
    } catch (err) {
      console.warn('Storage cleanup failed (non-critical):', err);
    }

    await loadBanners();
  }

  async function toggleActive(id, state) {
    const { error } = await sb.from('banners').update({ is_active: state }).eq('id', id);
    if (error) alert('Toggle failed: ' + error.message);
    else await loadBanners();
  }

  function edit(id) {
    const b = banners.find(x => x.id === id);
    if (!b) return;
    openDrawer(b);
  }

  // --- Upload Logic ---

  async function handleFileUpload(file) {
    if (!file) return;
    if (!canEdit) { alert('You do not have permission to upload images.'); return; }

    // Validation
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { alert('Invalid file type. Please use JPG, PNG, or WEBP.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB allowed.'); return; }

    isUploading = true;
    uploadProgress.style.width = '0%';
    uploadZone.querySelector('.upload-overlay').innerHTML = '<span>Uploading...</span>';
    uploadZone.querySelector('.upload-overlay').style.opacity = '1';

    const ext = file.name.split('.').pop();
    const filename = `${crypto.randomUUID()}-${slugify(file.name.split('.')[0])}.${ext}`;

    const { data, error } = await sb.storage
      .from('banner-images')
      .upload(filename, file, { cacheControl: '3600', upsert: false });

    if (error) {
      alert('Upload failed: ' + error.message);
      isUploading = false;
      uploadZone.querySelector('.upload-overlay').style.opacity = '0';
      return;
    }

    const { data: { publicUrl } } = sb.storage.from('banner-images').getPublicUrl(filename);
    uploadedUrl = publicUrl;
    
    // Update UI
    uploadPreview.src = uploadedUrl;
    uploadPreview.style.display = 'block';
    uploadProgress.style.width = '100%';
    isUploading = false;
    uploadZone.querySelector('.upload-overlay').innerHTML = '<span>Change Image</span>';
    
    updateLivePreview();
  }

  // --- UI Helpers ---

  function openDrawer(banner = null) {
    editingId = banner ? banner.id : null;
    uploadedUrl = banner ? banner.image_url : null;
    drawerTitle.textContent = banner ? 'Edit Banner' : 'New Banner';
    
    bannerForm.reset();
    uploadPreview.style.display = 'none';
    uploadProgress.style.width = '0%';
    document.getElementById('scheduleFields').classList.remove('open');

    if (banner) {
      document.getElementById('f_title').value = banner.title;
      document.getElementById('f_subtitle').value = banner.subtitle || '';
      document.getElementById('f_cta_text').value = banner.cta_text || '';
      document.getElementById('f_cta_link').value = banner.cta_link || '';
      document.getElementById('f_sort_order').value = banner.sort_order;
      document.getElementById('f_active').checked = banner.is_active;
      document.getElementById('f_starts_at').value = banner.starts_at ? banner.starts_at.slice(0, 16) : '';
      document.getElementById('f_ends_at').value = banner.ends_at ? banner.ends_at.slice(0, 16) : '';
      
      uploadPreview.src = banner.image_url;
      uploadPreview.style.display = 'block';
      uploadZone.querySelector('.upload-overlay').innerHTML = '<span>Change Image</span>';
    } else {
      document.getElementById('f_sort_order').value = banners.length > 0 ? Math.max(...banners.map(b => b.sort_order)) + 1 : 1;
      uploadZone.querySelector('.upload-overlay').innerHTML = '<span>Upload Image</span>';
    }

    updateLivePreview();
    updateCharCount('title', 80);
    updateCharCount('subtitle', 160);

    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    editingId = null;
    uploadedUrl = null;
  }

  function updateLivePreview() {
    const title = document.getElementById('f_title').value || 'Banner Title';
    const subtitle = document.getElementById('f_subtitle').value || 'Banner subtitle text appears here.';
    const cta = document.getElementById('f_cta_text').value || 'Button Text';
    
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewSubtitle').textContent = subtitle;
    document.getElementById('previewCta').textContent = cta;
    document.getElementById('previewImg').src = uploadedUrl || 'https://picsum.photos/1200/600?grayscale';
  }

  function initSortable() {
    if (!canEdit || !window.Sortable) return;
    new Sortable(bannerListEl, {
      handle: '.drag-handle',
      animation: 150,
      ghostClass: 'sortable-ghost',
      onEnd: async () => {
        const ids = Array.from(bannerListEl.children).map(el => el.dataset.id);
        await saveSortOrder(ids);
      }
    });
  }

  async function saveSortOrder(ids) {
    showToast('Saving order...');
    
    // Optimistic UI update in local state
    const newBanners = ids.map((id, index) => {
      const b = banners.find(x => x.id === id);
      return { ...b, sort_order: index + 1 };
    });

    // Batch update (Upsert is easiest for this)
    const { error } = await sb
      .from('banners')
      .upsert(newBanners.map(b => ({
        id: b.id,
        sort_order: b.sort_order,
        updated_at: new Date().toISOString()
      })));

    if (error) {
      alert('Failed to save order: ' + error.message);
      await loadBanners(); // Rollback
    } else {
      banners = newBanners;
      hideToast();
    }
  }

  // --- Utils ---

  function getBannerStatus(b) {
    if (!b.is_active) return { label: 'Inactive', class: 'inactive' };
    const now = new Date();
    if (b.starts_at && new Date(b.starts_at) > now) return { label: 'Scheduled', class: 'scheduled' };
    if (b.ends_at && new Date(b.ends_at) < now) return { label: 'Expired', class: 'expired' };
    return { label: 'Active', class: 'active' };
  }

  function formatSchedule(b) {
    const s = b.starts_at ? new Date(b.starts_at).toLocaleDateString() : '...';
    const e = b.ends_at ? new Date(b.ends_at).toLocaleDateString() : '...';
    return `${s} to ${e}`;
  }

  function setupCharCounter(id, max) {
    const input = document.getElementById('f_' + id);
    input.onkeyup = () => updateCharCount(id, max);
  }

  function updateCharCount(id, max) {
    const input = document.getElementById('f_' + id);
    const counter = document.getElementById('count_' + id);
    counter.textContent = `${input.value.length} / ${max}`;
    counter.style.color = input.value.length > max ? '#dc2626' : '#9ca3af';
  }

  function showToast(msg) {
    toastSave.querySelector('span').textContent = msg;
    toastSave.classList.add('show');
  }

  function hideToast() {
    toastSave.classList.remove('show');
  }

  function slugify(text) {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Global exports for inline onclicks
  window.PulseBanners = { edit, remove, toggleActive };

})();
