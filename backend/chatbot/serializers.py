# myapp/serializers.py

from rest_framework import serializers

class ChatMessageSerializer(serializers.Serializer):
    """
    Serializer for the incoming chat message from the user.
    """
    message = serializers.CharField(required=True)