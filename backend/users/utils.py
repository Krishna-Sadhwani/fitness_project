# This new file will hold the business logic for our calorie calculations,
# keeping our views clean and organized.
#

def calculate_calorie_suggestions(profile):
    """
    Calculates BMR, TDEE, and goal-based daily calorie suggestions.

    Returns:
        A dictionary with maintenance calories and a list of suggestions.
    """
    if not all([profile.weight, profile.height, profile.age, profile.gender, profile.activity_level]):
        raise ValueError("Profile is missing required information for calculation.")

    # 1. Calculate BMR using the Mifflin-St Jeor equation
    if profile.gender == 'male':
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    else: # 'female'
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161

    # 2. Define activity level multipliers
    activity_multipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extra_active': 1.9,
    }
    multiplier = activity_multipliers.get(profile.activity_level)
    
    # 3. Calculate TDEE (maintenance calories)
    tdee = bmr * multiplier
    
    # 4. Generate suggestions based on the user's goal
    suggestions = []
    goal = profile.calorie_goal_option
    
    if goal in ['deficit', 'surplus']:
        # The caloric adjustment for 1kg is ~7700 kcal. Per day this is ~1100.
        # We'll use standard adjustments: 250, 500, 1000 for simplicity.
        adjustments = {
            0.25: 250, # For 0.25 kg/week
            0.5: 500,  # For 0.5 kg/week
            1.0: 1000, # For 1.0 kg/week
        }
        
        for kg, cal_adj in adjustments.items():
            if goal == 'deficit':
                weekly_goal_text = f"Lose {kg} kg/week"
                daily_calories = tdee - cal_adj
            else: # surplus
                weekly_goal_text = f"Gain {kg} kg/week"
                daily_calories = tdee + cal_adj
            
            suggestions.append({
                "weekly_goal": weekly_goal_text,
                "daily_calories": round(daily_calories)
            })
            
    return {
        "maintenance_calories": round(tdee),
        "goal": goal,
        "suggestions": suggestions
    }