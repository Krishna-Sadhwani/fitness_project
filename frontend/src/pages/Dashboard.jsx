import React, { useEffect, useMemo, useState } from 'react'
import apiClient from '../api/client'

const formatDate = (d) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const toNumber = (v) => (v === null || v === undefined ? 0 : Number(v))

const Dashboard = () => {
  const [dateStr, setDateStr] = useState(() => formatDate(new Date()))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [daily, setDaily] = useState({
    total_calories: 0,
    daily_goal: 0,
    remaining_calories: 0,
    status_message: '',
  })
  const [burned, setBurned] = useState(0)

  // Quick add meal state
  const [mealType, setMealType] = useState('breakfast')
  const [foodQuery, setFoodQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState(null)
  const [addSuccess, setAddSuccess] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState('100')

  const progress = useMemo(() => {
    const eaten = toNumber(daily.total_calories)
    const goal = Math.max(1, toNumber(daily.daily_goal))
    return Math.max(0, Math.min(100, Math.round((eaten / goal) * 100)))
  }, [daily])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dailyRes, workoutRes] = await Promise.all([
        apiClient.get(`/daily-calories/?date=${dateStr}`),
        apiClient.get(`/summary/?date=${dateStr}`),
      ])
      setDaily(dailyRes.data)
      setBurned(toNumber(workoutRes.data?.total_calories_burned))
    } catch (e) {
      setError(e?.response?.data || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [dateStr])

  const handleSearchFood = async (e) => {
    e.preventDefault()
    if (!foodQuery.trim()) return
    setSearching(true)
    setSearchResults([])
    setSelectedFood(null)
    try {
      const res = await apiClient.post('/food-search/', { query: foodQuery })
      if (res.data?.food_item) {
        setSearchResults([res.data.food_item])
      }
    } catch (e) {
      setAddError('Food search failed')
    } finally {
      setSearching(false)
    }
  }

  const handleAddFoodToMeal = async (foodItem) => {
    const qty = Number(grams)
    if (!qty || qty <= 0) {
      setAddError('Enter a valid quantity in grams')
      return
    }
    setAdding(true)
    setAddError(null)
    setAddSuccess(null)
    try {
      // Create or update meal with the selected food item
      const res = await apiClient.post('/meals/', {
        meal_type: mealType,
        date: dateStr,
        meal_items: [
          {
            food_item_id: foodItem.id,
            quantity_g: qty,
          },
        ],
      })

      const created = res.status === 201
      setAddSuccess(
        created
          ? `Created ${mealType} and added ${qty}g of ${foodItem.name}`
          : `Added ${qty}g of ${foodItem.name} to existing ${mealType}`
      )
      setFoodQuery('')
      setGrams('100')
      setSearchResults([])
      setSelectedFood(null)
      await fetchData()
    } catch (e) {
      setAddError(e?.response?.data || 'Failed to add meal')
    } finally {
      setAdding(false)
    }
  }

  const handleAddMeal = async (e) => {
    e.preventDefault()
    // This function is no longer used but kept for compatibility
    console.log('handleAddMeal called but not implemented')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{JSON.stringify(error)}</div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-brandLight text-brand">🔥</span>
                <span>Calories Eaten</span>
              </div>
              <div className="text-3xl font-bold mt-1">
                {Math.round(toNumber(daily.total_calories))}
                <span className="text-gray-400 text-base"> kcal</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>
                    {Math.round(toNumber(daily.total_calories))} / {Math.round(toNumber(daily.daily_goal))}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-green-500 rounded"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2">{daily.status_message}</div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-gray-500 text-sm">Daily Goal</div>
              <div className="text-3xl font-bold mt-1">
                {Math.round(toNumber(daily.daily_goal))}
                <span className="text-gray-400 text-base"> kcal</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">Remaining: {Math.round(toNumber(daily.remaining_calories))}</div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-brandLight text-brand">🏋️‍♀️</span>
                <span>Calories Burned</span>
              </div>
              <div className="text-3xl font-bold mt-1">
                {Math.round(toNumber(burned))}
                <span className="text-gray-400 text-base"> kcal</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">From logged workouts</div>
            </div>
          </div>

          {/* Quick Add Meal */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Quick Add Meal</h3>
            {addError && <div className="text-red-600 text-sm mb-2">{JSON.stringify(addError)}</div>}
            {addSuccess && <div className="text-green-600 text-sm mb-2">{addSuccess}</div>}
            <form onSubmit={handleSearchFood} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="border rounded px-3 py-2">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
              <input
                type="text"
                placeholder="Food (e.g., chicken breast)"
                className="border rounded px-3 py-2 md:col-span-2"
                value={foodQuery}
                onChange={(e) => setFoodQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={searching}
                className={`px-4 py-2 rounded text-white ${searching ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {searching ? 'Searching…' : 'Search Food'}
              </button>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((food) => (
                  <div key={food.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{food.name}</h4>
                      <span className="text-sm text-gray-500">per 100g</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{Math.round(food.calories || 0)}</div>
                        <div className="text-xs text-gray-600">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{Math.round(food.protein || 0)}g</div>
                        <div className="text-xs text-gray-600">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{Math.round(food.carbs || 0)}g</div>
                        <div className="text-xs text-gray-600">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{Math.round(food.fats || 0)}g</div>
                        <div className="text-xs text-gray-600">Fats</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Grams"
                        className="border rounded px-3 py-2 flex-1"
                        value={grams}
                        onChange={(e) => setGrams(e.target.value)}
                        min="1"
                      />
                      <button
                        onClick={() => handleAddFoodToMeal(food)}
                        disabled={adding}
                        className={`px-6 py-2 rounded text-white ${adding ? 'bg-gray-400' : 'bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105'}`}
                      >
                        {adding ? 'Adding…' : 'Add Food Item'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard


