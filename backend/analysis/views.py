
# import matplotlib
# matplotlib.use('Agg') 
from groq import Groq
from django.conf import settings
import pandas as pd
# import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from datetime import datetime, timedelta
from decimal import Decimal

from django.http import HttpResponse
from django.db.models import Sum, F, DecimalField, Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Import all the models we need to analyze
from daily_data.models import WeightLog, DailySteps, WaterIntake, Sleep
from meals.models import MealItem
from meals.models import Meal

from workouts.models import Workout

class AnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get_dataframe(self, user, start_date, end_date):
        """
        Helper function to fetch all user data for a date range
        and compile it into a single pandas DataFrame.
        """
        date_range = pd.date_range(start=start_date, end=end_date, freq='D')
        df = pd.DataFrame(index=date_range)

        # Fetch all necessary data from the database
        weight_data = WeightLog.objects.filter(user=user, date__range=[start_date, end_date])
        steps_data = DailySteps.objects.filter(user=user, date__range=[start_date, end_date])
        workout_data = Workout.objects.filter(user=user, date__range=[start_date, end_date])
        water_data = WaterIntake.objects.filter(user=user, date__range=[start_date, end_date])
        sleep_data = Sleep.objects.filter(user=user, date__range=[start_date, end_date])
        
        meal_data = MealItem.objects.filter(
            meal__user=user, meal__date__range=[start_date, end_date]
        ).values('meal__date').annotate(
            daily_calories=Sum(F('food_item__calories') * F('quantity_g') / Decimal('100.0')),
            daily_protein=Sum(F('food_item__protein') * F('quantity_g') / Decimal('100.0')),
            daily_carbs=Sum(F('food_item__carbs') * F('quantity_g') / Decimal('100.0')),
            daily_fats=Sum(F('food_item__fats') * F('quantity_g') / Decimal('100.0'))
        )

        df['weight_kg'] = pd.Series({pd.to_datetime(w.date): float(w.weight_kg) for w in weight_data})
        df['daily_steps'] = pd.Series({pd.to_datetime(s.date): s.step_count for s in steps_data})
        df['water_intake_ml'] = pd.Series({pd.to_datetime(w.date): w.milliliters for w in water_data})
        df['sleep_hours'] = pd.Series({pd.to_datetime(s.date): float(s.duration_hours) for s in sleep_data})
        df['calories_from_steps'] = pd.Series({pd.to_datetime(s.date): float(s.calories_burned) for s in steps_data})
        df['calories_from_workouts'] = pd.Series({pd.to_datetime(w.date): float(w.calories_burned) for w in workout_data})
        df['calories_consumed'] = pd.Series({pd.to_datetime(m['meal__date']): float(m['daily_calories']) for m in meal_data})
        df['protein_g'] = pd.Series({pd.to_datetime(m['meal__date']): float(m['daily_protein']) for m in meal_data})
        df['carbs_g'] = pd.Series({pd.to_datetime(m['meal__date']): float(m['daily_carbs']) for m in meal_data})
        df['fats_g'] = pd.Series({pd.to_datetime(m['meal__date']): float(m['daily_fats']) for m in meal_data})
        
        df.fillna(0, inplace=True)
        df['total_calories_burned'] = df['calories_from_steps'] + df['calories_from_workouts']
        df['net_calories'] = df['calories_consumed'] - df['total_calories_burned']
        
        return df

    def get(self, request, *args, **kwargs):
        """
        Handles requests for the analysis report data.
        """
        user = request.user
        period = request.query_params.get('period', 'monthly')

        if period == 'weekly':
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=6)
        else: # monthly
            year = int(request.query_params.get('year', datetime.now().year))
            month = int(request.query_params.get('month', datetime.now().month))
            start_date = datetime(year, month, 1).date()
            end_date = (start_date + timedelta(days=31)).replace(day=1) - timedelta(days=1)

        df = self.get_dataframe(user, start_date, end_date)

        # --- Calculate Summary Stats ---
        start_weight = df['weight_kg'].loc[df['weight_kg'] > 0].iloc[0] if not df['weight_kg'].loc[df['weight_kg'] > 0].empty else 0
        end_weight = df['weight_kg'].loc[df['weight_kg'] > 0].iloc[-1] if not df['weight_kg'].loc[df['weight_kg'] > 0].empty else 0
        
        summary = {
            'weight_change_kg': round(end_weight - start_weight, 2),
            'avg_daily_calories_consumed': round(df['calories_consumed'].mean(), 0),
            'avg_daily_calories_burned': round(df['total_calories_burned'].mean(), 0),
            'total_workouts': Workout.objects.filter(user=user, date__range=[start_date, end_date]).count(),
        }

        # --- Format Data for Charts ---
        df.index.name = 'date'
        chart_data = df.reset_index().to_dict(orient='records')
        
        # Format the date for better readability in charts
        for item in chart_data:
            item['date'] = item['date'].strftime('%b %d') 

        response_data = {
            'summary_stats': summary,
            'chart_data': chart_data,
        }
        return Response(response_data)

