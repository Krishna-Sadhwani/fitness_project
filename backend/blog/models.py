from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User



class BlogPost(models.Model):
    """
    Represents a single blog post written by a user.
    """
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    # --- Fields ---
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    title = models.CharField(max_length=200)
    
    content = models.TextField()
    
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True) # Automatically set when the post is created
    updated_at = models.DateTimeField(auto_now=True)     # Automatically set when the post is updated

    def __str__(self):
        """String representation of the BlogPost object."""
        return self.title

# --- Comment Model ---

class Comment(models.Model):
    """
    Represents a comment made by a user on a specific blog post.
    """
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    
    content = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'

# --- Like Model ---

class Like(models.Model):
    """
    Represents a "like" given by a user to a blog post.
    """
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='likes')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # This ensures that a user can only like a specific post once.
        # If they try to like it again, it will result in a database error,
        # which we will handle in our view to make it an "unlike" action.
        unique_together = ('post', 'user')

    def __str__(self):
        return f'{self.user.username} likes {self.post.title}'
