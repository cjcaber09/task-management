import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserType } from '@/types/index'
export const useUsersStore = defineStore('user', () => {
  const users = ref<UserType[]>([])

  const fetchUserByEmail = async (email: string): Promise<UserType | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI_DEV}/users/find?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      )
      if (!response.ok) {
        console.error('Failed to fetch users by email')
        return null
      }
      const data = await response.json()
      return data.user ? data.user : null
    } catch (error) {
      console.error('Error fetching users by email:', error)
      return null
    }
  }
  return {
    fetchUserByEmail,
    users,
  }
})