class WeeklyTrendsView(APIView):
    """
    An endpoint to provide data for the dashboard's weekly trend charts.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=6)

        # Create a date range to ensure we have an entry for all 7 days
        date_range = pd.date_range(start=start_date, end=end_date, freq='D')
        df = pd.DataFrame(index=date_range)

        # Fetch the data
        steps_data = DailySteps.objects.filter(user=user, date__range=[start_date, end_date])
        water_data = WaterIntake.objects.filter(user=user, date__range=[start_date, end_date])
        sleep_data = Sleep.objects.filter(user=user, date__range=[start_date, end_date])

        # Populate a DataFrame
        df['steps'] = pd.Series({pd.to_datetime(s.date): s.step_count for s in steps_data})
        df['water_ml'] = pd.Series({pd.to_datetime(w.date): w.milliliters for w in water_data})
        df['sleep_hours'] = pd.Series({pd.to_datetime(s.date): float(s.duration_hours) for s in sleep_data})
        
        df.fillna(0, inplace=True)
        
        # Format the data for Recharts
        # Recharts expects an array of objects, e.g., [{name: 'Mon', steps: 8000}, ...]
        chart_data = []
        for index, row in df.iterrows():
            chart_data.append({
                'name': index.strftime('%a'), # e.g., "Mon", "Tue"
                'steps': row['steps'],
                'water': round(row['water_ml'] / 250), # Convert ml to glasses
                'sleep': row['sleep_hours'],
            })

        return Response(chart_data)

class ExportCsvView(AnalysisView):
    def get(self, request, *args, **kwargs):
        user = request.user
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=29)
        
        df = self.get_dataframe(user, start_date, end_date)
        
        df_export = df[[
            'weight_kg', 'daily_steps', 'water_intake_ml', 'sleep_hours',
            'calories_consumed', 'protein_g', 'carbs_g', 'fats_g',
            'calories_from_workouts', 'calories_from_steps',
            'total_calories_burned', 'net_calories'
        ]]
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="fittrack_report_{end_date}.csv"'
        
        df_export.to_csv(path_or_buf=response, index_label='date')
        return response
class DailyTipView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        today = datetime.now().date()
        
        calories_consumed = Meal.objects.filter(user=user, date=today).aggregate(total=Sum('total_calories'))['total']
        calories_burned = Workout.objects.filter(user=user, date=today).aggregate(total=Sum('calories_burned'))['total']
        
        try:
            steps = DailySteps.objects.get(user=user, date=today).step_count
        except DailySteps.DoesNotExist:
            steps = None

        try:
            sleep = Sleep.objects.get(user=user, date=today).duration_hours
        except Sleep.DoesNotExist:
            sleep = None


        user_goal = user.profile.get_calorie_goal_option_display() or "their fitness goals"
        prompt_persona = f"You are 'FitCoach', a friendly and insightful AI assistant. Your user's main goal is to {user_goal}."

        facts = []
        data_found = False
        if user.profile.daily_calorie_intake:
            facts.append(f"- Calorie Goal: {user.profile.daily_calorie_intake} kcal")
        if calories_consumed is not None and calories_consumed > 0:
            facts.append(f"- Calories Consumed: {calories_consumed:.0f} kcal")
            data_found = True
        if calories_burned is not None and calories_burned > 0:
            facts.append(f"- Calories Burned from Workouts: {calories_burned:.0f} kcal")
            data_found = True
        if steps is not None and steps > 0:
            facts.append(f"- Steps Taken: {steps}")
            data_found = True
        if sleep is not None and sleep > 0:
            facts.append(f"- Last Night's Sleep: {sleep} hours")
            data_found = True

        if not data_found:
            return Response({"tip": "Log your first activity of the day to unlock a personalized tip!"})

        prompt_instructions = (
            "\nHere are your instructions:\n"
            "1. Analyze the user's data above.\n"
            "2. Pick the single most relevant fact to comment on.\n"
            "3. Write one short, motivational, and actionable tip based ONLY on that fact and the user's main goal.\n"
            "4. The tip must be under 30 words, encouraging, and feel personal.\n"
            "5. Do NOT invent any data or percentages.\n\n"
            "Example of a good tip: 'Great job on your steps! Lets get u some nutrition dense meal to recover .IMPORTANT: Do not write anything before the tip. Your entire response must only be the tip itself.'"
        )
        
        prompt = f"{prompt_persona}\n\nHere is the user's data for today:\n" + "\n".join(facts) + prompt_instructions

        # 4. Call the Groq AI with the improved prompt.
        try:
            client = Groq(api_key=settings.GROQ_API_KEY)
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "user", "content": prompt},
                ],
                model="llama3-8b-8192",
            )
            ai_tip = chat_completion.choices[0].message.content
            return Response({"tip": ai_tip})
        except Exception as e:
            return Response({"error": "Could not generate a tip at this time."}, status=500)

