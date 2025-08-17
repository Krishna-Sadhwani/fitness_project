import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CalorieTracker({ stats }) {
    const caloriesConsumed = Math.round(stats.meals.total_calories);
    const calorieGoal = Math.round(stats.meals.daily_goal);
    const calorieProgress = calorieGoal > 0 ? (caloriesConsumed / calorieGoal) * 100 : 0;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 ">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Calorie Tracker</h2>
            <div className="flex items-center gap-4">
                {/* Progress Ring */}
                <div className="relative w-32 h-32 flex-shrink-0">
  {/* 1. The progress bar is the first layer */}
  <CircularProgressbar
    value={calorieProgress}
    strokeWidth={10}
    styles={buildStyles({
      pathTransitionDuration: 0.5,
      pathColor: '#10B981',
      trailColor: '#E5E7EB',
    })}
  />
  {/* 2. The text is the second layer, positioned on top */}
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <p className="text-2xl font-bold text-gray-800">{caloriesConsumed}</p>
    <p className="text-xs text-gray-500">/ {calorieGoal} kcal</p>
  </div>
</div>
                {/* Macros (Compact Vertical Layout) */}
               <div className="w-full bg-green-50 p-4 rounded-lg mt-4">
    <div className="grid grid-cols-3 gap-4 text-center">
        <div>
            <p className="font-semibold text-blue-600">Protein</p>
            <p className="text-2xl font-bold">{Math.round(stats.meals.total_protein)}g</p>
        </div>
        <div>
            <p className="font-semibold text-orange-500">Carbs</p>
            <p className="text-2xl font-bold">{Math.round(stats.meals.total_carbs)}g</p>
        </div>
        <div>
            <p className="font-semibold text-purple-500">Fats</p>
            <p className="text-2xl font-bold">{Math.round(stats.meals.total_fats)}g</p>
        </div>
    </div>
</div>
            </div>
        </div>
    );
}
