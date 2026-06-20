<script lang="ts" setup>
import type { TaskType } from '../types/index'
import Textarea from './ui/Textarea.vue'
import Button from './ui/Button.vue'
import zod from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { storeToRefs } from 'pinia'
import useCommentsStore from '../stores/commentsStore.ts'
import { watch, ref } from 'vue'
import CommentBox from './ui/CommentBox.vue'
import AddAssignee from './ui/AddAssignee.vue'
import Select from './ui/Select.vue'
import { useTaskStore } from '../stores/taskStore'
import useNotificationStore from '../stores/notificationStore'
import Input from './ui/Input.vue'
import { Check } from '@lucide/vue'
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
const [comment] = defineField('comment')
const commentsStore = useCommentsStore()
const taskStore = useTaskStore()
const { getActiveTask: task } = storeToRefs(taskStore)
const { getComments: comments } = storeToRefs(commentsStore)
const addComment = handleSubmit(async (values) => {
  if (!task.value?.guid) {
    return
  }
  await commentsStore.createComment({ task_guid: task.value.guid, comment: values.comment })
  // Clear the field and reset validation state after successful submit.
  resetField('comment', { value: '' })
})
watch(
  () => task.value?.guid,
  async (taskGuid) => {
    if (!taskGuid) {
      return
    }
    commentsStore.setComments([])
    await commentsStore.fetchCommentsByTask({ task_guid: taskGuid })
  },
  { immediate: true },
)

const assigned = ref('')

const isValidPriority = (value: string): value is TaskType['priority'] => {
  return value === 'low' || value === 'medium' || value === 'high'
}
const isValidTaskStatus = (value: string): value is TaskType['status'] => {
  return value === 'todo' || value === 'in_progress' || value === 'done'
}

const changePriority = async (value: string) => {
  if (!task.value?.guid) {
    return
  }
  if (!isValidPriority(value)) {
    console.error('Invalid priority value received:', value)
    return
  }
  if (value === task.value.priority) {
    return
  }

  // calls API to update task priority, then fetch updated task details to reflect the change in the UI
  const res = await taskStore.updateTask(task.value.guid, { priority: value }, true)
  if (res.success) {
    notificationStore.notify('success', `Priority changed to ${value}`)
  } else {
    notificationStore.notify('error', 'Failed to update priority')
  }
}
const changeStatus = async (value: string) => {
  if (!task.value?.guid) {
    return
  }
  if (!isValidTaskStatus(value)) {
    console.error('Invalid status value received:', value)
    return
  }
  if (value === task.value.status) {
    return
  }

  // calls API to update task status, then fetch updated task details to reflect the change in the UI
  const res = await taskStore.updateTask(task.value.guid, { status: value }, true)
  if (res.success) {
    notificationStore.notify('success', `Status changed to ${value.replace('_', ' ')}`)
  } else {
    notificationStore.notify('error', 'Failed to update status')
  }
}

const descModel = ref('')
const titleModel = ref('')
const editDesc = ref(false)
const editTitle = ref(false)
watch(
  task,
  (currentTask) => {
    console.log('Active task changed in TaskDetails component: ', currentTask)
    titleModel.value = currentTask?.name || ''
    descModel.value = currentTask?.description || ''
    assigned.value = currentTask?.assigned_to || ''
  },
  { immediate: true },
)

const changeState = (field: 'title' | 'description') => {
  if (field === 'title') {
    editTitle.value = !editTitle.value
  } else {
    editDesc.value = !editDesc.value
  }
}
const notificationStore = useNotificationStore()
const editDetails = (field: 'title' | 'description') => {
  if (!task.value?.guid) {
    return
  }
  taskStore
    .updateTask(task.value.guid, { description: descModel.value, name: titleModel.value }, true)
    .then((response) => {
      if (response.success) {
        notificationStore.notify('success', 'Task updated successfully')
        changeState(field)
      } else {
        notificationStore.notify('error', 'Failed to update task')
      }
    })
}
</script>

