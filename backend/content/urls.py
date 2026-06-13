from django.urls import path
from . import views

urlpatterns = [

    # Content
    path('api/content/',
         views.all_content),
    path('api/content/<str:section>/',
         views.content_by_section),

    # Products
    path('api/products/',
         views.products_list),
    path('api/products/featured/',
         views.featured_product),
    path('api/products/<slug:slug>/',
         views.product_detail),

    # Blog
    path('api/blog/',
         views.blog_list),
    path('api/blog/<slug:slug>/',
         views.blog_detail),

    # Forms
    path('api/submit/',
         views.submit_form),

    # Pages
    path('api/pages/<slug:slug>/',
         views.page_detail),

    # Stats
    path('api/stats/',
         views.dashboard_stats),
]
