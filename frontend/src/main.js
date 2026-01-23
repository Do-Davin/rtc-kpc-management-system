import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Restore auth before mount
const authStore = useAuthStore()
const restored = authStore.restore()

if (restored && authStore.user) {
  authStore.redirectByRole()
}

app.mount('#app')
