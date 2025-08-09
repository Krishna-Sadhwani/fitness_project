from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet

# Create a router and register our viewset with it.
router = DefaultRouter()
router.register(r'profile', ProfileViewSet, basename='profile')

urlpatterns = [
    # The router will automatically generate all profile URLs (create, retrieve, update)
    path('', include(router.urls)),
]