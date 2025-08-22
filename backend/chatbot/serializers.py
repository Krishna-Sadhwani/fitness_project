# myapp/serializers.py

from rest_framework import serializers
from .models import Conversation

class ChatMessageSerializer(serializers.Serializer):
    """
    Serializer for the incoming chat message from the user.
    """
    message = serializers.CharField(required=True)
class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'user_message', 'ai_response', 'timestamp']