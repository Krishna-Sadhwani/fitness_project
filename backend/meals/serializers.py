from rest_framework import serializers
from .models import Meal, FoodItem, MealItem

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = '__all__'

class MealItemSerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer(read_only=True)
    food_item_id = serializers.PrimaryKeyRelatedField(
        queryset=FoodItem.objects.all(), source='food_item', write_only=True
    )
    
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbs = serializers.SerializerMethodField()
    fats = serializers.SerializerMethodField()
    
    class Meta:
        model = MealItem
        fields = ['id', 'food_item', 'food_item_id', 'quantity_g', 'calories', 'protein', 'carbs', 'fats']

    def get_calories(self, obj):
        return round(obj.food_item.calories * (obj.quantity_g / 100), 2)

    def get_protein(self, obj):
        return round(obj.food_item.protein * (obj.quantity_g / 100), 2)

    def get_carbs(self, obj):
        return round(obj.food_item.carbs * (obj.quantity_g / 100), 2)

    def get_fats(self, obj):
        return round(obj.food_item.fats * (obj.quantity_g / 100), 2)

class MealSerializer(serializers.ModelSerializer):
    meal_items = MealItemSerializer(many=True)
    total_calories = serializers.ReadOnlyField()
    total_protein = serializers.ReadOnlyField()
    total_carbs = serializers.ReadOnlyField()
    total_fats = serializers.ReadOnlyField()
    
    class Meta:
        model = Meal
        fields = ['id', 'user', 'meal_type', 'date', 'meal_items',
                  'total_calories', 'total_protein', 'total_carbs', 'total_fats']
        read_only_fields = ['user']

   
    def create(self, validated_data):
        meal_items_data = validated_data.pop('meal_items')
        meal = Meal.objects.create(**validated_data)
        
        for item_data in meal_items_data:
            MealItem.objects.create(meal=meal, **item_data)
        
        return meal

    def update(self, instance, validated_data):
        """
        Custom update logic to handle the nested meal_items.
        """
        meal_items_data = validated_data.pop('meal_items')
        
        instance.meal_type = validated_data.get('meal_type', instance.meal_type)
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        instance.meal_items.all().delete()

        for item_data in meal_items_data:
            MealItem.objects.create(meal=instance, **item_data)
            
        return instance
class DailyCalorieSerializer(serializers.Serializer):
    """
    Serializer to display a user's daily calorie intake, goal, and status.
    """
    date = serializers.DateField()
    total_calories = serializers.DecimalField(max_digits=8, decimal_places=2)
    total_protein = serializers.DecimalField(max_digits=8, decimal_places=2)
    total_carbs = serializers.DecimalField(max_digits=8, decimal_places=2)
    total_fats = serializers.DecimalField(max_digits=8, decimal_places=2)

    daily_goal = serializers.DecimalField(max_digits=8, decimal_places=2)
    remaining_calories = serializers.DecimalField(max_digits=8, decimal_places=2)
    status_message = serializers.CharField(max_length=255)
