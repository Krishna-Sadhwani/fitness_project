# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
import math



class UserRegistrationSerializer(serializers.ModelSerializer):
    # A second password field for confirmation
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # Custom validation to check if the passwords match
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    # Override the create method to use Django's set_password for security
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Profile model.
    It includes the username and email from the related User model.
    """
    user = UserRegistrationSerializer(read_only=True)
    recommended_calories = serializers.SerializerMethodField()

    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'height', 'weight','age','gender', 'weight_goal', 'calorie_goal_option','recommended_calories','daily_calorie_intake'] #'profile_picture']

    def validate(self, data):
        """
        Custom validation to ensure consistency between calorie_goal and weight_goal.
        """
        # Get the current profile data. For PATCH requests, this is the existing instance.
        # For new profiles (which should now be created automatically), this is None.
        instance_weight = self.instance.weight if self.instance else None
        
        # Get the data from the request. Use .get() to handle cases where the field is not present.
        request_weight = data.get('weight', instance_weight)
        request_weight_goal = data.get('weight_goal')
        request_height=data.get('height')
        request_calorie_goal = data.get('calorie_goal_option')

        # Check that weight and weight_goal are positive numbers if they are provided
        if request_weight is not None and request_weight <= 0:
            raise serializers.ValidationError({"weight": "Weight must be a positive number."})
        
        if request_weight_goal is not None and request_weight_goal <= 0:
            raise serializers.ValidationError({"weight_goal": "Weight goal must be a positive number."})
        if request_height is not None and request_height <= 0:
            raise serializers.ValidationError({"height": "Height must be a positive number."})
        # Logic to enforce consistency between calorie goal and weight goal
        if request_calorie_goal == 'deficit':
            if request_weight_goal is None or request_weight is None or request_weight_goal >= request_weight:
                raise serializers.ValidationError(
                    {"weight_goal": "For a calorie deficit, your weight goal must be less than your current weight."}
                )
        
        if request_calorie_goal == 'surplus':
            if request_weight_goal is None or request_weight is None or request_weight_goal <= request_weight:
                raise serializers.ValidationError(
                    {"weight_goal": "For a calorie surplus, your weight goal must be greater than your current weight."}
                )
        
        # We can add a simple check for 'maintain' and no goal
        if request_calorie_goal in ['maintain', None] and request_weight_goal is not None:
            # We could clear the weight_goal here or just warn. Let's not be too strict for now.
            pass

        return data
    def get_recommended_calories(self, obj):
        """
        Calculates and returns the recommended daily calorie intake options.
        """
        # Ensure all required fields are available before attempting calculations.
        if not all([obj.weight, obj.height, obj.age, obj.gender]):
            return None # Return None if not all data is present

        weight_kg = obj.weight  # Assuming weight is in kg
        height_cm = obj.height  # Assuming height is in cm
        age = obj.age
        gender = obj.gender
        
        # We need a fallback in case data is not provided.
        if weight_kg is None or height_cm is None or age is None or gender is None:
            return None

        # Mifflin-St Jeor Equation for BMR
        if gender.lower() == 'male':
            bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
        elif gender.lower() == 'female':
            bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
        else:
            return None # Handle other genders or return an average

        # We'll assume a "lightly active" lifestyle for a general-purpose app.
        # This can be made dynamic by adding an activity_level field later.
        activity_multiplier = 1.375
        tdee = bmr * activity_multiplier

        # Define calorie adjustments for weight loss/gain
        # Note: 1 kg of fat is approximately 7700 calories.
        # Deficit/Surplus per day:
        calorie_deficits = {
            '1kg/week': tdee - 1100, # 7700 / 7 = 1100
            '0.5kg/week': tdee - 550, # 7700 / 2 / 7 = 550
            '0.25kg/week': tdee - 275,
        }
        calorie_surplus = {
            '1kg/week': tdee + 1100,
            '0.5kg/week': tdee + 550,
            '0.25kg/week': tdee + 275,
        }
        
        # Round the values to the nearest whole number for readability.
        maintain_calories = round(tdee)
        calorie_deficits = {k: round(v) for k, v in calorie_deficits.items()}
        calorie_surplus = {k: round(v) for k, v in calorie_surplus.items()}

        # Return the appropriate calorie recommendations based on the user's calorie goal selection.
        if obj.calorie_goal_option == 'deficit':
            return {'options': calorie_deficits, 'goal_type': 'deficit'}
        elif obj.calorie_goal_option == 'surplus':
            return {'options': calorie_surplus, 'goal_type': 'surplus'}
        else:
            return {'options': {'maintain': maintain_calories}, 'goal_type': 'maintain'}

class CalorieSuggestionSerializer(serializers.Serializer):
    """Serializer for a single calorie suggestion."""
    weekly_goal = serializers.CharField()
    daily_calories = serializers.IntegerField()

class CalorieGoalResponseSerializer(serializers.Serializer):
    """Serializer for the final response from our suggestions endpoint."""
    maintenance_calories = serializers.IntegerField()
    goal = serializers.CharField()
    suggestions = CalorieSuggestionSerializer(many=True)
