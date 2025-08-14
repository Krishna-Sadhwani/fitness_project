import React, { useEffect, useState } from 'react'
import apiClient from '../api/client'

const Profile = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [profile, setProfile] = useState({
    id: null,
    height: '',
    weight: '',
    age: '',
    gender: '',
    activity_level: '',
    weight_goal: '',
    calorie_goal_option: '',
    daily_calorie_intake: '',
  })

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('auth/profile/')
      // Endpoint returns a single profile for current user, but router list may return array
      const data = Array.isArray(res.data) ? res.data[0] : res.data
      setProfile({
        id: data?.id ?? null,
        height: data?.height ?? '',
        weight: data?.weight ?? '',
        age: data?.age ?? '',
        gender: data?.gender ?? '',
        activity_level: data?.activity_level ?? '',
        weight_goal: data?.weight_goal ?? '',
        calorie_goal_option: data?.calorie_goal_option ?? '',
        daily_calorie_intake: data?.daily_calorie_intake ?? '',
      })
      setRecommendations(data?.recommended_calories ?? null)
    } catch (e) {
      setError(e?.response?.data || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      // PATCH the current user's profile by id
      const targetId = profile.id || '1'
      await apiClient.patch(`/auth/profile/${targetId}/`, profile)
      await fetchProfile()
    } catch (e) {
      setError(e?.response?.data || 'Update failed')
    }
  }

  if (loading) return <div className="p-6">Loading profile...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
      {error && <p className="text-red-500 text-sm mb-4">{JSON.stringify(error)}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" step="0.1" name="height" value={profile.height} onChange={handleChange} placeholder="Height (cm)" className="border rounded px-3 py-2" />
        <input type="number" step="0.1" name="weight" value={profile.weight} onChange={handleChange} placeholder="Weight (kg)" className="border rounded px-3 py-2" />
        <input type="number" name="age" value={profile.age} onChange={handleChange} placeholder="Age" className="border rounded px-3 py-2" />
        <select name="gender" value={profile.gender} onChange={handleChange} className="border rounded px-3 py-2">
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select name="activity_level" value={profile.activity_level} onChange={handleChange} className="border rounded px-3 py-2 md:col-span-2">
          <option value="">Activity Level</option>
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="lightly_active">Lightly active (1-3 days/week)</option>
          <option value="moderately_active">Moderately active (3-5 days/week)</option>
          <option value="very_active">Very active (6-7 days/week)</option>
          <option value="extra_active">Extra active (very hard exercise & physical job)</option>
        </select>
        <input type="number" step="0.1" name="weight_goal" value={profile.weight_goal} onChange={handleChange} placeholder="Weight Goal (kg)" className="border rounded px-3 py-2" />
        <select name="calorie_goal_option" value={profile.calorie_goal_option} onChange={handleChange} className="border rounded px-3 py-2">
          <option value="">Calorie Goal Option</option>
          <option value="deficit">Deficit</option>
          <option value="surplus">Surplus</option>
          <option value="maintain">Maintain</option>
        </select>
        <input type="number" name="daily_calorie_intake" value={profile.daily_calorie_intake} onChange={handleChange} placeholder="Daily Calories (override)" className="border rounded px-3 py-2 md:col-span-2" />
        <button type="submit" className="text-white rounded px-4 py-2 md:col-span-2 bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105">Save</button>
      </form>

      {/* Recommendations Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Suggested Daily Calories</h3>
        {!recommendations && (
          <p className="text-gray-600 text-sm">Fill in height, weight, age, gender, and choose a calorie goal to see suggestions.</p>
        )}
        {recommendations && (
          <div className="border rounded-lg p-4 bg-gray-50">
            {recommendations.goal_type === 'maintain' ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">Maintain weight</p>
                  <p className="text-2xl font-bold">{recommendations.options?.maintain}</p>
                </div>
                <button
                  className="text-white rounded px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105"
                  onClick={() => setProfile((p) => ({ ...p, daily_calorie_intake: String(recommendations.options?.maintain ?? '') }))}
                >
                  Use
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(recommendations.options || {}).map(([label, value]) => (
                  <div key={label} className="rounded-lg border bg-white p-3 flex flex-col gap-2">
                    <div className="text-sm text-gray-600">{label}</div>
                    <div className="text-2xl font-bold">{value}</div>
                    <button
                      className="text-white rounded px-3 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105"
                      onClick={() => setProfile((p) => ({ ...p, daily_calorie_intake: String(value) }))}
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile


