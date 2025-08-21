from django.urls import path
from .views import AnalysisView, ExportCsvView,WeeklyTrendsView,DailyTipView

urlpatterns = [
        path('weekly-trends/', WeeklyTrendsView.as_view(), name='weekly-trends'),

    path('report/', AnalysisView.as_view(), name='analysis-report'),
    path('export-csv/', ExportCsvView.as_view(), name='export-csv'),
    path('daily-tip/', DailyTipView.as_view(), name='daily-tip'),

]
