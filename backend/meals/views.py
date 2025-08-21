
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Meal, FoodItem
from .serializers import MealSerializer, FoodItemSerializer
from .api_services import search_and_save_food
from django.db.models import Sum, F, DecimalField
from datetime import date
from decimal import Decimal # Import the Decimal class
# Import your existing models and the new serializer
from .models import Meal,MealItem
from users.models import Profile
from .serializers import DailyCalorieSerializer

class MealViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing Meal instances.
    """
    serializer_class = MealSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Ensures users can only see their own meals and filters by date.
        """
        user = self.request.user
        queryset = Meal.objects.filter(user=user)

        # --- THIS IS THE FIX ---
        # Get the 'date' from the URL's query parameters (e.g., /?date=YYYY-MM-DD)
        date_filter = self.request.query_params.get('date', None)
        
        # If a date is provided, filter the queryset
        if date_filter:
            queryset = queryset.filter(date=date_filter)
            
        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create a meal if one does not exist for the given date and meal_type.
        If it exists, append the provided meal_items to the existing meal and
        return the updated meal. Ensures only one meal per type per day.
        """
        user = request.user
        # Validate the incoming payload with existing serializer to reuse nested item validation
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated = serializer.validated_data
        meal_type = validated.get('meal_type')
        meal_date = validated.get('date')
        incoming_items = validated.get('meal_items', [])

        # Try to find an existing meal for this user/date/type
        existing_meal = Meal.objects.filter(user=user, meal_type=meal_type, date=meal_date).first()

        if existing_meal:
            # Append new items to the existing meal
            for item_data in incoming_items:
                # item_data already has 'food_item' and 'quantity_g' from validation
                MealItem.objects.create(meal=existing_meal, **item_data)

            # Serialize and return the updated meal
            output = self.get_serializer(existing_meal)
            return Response(output.data, status=status.HTTP_200_OK)

        # No existing meal: create a new one linked to current user
        new_meal = serializer.save(user=user)
        output = self.get_serializer(new_meal)
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)

class FoodSearchAPIView(APIView):
    """
    An endpoint to search for food items using external APIs and save them.
    The client will send a POST request with a 'query' in the body.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        query = request.data.get('query')
        if not query:
            return Response(
                {"error": "Please provide a 'query' for the food item."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # --- THIS IS THE ONLY VALIDATION YOU NEED ---
        # It checks if the query, after removing spaces, contains only letters.
        if not query.replace(' ', '').isalpha():
            return Response(
                {"error": "Please enter a valid food name using only letters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ... (rest of your view logic) ...
            
        # Use the service module to search the APIs and save to the database.
        food_item, created = search_and_save_food(query)

        if food_item:
            serializer = FoodItemSerializer(food_item)
            return Response(
                {"food_item": serializer.data, "created": created},
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        
        return Response(
            {"error": f"Could not find nutritional data for '{query}'."},
            status=status.HTTP_404_NOT_FOUND
        )
class DailyCalorieTrackerViewSet(viewsets.ViewSet):
    """
    A view to get a user's daily calorie intake and compare it to their goal.
    This view requires the user to be authenticated.
    """
    permission_classes = [IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        # Ensure the user is authenticated before proceeding
        user = request.user
        
        # Get the date from an optional query parameter, or use today's date
        request_date_str = request.query_params.get('date', None)
        try:
            request_date = date.fromisoformat(request_date_str) if request_date_str else date.today()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the user's daily calorie goal from their Profile
        try:
            user_profile = user.profile
            daily_goal = user_profile.daily_calorie_intake
            
            # If the user has not set a goal, return an error
            if daily_goal is None:
                return Response(
                    {"error": "Please set your daily calorie intake in your profile to use this feature."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Profile.DoesNotExist:
            return Response(
                {"error": "User profile not found. Please create a profile."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # --- CORRECTED AGGREGATION QUERY ---
        # The calculation is now more robust by explicitly casting the denominator
        # to a Decimal to ensure floating-point division at the database level.
        daily_totals = MealItem.objects.filter(
            meal__user=user, 
            meal__date=request_date
        ).aggregate(
            total_calories=Sum(
                F('food_item__calories') * F('quantity_g') / Decimal('100.0'),
                output_field=DecimalField()
            ),
            total_protein=Sum(
                F('food_item__protein') * F('quantity_g') / Decimal('100.0'),
                output_field=DecimalField()
            ),
            total_carbs=Sum(
                F('food_item__carbs') * F('quantity_g') / Decimal('100.0'),
                output_field=DecimalField()
            ),
            total_fats=Sum(
                F('food_item__fats') * F('quantity_g') / Decimal('100.0'),
                output_field=DecimalField()
            )
        )
        
        # Extract the totals, defaulting to 0 if no meals were found for the day.
        # It's good practice to convert to Decimal if the values might be None.
        total_calories = daily_totals.get('total_calories') or Decimal('0.0')
        total_protein = daily_totals.get('total_protein') or Decimal('0.0')
        total_carbs = daily_totals.get('total_carbs') or Decimal('0.0')
        total_fats = daily_totals.get('total_fats') or Decimal('0.0')

        # Calculate the remaining calories and determine a status message
        remaining_calories = daily_goal - total_calories
        
        status_message = ""
        if remaining_calories > 200:
            status_message = f"You are significantly under your daily goal. Remaining: {remaining_calories:.2f} calories."
        elif remaining_calories > 0 and remaining_calories <= 200:
            status_message = f"You are under your daily goal. Remaining: {remaining_calories:.2f} calories."
        elif remaining_calories < 0 and remaining_calories >= -200:
            status_message = f"You have slightly exceeded your daily goal. Over by: {-remaining_calories:.2f} calories."
        else: # remaining_calories < -200
            status_message = f"You are significantly over your daily goal. Over by: {-remaining_calories:.2f} calories."

        # Prepare the data for the response
        response_data = {
            'date': request_date,
            'total_calories': total_calories,
            'total_protein': total_protein,
            'total_carbs': total_carbs,
            'total_fats': total_fats,
            'daily_goal': daily_goal,
            'remaining_calories': remaining_calories,
            'status_message': status_message
        }
        
        # Serialize and return the response
        serializer = DailyCalorieSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
