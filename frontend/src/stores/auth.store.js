import { defineStore } from "pinia";
import api from "@/services/api";
import router from "@/router";

const STORAGE_KEY = 'auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,

    loading: false,
    fieldErrors: {},
  }),

  actions: {
    // Register
    async register(email, password) {
      this.loading = true
      this.fieldErrors = {}

      try {
        await api.post('/auth/register', {
          email,
          password,
        })

        // after successful register -> go to login
        router.replace('/login')
      } catch (err) {
        const messages = err.response?.data?.message

        if (Array.isArray(messages)) {
          messages.forEach((msg) => {
            const lower = msg.toLowerCase()
            if (lower.includes('email')) this.fieldErrors.email = msg
            if (lower.includes('password')) this.fieldErrors.password = msg
          })
        } else {
          this.fieldErrors.email = 'Registration failed'
        }
      } finally {
        this.loading = false
      }
    },

    // Login
    async login(payload) {
      this.loading = true
      this.fieldErrors = {}

      try {
        const res = await api.post('/auth/login', payload)

        this.setTokens(res.data.access_token, res.data.refresh_token)

        await this.fetchMe()
        this.redirectByRole()
      } catch (err) {
        const message = err.response?.data?.message

        // Backend validation array -> map cleanly
        if (Array.isArray(message)) {
          message.forEach((msg) => {
            if (msg.toLowerCase().includes('email')) {
              this.fieldErrors.email = msg
            }
            if (msg.toLowerCase().includes('password')) {
              this.fieldErrors.password = msg
            }
          })
        } else {
          // fallback (wrong credentials, etc.)
          this.fieldErrors.email = 'Invalid email or password'
        }
      } finally {
        this.loading = false
      }
    },

    // Fetch me
    async fetchMe() {
      const res = await api.get('/users/me')
      this.user = res.data
      this.persist()
    },

    // Token setting
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.persist()
    },

    // Persist
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
          user: this.user,
        })
      )
    },

    // Restore
    restore() {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return false

      const parsed = JSON.parse(data)

      this.accessToken = parsed.accessToken
      this.refreshToken = parsed.refreshToken
      this.user = parsed.user

      return true
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.error = null
      this.loading = false

      localStorage.removeItem(STORAGE_KEY)
      router.replace('/login')
    },

    // Redirect
    redirectByRole() {
      if (!this.user) return

      const role = this.user.role

      if (role === 'ADMIN') router.replace('/admin/dashboard')
      else if (role === 'TEACHER') router.replace('/teacher/dashboard')
      else router.replace('/student/dashboard')
    },
  },
})
