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
    permission_classes = [permissions.AllowAny] # Anyone can access this view to register.
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Automatically create a new, empty Profile instance for the user.
        # This ensures that every user has a profile from the moment they sign up.
        Profile.objects.create(user=user)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# --- User Profile View (Updated) ---
# This view is for fetching (GET) and updating (PATCH/PUT) the logged-in user's profile.
# It replaces the previous ProfileViewSet for simplicity and security.
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
    permission_classes = [permissions.IsAuthenticated] # Only logged-in users can access this.

    def get_object(self):
        """
        Overrides the default get_object method to return the profile
        of the currently authenticated user.
        """
        return self.request.user.profile

# --- Calorie Goal Suggestion View ---
# This view provides personalized calorie intake suggestions.

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
            # Calculate suggestions using our utility function
            suggestion_data = calculate_calorie_suggestions(user.profile)
            
            # Serialize the data for the response
            serializer = CalorieGoalResponseSerializer(suggestion_data)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # Handle cases where the profile is incomplete
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle other potential errors
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
