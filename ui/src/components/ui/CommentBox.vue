<script lang="ts" setup>
import type { UserType } from '@/types/index'
defineOptions({
  name: 'CommentBox',
})
defineProps<{
  commentItem: {
    user: UserType | null
    comment: string
    updated_at: string
  }
}>()
</script>

<template>
  <!-- view comment -->
  <div class="comment-item">
    <span class="text-xs text-gray-500">{{ commentItem.user?.name ?? 'Unknown User' }}</span>
    <p class="text-sm my-2">{{ commentItem.comment }}</p>
    <span class="text-xs text-gray-500">{{
      new Date(commentItem.updated_at).toLocaleString()
    }}</span>
  </div>
</template>

<style scoped>
.comment-item {
  padding: 0.5rem;
  border-radius: 0.25rem;
}
</style>
