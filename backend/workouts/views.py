from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Workout
from .serializers import WorkoutSerializer
from .api_services import get_workout_calories
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import APIException
# Assuming this is your user profile app
from users.models import Profile 

class WorkoutViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing user workouts.
    """
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the workouts
        for the currently authenticated user.
        """
        return self.queryset.filter(user=self.request.user).order_by('-date')

    def create(self, request, *args, **kwargs):
        """
        Creates a new workout entry, getting calories burned from the Nutritionix API.
        """
        try:
            user_profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            raise APIException("User profile not found. Please create a profile with weight, height, age, and gender.")
        
        description = request.data.get('description')
        if not description:
            return Response(
                {"error": "A 'description' of the workout is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Call the API service. If it fails, it will raise an exception.
            calories_burned = get_workout_calories(
                description,
                user_profile.gender,
                user_profile.weight,
                user_profile.height,
                user_profile.age
            )
            
            # If the API call succeeds, we proceed with creating the workout.
            workout_data = {
                'user': request.user.pk,
                'description': description,
                'calories_burned': calories_burned
            }
            
            serializer = self.get_serializer(data=workout_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Catch the exception raised by the API service and return a 400 response.
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

