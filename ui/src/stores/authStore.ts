import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserType } from '@/types/index'
export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserType | null>(null)
  const token = ref<string | null>(localStorage.getItem('authToken'))

  const isAuthenticated = computed(() => !!token.value)

  const getUser = computed(() => {
    return user.value
  })

  function setUser(userData: UserType) {
    user.value = userData
  }

  function storeToken(tokenValue: string) {
    token.value = tokenValue
    localStorage.setItem('authToken', tokenValue)
  }

  function clearUser() {
    user.value = null
    token.value = null
    localStorage.removeItem('authToken')
  }

  function getToken(): string | null {
    return token.value
  }

  async function validateUser(): Promise<UserType | null> {
    if (!token.value) return null
    try {
      const response = await fetch(import.meta.env.VITE_API_URI_DEV + '/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        clearUser()
        return null
      }
      const data = await response.json()
      setUser(data.user)
      return data.user
    } catch (error) {
      console.error('Error validating user:', error)
      clearUser()
      return null
    }
  }

  return { user, setUser, clearUser, storeToken, getToken, validateUser, isAuthenticated, getUser }
})
