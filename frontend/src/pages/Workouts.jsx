import React, { useState, useEffect } from 'react'
import apiClient from '../api/client'

const Workouts = () => {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [newWorkout, setNewWorkout] = useState({ description: '' })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchWorkouts()
  }, [selectedDate])

  const fetchWorkouts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get(`/workouts/?date=${selectedDate}`)
      setWorkouts(res.data)
    } catch (e) {
      setError(e?.response?.data || 'Failed to load workouts')
    } finally {
      setLoading(false)
    }
  }

  const addWorkout = async (e) => {
    e.preventDefault()
    if (!newWorkout.description.trim()) return
    
    setAdding(true)
    setError(null)
    try {
      await apiClient.post('/workouts/', {
        description: newWorkout.description,
        date: selectedDate
      })
      setNewWorkout({ description: '' })
      await fetchWorkouts()
    } catch (e) {
      setError(e?.response?.data || 'Failed to add workout')
    } finally {
      setAdding(false)
    }
  }

  const deleteWorkout = async (workoutId) => {
    try {
      await apiClient.delete(`/workouts/${workoutId}/`)
      await fetchWorkouts()
    } catch (e) {
      setError('Failed to delete workout')
    }
  }

  if (loading) return <div className="p-6">Loading workouts...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Workout Log</h2>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {error && <div className="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded p-2">{JSON.stringify(error)}</div>}

      {/* Add New Workout */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-3">Add New Workout</h3>
        <form onSubmit={addWorkout} className="flex gap-3">
          <input
            type="text"
            placeholder="e.g., 30 min running, 3 sets bench press"
            className="flex-1 border rounded px-3 py-2"
            value={newWorkout.description}
            onChange={(e) => setNewWorkout({ description: e.target.value })}
          />
          <button
            type="submit"
            disabled={adding}
            className={`px-6 py-2 rounded text-white ${
              adding ? 'bg-gray-400' : 'bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105'
            }`}
          >
            {adding ? 'Adding...' : 'Add Workout'}
          </button>
        </form>
      </div>

      {/* Workouts List */}
      <div className="space-y-4">
        {workouts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No workouts logged for this date</p>
        ) : (
          workouts.map((workout) => (
            <div key={workout.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{workout.description}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Calories Burned:</span>
                  <span className="ml-2 font-medium">{Math.round(workout.calories_burned || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2 font-medium">{workout.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Workouts




