<script lang="ts" setup>
import { Edit } from '@lucide/vue'
import Input from './Input.vue'
import { ref } from 'vue'
defineOptions({
  name: 'AddAssignee',
})
defineProps<{
  modelValue: string
  assignees?: {
    email: string
  }[]
  error?: string
  label?: string
  singleAssigned?: string
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input-change': [value: string]
  add: []
  remove: [index: number]
}>()
const editMode = ref(false)
</script>
<template>
  <div class="flex flex-col gap-2">
    <span v-if="label" class="text-xs text-gray-500">{{ label }}</span>
    <Input
      type="text"
      placeholder="Enter email and press Enter"
      :modelValue="modelValue"
      @update:modelValue="(emit('update:modelValue', $event), emit('input-change', $event))"
      @input-enter="emit('add')"
      v-if="!singleAssigned || (singleAssigned && editMode === true)"
    />
    <div class="flex flex-row flex-wrap gap-2" v-if="assignees && assignees.length > 0">
      <div
        v-for="(assignee, index) in assignees"
        :key="index"
        class="badge badge-primary flex items-center gap-1 cursor-pointer"
      >
        {{ assignee.email }}
        <span @click.prevent="emit('remove', index)" class="ml-1 text-xs">X</span>
      </div>
    </div>
    <div
      v-else-if="singleAssigned"
      class="badge badge-primary flex items-center gap-2 w-fit"
      @click="editMode = !editMode"
    >
      {{ singleAssigned }}
      <Edit class="w-3 h-3 ml-1 cursor-pointer" />
    </div>
    <span class="text-red-500 text-sm mt-1" v-if="error">{{ error }}</span>
  </div>
</template>
