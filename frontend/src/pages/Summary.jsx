import React, { useState, useEffect } from 'react'
import apiClient from '../api/client'

const Summary = () => {
  const [dailyData, setDailyData] = useState(null)
  const [workoutSummary, setWorkoutSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchSummaryData()
  }, [selectedDate])

  const fetchSummaryData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dailyRes, workoutRes] = await Promise.all([
        apiClient.get(`/daily-calories/?date=${selectedDate}`),
        apiClient.get(`/summary/?date=${selectedDate}`),
      ])
      setDailyData(dailyRes.data)
      setWorkoutSummary(workoutRes.data)
    } catch (e) {
      setError(e?.response?.data || 'Failed to load summary data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading summary...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Daily Summary</h2>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {error && <div className="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded p-2">{JSON.stringify(error)}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Nutrition Summary */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Nutrition Summary</h3>
          {dailyData ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Goal:</span>
                <span className="font-medium">{Math.round(dailyData.daily_goal || 0)} calories</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calories Eaten:</span>
                <span className="font-medium">{Math.round(dailyData.total_calories || 0)} calories</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining:</span>
                <span className={`font-medium ${dailyData.remaining_calories >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.round(dailyData.remaining_calories || 0)} calories
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Protein:</span>
                <span className="font-medium">{Math.round(dailyData.total_protein || 0)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carbs:</span>
                <span className="font-medium">{Math.round(dailyData.total_carbs || 0)}g</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">{dailyData.status_message}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No nutrition data available</p>
          )}
        </div>

        {/* Workout Summary */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Workout Summary</h3>
          {workoutSummary ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{workoutSummary.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calories Burned:</span>
                <span className="font-medium text-orange-600">
                  {Math.round(workoutSummary.total_calories_burned || 0)} calories
                </span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">
                  {workoutSummary.total_calories_burned > 0 
                    ? 'Great job staying active today!' 
                    : 'No workouts logged for this date'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No workout data available</p>
          )}
        </div>
      </div>

      {/* Progress Visualization */}
      {dailyData && (
        <div className="mt-6 bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Progress Visualization</h3>
          <div className="space-y-4">
            {/* Calorie Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Calorie Progress</span>
                <span className="text-gray-600">
                  {Math.round(dailyData.total_calories || 0)} / {Math.round(dailyData.daily_goal || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((dailyData.total_calories || 0) / Math.max(1, dailyData.daily_goal || 1)) * 100))}%`
                  }}
                />
              </div>
            </div>

            {/* Macro Distribution */}
            <div>
              <h4 className="text-sm font-medium mb-2">Macro Distribution</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded p-3">
                  <div className="text-blue-600 font-semibold">{Math.round(dailyData.total_protein || 0)}g</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div className="bg-green-50 rounded p-3">
                  <div className="text-green-600 font-semibold">{Math.round(dailyData.total_carbs || 0)}g</div>
                  <div className="text-xs text-gray-600">Carbs</div>
                </div>
                <div className="bg-orange-50 rounded p-3">
                  <div className="text-orange-600 font-semibold">{Math.round(dailyData.total_fats || 0)}g</div>
                  <div className="text-xs text-gray-600">Fats</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Summary




