from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

# --- BlogPost Model ---
# This model represents a single blog article.

class BlogPost(models.Model):
    """
    Represents a single blog post written by a user.
    """
    
    # Define choices for the post's status
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    # --- Fields ---
    
    # Link to the user who wrote the post. If the user is deleted, their posts are also deleted.
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    
    # The title of the blog post.
    title = models.CharField(max_length=200)
    
    # The main content of the article. This can be a large amount of text.
    content = models.TextField()
    
    # An optional image for the blog post. This requires the 'Pillow' library to be installed.
    # The images will be uploaded to a 'blog_images/' directory in your media folder.
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    
    # The current status of the post (either a draft or published). Defaults to 'draft'.
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True) # Automatically set when the post is created
    updated_at = models.DateTimeField(auto_now=True)     # Automatically set when the post is updated

    def __str__(self):
        """String representation of the BlogPost object."""
        return self.title

# --- Comment Model ---
# This model represents a single comment on a blog post.

class Comment(models.Model):
    """
    Represents a comment made by a user on a specific blog post.
    """
    # Link to the blog post this comment belongs to.
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    
    # Link to the user who wrote the comment.
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    
    # The text content of the comment.
    content = models.TextField()
    
    # Timestamp for when the comment was created.
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'

# --- Like Model ---
# This model represents a "like" from a user on a blog post.

class Like(models.Model):
    """
    Represents a "like" given by a user to a blog post.
    """
    # Link to the blog post that was liked.
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='likes')
    
    # Link to the user who liked the post.
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    
    # Timestamp for when the like was given.
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # This ensures that a user can only like a specific post once.
        # If they try to like it again, it will result in a database error,
        # which we will handle in our view to make it an "unlike" action.
        unique_together = ('post', 'user')

    def __str__(self):
        return f'{self.user.username} likes {self.post.title}'
