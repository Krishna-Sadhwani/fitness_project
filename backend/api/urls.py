from django.urls import path, include
from users import views as UserViews
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # All authentication-related URLs will be under the 'auth/' path.
    # This single line includes all the URLs from the users/urls.py file.
    path('auth/', include('users.urls')),

    path("register/", UserViews.UserRegistrationView.as_view(), name="register"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
