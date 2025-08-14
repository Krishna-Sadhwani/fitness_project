import React, { useState, useEffect } from 'react'
import apiClient from '../api/client'

const Meals = () => {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchMeals()
  }, [selectedDate])

  const fetchMeals = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get(`/meals/?date=${selectedDate}`)
      setMeals(res.data)
    } catch (e) {
      setError(e?.response?.data || 'Failed to load meals')
    } finally {
      setLoading(false)
    }
  }

  const deleteMeal = async (mealId) => {
    try {
      await apiClient.delete(`/meals/${mealId}/`)
      await fetchMeals()
    } catch (e) {
      setError('Failed to delete meal')
    }
  }

  if (loading) return <div className="p-6">Loading meals...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Meal Log</h2>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {error && <div className="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded p-2">{JSON.stringify(error)}</div>}

      <div className="space-y-4">
        {meals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No meals logged for this date</p>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold capitalize">{meal.meal_type}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Calories:</span>
                  <span className="ml-2 font-medium">{Math.round(meal.total_calories || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Protein:</span>
                  <span className="ml-2 font-medium">{Math.round(meal.total_protein || 0)}g</span>
                </div>
                <div>
                  <span className="text-gray-500">Carbs:</span>
                  <span className="ml-2 font-medium">{Math.round(meal.total_carbs || 0)}g</span>
                </div>
                <div>
                  <span className="text-gray-500">Fats:</span>
                  <span className="ml-2 font-medium">{Math.round(meal.total_fats || 0)}g</span>
                </div>
              </div>
              {meal.meal_items?.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Food Items:</h4>
                  <div className="space-y-1">
                    {meal.meal_items.map((item) => (
                      <div key={item.id} className="text-sm text-gray-600">
                        {item.quantity_g}g {item.food_item?.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Meals




