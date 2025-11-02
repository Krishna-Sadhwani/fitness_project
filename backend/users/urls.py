# In users/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationView,
    UserProfileView,
    UserAccountView,
    CalorieGoalSuggestionViewSet
)

# Create a router only for the ViewSet
router = DefaultRouter()
router.register(r'calorie-suggestions', CalorieGoalSuggestionViewSet, basename='calorie-suggestion')

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    
    path('account/', UserAccountView.as_view(), name='user-account'),
    
    path('', include(router.urls)),
]