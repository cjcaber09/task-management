import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProgressTypeStore = defineStore('progressType', () => {
  const progressTypes = ref<string[]>(['All', 'To Do', 'In Progress', 'Done'])
  const selectedStatus = ref('All')

  function selectStatus(status: string) {
    selectedStatus.value = status
  }

  return { progressTypes, selectedStatus, selectStatus }
})
