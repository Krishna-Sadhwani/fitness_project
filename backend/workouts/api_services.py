from django.conf import settings
from groq import Groq

def get_workout_calories(description, weight, height, age, gender):
    """
    Calls the Groq API to get calories burned from a workout description.
    """
    # DEBUG: Print the values
    print(f"DEBUG - Workout Calories Request:")
    print(f"  Description: {description}")
    print(f"  Weight: {weight}kg")
    print(f"  Height: {height}cm")
    print(f"  Age: {age}")
    print(f"  Gender: {gender}")
    
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    prompt = f"""Calculate calories burned for this workout: {description}
User: weight={weight}kg, height={height}cm, age={age}, gender={gender}. Give accurate estimate based on this information.
Return ONLY a number (calories burned).There should be no explanation, just the number."""
    
    print(f"  Prompt sent to Groq: {prompt}\n")
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    
    return float(response.choices[0].message.content.strip())
