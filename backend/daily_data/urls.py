from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyStepsViewSet, WaterIntakeViewSet, SleepViewSet,WeightLogViewSet

router = DefaultRouter()
router.register(r'steps', DailyStepsViewSet, basename='dailysteps')
router.register(r'water', WaterIntakeViewSet, basename='waterintake')
router.register(r'sleep', SleepViewSet, basename='sleep')
router.register(r'weight', WeightLogViewSet, basename='weightlog')


urlpatterns = [
    path('', include(router.urls)),
]