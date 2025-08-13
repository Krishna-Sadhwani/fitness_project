from django.contrib import admin
from .models import DailySteps, WaterIntake, Sleep
# Register your models here.
admin.site.register(DailySteps)
admin.site.register(WaterIntake)
admin.site.register(Sleep)