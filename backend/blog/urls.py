
from django.urls import path, include
from rest_framework_nested import routers
from .views import BlogPostViewSet, CommentViewSet

router = routers.DefaultRouter()
router.register(r'posts', BlogPostViewSet)

# Create a nested router for comments under posts
# This will create URLs like /api/blog/posts/{post_pk}/comments/
posts_router = routers.NestedSimpleRouter(router, r'posts', lookup='post')
posts_router.register(r'comments', CommentViewSet, basename='post-comments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(posts_router.urls)),
]