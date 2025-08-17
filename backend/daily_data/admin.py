from django.contrib import admin
from .models import DailySteps, WaterIntake, Sleep,WeightLog, UserGoals
# Register your models here.
admin.site.register(DailySteps)
admin.site.register(WaterIntake)
admin.site.register(WeightLog)
admin.site.register(UserGoals)  # Register the new UserGoals model  
admin.site.register(Sleep)