from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealViewSet,FoodSearchAPIView,DailyCalorieTrackerViewSet

router = DefaultRouter()
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'daily-calories', DailyCalorieTrackerViewSet, basename='daily-calories')

urlpatterns = [
    path('', include(router.urls)),
    path('food-search/', FoodSearchAPIView.as_view(), name='food-search'),

]