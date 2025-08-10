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
        Ensures users can only see their own meals.
        """
        return Meal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically links the new meal to the current user.
        """
        serializer.save(user=self.request.user)

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
        )
        
        # Extract the totals, defaulting to 0 if no meals were found for the day.
        # It's good practice to convert to Decimal if the values might be None.
        total_calories = daily_totals.get('total_calories') or Decimal('0.0')
        total_protein = daily_totals.get('total_protein') or Decimal('0.0')
        total_carbs = daily_totals.get('total_carbs') or Decimal('0.0')

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
            'daily_goal': daily_goal,
            'remaining_calories': remaining_calories,
            'status_message': status_message
        }
        
        # Serialize and return the response
        serializer = DailyCalorieSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
