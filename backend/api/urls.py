from django.urls import path, include
from users import views as UserViews
from chatbot.views import ChatAPIView
from users.views import UserProfileView
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
path("blog/",include('blog.urls')),  # Include the blog app URLs
path('',include('daily_data.urls')),  # Include the daily_data app URLs
path('profile/', UserProfileView.as_view(), name='user-profile'),

]
# In api/urls.py

from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # --- Authentication ---
    path('auth/', include('users.urls')),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('meals/', include('meals.urls')),
    path('workouts/', include('workouts.urls')),
    path('blog/', include('blog.urls')),
    path('daily-data/', include('daily_data.urls')),
    path('chatbot/', include('chatbot.urls')),
    path('analysis/', include('analysis.urls')),

]