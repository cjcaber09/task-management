<script lang="ts" setup>
import { ref } from 'vue'
import type { TaskType } from '../types/index'
import Input from './ui/Input.vue'
import Textarea from './ui/Textarea.vue'
import { useTaskStore } from '../stores/taskStore'
import { useProjectStore } from '../stores/projectStore'
defineOptions({
  name: 'AddTaskForm',
})

const tasks = ref<Omit<TaskType, 'guid'>>({
  name: '',
  description: '',
  status: 'todo',
  priority: 'low',
  project_guid: '',
})
const taskStore = useTaskStore()
const projectStore = useProjectStore()
const addTask = () => {
  // check for active project guid, if not return error
  // run a fetch to get the updated list of tasks after adding a new task
  const activeProjectGuid = projectStore.getActiveProjectGuid
  if (!activeProjectGuid) {
    console.error('No active project selected. Cannot fetch tasks.')
    return
  }

  taskStore
    .addTask({ ...tasks.value, project_guid: activeProjectGuid })
    .then(() => {
      // reset the form after successful task creation
      tasks.value = {
        name: '',
        description: '',
        status: 'todo',
        priority: 'low',
        project_guid: '',
      }
    })
    .catch((error) => {
      console.error('Error adding task: ', error)
    })
    .finally(() => {
      // fetch the updated list of tasks to reflect the new task in the UI
      taskStore.fetchTasksByProject(activeProjectGuid)
      // fetch all tasks to reflect the new task in the UI
      taskStore.fetchTasksByProject(activeProjectGuid)
    })
}
</script>

<template>
  <div class="flex flex-col gap-4 mt-4">
    <Input
      type="text"
      placeholder="Task Title"
      class="input input-bordered w-full"
      v-model="tasks.name"
    />
    <Textarea
      placeholder="Task Description"
      class="textarea textarea-bordered w-full"
      v-model="tasks.description"
    />
    <select class="input input-bordered w-full" v-model="tasks.status">
      <option disabled selected>Status</option>
      <option value="todo">Todo</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
    <select class="input input-bordered w-full" v-model="tasks.priority">
      <option disabled selected>Priority</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    <button class="btn w-full" @click="addTask">Add Task</button>
  </div>
</template>
