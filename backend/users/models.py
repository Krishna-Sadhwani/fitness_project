# calculate their daily energy needs.
#

from django.db import models
from django.contrib.auth.models import User
from PIL import Image


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    # User's personal information
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
    ])
    
    # --- NEW FIELD ADDED ---
    # This field is essential for calculating TDEE (Total Daily Energy Expenditure).
    activity_level = models.CharField(max_length=20, null=True, blank=True, choices=[
        ('sedentary', 'Sedentary (little or no exercise)'),
        ('lightly_active', 'Lightly active (1-3 days/week)'),
        ('moderately_active', 'Moderately active (3-5 days/week)'),
        ('very_active', 'Very active (6-7 days/week)'),
        ('extra_active', 'Extra active (very hard exercise & physical job)'),
    ])
    
    # User's fitness goals
    weight_goal = models.FloatField(null=True, blank=True)
    calorie_goal_option = models.CharField(
        max_length=20, null=True, blank=True, 
        choices=[
            ('deficit', 'Calorie Deficit'),
            ('surplus', 'Calorie Surplus'),
            ('maintain', 'Maintain Weight'),
        ],
        help_text="The user's primary goal (lose, gain, or maintain weight)."
    )
    
    # This field will store the final daily calorie target chosen by the user.
    daily_calorie_intake = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f'{self.user.username} Profile'
    def save(self, *args, **kwargs):
        # Call the original save method first
        super().save(*args, **kwargs)

        # Open the image file if it exists
        if self.profile_picture:
            img = Image.open(self.profile_picture.path)

            # Resize the image if it's larger than 300x300 pixels
            if img.height > 300 or img.width > 300:
                output_size = (300, 300)
                img.thumbnail(output_size)
                img.save(self.profile_picture.path)