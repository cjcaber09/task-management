<script lang="ts" setup>
import { Bell } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import ProfileAvatar from './ui/ProfileAvatar.vue'
defineOptions({
  name: 'ContentHeader',
})
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>
<template>
  <div class="content-header flex items-center justify-between">
    <input type="text" placeholder="Search tasks..." class="input w-full max-w-sm ml-4" />
    <div class="notifications relative flex items-center">
      <Bell class="w-4 h-4 text-gray-600" />
      <span
        class="notification-badge absolute top-0 right-10 w-2 h-2 bg-red-500 rounded-full"
      ></span>
      <div class="profile ml-4">
        <ProfileAvatar :user="user" />
      </div>
    </div>
  </div>
</template>
