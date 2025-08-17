#
# File: users/serializers.py (Corrected)
#

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

# --- UserRegistrationSerializer (Unchanged) ---
class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {'password': {'write_only': True}}
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user

# --- UserAccountSerializer (Unchanged) ---
class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
    def validate_username(self, value):
        if User.objects.exclude(pk=self.instance.pk).filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value
    def validate_email(self, value):
        if User.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

# --- ProfileSerializer (Corrected) ---
class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Profile model.
    """
    user = UserRegistrationSerializer(read_only=True)
    recommended_calories = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        # --- CHANGE 1: Added 'activity_level' to the list of fields ---
        # This ensures the field is accepted and saved when you update the profile.
        fields = [
            'id', 'user', 'height', 'weight', 'age', 'gender', 
            'activity_level', 'weight_goal', 'calorie_goal_option', 
            'daily_calorie_intake', 'profile_picture', 'recommended_calories'
        ]

    def get_recommended_calories(self, obj):
        """
        Calculates and returns the recommended daily calorie intake options
        using the user's actual activity level.
        """
        # --- CHANGE 2: Using the dynamic activity_level from the profile ---
        if not all([obj.weight, obj.height, obj.age, obj.gender, obj.activity_level]):
            return None # Not enough data to calculate

        # BMR Calculation (Mifflin-St Jeor)
        if obj.gender.lower() == 'male':
            bmr = (10 * obj.weight) + (6.25 * obj.height) - (5 * obj.age) + 5
        else: # female
            bmr = (10 * obj.weight) + (6.25 * obj.height) - (5 * obj.age) - 161
        
        # Activity level multipliers
        activity_multipliers = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extra_active': 1.9,
        }
        
        # Get the correct multiplier based on the user's saved activity level
        multiplier = activity_multipliers.get(obj.activity_level, 1.2) # Default to sedentary
        tdee = bmr * multiplier # Total Daily Energy Expenditure

        # Calorie adjustments for goals
        calorie_deficits = {
            'Lose 0.25 kg/week': round(tdee - 250),
            'Lose 0.5 kg/week': round(tdee - 500),
            'Lose 1 kg/week': round(tdee - 1000),
        }
        calorie_surplus = {
            'Gain 0.25 kg/week': round(tdee + 250),
            'Gain 0.5 kg/week': round(tdee + 500),
            'Gain 1 kg/week': round(tdee + 1000),
        }
        
        if obj.calorie_goal_option == 'deficit':
            return {'options': calorie_deficits, 'goal_type': 'deficit', 'maintenance_calories': round(tdee)}
        elif obj.calorie_goal_option == 'surplus':
            return {'options': calorie_surplus, 'goal_type': 'surplus', 'maintenance_calories': round(tdee)}
        else:
            return {'options': {'maintain': round(tdee)}, 'goal_type': 'maintain', 'maintenance_calories': round(tdee)}

# --- CalorieGoalResponseSerializer (Unchanged) ---
# Note: This is now somewhat redundant as the logic is in ProfileSerializer.
# For consistency, you could refactor to use this, but the above will work.
class CalorieSuggestionSerializer(serializers.Serializer):
    weekly_goal = serializers.CharField()
    daily_calories = serializers.IntegerField()

class CalorieGoalResponseSerializer(serializers.Serializer):
    maintenance_calories = serializers.IntegerField()
    goal = serializers.CharField()
    suggestions = CalorieSuggestionSerializer(many=True)
