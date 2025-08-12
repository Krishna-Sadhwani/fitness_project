from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutViewSet,DailyWorkoutSummaryViewSet

# Create a router and register our viewset with it.
router = DefaultRouter()
router.register(r'workouts', WorkoutViewSet, basename='workout')
router.register(r'summary', DailyWorkoutSummaryViewSet, basename='workout-summary')


# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
