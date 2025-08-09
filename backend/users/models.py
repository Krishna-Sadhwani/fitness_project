from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Profile(models.Model):
    """
    A model to store additional information for a user.
    Uses a OneToOneField to link to the built-in Django User model.
    """
    # A OneToOneField ensures that each user has exactly one profile.
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # User's personal information
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    
    # User's fitness goals
    weight_goal = models.FloatField(null=True, blank=True)
    
    # Calorie goal choice with options (deficit, surplus, maintain)
    calorie_goal = models.CharField(max_length=20, null=True, blank=True, choices=[
        ('deficit', 'Calorie Deficit'),
        ('surplus', 'Calorie Surplus'),
        ('maintain', 'Maintain Weight'),
    ])
    
    # New field to store the specific daily calorie intake the user chooses.
    daily_calorie_intake = models.FloatField(null=True, blank=True)
    
    # Profile picture field that requires Pillow to be installed.
    # profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        """String representation of the Profile object."""
        return f'{self.user.username} Profile'

