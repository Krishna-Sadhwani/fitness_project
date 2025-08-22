from rest_framework import serializers
from .models import DailySteps, WaterIntake, Sleep,WeightLog,UserGoals
class UserGoalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGoals
        fields = ['step_goal', 'water_goal_ml', 'sleep_goal_hours']


class DailyStepsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySteps
        fields = ['id', 'user', 'date', 'step_count', 'calories_burned']
        read_only_fields = ['user', 'calories_burned']

class WaterIntakeSerializer(serializers.ModelSerializer):
    glasses = serializers.FloatField(read_only=True)
    
    class Meta:
        model = WaterIntake
        fields = ['id', 'user', 'date', 'milliliters', 'glasses']
        read_only_fields = ['user']

class SleepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sleep
        fields = ['id', 'user', 'date', 'duration_hours']
        read_only_fields = ['user']
class WeightLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightLog
        fields = ['id', 'user', 'date', 'weight_kg']
        read_only_fields = ['user']