import requests
from django.conf import settings
from .models import FoodItem

# Base URLs for the APIs
NUTRITIONIX_BASE_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients"
OPEN_FOOD_FACTS_BASE_URL = "https://world.openfoodfacts.org/cgi/search.pl"

def search_and_save_food(query):
    """
    Searches for a food item and saves it to the database,
    using Nutritionix as the primary API and Open Food Facts as a fallback.
    Returns the saved FoodItem instance.
    """
    # 1. Try to get data from Nutritionix
    nutritionix_data = _search_nutritionix(query)
    if nutritionix_data:
        # Check if the food already exists in our database
        food_item, created = FoodItem.objects.get_or_create(
            name=nutritionix_data['name'],
            defaults=nutritionix_data
        )
        return food_item, created

    # 2. If Nutritionix fails, try Open Food Facts
    open_food_facts_data = _search_open_food_facts(query)
    if open_food_facts_data:
        food_item, created = FoodItem.objects.get_or_create(
            name=open_food_facts_data['name'],
            defaults=open_food_facts_data
        )
        return food_item, created

    return None, False

def _search_nutritionix(query):
    """
    Searches Nutritionix API for a food item's nutritional data and normalizes to 100g.
    """
    headers = {
        "x-app-id": settings.NUTRITIONIX_APP_ID,
        "x-app-key": settings.NUTRITIONIX_API_KEY,
        "Content-Type": "application/json"
    }
    data = {"query": query}
    try:
        response = requests.post(NUTRITIONIX_BASE_URL, headers=headers, json=data, timeout=5)
        response.raise_for_status()
        result = response.json()
        
        if result.get("foods"):
            food = result["foods"][0]
            serving_grams = food.get("serving_weight_grams")
            
            # If serving_grams is not available or is 0, we can't normalize.
            if not serving_grams:
                print(f"Warning: Nutritionix API did not provide a serving weight for '{query}'. Cannot normalize to 100g.")
                return None
            
            # Normalize all values to a per-100g basis
            normalization_factor = 100 / serving_grams
            
            return {
                "name": food.get("food_name"),
                "calories": food.get("nf_calories") * normalization_factor if food.get("nf_calories") is not None else 0,
                "protein": food.get("nf_protein") * normalization_factor if food.get("nf_protein") is not None else 0,
                "carbs": food.get("nf_total_carbohydrate") * normalization_factor if food.get("nf_total_carbohydrate") is not None else 0,
                "fats": food.get("nf_total_fat") * normalization_factor if food.get("nf_total_fat") is not None else 0,
            }
        return None
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Nutritionix API: {e}")
        return None

def _search_open_food_facts(query):
    """
    Searches Open Food Facts API for a food item and uses its per-100g data.
    """
    params = {
        "search_terms": query,
        "json": 1,
        "page_size": 1,
    }
    try:
        response = requests.get(OPEN_FOOD_FACTS_BASE_URL, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        if data.get("products"):
            product = data["products"][0]
            # Use the *_100g fields directly from the API response
            nutriments = product.get("nutriments", {})
            return {
                "name": product.get("product_name"),
                "calories": nutriments.get("energy-kcal_100g"),
                "protein": nutriments.get("proteins_100g"),
                "carbs": nutriments.get("carbohydrates_100g"),
                "fats": nutriments.get("fat_100g"),
            }
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error calling Open Food Facts API: {e}")
        return None
