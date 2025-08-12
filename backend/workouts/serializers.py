# Create a new file: workouts/serializers.py

from rest_framework import serializers
from .models import Workout

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        # The user will only send the 'description'.
        # The user and calories_burned will be handled by the view.
        fields = ['id', 'user', 'description', 'calories_burned', 'date']
        read_only_fields = ['user', 'calories_burned']
class DailyWorkoutSummarySerializer(serializers.Serializer):
    """Serializer for the daily workout summary."""
    date = serializers.DateField()
    total_calories_burned = serializers.DecimalField(max_digits=8, decimal_places=2)