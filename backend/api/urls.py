from django.urls import path, include
from users import views as UserViews
from chatbot.views import ChatAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    # All authentication-related URLs will be under the 'auth/' path.
    # This single line includes all the URLs from the users/urls.py file.
    path('auth/', include('users.urls')),
path("",include('chatbot.urls')),  # Include the chatbot app URLs
    path("register/", UserViews.UserRegistrationView.as_view(), name="register"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('meals.urls')), # Include the new meals app URLs
    path('', include('workouts.urls')),  # Include the workouts app URLs

]
