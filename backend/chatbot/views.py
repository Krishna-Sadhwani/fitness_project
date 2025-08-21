# chatbot/views.py
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated # <-- Import IsAuthenticated
from groq import Groq
from django.conf import settings
from .models import Conversation
from .serializers import ChatMessageSerializer,ConversationSerializer
from users.models import Profile

# Initialize the Groq client
client = Groq(api_key=settings.GROQ_API_KEY)

class ChatAPIView(APIView):
    """
    DRF API view to handle chatbot requests.
    """
    # Add this line to enforce authentication
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        """
        Retrieves the conversation history for the authenticated user.
        """
        conversations = Conversation.objects.filter(user=request.user).order_by('timestamp')
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request, *args, **kwargs):
        # The serializer handles validation of the incoming JSON data
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            user_message = serializer.validated_data['message']
            user = request.user

            try:
                profile = Profile.objects.get(user=user)
                system_message = (
                    f"You are a helpful AI nutritionist for a user who wants to "
                    f"achieve a fitness goal of: {profile.weight_goal}. "
                    f"Their body stats are: Height - {profile.height} cm, "
                    f"Weight - {profile.weight} kg. Based on this, provide helpful "
                    f"and concise nutrition advice. Refer to their goals in your responses."
                )
            except Profile.DoesNotExist:
                system_message = "You are a helpful AI nutritionist. Answer health and nutrition questions concisely and accurately."

            conversation_history = Conversation.objects.filter(user=user).order_by('-timestamp')[:5]
            messages = []
            
            messages.append({"role": "system", "content": system_message})

            for convo in reversed(conversation_history):
                messages.append({"role": "user", "content": convo.user_message})
                messages.append({"role": "assistant", "content": convo.ai_response})

            messages.append({"role": "user", "content": user_message})

            try:
                chat_completion = client.chat.completions.create(
                    messages=messages,
                    model="llama3-8b-8192",
                )
                ai_response = chat_completion.choices[0].message.content

                Conversation.objects.create(
                    user=user,
                    user_message=user_message,
                    ai_response=ai_response
                )

                return Response({'response': ai_response}, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_message(request, message_id):
    """
    Deletes a single message belonging to the authenticated user.
    """
    try:
        # We use get_object_or_404 to automatically return a 404
        # if the message doesn't exist or doesn't belong to the user.
        message = get_object_or_404(Conversation, id=message_id, user=request.user)
        message.delete()
        # Return a 204 No Content status on successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_all_conversations(request):
    """
    Deletes all messages for the authenticated user.
    """
    try:
        # Filter all messages that belong to the current user
        conversations = Conversation.objects.filter(user=request.user)
        # Delete all objects in the queryset
        conversations.delete()
        # Return a 204 No Content status on successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
