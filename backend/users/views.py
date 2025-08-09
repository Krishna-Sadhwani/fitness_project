from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Profile
from rest_framework import status
from rest_framework.permissions import AllowAny

from rest_framework.response import Response
from rest_framework.views import APIView
# from .serializers import UserRegistrationSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .serializers import UserRegistrationSerializer,ProfileSerializer
# Create your views here.
# users/views.py


# users/views.py



class UserRegistrationView(generics.CreateAPIView):
    """
    A view to handle user registration.
    This view also creates an empty profile for the new user.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        # The user will be created first by the serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Automatically create a new Profile instance for the user
        # This prevents a 404 error when a new user tries to access their profile.
        Profile.objects.create(user=user)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ProfileViewSet(viewsets.ModelViewSet):
    """
    A single viewset to handle all CRUD operations for the authenticated user's profile.
    - POST: To create a new profile.
    - GET: To retrieve the profile.
    - PUT/PATCH: To update the profile.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Ensures that a user can only access their own profile.
        """
        if self.request.user.is_authenticated:
            return Profile.objects.filter(user=self.request.user)
        return Profile.objects.none()

    def get_object(self):
        """
        Returns the profile object for the currently authenticated user.
        """
        return self.get_queryset().get()

    def perform_create(self, serializer):
        """
        Links the new profile to the currently authenticated user.
        """
        serializer.save(user=self.request.user)
    


