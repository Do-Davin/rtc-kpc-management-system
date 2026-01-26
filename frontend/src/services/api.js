import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

let isRefreshing = false;
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  failedQueue = []
}

// Request
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

// Response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      error.response?.data?.error === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      // Queue requests if refresh is already happening
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        })
      }

      isRefreshing = true

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            refresh_token: authStore.refreshToken,
          }
        )

        const newAccessToken = res.data.access_token
        const newRefreshToken = res.data.refresh_token

        // Important: Update both tokens
        authStore.setTokens(newAccessToken, newRefreshToken)

        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        authStore.logout()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api;
