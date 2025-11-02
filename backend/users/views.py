from rest_framework import generics, viewsets, status, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Profile
from .serializers import UserRegistrationSerializer, ProfileSerializer, CalorieGoalResponseSerializer,UserAccountSerializer
from .utils import calculate_calorie_suggestions

# --- User Registration View ---
# This view handles the creation of a new user and their associated profile.

class UserRegistrationView(generics.CreateAPIView):
    """
    An endpoint for user registration.
    This view also creates an empty profile for the new user upon successful registration.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny] 
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        Profile.objects.create(user=user)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UserAccountView(generics.RetrieveUpdateAPIView):
    """
    An endpoint for the logged-in user to view and update their account details (username/email).
    """
    queryset = User.objects.all()
    serializer_class = UserAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        This view should return the User object of the currently authenticated user.
        """
        return self.request.user
class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    An endpoint for the logged-in user to view and update their own profile.
    - GET: Returns the user's profile.
    - PATCH: Partially updates the user's profile (e.g., only changing the weight).
    - PUT: Fully updates the user's profile.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def get_object(self):
        """
        Overrides the default get_object method to return the profile
        of the currently authenticated user.
        """
        return self.request.user.profile

# --- Calorie Goal Suggestion View ---

class CalorieGoalSuggestionViewSet(viewsets.ViewSet):
    """
    An endpoint to provide personalized daily calorie intake suggestions
    based on a user's profile and fitness goals.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """
        Returns a list of calorie suggestions for the authenticated user.
        """
        user = request.user
        try:
            suggestion_data = calculate_calorie_suggestions(user.profile)
            
            # Serialize the data for the response
            serializer = CalorieGoalResponseSerializer(suggestion_data)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