<template>
  <div class="task-details flex h-full min-h-0 flex-row gap-4">
    <div class="task-block flex min-h-0 flex-1 flex-col">
      <div @dblclick="changeState('title')">
        <span class="text-xs text-gray-500">Title</span>
        <div v-if="editTitle">
          <Input v-model="titleModel" :placeholder="'Enter task title...'" />
          <Button :label="'Save'" :iconComponent="Check" @click="editDetails('title')"> </Button>
        </div>
        <div v-else class="task-title flex items-center gap-2">
          <h2 class="text-lg font-semibold">{{ task?.name || '' }}</h2>
        </div>
      </div>
      <span class="text-xs text-gray-500">Description</span>
      <div class="task-content" @dblclick="changeState('description')">
        <div v-if="editDesc">
          <Textarea v-model="descModel" :showLabel="false" :cols="50" :rows="10" />
          <Button
            classes="mt-2 font-bold"
            btnUI="btn-primary"
            @click="editDetails('description')"
            label="Save"
          >
          </Button>
        </div>
        <pre v-else class="px-4">{{ task?.description || '' }}</pre>
      </div>
      <div class="task-comments flex min-h-0 flex-1 flex-col">
        <span class="text-xs text-gray-500">Comments</span>
        <div class="comment-section mt-2 shrink-0">
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
        <div class="comment-block scroll-wrapper min-h-0 flex-1 overflow-y-auto pr-1">
          <div
            v-for="(comment, index) in comments"
            :key="`${comment.guid ?? comment.guid ?? index}`"
            class="comments"
          >
            <CommentBox
              :commentItem="{
                ...comment,
                updated_at: comment.updated_at,
                user: comment.user ?? null,
              }"
            />
          </div>
        </div>
        <!-- Display comments here -->
      </div>
    </div>
    <div class="task-activity w-1/3">
      <div class="task-information flex flex-row gap-2 mb-4 flex-wrap">
        <div class="task-info">
          <span class="text-xs text-gray-500">Project</span>
          <span class="text-sm font-regular">{{ task?.project?.name ?? 'Project 1' }}</span>
        </div>
        <div class="task-info">
          <span class="text-xs text-gray-500">Created By</span>
          <span class="text-sm font-regular">{{ task?.deleted_at ?? 'John Doe' }}</span>
        </div>
        <div class="task-info">
          <span class="text-xs text-gray-500">Priority</span>
          <Select
            :options="['low', 'medium', 'high']"
            :selected="task?.priority ?? 'low'"
            @change="changePriority"
          />
        </div>
        <div class="task-info">
          <span class="text-xs text-gray-500">Status</span>
          <Select
            :options="['todo', 'in_progress', 'done']"
            :selected="task?.status ?? 'todo'"
            @change="changeStatus"
          />
        </div>

        <div class="task-info assignee">
          <span class="text-xs text-gray-500">Assigned to</span>
          <AddAssignee :modelValue="assigned" singleAssigned="johndoe@gmail.com" />
        </div>
      </div>
      <span class="text-xs text-gray-500">Activity</span>
      <div class="activity-block"></div>
    </div>

    <!-- Display task details here -->
  </div>
</template>

<style scoped>
/* @reference '../assets/index.css'; */
@import 'tailwindcss';
.task-content {
  max-height: 350px;
  overflow-y: auto;
  text-align: left;
  word-wrap: break-word;
  /* border: 1px solid #585858; */
  @apply py-1 mb-4 mt-1 min-h-[50px] text-sm rounded rounded-lg;
}
.task-info {
  /* flex flex-1 flex-col min-w-[100px] max-w-[150px] */
  display: flex;
  flex-direction: column;
  min-width: 100px;
  max-width: 150px;
  flex: 1;
}
.assignee {
  min-width: 100%;
}
</style>
