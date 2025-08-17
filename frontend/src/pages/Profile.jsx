import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { Camera, Edit2, Check, X, Info,RefreshCw } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// --- Helper Components ---
const FormInput = ({ label, name, value, onChange, error, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
      id={name} name={name} value={value || ''} onChange={onChange}
      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const FormSelect = ({ label, name, value, onChange, error, children }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">{label}</label>
    <select
      id={name} name={name} value={value || ''} onChange={onChange}
      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none sm:text-sm ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// --- Main Profile Page Component ---
export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [account, setAccount] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editableAccount, setEditableAccount] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [goals, setGoals] = useState({ step_goal: 8000, water_goal_ml: 2000, sleep_goal_hours: 8.0 });
  const [showSuggestions, setShowSuggestions] = useState(false);


  // Memoized check to see if essential biometrics are filled out
  const hasCompletedBiometrics = useMemo(() => {
    if (!profile) return false;
    return !!(profile.height && profile.weight && profile.age && profile.gender && profile.activity_level && profile.calorie_goal_option);
  }, [profile]);

  // --- Data Fetching ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, accountRes] = await Promise.all([
        apiClient.get('/auth/profile/'),
        apiClient.get('/auth/account/'),
      ]);
      const profileData = profileRes.data;
      setProfile(profileData);
      setAccount(accountRes.data);
      setEditableAccount(accountRes.data);

      // Check if biometrics are complete to fetch suggestions on initial load
      if (profileData.height && profileData.weight && profileData.age && profileData.gender && profileData.activity_level && profileData.calorie_goal_option) {
        const suggestionsRes = await apiClient.get('/auth/calorie-suggestions/');
        setSuggestions(suggestionsRes.data);
        if (!profileData.daily_calorie_intake) {
          setShowSuggestions(true);
        }
      }
    } catch (err) {
      toast.error('Failed to load your data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Event Handlers ---
  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleAccountChange = (e) => setEditableAccount({ ...editableAccount, [e.target.name]: e.target.value });
  const handleGoalsChange = (e) => setGoals({ ...goals, [e.target.name]: e.target.value });

  const handleGoalsSubmit = async (e) => {
    e.preventDefault();
    try {
        await apiClient.patch('/daily-data/goals/', goals);
        toast.success('Daily goals saved successfully!');
    } catch (err) {
        toast.error('Failed to save daily goals.');
    }
  };
  const handleBiometricsSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear old errors

    // Create a new object with only the fields we want to patch
    const biometricData = {
        height: profile.height,
        weight: profile.weight,
        age: profile.age,
        gender: profile.gender,
        activity_level: profile.activity_level,
        calorie_goal_option: profile.calorie_goal_option,
        weight_goal: profile.weight_goal
    };

    try {
      const res = await apiClient.patch('/auth/profile/', biometricData);
      setProfile(res.data);
      // This is the updated toast message
      toast.success('Profile updated successfully!');

      // Check if biometrics are complete before fetching suggestions
      if (res.data.height && res.data.weight && res.data.age && res.data.gender && res.data.activity_level && res.data.calorie_goal_option) {
        console.log("trying to fetch suggestions");
        const suggestionsRes = await apiClient.get('/auth/calorie-suggestions/');
        setSuggestions(suggestionsRes.data);
         if (!res.data.daily_calorie_intake) {
        setShowSuggestions(true);
      }
      } else {
        setSuggestions(null); // Clear suggestions if biometrics are incomplete
      }

    } catch (err) {
        console.error('Biometrics submit error:', err.response?.data);
        if (err.response?.data) {
            // The backend returned validation errors
            setErrors(err.response.data);
            toast.error('Please correct the errors and try again.');
        } else {
            // General error
            toast.error('Failed to save biometrics.');
        }
    }
  };
  
  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.patch('/auth/profile/', { daily_calorie_intake: profile.daily_calorie_intake });
      toast.success('Calorie goal saved successfully!');
      setShowSuggestions(false);

    } catch (err) {
      toast.error('Failed to save calorie goal.');
    }
  };

  const handleAccountSubmit = async () => {
    try {
      const res = await apiClient.patch('/auth/account/', editableAccount);
      setAccount(res.data);
      setIsEditingAccount(false);
      toast.success('Account details updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update account details.');
    }
   };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profile_picture', file);
    try {
      const res = await apiClient.patch('/auth/profile/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(res.data);
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error('Failed to upload image.');
    }
   };

  // --- Render Logic ---
  if (loading) return <div className="p-8 text-center">Loading your profile...</div>;

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Profile Header (Unchanged) */}
        <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            <div className="relative">
                <img src={profile?.profile_picture || `https://placehold.co/150x150/E2E8F0/4A5568?text=${account?.username?.charAt(0).toUpperCase() || 'P'}`} alt="Profile" className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg" />
                <button onClick={() => fileInputRef.current.click()} className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors" aria-label="Change profile picture">
                <Camera size={20} className="text-gray-600" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/png, image/jpeg" />
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-left flex-1">
                {isEditingAccount ? (
                <div className="space-y-2">
                    <input type="text" name="username" value={editableAccount.username} onChange={handleAccountChange} className="text-2xl font-bold p-1 border rounded w-full" />
                    <input type="email" name="email" value={editableAccount.email} onChange={handleAccountChange} className="text-gray-500 p-1 border rounded w-full" />
                    <div className="flex gap-2 justify-center md:justify-start mt-2">
                        <button onClick={handleAccountSubmit} className="p-1.5 bg-green-100 text-green-600 rounded-full"><Check size={16}/></button>
                        <button onClick={() => setIsEditingAccount(false)} className="p-1.5 bg-red-100 text-red-600 rounded-full"><X size={16}/></button>
                    </div>
                </div>
                ) : (
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{account?.username}</h2>
                    <p className="text-lg text-gray-500">{account?.email}</p>
                    <button onClick={() => setIsEditingAccount(true)} className="mt-2 text-sm text-green-600 font-semibold flex items-center gap-1 mx-auto md:mx-0">
                    <Edit2 size={14} /> Edit Account
                    </button>
                </div>
                )}
            </div>
        </div>
        {/* Daily Goals Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Set Your Daily Goals</h3>
            <form onSubmit={handleGoalsSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput label="Step Goal" name="step_goal" type="number" value={goals?.step_goal} onChange={handleGoalsChange} />
                <FormInput label="Water Goal (ml)" name="water_goal_ml" type="number" value={goals?.water_goal_ml} onChange={handleGoalsChange} />
                <FormInput label="Sleep Goal (hours)" name="sleep_goal_hours" type="number" step="0.5" value={goals?.sleep_goal_hours} onChange={handleGoalsChange} />
                <div className="md:col-span-3">
                    <button type="submit" className="w-full py-2.5 text-white font-semibold bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                        Save Daily Goals
                    </button>
                </div>
            </form>
        </div>

        {/* Biometrics Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Biometrics</h3>
          <form onSubmit={handleBiometricsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Height (cm)" name="height" type="number" value={profile?.height} onChange={handleChange} placeholder="e.g., 175" error={errors.height} />
            <FormInput label="Weight (kg)" name="weight" type="number" value={profile?.weight} onChange={handleChange} placeholder="e.g., 70" error={errors.weight} />
            <FormInput label="Age" name="age" type="number" value={profile?.age} onChange={handleChange} placeholder="e.g., 30" error={errors.age} />
            <FormSelect label="Gender" name="gender" value={profile?.gender} onChange={handleChange} error={errors.gender}>
              <option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option>
            </FormSelect>
            <FormSelect label="Activity Level" name="activity_level" value={profile?.activity_level} onChange={handleChange} error={errors.activity_level}>
                <option value="">Select Activity Level</option><option value="sedentary">Sedentary</option><option value="lightly_active">Lightly active</option><option value="moderately_active">Moderately active</option><option value="very_active">Very active</option><option value="extra_active">Extra active</option>
            </FormSelect>
            <FormSelect label="Primary Goal" name="calorie_goal_option" value={profile?.calorie_goal_option} onChange={handleChange} error={errors.calorie_goal_option}>
                <option value="">What is your main goal?</option>
                <option value="deficit">Lose Weight</option>
                <option value="surplus">Gain Muscle</option>
                <option value="maintain">Maintain Weight</option>
            </FormSelect>
            {/* --- WEIGHT GOAL FIELD ADDED --- */}
            <FormInput label="Weight Goal (kg)" name="weight_goal" type="number" value={profile?.weight_goal} onChange={handleChange} placeholder="e.g., 65" error={errors.weight_goal} />

            <div className="md:col-span-2">
              <button type="submit" className="w-full py-2.5 text-white font-semibold bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                Save Biometrics & Get Suggestions
              </button>
            </div>
          </form>
        </div>

        {/* --- CONDITIONAL CALORIE GOAL SECTION --- */}
        {hasCompletedBiometrics && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your Daily Calorie Goal</h3>
            
            {showSuggestions && suggestions ? (
              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <p className="text-gray-600 mb-4">Based on your biometrics, here are some suggested targets. Select one or enter your own below.</p>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="font-semibold">To Maintain Weight:</p>
                  <p className="text-2xl font-bold text-gray-800">{suggestions.maintenance_calories} kcal / day</p>
                </div>
                {suggestions.suggestions.map(suggestion => (
                  <div key={suggestion.weekly_goal} className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-semibold text-green-800">{suggestion.weekly_goal}</p>
                      <p className="text-2xl font-bold text-green-900">{suggestion.daily_calories} kcal / day</p>
                    </div>
                    <button type="button" onClick={() => setProfile({...profile, daily_calorie_intake: suggestion.daily_calories})} className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600">Set Goal</button>
                  </div>
                ))}
              </form>
            ) : (
              <p className="text-gray-600 mb-4">Your goal is set. You can edit it below or see suggestions again.</p>
            )}

            {/* Always show the input and save button */}
            <form onSubmit={handleGoalSubmit} className="mt-6">
              <FormInput label="Your Current Goal (kcal)" name="daily_calorie_intake" type="number" value={profile?.daily_calorie_intake} onChange={handleChange} placeholder="Set a goal" />
              <div className="flex items-center gap-4 mt-4">
                <button type="submit" className="w-full py-2.5 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Calorie Goal
                </button>
                {!showSuggestions && (
                  <button type="button" onClick={() => setShowSuggestions(true)} className="w-full py-2.5 text-gray-700 font-semibold bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                    <RefreshCw size={16} /> See Suggestions
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        {/* Prompt to complete profile if needed */}
        {!hasCompletedBiometrics && !loading && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="py-1"><Info className="h-5 w-5 text-yellow-500 mr-3" /></div>
                    <div>
                        <p className="font-bold text-yellow-800">Complete Your Profile</p>
                        <p className="text-sm text-yellow-700">Please fill in and save your biometrics to unlock personalized calorie suggestions.</p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </>
  );
}
