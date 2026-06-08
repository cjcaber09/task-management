import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserType } from '../../../shared/types/user'
import { useAuthStore } from './authStore'
export const useCompanyStore = defineStore('company', () => {
  const company = ref({
    guid: '',
    name: '',
    description: '',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  })

  function setCompany(newCompany: typeof company.value) {
    company.value = newCompany
  }

  function getCompany() {
    return company.value
  }
  function fetchCompanyByUser(user_guid: UserType['guid']) {
    if (!user_guid) {
      // useAuthStore().fetchUser()
      user_guid = useAuthStore().getUser?.guid || ''
    }
    fetch(`${import.meta.env.VITE_API_URI_DEV}/users/me/company`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useAuthStore().getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        company.value = data.company
      })
      .catch((error) => {
        console.error('Error fetching company:', error)
      })
  }
  function clearCompany() {
    company.value = {
      guid: '',
      name: '',
      description: '',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }
  }

  return { company, setCompany, getCompany, fetchCompanyByUser, clearCompany }
})
