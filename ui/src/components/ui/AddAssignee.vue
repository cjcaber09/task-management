<script lang="ts" setup>
import Input from './Input.vue'
defineOptions({
  name: 'AddAssignee',
})
defineProps<{
  modelValue: string
  assignees: {
    email: string
  }[]
  error: string
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input-change': [value: string]
  add: []
  remove: [index: number]
}>()
</script>
<template>
  <div class="flex flex-col gap-2">
    <span class="text-xs text-gray-500">Assignees</span>
    <Input
      type="text"
      placeholder="Enter email and press Enter"
      :modelValue="modelValue"
      @update:modelValue="(emit('update:modelValue', $event), emit('input-change', $event))"
      @input-enter="emit('add')"
    />
    <!-- add menu for suggested users will go here
    <div class="flex flex-col gap-1">
      <span class="text-xs text-gray-500">Suggested Users</span>
      <div
        v-for="(user, index) in assignees"
        :key="index"
        class="p-2 border rounded cursor-pointer hover:bg-gray-100"
        @click="emit('add')"
      >
        {{ user.email }}
      </div>
    </div> -->
    <div class="flex flex-row flex-wrap gap-2">
      <div
        v-for="(assignee, index) in assignees"
        :key="index"
        class="badge badge-primary flex items-center gap-1 cursor-pointer"
      >
        {{ assignee.email }}
        <span @click.prevent="emit('remove', index)" class="ml-1 text-xs">X</span>
      </div>
    </div>
    <span class="text-red-500 text-sm mt-1" v-if="error">{{ error }}</span>
  </div>
</template>
