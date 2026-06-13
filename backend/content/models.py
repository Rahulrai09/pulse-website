from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField


# ─────────────────────────────────────────────────────────────────────────────
# Original PulseContent model (unchanged)
# ─────────────────────────────────────────────────────────────────────────────

class PulseContent(models.Model):

    SECTION_CHOICES = [
        ('hero_badges',    'Hero Badges'),
        ('intro_stats',    'Intro Stats'),
        ('why_pulse',      'Why Pulse'),
        ('backed_by',      'Backed By'),
        ('certifications', 'Certifications'),
        ('other',          'Other'),
    ]

    section_name = models.CharField(
        max_length=100,
        choices=SECTION_CHOICES,
        help_text="Which section of the website this belongs to",
    )
    label_text = models.CharField(
        max_length=200,
        help_text="Display text e.g. 'ISO', 'Made in India', '500+'",
    )
    value_metric = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Optional metric e.g. '72 Hrs', '65+ Yrs'",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Toggle to show/hide this item on the website",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pulse Content"
        verbose_name_plural = "Pulse Content Items"
        ordering = ['section_name', 'label_text']

    def __str__(self):
        return f"{self.section_name} — {self.label_text}"


# ─────────────────────────────────────────────────────────────────────────────
# Category
# ─────────────────────────────────────────────────────────────────────────────

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


# ─────────────────────────────────────────────────────────────────────────────
# Product
# ─────────────────────────────────────────────────────────────────────────────

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('critical_care',  'Critical Care'),
        ('renal_care',     'Renal Care'),
        ('cardiac_care',   'Cardiac Care'),
        ('aesthetics',     'Aesthetics'),
        ('rehab_therapy',  'Rehab & Therapy'),
        ('hospital_setup', 'Hospital Setup'),
    ]

    name     = models.CharField(max_length=200)
    slug     = models.SlugField(unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    subtitle = models.CharField(max_length=300, blank=True)
    description  = RichTextUploadingField(blank=True)
    image    = models.ImageField(upload_to='products/', blank=True, null=True)
    badge_text   = models.CharField(
        max_length=50, blank=True,
        help_text="e.g. ICU GRADE, OT GRADE",
    )
    is_featured  = models.BooleanField(default=False)
    is_active    = models.BooleanField(default=True)
    order        = models.PositiveIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'order']

    def __str__(self):
        return f"{self.name} ({self.category})"


# ─────────────────────────────────────────────────────────────────────────────
# BlogPost
# ─────────────────────────────────────────────────────────────────────────────

class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft',     'Draft'),
        ('published', 'Published'),
    ]

    title       = models.CharField(max_length=300)
    slug        = models.SlugField(unique=True)
    excerpt     = models.TextField(
        max_length=500,
        help_text="Short summary shown in listings",
    )
    content     = RichTextUploadingField()
    cover_image = models.ImageField(upload_to='blog/', blank=True, null=True)
    author      = models.CharField(max_length=100, default='Pulse Team')
    status      = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='draft',
    )
    published_at = models.DateTimeField(blank=True, null=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


# ─────────────────────────────────────────────────────────────────────────────
# FormSubmission
# ─────────────────────────────────────────────────────────────────────────────

class FormSubmission(models.Model):
    FORM_TYPE_CHOICES = [
        ('demo',    'Request a Demo'),
        ('quote',   'Get a Quote'),
        ('contact', 'Contact Us'),
        ('support', 'Service Support'),
    ]

    form_type        = models.CharField(max_length=20, choices=FORM_TYPE_CHOICES)
    name             = models.CharField(max_length=200)
    email            = models.EmailField()
    phone            = models.CharField(max_length=20, blank=True)
    organization     = models.CharField(max_length=200, blank=True)
    message          = models.TextField(blank=True)
    product_interest = models.CharField(max_length=200, blank=True)
    is_read          = models.BooleanField(default=False)
    submitted_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Form Submission"

    def __str__(self):
        return f"{self.form_type} — {self.name} ({self.email})"


# ─────────────────────────────────────────────────────────────────────────────
# Page
# ─────────────────────────────────────────────────────────────────────────────

class Page(models.Model):
    STATUS_CHOICES = [
        ('draft',     'Draft'),
        ('published', 'Published'),
    ]

    title            = models.CharField(max_length=200)
    slug             = models.SlugField(unique=True)
    meta_description = models.CharField(
        max_length=160, blank=True,
        help_text="SEO description, max 160 chars",
    )
    content    = RichTextUploadingField(blank=True)
    status     = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='draft',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
