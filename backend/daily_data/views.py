from rest_framework import viewsets, permissions
from .models import DailySteps, WaterIntake, Sleep,WeightLog, UserGoals
from .serializers import DailyStepsSerializer, WaterIntakeSerializer, SleepSerializer,WeightLogSerializer, UserGoalsSerializer
from rest_framework import generics
class DailyDataViewSet(viewsets.ModelViewSet):
    """
    A base ViewSet for handling daily data entries.
    It ensures that users can only interact with their own data.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter the queryset to only return objects belonging to the current user.
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user to the logged-in user upon creation.
        serializer.save(user=self.request.user)

# We create a specific ViewSet for each model, inheriting the custom logic from our base class.
class DailyStepsViewSet(DailyDataViewSet):
    queryset = DailySteps.objects.all()
    serializer_class = DailyStepsSerializer

class WaterIntakeViewSet(DailyDataViewSet):
    queryset = WaterIntake.objects.all()
    serializer_class = WaterIntakeSerializer

class SleepViewSet(DailyDataViewSet):
    queryset = Sleep.objects.all()
    serializer_class = SleepSerializer
class WeightLogViewSet(DailyDataViewSet):
    queryset = WeightLog.objects.all()
    serializer_class = WeightLogSerializer
class UserGoalsView(generics.RetrieveUpdateAPIView):
    """
    An endpoint for the logged-in user to view and update their daily goals.
    """
    queryset = UserGoals.objects.all()
    serializer_class = UserGoalsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        goals, created = UserGoals.objects.get_or_create(user=self.request.user)
        return goals