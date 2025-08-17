from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyStepsViewSet, WaterIntakeViewSet, SleepViewSet, WeightLogViewSet, UserGoalsView # Import new view

router = DefaultRouter()
router.register(r'weight', WeightLogViewSet, basename='weightlog')
router.register(r'steps', DailyStepsViewSet, basename='dailysteps')
router.register(r'water', WaterIntakeViewSet, basename='waterintake')
router.register(r'sleep', SleepViewSet, basename='sleep')

urlpatterns = [
    # --- ADD THIS LINE ---
    path('goals/', UserGoalsView.as_view(), name='user-goals'),
    
    path('', include(router.urls)),
]