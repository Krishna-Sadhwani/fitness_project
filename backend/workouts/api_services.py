from django.conf import settings
import requests

def get_workout_calories(description, gender, weight, height, age):
    """
    Calls the Nutritionix API to get calories burned from a workout description.
    
    Args:
        description (str): A natural language description of the workout.
        gender (str): The user's gender (e.g., 'male' or 'female').
        weight_kg (float): The user's weight in kilograms.
        height_cm (float): The user's height in centimeters.
        age (int): The user's age in years.
        
    Returns:
        float: The total calories burned for the workout.
        
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

    # Include user's specific data for a more accurate calculation
    data = {
        "query": description,
        "gender": gender,
        "weight_kg": weight,
        "height_cm": height,
        "age": age
    }

    try:
        response = requests.post(NUTRITIONIX_ENDPOINT, json=data, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        
        result = response.json()
        if 'exercises' in result and len(result['exercises']) > 0:
            return result['exercises'][0]['nf_calories']
        else:
            raise Exception("No exercise data found in API response.")
    
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error calling Nutritionix API: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")

