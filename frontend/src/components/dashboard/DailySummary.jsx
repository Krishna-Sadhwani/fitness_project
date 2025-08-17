import React from 'react';
import { Flame, Droplets, Footprints, BedDouble, Plus, Weight } from 'lucide-react';

// --- THIS COMPONENT IS NOW CORRECTED ---
const StatCard = ({ icon, title, value, unit, color, onLog }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
        <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-full ${color}`}>{icon}</div>
            {/* It now checks for the onLog prop and displays the button if it exists */}
            {onLog && (
                <button onClick={onLog} className="p-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                    <Plus size={16} />
                </button>
            )}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value} <span className="text-base font-medium text-gray-500">{unit}</span></p>
        </div>
    </div>
);

const TrackingCard = ({ icon, title, value, goal, unit, color, onLog }) => {
    const progress = goal > 0 ? (value / goal) * 100 : 0;
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${color}`}>{icon}</div>
                    <p className="font-semibold text-gray-700">{title}</p>
                </div>
                <button onClick={onLog} className="p-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"><Plus size={16} /></button>
            </div>
            <div className="mt-4">
                <p className="text-xl font-bold text-gray-800">{value} / {goal} <span className="text-sm font-medium text-gray-500">{unit}</span></p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default function DailySummary({ stats, onLog }) {
    return (
        <>
            <StatCard 
                icon={<Flame size={20} className="text-white"/>} 
                title="Calories Burned" 
                value={Math.round(stats.workouts.total_calories_burned)} 
                unit="kcal" 
                color="bg-red-500"
            />
            {/* --- THIS IS THE CORRECTED CODE --- */}
            {/* A custom card for logging weight without displaying a value */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
                <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-full bg-gray-500">
                        <Weight size={20} className="text-white"/>
                    </div>
                    <button onClick={() => onLog('weight')} className="p-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                        <Plus size={16} />
                    </button>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-800">Log Today's Weight</p>
                    <p className="text-xs text-gray-500 mt-1">Weekly logs help track your progress!</p>
                </div>
            </div>
            <TrackingCard 
                icon={<Footprints size={20} className="text-blue-600"/>} 
                title="Steps" 
                value={stats.steps.step_count} 
                goal={stats.goals.step_goal} 
                unit="steps" 
                color="bg-blue-100"
                onLog={() => onLog('steps')}
            />
            <TrackingCard 
                icon={<Droplets size={20} className="text-sky-600"/>} 
                title="Water" 
                value={Math.round(stats.water.milliliters / 250)} 
                goal={Math.round(stats.goals.water_goal_ml / 250)} 
                unit="glasses" 
                color="bg-sky-100"
                onLog={() => onLog('water')}
            />
            <TrackingCard 
                icon={<BedDouble size={20} className="text-indigo-600"/>} 
                title="Sleep" 
                value={parseFloat(stats.sleep.duration_hours)} 
                goal={parseFloat(stats.goals.sleep_goal_hours)} 
                unit="hours" 
                color="bg-indigo-100"
                onLog={() => onLog('sleep')}
            />
        </>
    );
}
