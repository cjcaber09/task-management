import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserType } from '@/types/index'
import type { ChangePasswordPayload } from '@/types/user'
import { useAuthStore } from './authStore'
import useNotificationStore from './notificationStore'

const authStore = useAuthStore()
const toastStore = useNotificationStore()
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
  type errorResponse = {
    error: string
  }
  const updatePassword = async (
    values: ChangePasswordPayload,
  ): Promise<{ user?: UserType; success?: string; error?: string }> => {
    try {
      // fetch the current user's email from localStorage
      const user = authStore.getUser
      if (!user) {
        console.error('No authenticated user found')
        return { error: 'No authenticated user found' }
      }
      const guid = user.guid
      const response = await fetch(
        `${import.meta.env.VITE_API_URI_DEV}/users/${guid}/update-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify(values),
        },
      )
      if (!response.ok) {
        console.error('Failed to update password')
        const data = await response.json()
        return { error: data.error || 'Failed to update password' }
      }
      const data = await response.json()
      return { user: data.user, success: data.message }
    } catch (error: unknown) {
      return { error: (error as errorResponse).error || 'Error updating password' }
    }
  }

  const updateUserData = async (
    guid: string,
    file: File | null,
    userDetails: Partial<UserType>,
  ) => {
    const formData = new FormData()
    if (file) formData.append('profilePicture', file)
    Object.entries(userDetails).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, JSON.stringify(value))
      }
    })
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI_DEV}/users/${guid}/update-user-data`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: formData,
        },
      )
      if (!response.ok) {
        console.error('Failed to upload profile image')
        return
      }
      const data = await response.json()
      // update the user in the authStore with the new data
      authStore.setUser(data.user)
      // success notification
      toastStore.notify('success', 'Profile updated successfully')
    } catch (error) {
      console.error('Error uploading profile image:', error)
    }
  }
  return {
    fetchUserByEmail,
    updatePassword,
    users,
    updateUserData,
  }
})
