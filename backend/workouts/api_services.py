
from django.conf import settings
import requests

def get_workout_calories(description, weight, height, age, gender):
    """
    Calls the Nutritionix API to get calories burned from a workout description.
    
    Args:
        description (str): A natural language description of the workout.
        weight (float): The user's weight in kilograms.
        height (float): The user's height in centimeters.
        age (int): The user's age in years.
        gender (str): The user's gender (e.g., 'male', 'female').
        
    Returns:
        float: The total calories burned for all exercises found.
        
    Raises:
        Exception: If the API request fails or returns an error.
    """
    NUTRITIONIX_API_KEY = settings.NUTRITIONIX_API_KEY
    NUTRITIONIX_APP_ID = settings.NUTRITIONIX_APP_ID
    NUTRITIONIX_ENDPOINT = "https://trackapi.nutritionix.com/v2/natural/exercise"
    
    headers = {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "query": description,
        "gender": gender,
        "weight_kg": weight,
        "height_cm": height,
        "age": age
    }

    try:
        response = requests.post(NUTRITIONIX_ENDPOINT, json=data, headers=headers)
        response.raise_for_status()  
        
        result = response.json()
        
        if 'exercises' in result and len(result['exercises']) > 0:
            total_calories = sum(exercise['nf_calories'] for exercise in result['exercises'])
            return total_calories
        else:
            raise Exception("No exercise data could be found for the provided description.")
    
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error calling Nutritionix API: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")
