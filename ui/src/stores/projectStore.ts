import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { ProjectType } from '../../../shared/types/project'
import { useAuthStore } from './authStore'
import router from '@/router'
import type { AddProjectType } from '@/types/projects'
import { useTaskStore } from './taskStore'
import type { UserType } from '@shared/types/user'
export const useProjectStore = defineStore('project', () => {
  const projects = ref<ProjectType[]>([])
  const activeProject = ref<ProjectType | null>(null)

  async function fetchProjects() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI_DEV}/projects`, {
        headers: {
          Authorization: `Bearer ${useAuthStore().getToken()}`,
        },
      })
      if (!response.ok && response.status !== 403) {
        console.error('Failed to fetch projects')
        return
      }
      if (response.ok) {
        const data = await response.json()
        projects.value = data.projects
      }
      if (response.status === 403) {
        console.error('Unauthorized: Please log in to view projects')
        const authStore = useAuthStore()
        authStore.clearUser()
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  async function addProject(project: AddProjectType) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI_DEV}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useAuthStore().getToken()}`,
        },
        body: JSON.stringify(project),
      })
      if (!response.ok) {
        console.error('Failed to create project')
        return
      }
      const newProject = await response.json()
      projects.value.push(newProject)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const getProject = computed(() => {
    return projects.value
  })
  const getActiveProjectGuid = computed(() => {
    if (!activeProject.value) {
      console.error('No active project selected')
      return null
    }
    return activeProject.value?.guid
  })
  const setActiveProject = (guid: string | null) => {
    if (guid === null) activeProject.value = null
    const project = projects.value.find((p) => p.guid === guid) || null
    activeProject.value = project
  }

  const searchUsersByEmail = async (email: UserType['email']) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI_DEV}/users/search?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore().getToken()}`,
          },
        },
      )
      if (!response.ok) {
        console.error('Failed to search users by email')
        return []
      }
      const data = await response.json()
      return data.users
    } catch (error) {
      console.error('Error searching users by email:', error)
      return []
    }
  }

  const archiveProject = async (guid: ProjectType['guid']) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI_DEV}/projects/${guid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${useAuthStore().getToken()}`,
        },
      })
      if (!response.ok) {
        console.error('Failed to archive project')
        return
      }
      // Remove the archived project from the projects list
      projects.value = projects.value.filter((project) => project.guid !== guid)
      // If the archived project is the active project, reset activeProject to null
      if (activeProject.value?.guid === guid) {
        activeProject.value = null
      }
    } catch (error) {
      console.error('Error archiving project:', error)
    }
  }
  // watch projects if null set tasks to fetch all tasks, otherwise fetch tasks for the active project
  watch(activeProject, () => {
    if (!activeProject.value) {
      // fetch all tasks logic here
      const taskStore = useTaskStore()
      taskStore.fetchAllTasks()
    } else {
      // fetch tasks for the active project logic here
      const taskStore = useTaskStore()
      taskStore.fetchTasksByProject(activeProject.value.guid)
    }
  })

  return {
    projects,
    activeProject,
    getProject,
    fetchProjects,
    addProject,
    getActiveProjectGuid,
    setActiveProject,
    searchUsersByEmail,
    archiveProject,
  }
})
