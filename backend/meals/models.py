from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum, F, DecimalField
from decimal import Decimal

class FoodItem(models.Model):
    """
    Stores nutritional data for a food item per 100g.
    """
    name = models.CharField(max_length=255)
    calories = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    protein = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    carbs = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fats = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return self.name

class Meal(models.Model):
    """
    Represents a single meal log for a user on a specific date.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meals')
    meal_type = models.CharField(max_length=20, choices=[
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
    ])
    date = models.DateField()
    total_calories = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.user.username}'s {self.get_meal_type_display()} on {self.date}"

class MealItem(models.Model):
    """
    Links a Meal to a FoodItem, storing the quantity consumed.
    This is where we'll calculate the actual macros for the user's log.
    """
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name='meal_items')
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    # Changed to DecimalField for precision
    quantity_g = models.DecimalField(max_digits=8, decimal_places=2, help_text="Quantity in grams")

    def __str__(self):
        return f"{self.quantity_g}g of {self.food_item.name}"

# Signal handlers to update Meal total_calories automatically.
@receiver(post_save, sender=MealItem)
@receiver(post_delete, sender=MealItem)
def update_meal_calories(sender, instance, **kwargs):
    """
    Recalculates and updates the total_calories field of the associated Meal.
    """
    meal = instance.meal
    
    aggregation_result = MealItem.objects.filter(meal=meal).aggregate(
        total=Sum(
            (F('food_item__calories') * F('quantity_g')) / Decimal('100.0'), 
            output_field=DecimalField()
        )
    )

    total_calories = aggregation_result['total'] or Decimal('0.0')

    meal.total_calories = total_calories
    print(f"Updated total calories for {meal}: {meal.total_calories}")
    meal.save(update_fields=['total_calories'])
