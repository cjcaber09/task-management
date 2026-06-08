<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Plus } from '@lucide/vue'
import { useProjectStore } from '@/stores/projectStore'
import Modal from './ui/Modal.vue'
import AddTaskForm from './AddTaskForm.vue'
import type { ProjectType } from '@shared/types/project'
defineOptions({
  name: 'ProjectTitle',
})

const addTaskModal = ref<boolean>(false)
const projectStore = useProjectStore()

const activeProject = computed<ProjectType | null>(() => {
  return projectStore.activeProject
})
const titleText = computed(() => {
  return activeProject.value ? activeProject.value.name : 'All Tasks'
})
const subtitleText = computed(() => {
  return activeProject.value ? activeProject.value.description : 'All tasks across all projects'
})

const addTask = () => {
  addTaskModal.value = true
}
</script>

<template>
  <div class="project-title flex items-center justify-between">
    <div class="project-details">
      <h2>{{ titleText }}</h2>
      <small>{{ subtitleText }}</small>
    </div>
    <button class="btn flex items-center" @click="addTask" v-if="activeProject">
      <Plus class="mr-2 w-4 h-4" />Add Task
    </button>
  </div>
  <Modal v-if="addTaskModal" @close="addTaskModal = false">
    <template #header>
      <h3 class="text-lg font-semibold">Add New Task</h3>
    </template>
    <template #content>
      <AddTaskForm />
    </template>
    <template #footer> </template>
  </Modal>
</template>
