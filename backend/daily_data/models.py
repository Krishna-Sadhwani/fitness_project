from django.db import models

# Create your models here.
#
# File: daily_data/models.py
#

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
class UserGoals(models.Model):
    """
    Stores the daily goals for a user. Each user will have one set of goals.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='goals')
    
    step_goal = models.PositiveIntegerField(default=8000)
    water_goal_ml = models.PositiveIntegerField(default=2000)
    sleep_goal_hours = models.DecimalField(max_digits=4, decimal_places=2, default=8.0)

    def __str__(self):
        return f"{self.user.username}'s Daily Goals"
class WeightLog(models.Model):
    """Stores a user's weight on a specific date to track progress."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weight_logs')
    date = models.DateField(default=timezone.now)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username}'s weight on {self.date}: {self.weight_kg}kg"

class DailySteps(models.Model):
    """Stores the step count and calculated calories burned for a user on a specific day."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_steps')
    date = models.DateField(default=timezone.now)
    step_count = models.PositiveIntegerField()
    calories_burned = models.DecimalField(max_digits=6, decimal_places=2, editable=False)

    class Meta:
        # Ensures a user can only have one step entry per day.
        unique_together = ('user', 'date')

    def save(self, *args, **kwargs):
        # --- Automatic Calorie Calculation ---
        #  the user's weight to make this calculation accurate.
        user_weight_kg = self.user.profile.weight
        if user_weight_kg:
            # A common formula: (MET * body weight in kg * 3.5) / 200 * duration in minutes
            # Walking MET is ~3.5. Avg walking speed is ~100 steps/min.
            # Simplified: A common estimate is ~0.04 calories per step, adjusted for weight.
            # Base calories for a 70kg person is ~0.04. We'll adjust from there.
            calories_per_step = 0.04 * (user_weight_kg / 70)
            self.calories_burned = self.step_count * calories_per_step
        else:
            # Default if weight is not set, though the view should prevent this.
            self.calories_burned = self.step_count * 0.04
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username}'s steps on {self.date}: {self.step_count}"

class WaterIntake(models.Model):
    """Stores the water intake for a user on a specific day."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='water_intakes')
    date = models.DateField(default=timezone.now)
    milliliters = models.PositiveIntegerField()

    class Meta:
        unique_together = ('user', 'date')

    @property
    def glasses(self):
        """Returns the approximate number of 250ml glasses."""
        return round(self.milliliters / 250, 1)

    def __str__(self):
        return f"{self.user.username}'s water intake on {self.date}: {self.milliliters}ml"

class Sleep(models.Model):
    """Stores the sleep duration for a user on a specific night."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sleep_records')
    date = models.DateField(default=timezone.now, help_text="The date of the night's sleep (e.g., the morning you woke up).")
    duration_hours = models.DecimalField(max_digits=4, decimal_places=2)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username}'s sleep on {self.date}: {self.duration_hours} hours"
