import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Toaster, toast } from 'sonner';
import { Plus, X, Search, Trash2, Edit, Flame, Drumstick, Wheat, Pizza } from 'lucide-react';

const searchFoodAPI = async (query) => {
  // This now makes a real POST request to your Django backend endpoint.
  const response = await apiClient.post('/meals/food-search/', { query });
  return response.data; // The backend returns an object like { food_item: {...} }
};

// --- Main Meals Page Component ---
export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingMeal, setEditingMeal] = useState(null);

  
  // State for the "Add Meal" modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [mealType, setMealType] = useState('breakfast');
  const [currentMealItems, setCurrentMealItems] = useState([]);
  
  // State for food search within the modal
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch meals when the selected date changes
  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/meals/meals/?date=${selectedDate}`);
      setMeals(res.data);
    } catch (e) {
      setError('Failed to load meals.');
      toast.error('Failed to load meals.');
    } finally {
      setLoading(false);
    }
  };

  // --- Event Handlers ---

  const openModal = (type) => {
    setEditingMeal(null); // <-- ADD THIS LINE to clear any previous edit

    setMealType(type);
    setModalOpen(true);
    // Reset modal state
    setCurrentMealItems([]);
    setSearchTerm('');
    setSearchResult(null);
  };
  const closeModal = () => {
  setModalOpen(false);
  setEditingMeal(null); // Clear the meal being edited
  setCurrentMealItems([]); // Clear the food items
  setSearchTerm('');
  setSearchResult(null);
};

  const handleSearch = async () => {
    if (searchTerm.length < 3) {
      toast.error('Please enter at least 3 characters to search.');
      return;
    }
    setIsSearching(true);
    setSearchResult(null);
    try {
      const res = await searchFoodAPI(searchTerm);
      if (res && res.food_item) {
        setSearchResult(res.food_item);
      } else {
        toast.error(`No results found for "${searchTerm}".`);
      }
    } catch (err) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const addFoodToMeal = (food) => {
    // Check if item already exists
    if (currentMealItems.find(item => item.food_item.id === food.id)) {
      toast.info(`${food.name} is already in your meal.`);
      return;
    }
    setCurrentMealItems([...currentMealItems, { food_item: food, quantity_g: 100 }]);
    setSearchResult(null);
    setSearchTerm('');
  };
  
  const updateQuantity = (foodId, newQuantity) => {
    setCurrentMealItems(currentMealItems.map(item => 
      item.food_item.id === foodId ? { ...item, quantity_g: parseInt(newQuantity) || 0 } : item
    ));
  };
  
  const removeItem = (foodId) => {
    setCurrentMealItems(currentMealItems.filter(item => item.food_item.id !== foodId));
  };

  const handleLogMeal = async () => {
  if (currentMealItems.length === 0) {
    toast.error('Please add at least one food item to your meal.');
    return;
  }
  
  const payload = {
    date: selectedDate,
    meal_type: mealType,
    meal_items: currentMealItems.map(item => ({
      food_item_id: item.food_item.id,
      quantity_g: item.quantity_g,
    })),
  };

  try {
    if (editingMeal) {
      // If we are editing, send a PATCH request
      await apiClient.patch(`/meals/meals/${editingMeal.id}/`, payload);
      toast.success('Meal updated successfully!');
    } else {
      // Otherwise, send a POST request to create a new meal
      await apiClient.post('/meals/meals/', payload);
      toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} logged successfully!`);
    }
    
    setModalOpen(false);
    setEditingMeal(null); // Reset the editing state
    fetchMeals(); // Refresh the meal list
  } catch (err) {
    console.log(err.response.data)
    toast.error('Failed to save meal.');
  }
};
  const openEditModal = (meal) => {
  setEditingMeal(meal); // Set the meal to be edited
  setMealType(meal.meal_type); // Set the meal type in the modal
  setCurrentMealItems(meal.meal_items); // Pre-fill the modal with existing food items
  setModalOpen(true); // Open the modal
};

  const deleteMeal = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this entire meal?')) {
      try {
        await apiClient.delete(`/meals/meals/${mealId}/`);
        toast.success('Meal deleted successfully!');
        fetchMeals();
      } catch (e) {
        toast.error('Failed to delete meal.');
      }
    }
  };

  // --- Render Logic ---

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Meal Log</h2>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Add Meal Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
            <button key={type} onClick={() => openModal(type)} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors shadow-sm">
              <Plus size={18} />
              <span className="capitalize">Add {type}</span>
            </button>
          ))}
        </div>

        {/* Display Logged Meals */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading meals...</p>
          ) : meals.length === 0 ? (
            <p className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">No meals logged for this date. Add one above!</p>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg capitalize text-gray-800">{meal.meal_type}</h3>
                  <div className="flex gap-3">
                <button onClick={() => openEditModal(meal)} className="text-sm text-blue-600 font-semibold hover:underline"><Edit size={14} className="inline mr-1"/>Edit</button>   
                 <button onClick={() => deleteMeal(meal.id)} className="text-sm text-red-600 font-semibold hover:underline"><Trash2 size={14} className="inline mr-1"/>Delete</button>
                  </div>
                </div>
                {/* Meal summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-3">
                    {/* ... stats ... */}
                </div>
                {/* Meal items */}
                <div className="mt-4 space-y-2">
                  {meal.meal_items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
                      <span>{item.food_item.name} ({item.quantity_g}g)</span>
                      <span className="font-semibold">{item.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Add Meal Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-bold capitalize">{editingMeal ? 'Edit' : 'Add'} {mealType}</h3>  
            <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-100"><X size={20}/></button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Food Search */}
              <div>
                <label className="font-semibold text-sm">Find a food</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="e.g., apple or chicken breast" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"/>
                  <button onClick={handleSearch} disabled={isSearching} className="bg-green-500 text-white font-semibold px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400">
                    {isSearching ? '...' : <Search size={20}/>}
                  </button>
                </div>
              </div>

              {/* Search Result */}
              {searchResult && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="font-bold">{searchResult.name}</p>
                  <p className="text-xs text-gray-600 mb-2">Nutritional info per 100g</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <span><Flame size={14} className="inline mr-1 text-red-500"/>{searchResult.calories} kcal</span>
                    <span><Drumstick size={14} className="inline mr-1 text-orange-500"/>{searchResult.protein}g P</span>
                    <span><Wheat size={14} className="inline mr-1 text-yellow-500"/>{searchResult.carbs}g C</span>
                    <span><Pizza size={14} className="inline mr-1 text-blue-500"/>{searchResult.fats}g F</span>
                  </div>
                  <button onClick={() => addFoodToMeal(searchResult)} className="w-full mt-3 bg-green-500 text-white text-sm font-semibold py-1.5 rounded-md hover:bg-green-600">Add to Meal</button>
                </div>
              )}

              {/* Current Meal Items */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Your Meal Items</h4>
                {currentMealItems.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">Search for food to add it here.</p>
                ) : (
                  currentMealItems.map(item => (
                    <div key={item.food_item.id} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                      <span className="flex-1 font-semibold text-sm">{item.food_item.name}</span>
                      <input type="number" value={item.quantity_g} onChange={e => updateQuantity(item.food_item.id, e.target.value)} className="w-20 text-center border border-gray-300 rounded-md px-1 py-0.5"/>
                      <span className="text-xs">grams</span>
                      <button onClick={() => removeItem(item.food_item.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16}/></button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t mt-auto">
<button onClick={handleLogMeal} className="...">{editingMeal ? 'Save Changes' : 'Log Meal'}</button>   
         </div>
          </div>
        </div>
      )}
    </>
  );
}

