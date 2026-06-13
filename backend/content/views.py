from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .models import (PulseContent, Product,
                     BlogPost, FormSubmission, Page)
from .serializers import (PulseContentSerializer,
    ProductSerializer, BlogPostSerializer,
    FormSubmissionSerializer, PageSerializer)

# ── PULSE CONTENT ────────────────────────────
@api_view(['GET'])
def content_by_section(request, section):
    items = PulseContent.objects.filter(
        section_name=section, is_active=True)
    serializer = PulseContentSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def all_content(request):
    items = PulseContent.objects.filter(is_active=True)
    serializer = PulseContentSerializer(items, many=True)
    return Response(serializer.data)

# ── PRODUCTS ─────────────────────────────────
@api_view(['GET'])
def products_list(request):
    category = request.GET.get('category', None)
    qs = Product.objects.filter(is_active=True)
    if category:
        qs = qs.filter(category=category)
    qs = qs.order_by('category','order')
    serializer = ProductSerializer(
        qs, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def product_detail(request, slug):
    try:
        product = Product.objects.get(
            slug=slug, is_active=True)
        serializer = ProductSerializer(
            product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

@api_view(['GET'])
def featured_product(request):
    try:
        product = Product.objects.filter(
            is_featured=True, is_active=True).first()
        if product:
            serializer = ProductSerializer(
                product, context={'request': request})
            return Response(serializer.data)
        return Response({})
    except:
        return Response({})

# ── BLOG POSTS ───────────────────────────────
@api_view(['GET'])
def blog_list(request):
    posts = BlogPost.objects.filter(
        status='published').order_by('-published_at')
    serializer = BlogPostSerializer(
        posts, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def blog_detail(request, slug):
    try:
        post = BlogPost.objects.get(
            slug=slug, status='published')
        serializer = BlogPostSerializer(
            post, context={'request': request})
        return Response(serializer.data)
    except BlogPost.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

# ── FORM SUBMISSION (POST) ────────────────────
@csrf_exempt
@api_view(['POST'])
def submit_form(request):
    serializer = FormSubmissionSerializer(
        data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True,
             'message': 'Submission received!'},
            status=status.HTTP_201_CREATED)
    return Response(
        {'success': False,
         'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST)

# ── PAGES ────────────────────────────────────
@api_view(['GET'])
def page_detail(request, slug):
    try:
        page = Page.objects.get(
            slug=slug, status='published')
        serializer = PageSerializer(page)
        return Response(serializer.data)
    except Page.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

# ── DASHBOARD STATS (admin use) ───────────────
@api_view(['GET'])
def dashboard_stats(request):
    return Response({
        'total_submissions': FormSubmission.objects.count(),
        'unread': FormSubmission.objects.filter(
                    is_read=False).count(),
        'total_products': Product.objects.count(),
        'active_products': Product.objects.filter(
                             is_active=True).count(),
        'total_blogs': BlogPost.objects.count(),
        'published_blogs': BlogPost.objects.filter(
                             status='published').count(),
        'demo_count': FormSubmission.objects.filter(
                        form_type='demo').count(),
        'quote_count': FormSubmission.objects.filter(
                         form_type='quote').count(),
        'contact_count': FormSubmission.objects.filter(
                           form_type='contact').count(),
    })
