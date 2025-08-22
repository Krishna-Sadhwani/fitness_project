from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutViewSet,DailyWorkoutSummaryViewSet,WorkoutCalculationView

router = DefaultRouter()
router.register(r'workouts', WorkoutViewSet, basename='workout')
router.register(r'summary', DailyWorkoutSummaryViewSet, basename='workout-summary')


urlpatterns = [
    path('workouts/calculate/', WorkoutCalculationView.as_view(), name='workout-calculate'),

    path('', include(router.urls)),
]
