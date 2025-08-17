import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Toaster, toast } from 'sonner';
import { Plus, Trash2, Flame, Calendar } from 'lucide-react';

// --- Main Workouts Page Component ---
export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [summary, setSummary] = useState({ total_calories_burned: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // State for the new workout form
   const [description, setDescription] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  
  //Workout Preview
  const [workoutPreview, setWorkoutPreview] = useState(null);


  // Fetch both workouts and the daily summary whenever the date changes
  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both data points in parallel for better performance
      const [workoutsRes, summaryRes] = await Promise.all([
        apiClient.get(`/workouts/workouts/?date=${selectedDate}`),
        apiClient.get(`/workouts/summary/?date=${selectedDate}`)
      ]);
      setWorkouts(workoutsRes.data);
      setSummary(summaryRes.data);
    } catch (e) {
      toast.error('Failed to load workout data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateWorkout = async (e) => {
    e.preventDefault();
    if (description.trim().length < 5) {
      toast.error('Please provide a more detailed workout description.');
      return;
    }
    
    setIsCalculating(true);
    setWorkoutPreview(null); // Clear previous preview
    try {
      // 1. Call the new 'calculate' endpoint
      const res = await apiClient.post('/workouts/workouts/calculate/', { description });
      // 2. Save the result to show the confirmation modal
      setWorkoutPreview(res.data);
    } catch (e) {
      console.log(e)
      const errorMessage = e.response?.data?.error || 'Could not calculate calories for this workout.';
      toast.error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  };
  const handleConfirmAndSave = async () => {
    if (!workoutPreview) return;
    
    try {
      // 3. Call the original endpoint to save the workout
      await apiClient.post('/workouts/workouts/', {
        description: workoutPreview.description,
        calories_burned: workoutPreview.calories_burned, // Pass the pre-calculated calories
        date: selectedDate
      });
      toast.success('Workout logged successfully!');
      setDescription('');
      setWorkoutPreview(null); // Close the confirmation modal
      fetchData(); // Refresh all data
    } catch (e) {
      toast.error('Failed to save workout.');
    }
  };

  const deleteWorkout = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await apiClient.delete(`/workouts/workouts/${workoutId}/`);
        toast.success('Workout deleted successfully!');
        fetchData(); // Refresh all data
      } catch (e) {
        toast.error('Failed to delete workout.');
      }
    }
  };

  // --- Render Logic ---

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Workout Log</h2>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="date"
              className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Daily Summary Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-700">Today's Summary</h3>
            <div className="flex items-center mt-2">
                <Flame size={28} className="text-red-500 mr-3"/>
                <div>
                    <p className="text-3xl font-bold text-gray-800">{Math.round(summary.total_calories_burned)}</p>
                    <p className="text-sm text-gray-500">Total Calories Burned</p>
                </div>
            </div>
        </div>

        {/* Add New Workout Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Log a New Workout</h3>
          <form onSubmit={handleCalculateWorkout} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g., ran 3 miles and did 20 pushups"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="submit"
              disabled={isCalculating}
              className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-sm disabled:bg-gray-400"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Calories'}
            </button>
          </form>
        </div>
        

        {/* Logged Workouts List */}
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Workouts</h3>
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Loading workouts...</p>
                ) : workouts.length === 0 ? (
                    <p className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">No workouts logged for this date.</p>
                ) : (
                workouts.map((workout) => (
                    <div key={workout.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-gray-700">{workout.description}</p>
                        <p className="text-sm text-red-500 font-medium mt-1">
                            <Flame size={14} className="inline mr-1"/>
                            {Math.round(workout.calories_burned || 0)} kcal burned
                        </p>
                    </div>
                    <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                        aria-label="Delete workout"
                    >
                        <Trash2 size={18} />
                    </button>
                    </div>
                ))
                )}
            </div>
        </div>
      </div>
       {/* --- NEW: Confirmation Modal --- */}
      {workoutPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md text-center p-6">
            <h3 className="text-xl font-bold text-gray-800">Confirm Workout</h3>
            <p className="text-gray-600 mt-2">This workout burned approximately:</p>
            <p className="text-5xl font-bold text-red-500 my-4">{Math.round(workoutPreview.calories_burned)} kcal</p>
            <p className="text-sm bg-gray-100 p-2 rounded-md">"{workoutPreview.description}"</p>
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={() => setWorkoutPreview(null)} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleConfirmAndSave} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                Add to Log
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
