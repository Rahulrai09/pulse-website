from django.contrib import admin
from django.contrib.admin.sites import AdminSite
from django.utils.html import format_html
from .models import (
    PulseContent, Product, BlogPost,
    FormSubmission, Page, Category,
)

# ─────────────────────────────────────────────────────────────────────────────
# Inject dashboard context into the DEFAULT admin.site index view.
# We patch AdminSite.index() so the default admin.site (used in urls.py)
# gets our stats data — no custom site namespace needed.
# ─────────────────────────────────────────────────────────────────────────────

import json
import datetime

_orig_index = AdminSite.index   # keep original so we can still call it

def _pulse_index(self, request, extra_context=None):
    extra_context = extra_context or {}
    total_sub = FormSubmission.objects.count()
    demo_count = FormSubmission.objects.filter(form_type='demo').count()
    quote_count = FormSubmission.objects.filter(form_type='quote').count()
    contact_count = FormSubmission.objects.filter(form_type='contact').count()

    demo_pct = (demo_count / total_sub * 100) if total_sub else 0
    quote_pct = (quote_count / total_sub * 100) if total_sub else 0
    contact_pct = (contact_count / total_sub * 100) if total_sub else 0

    # Chart data
    current_year = datetime.datetime.now().year
    months_data = [0] * 12
    demo_data = [0] * 12
    quote_data = [0] * 12
    contact_data = [0] * 12

    for submission in FormSubmission.objects.filter(submitted_at__year=current_year):
        m_idx = submission.submitted_at.month - 1
        months_data[m_idx] += 1
        if submission.form_type == 'demo':
            demo_data[m_idx] += 1
        elif submission.form_type == 'quote':
            quote_data[m_idx] += 1
        elif submission.form_type == 'contact':
            contact_data[m_idx] += 1

    extra_context.update({
        # Totals
        'total_submissions':  total_sub,
        'unread_submissions': FormSubmission.objects.filter(is_read=False).count(),
        'total_products':     Product.objects.count(),
        'active_products':    Product.objects.filter(is_active=True).count(),
        'total_blogs':        BlogPost.objects.count(),
        'published_blogs':    BlogPost.objects.filter(status='published').count(),
        'total_content':      PulseContent.objects.count(),
        'active_content':     PulseContent.objects.filter(is_active=True).count(),
        # Submission breakdown
        'demo_count':         demo_count,
        'quote_count':        quote_count,
        'contact_count':      contact_count,
        'demo_pct':           demo_pct,
        'quote_pct':          quote_pct,
        'contact_pct':        contact_pct,
        # Chart Data
        'chart_months_data':  json.dumps(months_data),
        'chart_demo_data':    json.dumps(demo_data),
        'chart_quote_data':   json.dumps(quote_data),
        'chart_contact_data': json.dumps(contact_data),
        # Recent lists
        'recent_submissions': FormSubmission.objects.order_by('-submitted_at')[:8],
        'recent_products':    Product.objects.order_by('-created_at')[:5],
        'recent_blogs':       BlogPost.objects.order_by('-created_at')[:5],
    })
    return _orig_index(self, request, extra_context)

# Apply patch to the AdminSite class — admin.site inherits this immediately
AdminSite.index = _pulse_index

# ─── Branding (applied to the default site) ───────────────────────────────
admin.site.site_header  = "Pulse Medical"
admin.site.site_title   = "Pulse Admin"
admin.site.index_title  = "Content Management"


# ─────────────────────────────────────────────────────────────────────────────
# Model Admins — all registered with the default admin.site via @admin.register
# ─────────────────────────────────────────────────────────────────────────────

@admin.register(PulseContent)
class PulseContentAdmin(admin.ModelAdmin):
    list_display    = ['section_name', 'label_text', 'value_metric',
                       'is_active', 'updated_at']
    list_filter     = ['section_name', 'is_active']
    search_fields   = ['label_text', 'section_name', 'value_metric']
    list_editable   = ['is_active']
    list_per_page   = 25
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Content',    {'fields': ('section_name', 'label_text', 'value_metric')}),
        ('Visibility', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display        = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    search_fields       = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display        = ['name', 'category', 'badge_text',
                           'is_featured', 'is_active', 'order', 'image_preview']
    list_filter         = ['category', 'is_featured', 'is_active']
    search_fields       = ['name', 'subtitle']
    list_editable       = ['is_featured', 'is_active', 'order']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields     = ['image_preview', 'created_at', 'updated_at']
    list_per_page       = 20
    fieldsets = (
        ('Basic Info', {'fields': ('name', 'slug', 'category', 'badge_text', 'subtitle')}),
        ('Content',    {'fields': ('description', 'image', 'image_preview')}),
        ('Settings',   {'fields': ('is_featured', 'is_active', 'order')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="80" height="60" '
                'style="object-fit:cover;border-radius:6px;"/>',
                obj.image.url,
            )
        return "—"
    image_preview.short_description = "Preview"


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display        = ['title', 'author', 'status', 'published_at', 'created_at']
    list_filter         = ['status', 'author']
    search_fields       = ['title', 'excerpt']
    list_editable       = ['status']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields     = ['created_at', 'updated_at']
    list_per_page       = 20
    fieldsets = (
        ('Article Info', {'fields': ('title', 'slug', 'author', 'status', 'published_at')}),
        ('Content',      {'fields': ('excerpt', 'cover_image', 'content')}),
        ('Timestamps',   {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
    list_display    = ['form_type', 'name', 'email', 'phone',
                       'product_interest', 'is_read', 'submitted_at']
    list_filter     = ['form_type', 'is_read', 'submitted_at']
    search_fields   = ['name', 'email', 'phone', 'organization', 'message']
    list_editable   = ['is_read']
    readonly_fields = ['form_type', 'name', 'email', 'phone',
                       'organization', 'message', 'product_interest', 'submitted_at']
    list_per_page   = 30

    def has_add_permission(self, request):
        return False


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display        = ['title', 'slug', 'status', 'updated_at']
    list_filter         = ['status']
    search_fields       = ['title']
    list_editable       = ['status']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields     = ['created_at', 'updated_at']
    list_per_page       = 20
