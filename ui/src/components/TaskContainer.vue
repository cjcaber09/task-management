<script lang="ts" setup>
import { Flag } from '@lucide/vue';

defineOptions({
  name: 'TaskContainer',
})
const { title,  status, priority  } = defineProps<{
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  project: string
}>()
</script>
<template>
  <div class="task-container p-4 rounded border flex flex-row items-center justify-between gap-4">
    <div class="flex-1 flex flex-row items-center gap-2 justify-between">
      <span class="text-sm font-bold">{{ title }}</span>
      <!-- <h6 class="text-sm text-gray-500">{{ description }}</h6> -->
      <div
        class=" px-2 py-1 rounded text-xs self-start justify-end flex gap-1 items-center"
         :class="{
          'text-gray-400': priority === 'low',
          'text-yellow-400': priority === 'medium',
          'text-red-400': priority === 'high',
        }"
      >
      <Flag class="w-4 h-4" />
        {{ priority }}
      </div>
    </div>
    <div class="flex flex-col items-end gap-2">
      <span
        :class="{
          'bg-gray-300 text-gray-800': status === 'todo',
          'bg-yellow-300 text-yellow-800': status === 'in_progress',
          'bg-green-300 text-green-800': status === 'done',
        }"
        class="px-2 py-1 rounded text-xs font-medium"
      >
        {{ status }}
      </span>
    </div>
  </div>
</template>
