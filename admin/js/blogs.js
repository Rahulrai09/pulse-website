/**
 * PHASE 4: BLOGS — RICH TEXT EDITOR + SEO + WORKFLOW
 */

(async function () {
  'use strict';

  // --- Auth & Config ---
  const ctx = await window.PulseAdmin.requireAdmin();
  if (!ctx) return;

  const { sb } = window.PulseAdmin;
  const canEdit = ['super_admin', 'editor'].includes(ctx.admin.role);

  // --- TipTap Editor Instance ---
  let editor = null;
  let autoSaveTimeout = null;
  let lastSavedAt = null;

  // --- State ---
  let blogs = [];
  let categories = [];
  let currentBlog = null; // When editing
  let activeTab = 'all';
  let searchQuery = '';

  // --- DOM Refs ---
  const listView = document.getElementById('listView');
  const editorView = document.getElementById('editorView');
  const blogListEl = document.getElementById('blogList');
  const addBtn = document.getElementById('addBlogBtn');
  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const searchInput = document.getElementById('blogSearch');
  
  // Editor Refs
  const blogForm = document.getElementById('blogForm');
  const titleInput = document.getElementById('blogTitle');
  const slugInput = document.getElementById('blogSlug');
  const categorySelect = document.getElementById('blogCategory');
  const statusSelect = document.getElementById('blogStatus');
  const scheduleWrap = document.getElementById('scheduleWrap');
  const scheduledFor = document.getElementById('f_scheduled_for');
  
  const featuredImageZone = document.getElementById('featuredImageZone');
  const featuredImageInput = document.getElementById('featuredImageInput');
  const featuredImagePreview = document.getElementById('featuredImagePreview');
  
  const autoSaveIndicator = document.getElementById('autoSaveIndicator');
  const revisionsPanel = document.getElementById('revisionsPanel');
  const revisionsList = document.getElementById('revisionsList');

  // --- Initialization ---
  init();

  async function init() {
    setupEventListeners();
    await loadCategories();
    await loadBlogs();
    initTipTap();
  }

  function setupEventListeners() {
    // List View
    addBtn.onclick = () => openEditor();
    
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.dataset.tab;
        renderBlogs();
      };
    });

    searchInput.oninput = (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderBlogs();
    };

    // Editor
    document.getElementById('cancelEdit').onclick = () => {
      if (confirm('Are you sure? Unsaved changes will be lost.')) closeEditor();
    };

    titleInput.oninput = (e) => {
      if (!currentBlog || !currentBlog.id) { // Only auto-gen slug for new posts
        const slug = slugify(e.target.value);
        slugInput.value = slug;
        document.getElementById('slugPreview').textContent = slug;
      }
      triggerAutoSave();
    };

    slugInput.oninput = (e) => {
      const slug = slugify(e.target.value);
      slugInput.value = slug;
      document.getElementById('slugPreview').textContent = slug;
    };

    // Image Upload (Reuse Banner Pattern)
    featuredImageZone.onclick = () => featuredImageInput.click();
    featuredImageInput.onchange = (e) => handleImageUpload(e.target.files[0], 'featured');

    // SEO Toggle
    document.getElementById('seoToggle').onclick = () => {
      document.getElementById('seoFields').classList.toggle('open');
      document.getElementById('seoChevron').classList.toggle('ti-chevron-up');
    };

    // Status Change
    statusSelect.onchange = (e) => {
      scheduleWrap.style.display = e.target.value === 'scheduled' ? 'block' : 'none';
    };

    // Form Save
    blogForm.onsubmit = (e) => handleSave(e, false);
    document.getElementById('savePublish').onclick = (e) => handleSave(e, true);

    // Revisions
    document.getElementById('openRevisions').onclick = () => toggleRevisions(true);
    document.getElementById('closeRevisions').onclick = () => toggleRevisions(false);
  }

  // --- TipTap Setup ---
  function initTipTap() {
    const { Editor } = window.tiptap;
    const StarterKit = window.tiptap.StarterKit;
    const Link = window.tiptap.Link;
    const Image = window.tiptap.Image;
    const Underline = window.tiptap.Underline;
    const Placeholder = window.tiptap.Placeholder;

    editor = new Editor({
      element: document.getElementById('tiptapEditor'),
      extensions: [
        StarterKit,
        Underline,
        Link.configure({ openOnClick: false }),
        Image,
        Placeholder.configure({ placeholder: 'Start writing your story...' })
      ],
      content: '',
      onUpdate({ editor }) {
        updateStats();
        triggerAutoSave();
      }
    });

    // Toolbar logic
    document.querySelectorAll('.tiptap-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        const level = btn.dataset.level;

        if (action === 'bold') editor.chain().focus().toggleBold().run();
        if (action === 'italic') editor.chain().focus().toggleItalic().run();
        if (action === 'underline') editor.chain().focus().toggleUnderline().run();
        if (action === 'strike') editor.chain().focus().toggleStrike().run();
        if (action === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
        if (action === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
        if (action === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
        if (action === 'bulletList') editor.chain().focus().toggleBulletList().run();
        if (action === 'orderedList') editor.chain().focus().toggleOrderedList().run();
        if (action === 'blockquote') editor.chain().focus().toggleBlockquote().run();
        if (action === 'codeBlock') editor.chain().focus().toggleCodeBlock().run();
        if (action === 'undo') editor.chain().focus().undo().run();
        if (action === 'redo') editor.chain().focus().redo().run();
        
        if (action === 'link') {
          const url = prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }

        if (action === 'image') {
          const url = prompt('Enter Image URL or use the featured image upload below.');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }
      };
    });
  }

  function updateStats() {
    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const minutes = Math.ceil(words / 200);
    document.getElementById('wordCount').textContent = words;
    document.getElementById('readingTime').textContent = minutes;
  }

  // --- Data Loading ---
  async function loadCategories() {
    const { data } = await sb.from('blog_categories').select('*').order('name');
    categories = data || [];
    categorySelect.innerHTML = '<option value="">Uncategorized</option>' + 
      categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  async function loadBlogs() {
    const { data, error } = await sb
      .from('blogs')
      .select('*, blog_categories(name)')
      .order('created_at', { ascending: false });

    if (error) { console.error('Load Error:', error); return; }
    blogs = data || [];
    updateTabs();
    renderBlogs();
  }

  function updateTabs() {
    const counts = {
      all: blogs.length,
      draft: blogs.filter(b => b.status === 'draft').length,
      scheduled: blogs.filter(b => b.status === 'scheduled').length,
      published: blogs.filter(b => b.status === 'published').length,
      archived: blogs.filter(b => b.status === 'archived').length
    };

    Object.keys(counts).forEach(key => {
      const el = document.querySelector(`.tab-btn[data-tab="${key}"] .tab-count`);
      if (el) el.textContent = counts[key];
    });
  }

  function renderBlogs() {
    let filtered = blogs;
    if (activeTab !== 'all') filtered = filtered.filter(b => b.status === activeTab);
    if (searchQuery) filtered = filtered.filter(b => b.title.toLowerCase().includes(searchQuery));

    if (filtered.length === 0) {
      blogListEl.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; padding: 60px;">
          <i class="ti ti-news"></i>
          <h2>No posts found</h2>
          <p>Try a different filter or create a new blog post.</p>
        </div>
      `;
      return;
    }

    blogListEl.innerHTML = filtered.map(b => `
      <div class="blog-card" onclick="window.PulseBlogs.edit('${b.id}')">
        <img src="${b.featured_image_url || 'https://picsum.photos/400/300?grayscale'}" class="blog-card-img">
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="status-pill badge-${b.status}">${b.status.toUpperCase()}</span>
            <span style="font-size:11px; font-weight:600; color:#1e40af;">${b.blog_categories?.name || 'Uncategorized'}</span>
          </div>
          <h3 class="blog-card-title">${esc(b.title)}</h3>
          <p class="blog-card-excerpt">${esc(b.excerpt || 'No excerpt available...')}</p>
        </div>
        <div class="blog-card-footer">
          <span><i class="ti ti-eye"></i> ${b.view_count} views</span>
          <span>${new Date(b.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');
  }

  // --- CRUD Logic ---
  async function handleSave(e, publish = false) {
    if (e) e.preventDefault();
    if (!canEdit) return;

    const formData = new FormData(blogForm);
    const contentJSON = editor.getJSON();
    const contentHTML = editor.getHTML();
    
    const payload = {
      title: titleInput.value,
      slug: slugInput.value,
      excerpt: formData.get('excerpt') || extractExcerpt(contentHTML),
      content: contentJSON,
      content_html: contentHTML,
      category_id: categorySelect.value || null,
      featured_image_url: featuredImagePreview.src.includes('http') ? featuredImagePreview.src : null,
      status: publish ? 'published' : formData.get('status'),
      scheduled_for: formData.get('scheduled_for') || null,
      seo_title: formData.get('seo_title'),
      seo_description: formData.get('seo_description'),
      tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
      updated_at: new Date().toISOString(),
      updated_by: ctx.session.user.id
    };

    if (publish) {
      payload.published_at = new Date().toISOString();
    }

    let error;
    if (currentBlog?.id) {
      ({ error } = await sb.from('blogs').update(payload).eq('id', currentBlog.id));
    } else {
      payload.created_by = ctx.session.user.id;
      payload.author_id = ctx.session.user.id;
      ({ error } = await sb.from('blogs').insert([payload]));
    }

    if (error) {
      alert('Save failed: ' + error.message);
    } else {
      closeEditor();
      await loadBlogs();
    }
  }

  function openEditor(blog = null) {
    currentBlog = blog;
    listView.style.display = 'none';
    editorView.style.display = 'grid';
    
    blogForm.reset();
    editor.commands.setContent(blog ? blog.content : '');
    featuredImagePreview.src = blog ? blog.featured_image_url : '';
    featuredImagePreview.style.display = blog && blog.featured_image_url ? 'block' : 'none';

    if (blog) {
      titleInput.value = blog.title;
      slugInput.value = blog.slug;
      categorySelect.value = blog.category_id || '';
      statusSelect.value = blog.status;
      scheduledFor.value = blog.scheduled_for ? blog.scheduled_for.slice(0,16) : '';
      scheduleWrap.style.display = blog.status === 'scheduled' ? 'block' : 'none';
      document.getElementById('slugPreview').textContent = blog.slug;
      document.getElementById('f_excerpt').value = blog.excerpt || '';
      document.getElementById('f_seo_title').value = blog.seo_title || '';
      document.getElementById('f_seo_description').value = blog.seo_description || '';
      document.getElementById('f_tags').value = (blog.tags || []).join(', ');
    } else {
      document.getElementById('slugPreview').textContent = '...';
      statusSelect.value = 'draft';
      scheduleWrap.style.display = 'none';
    }

    updateStats();
    toggleRevisions(false);
  }

  function closeEditor() {
    editorView.style.display = 'none';
    listView.style.display = 'block';
    currentBlog = null;
    clearTimeout(autoSaveTimeout);
  }

  // --- Auto-Save ---
  function triggerAutoSave() {
    if (!currentBlog || currentBlog.status === 'published') return;
    
    autoSaveIndicator.textContent = 'Unsaved changes';
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(async () => {
      autoSaveIndicator.innerHTML = '<i class="ti ti-loader-2 ti-spin"></i> Saving...';
      
      const payload = {
        title: titleInput.value,
        content: editor.getJSON(),
        content_html: editor.getHTML(),
        updated_at: new Date().toISOString()
      };

      const { error } = await sb.from('blogs').update(payload).eq('id', currentBlog.id);
      if (!error) {
        lastSavedAt = new Date();
        autoSaveIndicator.textContent = 'Saved at ' + lastSavedAt.toLocaleTimeString();
      }
    }, 3000);
  }

  // --- Revisions ---
  async function toggleRevisions(open) {
    if (open) {
      revisionsPanel.classList.add('open');
      if (currentBlog?.id) {
        const { data } = await sb
          .from('blog_revisions')
          .select('*')
          .eq('blog_id', currentBlog.id)
          .order('created_at', { ascending: false });
        
        revisionsList.innerHTML = (data || []).map(r => `
          <div class="revision-item" onclick="window.PulseBlogs.restore('${r.id}')">
            <div class="time">${new Date(r.created_at).toLocaleString()}</div>
            <div class="author">Modified version: ${esc(r.title)}</div>
          </div>
        `).join('') || '<p style="padding:20px; color:#9ca3af; font-size:13px;">No revisions yet.</p>';
      }
    } else {
      revisionsPanel.classList.remove('open');
    }
  }

  async function restoreRevision(revisionId) {
    if (!confirm('Restore this version? Current unsaved changes will be lost.')) return;
    
    const { data, error } = await sb.from('blog_revisions').select('*').eq('id', revisionId).single();
    if (data) {
      titleInput.value = data.title;
      editor.commands.setContent(data.content);
      toggleRevisions(false);
      alert('Revision restored. Click Save to commit.');
    }
  }

  // --- Image Handling ---
  async function handleImageUpload(file, type) {
    if (!file) return;
    
    const ext = file.name.split('.').pop();
    const filename = `${crypto.randomUUID()}.${ext}`;

    const { data, error } = await sb.storage
      .from('blog-images')
      .upload(filename, file);

    if (error) { alert('Upload failed: ' + error.message); return; }

    const { data: { publicUrl } } = sb.storage.from('blog-images').getPublicUrl(filename);
    
    if (type === 'featured') {
      featuredImagePreview.src = publicUrl;
      featuredImagePreview.style.display = 'block';
    }
    
    return publicUrl;
  }

  // --- Utils ---
  function slugify(text) {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  function extractExcerpt(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.innerText || temp.textContent || "";
    return text.slice(0, 160) + (text.length > 160 ? '...' : '');
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Global exports
  window.PulseBlogs = { 
    edit: (id) => openEditor(blogs.find(b => b.id === id)),
    restore: restoreRevision
  };

})();
