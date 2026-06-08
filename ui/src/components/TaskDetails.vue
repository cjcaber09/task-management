<script lang="ts" setup>
import type { TaskType } from '../types/index'
import Textarea from './ui/Textarea.vue'
import Button from './ui/Button.vue'
import zod from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { storeToRefs } from 'pinia'
import useCommentsStore from '../stores/commentsStore.ts'
import { watch } from 'vue'
const commentSchema = zod.object({
  comment: zod.string().min(1, 'Comment cannot be empty'),
})

const { defineField, errors, handleSubmit, resetField } = useForm({
  validationSchema: toTypedSchema(commentSchema),
  initialValues: {
    comment: '',
  },
})

defineOptions({
  name: 'TaskDetails',
})
const props = defineProps<{ task: TaskType }>()
const [comment] = defineField('comment')
const commentsStore = useCommentsStore()

const { getComments: comments } = storeToRefs(commentsStore)
const addComment = handleSubmit(async (values) => {
  await commentsStore.createComment(props.task.guid, values.comment)
  // Clear the field and reset validation state after successful submit.
  resetField('comment', { value: '' })
})
watch(
  () => props.task.guid,
  async (taskGuid) => {
    commentsStore.setComments([])
    await commentsStore.fetchCommentsByTask(taskGuid)
  },
  { immediate: true },
)
</script>

<template>
  <div class="task-details flex flex-row gap-4">
    <div class="task-info mb-4 flex-1">
      <div>
        <span class="text-xs text-gray-500">Title</span>
        <h1 class="text-md font-regular">{{ props.task.name }}</h1>
      </div>
      <span class="text-xs text-gray-500">Description</span>
      <div class="task-content">{{ props.task.description }}</div>
      <div class="task-comments">
        <span class="text-xs text-gray-500">Comments</span>
        <div class="comment-block">
          <div
            v-for="(comment, index) in comments"
            :key="`${comment.guid ?? comment.id ?? index}`"
            class="comment-item"
          >
            <p class="text-sm">{{ comment.comment }}</p>
          </div>
        </div>
        <div class="comment-section mt-2">
          <small class="text-xs" :class="`${errors.comment ? 'text-red-500' : 'text-gray-500'}`">{{
            errors.comment
          }}</small>
          <Textarea
            placeholder="Add a comment..."
            v-model="comment"
            :cols="3"
            :rows="2"
            :showLabel="false"
          />
          <Button class="mt-2" @click="addComment" label="Add Comment">Add Comment</Button>
        </div>
        <!-- Display comments here -->
      </div>
    </div>
    <div class="task-activity mb-4 w-1/3">
      <div class="task-info flex flex-row gap-2 mb-4 flex-wrap">
        <div class="flex flex-1 flex-col min-w-[100px] max-w-[150px]">
          <span class="text-xs text-gray-500">Priority</span>
          <h1 class="text-md font-regular">{{ props.task.priority }}</h1>
        </div>
        <div class="flex flex-1 flex-col min-w-[100px] max-w-[150px]">
          <span class="text-xs text-gray-500">Status</span>
          <h1 class="text-md font-regular">{{ props.task.status }}</h1>
        </div>
        <div class="flex flex-1 flex-col min-w-[100px] max-w-[150px]">
          <span class="text-xs text-gray-500">Project</span>
          <h1 class="text-md font-regular">{{ props.task.project_guid ?? 'Project 1' }}</h1>
        </div>
        <div class="flex flex-1 flex-col min-w-[100px] max-w-[150px]">
          <span class="text-xs text-gray-500">Created By</span>
          <!-- <h1 class="text-md font-regular">{{ props.task?.created_by ?? 'John Doe' }}</h1> -->
        </div>
      </div>
      <span class="text-xs text-gray-500">Activity</span>
      <div class="activity-block"></div>

      <!-- Display activity here -->
    </div>

    <!-- Display task details here -->
  </div>
</template>

<style scoped>
/* @reference '../assets/index.css'; */
@import 'tailwindcss';
.task-content {
  max-height: 400px;
  overflow-y: auto;
  text-align: left;
  word-wrap: break-word;
  /* border: 1px solid #585858; */
  @apply px-4 py-1 mb-4 mt-1 min-h-[200px] text-sm rounded rounded-lg;
}
</style>
