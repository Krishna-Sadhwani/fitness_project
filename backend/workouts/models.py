# workouts/models.py
from django.db import models
from django.contrib.auth.models import User
from datetime import date


class Workout(models.Model):
    """
    Model to store a user's workout details.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    description = models.CharField(max_length=255)
    calories_burned = models.DecimalField(max_digits=6, decimal_places=2)
    date = models.DateField(default=date.today)

    def __str__(self):
        return f"{self.user.username}'s workout on {self.date}"