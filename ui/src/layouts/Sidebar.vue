<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useCompanyStore } from '@/stores/companyStore'
import type { ProjectType } from '@shared/types/project'
import { Plus } from '@lucide/vue'
import AddProjectForm from '@/components/AddProjectForm.vue'
defineOptions({
  name: 'SidebarComponent',
})

const projectStore = useProjectStore()
const companyStore = useCompanyStore()
const showCreateProjectModal = ref(false)

const setActiveProject = async (project: ProjectType) => {
  projectStore.setActiveProject(project.guid)
}
const emptyActiveProject = () => {
  projectStore.setActiveProject(null)
  // taskStore.fetchAllTasks()
}
const projects = computed(() => {
  return projectStore.projects
})

const companyName = computed(() => {
  return companyStore.company ? companyStore.company.name : ''
})
</script>

<template>
  <div class="sidebar pt-6">
    <div class="logo flex gap-2 px-4 pb-6 flex-col">
      <h2 class="sidebar-title">Task Manager</h2>
      <!-- Company Name -->
      <span class="sidebar-company-name text-md text-gray-500">{{ companyName }}</span>
    </div>
    <nav class="sidebar-nav flex flex-col mt-6 px-4">
      <router-link to="/dashboard" class="sidebar-link" @click="emptyActiveProject"
        >All tasks</router-link
      >
      <div class="text-gray-500 my-2 flex items-center gap-2 justify-between">
        <h6 class="text-xs uppercase font-semibold">Projects</h6>
        <plus
          class="w-4 h-4 cursor-pointer"
          @click="showCreateProjectModal = !showCreateProjectModal"
        />
      </div>
      <div class="project-wrapper scroll-wrapper">
        <router-link
          v-for="project in projects"
          :key="project.guid"
          :to="`/dashboard/projects/${project.guid}`"
          class="sidebar-link"
          @click="setActiveProject(project)"
        >
          <div class="flex items-center gap-2 flex-1">
            <div class="project-dot"></div>
            <h5>{{ project.name }}</h5>
          </div>
          <span class="task-count text-xs text-gray-600">{{ project.task_count }}</span>
        </router-link>
      </div>
    </nav>
  </div>
  <AddProjectForm
    :showCreateProjectModal="showCreateProjectModal"
    @close="showCreateProjectModal = false"
  />
</template>
<style scoped></style>
