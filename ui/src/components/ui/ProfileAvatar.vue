<script lang="ts" setup>
import type { UserType } from '@/types/index'
import { computed } from 'vue'
defineOptions({
  name: 'ProfileAvatar',
})

const { user } = defineProps<{
  user: Pick<UserType, 'guid' | 'email' | 'name' | 'profileImage'> | null
}>()

const hasProfile = computed(() => !!user?.profileImage)
</script>

<template>
  <div v-if="hasProfile && user" class="flex">
    <img
      :src="user.profileImage || ''"
      alt="Profile"
      class="w-6 h-6 rounded-full border-2 border-gray-300"
    />
  </div>
  <div v-else class="flex">
    <div class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
      <span class="text-gray-600 text-xs">{{ user?.name?.charAt(0) || 'U' }}</span>
    </div>
  </div>
</template>
<style scoped></style>
