from rest_framework import serializers
from .models import BlogPost, Comment, Like
from django.contrib.auth.models import User

# --- Serializer for displaying author information ---
class AuthorSerializer(serializers.ModelSerializer):
    """A simple serializer to display a user's username."""
    class Meta:
        model = User
        fields = ['id', 'username']

# --- Serializer for Comments ---
class CommentSerializer(serializers.ModelSerializer):
    """Serializer for the Comment model."""
    # We use the AuthorSerializer to show the author's username instead of just their ID.
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']
        read_only_fields = ['author', 'post'] # The author and post are set automatically in the view.

# --- Serializer for Blog Posts ---
class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for the BlogPost model."""
    author = AuthorSerializer(read_only=True)
    # We can add custom fields that are not in the model.
    # Here, we count the number of likes.
    like_count = serializers.SerializerMethodField()
    # We nest the CommentSerializer to show all comments for a post.
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'author', 'title', 'content', 'image', 
            'status', 'created_at', 'updated_at', 'like_count', 'comments'
        ]
        read_only_fields = ['author'] # The author is set automatically.

    def get_like_count(self, obj):
        """Calculates the number of likes for a post."""
        return obj.likes.count()