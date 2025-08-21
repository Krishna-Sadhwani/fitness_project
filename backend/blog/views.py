from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import BlogPost, Comment, Like
from .serializers import BlogPostSerializer, CommentSerializer

# --- Custom Permission ---
class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the author of the post.
        return obj.author == request.user

# --- BlogPost ViewSet ---
class BlogPostViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing blog posts.
    """
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        """
        This view now correctly sorts all queries by the creation date,
        ensuring the newest posts appear first.
        """
        user = self.request.user
        my_posts_filter = self.request.query_params.get('my_posts', 'false').lower() == 'true'

        if user.is_authenticated:
            if my_posts_filter:
                # --- FIX: Added ordering ---
                return BlogPost.objects.filter(author=user).order_by('-created_at')
            
            # --- FIX: Added ordering ---
            return (BlogPost.objects.filter(status='published') | BlogPost.objects.filter(author=user, status='draft')).distinct().order_by('-created_at')
        
        # --- FIX: Added ordering ---
        return BlogPost.objects.filter(status='published').order_by('-created_at')


    def perform_create(self, serializer):
        """Automatically set the author of the post to the logged-in user."""
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """Action to like or unlike a blog post."""
        post = self.get_object()
        user = request.user
        try:
            # If the like already exists, it means the user is unliking the post.
            like = Like.objects.get(post=post, user=user)
            like.delete()
            return Response({'status': 'unliked'}, status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist:
            # If the like does not exist, create it.
            Like.objects.create(post=post, user=user)
            return Response({'status': 'liked'}, status=status.HTTP_201_CREATED)

# --- Comment ViewSet ---
class CommentViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing comments.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        """Filter comments to only those for a specific post."""
        return Comment.objects.filter(post=self.kwargs['post_pk'])

    def perform_create(self, serializer):
        """Automatically set the author and post for the comment."""
        post = BlogPost.objects.get(pk=self.kwargs['post_pk'])
        serializer.save(author=self.request.user, post=post)
