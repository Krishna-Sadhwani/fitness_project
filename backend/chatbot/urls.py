from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatAPIView,delete_message, clear_all_conversations


urlpatterns = [
      path('chat/', ChatAPIView.as_view(), name='chat_api'),
    path('chat/<int:message_id>/', delete_message, name='delete-message'),
    path('chat/clear/', clear_all_conversations, name='clear-all-conversations'),

]