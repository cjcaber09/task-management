<script lang="ts" setup>
import { List, Columns3 } from '@lucide/vue'
import { useProgressTypeStore } from '../stores/statusType.ts'
defineOptions({
  name: 'ProgressStatus',
})

const statusStore = useProgressTypeStore()
</script>
<template>
  <div class="flex flex-row gap-1 items-center justify-between">
    <div class="badge-container">
      <div class="flex flex-row gap-1">
        <div
          class="prog-type"
          :class="{ selected: statusStore.selectedStatus === 'All' }"
          @click="statusStore.selectStatus('All')"
        >
          All
        </div>
        <div
          class="prog-type"
          :class="{ selected: statusStore.selectedStatus === 'Todo' }"
          @click="statusStore.selectStatus('Todo')"
        >
          Todo
        </div>
        <div
          class="prog-type"
          :class="{ selected: statusStore.selectedStatus === 'In Progress' }"
          @click="statusStore.selectStatus('In Progress')"
        >
          In Progress
        </div>
        <div
          class="prog-type"
          :class="{ selected: statusStore.selectedStatus === 'Done' }"
          @click="statusStore.selectStatus('Done')"
        >
          Done
        </div>
      </div>
    </div>
    <div class="badge-container">
      <div class="flex flex-row gap-1">
        <div class="badge-type selected"><List class="w-4 h-4" /></div>
        <div class="badge-type"><Columns3 class="w-4 h-4" /></div>
      </div>
    </div>
  </div>
</template>
