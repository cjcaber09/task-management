import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TaskType, CreateTaskPayload } from '../types/index'
import { useAuthStore } from './authStore'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<TaskType[]>([])
  const activeTask = ref<TaskType>()

  function setActiveTask(task: TaskType) {
    console.log('Setting active task in task store: ', task)
    activeTask.value = task
  }
  const getTasks = computed(() => tasks.value)
  const getActiveTask = computed(() => activeTask.value)

  async function addTask(task: CreateTaskPayload) {
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

  async function updateTask(
    taskGuid: string,
    updates: Partial<CreateTaskPayload>,
    isActiveTask = false,
  ) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI_DEV}/tasks/${taskGuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useAuthStore().getToken()}`,
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        console.error('Failed to update task')
        return { success: false, error: 'Failed to update task' }
      }
      const updatedTask = await response.json()
      // Update the task in the local store
      const index = tasks.value.findIndex((task) => task.guid === taskGuid)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      // if the task is active task, we need to change the value of the active task in the task details component, so we return the updated task to the component to update the active task value
      if (isActiveTask) {
        setActiveTask(updatedTask)
        console.log('Updated active task in task store: ', updatedTask)
      }

      return { success: true, task: updatedTask }
    } catch (error) {
      console.error('Error updating task:', error)
      return { success: false, error }
    }
  }

  return {
    tasks,
    addTask,
    removeTask,
    filterTasksByStatus,
    fetchTasksByProject,
    fetchAllTasks,
    getTasks,
    updateTask,
    setActiveTask,
    getActiveTask,
  }
})
