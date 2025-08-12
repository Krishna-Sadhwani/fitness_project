from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.utils import timezone
from decimal import Decimal

from .models import Workout
from .serializers import WorkoutSerializer,DailyWorkoutSummarySerializer
from .api_services import get_workout_calories
from users.models import Profile # Import the Profile model

class WorkoutViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for creating, viewing, and managing workouts.
    """
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Ensures users can only see their own workouts."""
        return Workout.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Custom logic to fetch calories from Nutritionix before saving.
        """
        user = self.request.user
        description = serializer.validated_data.get('description')

        # Get user's profile for accurate calorie calculation
        try:
            profile = user.profile
            # Check for all required profile fields
            if not all([profile.weight, profile.height, profile.age, profile.gender]):
                raise Profile.DoesNotExist
        except Profile.DoesNotExist:
            raise serializers.ValidationError(
                "User profile is incomplete. Please provide weight, height, age, and gender."
            )

        # Call our API service to get calories
        try:
            calories = get_workout_calories(
                description=description,
                weight=profile.weight,
                height=profile.height,
                age=profile.age,
                gender=profile.gender
            )
            # Save the workout with the logged-in user and calculated calories
            serializer.save(user=user, calories_burned=calories)
        except Exception as e:
            # Handle errors from the Nutritionix API call
            raise serializers.ValidationError(str(e))
class DailyWorkoutSummaryViewSet(viewsets.ViewSet):
    """
    A ViewSet to get the total calories burned by a user for a specific day.
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Calculates and returns the sum of calories burned for a given date.
        The date can be provided as a query parameter (e.g., /api/summary/?date=YYYY-MM-DD).
        If no date is provided, it defaults to today.
        """
        user = request.user
        
        # Get the date from query params, or default to today
        date_str = request.query_params.get('date', timezone.now().strftime('%Y-%m-%d'))
        
        # Calculate the total calories burned for the user on the given date
        summary_data = Workout.objects.filter(
            user=user,
            date=date_str
        ).aggregate(
            total=Sum('calories_burned')
        )

        total_calories = summary_data['total'] or Decimal('0.00')

        # Prepare data for the serializer
        response_data = {
            'date': date_str,
            'total_calories_burned': total_calories
        }

        serializer = DailyWorkoutSummarySerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)