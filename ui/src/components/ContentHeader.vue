<script lang="ts" setup>
import { Bell } from '@lucide/vue'

defineOptions({
  name: 'ContentHeader',
})
</script>
<template>
  <div class="content-header flex items-center justify-between">
    <input type="text" placeholder="Search tasks..." class="input w-full max-w-sm ml-4" />
    <div class="notifications relative flex items-center">
      <Bell class="w-4 h-4 text-gray-600" />
      <span
        class="notification-badge absolute top-0 right-10 w-2 h-2 bg-red-500 rounded-full"
      ></span>
      <!-- add profile -->
      <div class="profile ml-4">
        <img alt="Profile" class="w-6 h-6 rounded-full border-2 border-gray-300" />
      </div>
    </div>
  </div>
</template>
