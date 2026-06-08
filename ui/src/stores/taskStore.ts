import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TaskType } from '../types/index'
import { useAuthStore } from './authStore'
export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<TaskType[]>([])

  const getTasks = computed(() => tasks.value)

  async function addTask(task: Omit<TaskType, 'guid'>) {
    fetch(import.meta.env.VITE_API_URI_DEV + '/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore().getToken()}`,
      },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((data) => {
        tasks.value.push(data.task)
      })
      .catch((error) => {
        console.error('Error adding task:', error)
      })
  }

  function removeTask(index: number) {
    tasks.value.splice(index, 1)
  }

  function filterTasksByStatus(status: string) {
    if (status === 'All') {
      return tasks.value
    }
    return tasks.value.filter((task) => task.status === status.toLowerCase().replace(' ', '-'))
  }

  function fetchTasksByProject(projectId: string) {
    // Fetch tasks from API and update the tasks store
    // This is a placeholder and should be replaced with actual API call
    fetch(import.meta.env.VITE_API_URI_DEV + `/tasks/${projectId}/lists`, {
      headers: {
        Authorization: `Bearer ${useAuthStore().getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        tasks.value = data.tasks
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error)
      })
  }
  async function fetchAllTasks() {
    // Fetch all tasks from API and update the tasks store
    // This is a placeholder and should be replaced with actual API call
    fetch(import.meta.env.VITE_API_URI_DEV + `/tasks`, {
      headers: {
        Authorization: `Bearer ${useAuthStore().getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        tasks.value = data.tasks
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error)
      })
  }
  return {
    tasks,
    addTask,
    removeTask,
    filterTasksByStatus,
    fetchTasksByProject,
    fetchAllTasks,
    getTasks,
  }
})
