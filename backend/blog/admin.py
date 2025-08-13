from django.contrib import admin
from .models import BlogPost, Comment, Like
# Register your models here.
admin.site.register(BlogPost)
admin.site.register(Comment)
# If you have a Like model, you can register it here as well.
admin.site.register(Like)  