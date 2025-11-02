import axios from 'axios';

// 1. Get the "root" URL from the environment, fall back to localhost if not found.
const API_ROOT = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// 2. Build the full base URL (this is the only part that changes)
const API_BASE_URL = `${API_ROOT}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
// This function correctly reads the separate tokens.
const getTokens = () => {
  try {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    return { access, refresh };
  } catch {
    return { access: null, refresh: null };
  }
};

// --- CHANGE: This function now correctly saves the new accessToken ---
const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

// This interceptor correctly attaches the token to every request.
apiClient.interceptors.request.use((config) => {
  const { access } = getTokens();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// This response interceptor handles token refreshing.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refresh } = getTokens();
      if (!refresh) {
        // If there's no refresh token, we can't do anything.
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
        const newAccessToken = res.data.access;
        setAccessToken(newAccessToken);
        apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // If refresh fails, we should log the user out.
        // You can add a call to your logout function here if you pass it in.
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;