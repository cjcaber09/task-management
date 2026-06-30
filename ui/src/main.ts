import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

import App from './App.vue'
import router from './router'
import './assets/index.css'
import './assets/theme.css'
import './assets/font.css'

const bootstrap = async () => {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  // Rehydrate authenticated user after page refresh when a token exists.
  const authStore = useAuthStore(pinia)
  await authStore.validateUser()

  app.use(router)
  app.mount('#app')
}

bootstrap()
