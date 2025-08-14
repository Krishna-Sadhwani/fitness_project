from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  CalorieGoalSuggestionViewSet,UserProfileView

# Create a router and register our viewset with it.
router = DefaultRouter()
# router.register(r'profile', ProfileViewSet, basename='profile')
router.register(r'calorie-suggestions', CalorieGoalSuggestionViewSet, basename='calorie-suggestion')


urlpatterns = [
    # The router will automatically generate all profile URLs (create, retrieve, update)
    path('', include(router.urls)),
    path('', include(router.urls)),
    path('profile/', UserProfileView.as_view(), name='user-profile'),



]