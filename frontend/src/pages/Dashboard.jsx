import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Toaster, toast } from 'sonner';
import { Info, Utensils, Dumbbell } from 'lucide-react';

// Import the dashboard components
import CalorieTracker from '../components/dashboard/CalorieTracker';
import DailySummary from '../components/dashboard/DailySummary';
import LogDataModal from '../components/dashboard/LogDataModal';
import WeeklyTrends from '../components/dashboard/WeeklyTrends'; // New component for weekly trends   
export default function Dashboard() {
    const [stats, setStats] = useState(null);
      const [trendData, setTrendData] = useState([]); // New state for trend data

    const [profileComplete, setProfileComplete] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [modalOpen, setModalOpen] = useState(false);
    const [logType, setLogType] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const profileRes = await apiClient.get('/auth/profile/');
            const profileData = profileRes.data;
            if (profileData.height && profileData.weight && profileData.age && profileData.daily_calorie_intake) {
                setProfileComplete(true);
                const [meals, workouts, goals, steps, water, sleep, weight,trends] = await Promise.all([
                    apiClient.get('/meals/daily-calories/'),
                    apiClient.get('/workouts/summary/'),
                    apiClient.get('/daily-data/goals/'),
                    apiClient.get('/daily-data/steps/').catch(() => ({ data: [{ step_count: 0 }] })),
                    apiClient.get('/daily-data/water/').catch(() => ({ data: [{ milliliters: 0 }] })),
                    apiClient.get('/daily-data/sleep/').catch(() => ({ data: [{ duration_hours: 0 }] })),
                    apiClient.get('/daily-data/weight/').catch(() => ({ data: [] })),
                    apiClient.get('/analysis/weekly-trends/') // Fetch trend data

                ]);
                console.log("Weekly trends data from API:", trends.data);

                setStats({
                    meals: meals.data,
                    workouts: workouts.data,
                    goals: goals.data,
                    steps: steps.data[0] || { step_count: 0 },
                    water: water.data[0] || { milliliters: 0 },
                    sleep: sleep.data[0] || { duration_hours: 0 },
                    weight: weight.data.sort((a, b) => new Date(b.date) - new Date(a.date))[0] || { weight_kg: profileData.weight },
                });
                // --- THIS IS THE FIX ---
            // Add this line to save the trend data to your state
            setTrendData(trends.data);
            } else {
                setProfileComplete(false);
            }
        } catch (error) {
            toast.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openLogModal = (type) => {
        setLogType(type);
        setModalOpen(true);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    if (!profileComplete) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1"><Info className="h-6 w-6 text-yellow-500 mr-4" /></div>
                        <div>
                            <p className="text-xl font-bold text-yellow-800">Complete Your Profile</p>
                            <p className="mt-2 text-yellow-700">Please set up your biometrics and calorie goal to unlock your personalized dashboard.</p>
                            <Link to="/profile" className="inline-block mt-4 bg-yellow-400 text-yellow-900 font-semibold px-6 py-2 rounded-lg hover:bg-yellow-500">
                                Go to Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-center" richColors duration={3000}/>
            <div className="p-4 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Today's Dashboard</h1>
                        <p className="text-gray-500">A summary of your activity for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/log-meal" className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                            <Utensils size={16} />
                            <span>Log Meal</span>
                        </Link>
                        <Link to="/log-workout" className="flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                            <Dumbbell size={16} />
                            <span>Log Workout</span>
                        </Link>
                    </div>
                </div>
                
                {stats && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2">
                            <CalorieTracker stats={stats} />
                            <div className="mt-8">
<WeeklyTrends data={trendData} />
                            </div>
                             

                        </div>
                        <div className="flex flex-col sm:flex-row xl:flex-col gap-6">
                            <DailySummary stats={stats} onLog={openLogModal} />

                        </div>
                        
                        
                    </div>
                )}
                
                {/* Placeholder for future graphs */}
                {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Activity</h2>
                    <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-gray-500">Graphs and data analysis will be displayed here.</p>
                    </div>
                </div> */}
            </div>
            {modalOpen && (
                <LogDataModal 
                    logType={logType} 
                    onClose={() => setModalOpen(false)} 
                    onSuccess={fetchData} 
                />
            )}
        </>
    );
}
