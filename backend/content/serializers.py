from rest_framework import serializers
from .models import (PulseContent, Product,
                     BlogPost, FormSubmission, Page)

class PulseContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PulseContent
        fields = ['id','section_name','label_text',
                  'value_metric','is_active']

class ProductSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(
        source='get_category_display', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id','name','slug','category',
                  'category_display','subtitle',
                  'description','image_url','badge_text',
                  'is_featured','is_active','order']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class BlogPostSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ['id','title','slug','excerpt',
                  'content','cover_image_url','author',
                  'status','published_at','created_at']

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(
                    obj.cover_image.url)
            return obj.cover_image.url
        return None

class FormSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormSubmission
        fields = ['form_type','name','email','phone',
                  'organization','message',
                  'product_interest']

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id','title','slug',
                  'meta_description','content','status']
