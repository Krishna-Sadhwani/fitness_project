import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Create a single axios instance for the app
const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Helper to get and set tokens in localStorage
const getTokens = () => {
  try {
    const access = localStorage.getItem('accessToken')
    const refresh = localStorage.getItem('refreshToken')
    return { access, refresh }
  } catch {
    return { access: null, refresh: null }
  }
}

const setAccessToken = (token) => {
  if (token) localStorage.setItem('accessToken', token)
}

// Attach Authorization header if we have an access token
apiClient.interceptors.request.use((config) => {
  const { access } = getTokens()
  if (access) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// On 401, try refreshing the token once and retry the original request
let isRefreshing = false
let pendingRequests = []

const processQueue = (error, token = null) => {
  pendingRequests.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  pendingRequests = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error?.response?.status

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true
      const { refresh } = getTokens()
      if (!refresh) {
        isRefreshing = false
        processQueue(new Error('No refresh token'))
        return Promise.reject(error)
      }

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh,
        })
        const newAccess = refreshResponse.data.access
        setAccessToken(newAccess)
        processQueue(null, newAccess)
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return apiClient(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient


