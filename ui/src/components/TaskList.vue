<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import TaskContainer from './TaskContainer.vue'
import Modal from './ui/Modal.vue'
import { useProgressTypeStore } from '../stores/statusType.ts'
import type { TaskType } from '../types/index'
import { useTaskStore } from '../stores/taskStore.ts'
import { useProjectStore } from '../stores/projectStore.ts'
import router from '@/router'
import TaskDetails from './TaskDetails.vue'
// need to filter tasks based on selected status in ProgressStatus component
const statusStore = useProgressTypeStore()
const tasksStore = useTaskStore()
const projectStore = useProjectStore()
defineOptions({
  name: 'TaskList',
})
const showModal = ref(false)

const activeTask = ref<TaskType | null>(null)
const filteredTasks = computed((): TaskType[] => {
  // if no active project, return all tasks, otherwise return tasks for the active project
  if (!projectStore.activeProject) {
    return tasksStore.tasks
  }
  if (statusStore.selectedStatus === 'All') {
    return tasksStore.tasks
  }
  return tasksStore.filterTasksByStatus(statusStore.selectedStatus)
})

const setActiveTask = (task: TaskType) => {
  activeTask.value = task
  showModal.value = true
}
onMounted(() => {
  //get param from url and set active project in project store, then fetch tasks for that project
  const route = router
  console.log('Current route: ', route)
})
</script>
<template>
  <div class="task-list mt-4">
    <h3 class="text-lg font-semibold mb-2">Tasks</h3>
    <ul class="space-y-2">
      <li
        v-for="task in filteredTasks"
        :key="task.guid"
        @click="setActiveTask(task)"
        class="cursor-pointer"
      >
        <TaskContainer
          :title="task.name"
          :description="task.description"
          :status="task.status"
          :priority="task.priority"
          :project="task.project_guid"
        />
      </li>
    </ul>
    <Modal
      v-if="showModal"
      :showModal="showModal"
      @close="showModal = false"
      :width="60"
      :height="50"
    >
      <template #content>
        <div v-if="activeTask">
          <TaskDetails :task="activeTask" />
        </div>
      </template>
      <!-- <template #footer>
        <button class="btn" @click="showModal = false">Close</button>
      </template> -->
    </Modal>
  </div>
</template>

<style scoped></style>
