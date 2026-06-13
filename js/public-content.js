/**
 * PULSE Public Website — Content Fetching Helpers
 * Handles fetching banners and blog posts from Supabase.
 * Dependencies: window.PulsePublic.sb (initialized in js/pulse-forms.js)
 */

(function () {
  'use strict';

  // Helper to wait for PulsePublic to be ready
  async function waitForPulsePublic() {
    return new Promise((resolve) => {
      if (window.PulsePublic && window.PulsePublic.sb) {
        resolve(window.PulsePublic.sb);
      } else {
        const interval = setInterval(() => {
          if (window.PulsePublic && window.PulsePublic.sb) {
            clearInterval(interval);
            resolve(window.PulsePublic.sb);
          }
        }, 50);
      }
    });
  }

  /**
   * Fetch active banners for the homepage carousel
   * @returns {Promise<Array>}
   */
  async function fetchActiveBanners() {
    try {
      const sb = await waitForPulsePublic();
      const now = new Date().toISOString();
      
      const { data, error } = await sb
        .from('banners')
        .select('id, title, subtitle, image_url, cta_text, cta_link, sort_order')
        .eq('is_active', true)
        .or(`starts_at.is.null,starts_at.lte.${now}`)
        .or(`ends_at.is.null,ends_at.gte.${now}`)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[public-content] fetchActiveBanners failed:', err);
      return [];
    }
  }

  /**
   * Fetch the latest published blogs for the homepage rail
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async function fetchLatestBlogs(limit = 4) {
    try {
      const sb = await waitForPulsePublic();
      const now = new Date().toISOString();

      const { data, error } = await sb
        .from('blogs')
        .select(`
          id, slug, title, excerpt, featured_image_url, 
          published_at, reading_time_minutes,
          blog_categories (name, slug)
        `)
        .eq('status', 'published')
        .or(`published_at.is.null,published_at.lte.${now}`)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;
      
      // Flatten the join result
      return (data || []).map(post => ({
        ...post,
        category_name: post.blog_categories?.name || 'Uncategorized',
        category_slug: post.blog_categories?.slug || 'uncategorized'
      }));
    } catch (err) {
      console.error('[public-content] fetchLatestBlogs failed:', err);
      return [];
    }
  }

  /**
   * Fetch all published blogs with pagination and filtering
   * @param {Object} options - { page, category, search }
   * @returns {Promise<Array>}
   */
  async function fetchAllBlogs({ page = 0, category = null, search = null } = {}) {
    try {
      const sb = await waitForPulsePublic();
      const now = new Date().toISOString();
      const pageSize = 12;
      const offset = page * pageSize;

      let query = sb
        .from('blogs')
        .select(`
          id, slug, title, excerpt, featured_image_url, 
          published_at, reading_time_minutes, view_count,
          blog_categories!inner (id, name, slug)
        `)
        .eq('status', 'published')
        .or(`published_at.is.null,published_at.lte.${now}`);

      if (category) {
        query = query.eq('blog_categories.slug', category);
      }

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query
        .order('published_at', { ascending: false, nullsFirst: false })
        .range(offset, offset + pageSize - 1);

      if (error) throw error;

      return (data || []).map(post => ({
        ...post,
        category_name: post.blog_categories?.name || 'Uncategorized',
        category_slug: post.blog_categories?.slug || 'uncategorized'
      }));
    } catch (err) {
      console.error('[public-content] fetchAllBlogs failed:', err);
      return [];
    }
  }

  /**
   * Fetch all blog categories
   * @returns {Promise<Array>}
   */
  async function fetchCategories() {
    try {
      const sb = await waitForPulsePublic();
      const { data, error } = await sb
        .from('blog_categories')
        .select('name, slug')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[public-content] fetchCategories failed:', err);
      return [];
    }
  }

  /**
   * Fetch a single blog post by slug
   * @param {string} slug 
   * @returns {Promise<Object|null>}
   */
  async function fetchBlogBySlug(slug) {
    try {
      const sb = await waitForPulsePublic();
      
      const { data, error } = await sb
        .from('blogs')
        .select(`
          *,
          blog_categories (id, name, slug)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        category_name: data.blog_categories?.name || 'Uncategorized',
        category_slug: data.blog_categories?.slug || 'uncategorized',
        category_id: data.blog_categories?.id
      };
    } catch (err) {
      console.error('[public-content] fetchBlogBySlug failed:', err);
      return null;
    }
  }

  /**
   * Fetch related blogs for a post
   * @param {string} currentId 
   * @param {string} categoryId 
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async function fetchRelatedBlogs(currentId, categoryId, limit = 3) {
    try {
      if (!categoryId) return [];
      const sb = await waitForPulsePublic();

      const { data, error } = await sb
        .from('blogs')
        .select(`
          id, slug, title, excerpt, featured_image_url, 
          published_at, reading_time_minutes,
          blog_categories (name, slug)
        `)
        .eq('status', 'published')
        .eq('category_id', categoryId)
        .neq('id', currentId)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(post => ({
        ...post,
        category_name: post.blog_categories?.name || 'Uncategorized',
        category_slug: post.blog_categories?.slug || 'uncategorized'
      }));
    } catch (err) {
      console.error('[public-content] fetchRelatedBlogs failed:', err);
      return [];
    }
  }

  /**
   * Increment the view count for a blog post (fire-and-forget)
   * @param {string} blogId 
   * @param {number} currentViews 
   */
  async function incrementBlogView(blogId, currentViews) {
    try {
      const sb = await waitForPulsePublic();
      // Using update instead of RPC to avoid potential missing RPCs in user's DB
      await sb
        .from('blogs')
        .update({ view_count: (currentViews || 0) + 1 })
        .eq('id', blogId);
    } catch (err) {
      // Quiet fail for view counts
      console.warn('[public-content] incrementBlogView failed (non-critical):', err);
    }
  }

  // Export helpers to global scope
  window.PulseContent = {
    fetchActiveBanners,
    fetchLatestBlogs,
    fetchAllBlogs,
    fetchCategories,
    fetchBlogBySlug,
    fetchRelatedBlogs,
    incrementBlogView
  };
})();
