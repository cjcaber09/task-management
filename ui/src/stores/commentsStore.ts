import type { CreateTaskCommentType, TaskCommentType } from '@/types/task_comments'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
const useCommentsStore = defineStore('comments', () => {
  const comments = ref<TaskCommentType[]>([])
  const latestTaskGuid = ref<Pick<CreateTaskCommentType, 'task_guid'> | null>(null)
  const createComment = async ({
    task_guid,
    comment,
  }: Omit<CreateTaskCommentType, 'user_guid'>): Promise<void> => {
    // logic to add comment to the store
    const newComment = await fetch(
      `${import.meta.env.VITE_API_URI_DEV}/comments/task/${task_guid}`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      },
    )
    const data = await newComment.json()
    // add it on the first place of the comments array
    comments.value.unshift(data)
  }
  const fetchCommentsByTask = async ({ task_guid }: Pick<CreateTaskCommentType, 'task_guid'>) => {
    latestTaskGuid.value = { task_guid }
    const response = await fetch(`${import.meta.env.VITE_API_URI_DEV}/comments/task/${task_guid}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
    const data = await response.json()
    if (latestTaskGuid.value && latestTaskGuid.value.task_guid !== task_guid) {
      return
    }
    setComments(data)
  }
  const setComments = (newComments: typeof comments.value) => {
    comments.value = newComments
  }

  const getComments = computed((): TaskCommentType[] => comments.value)
  return {
    comments,
    getComments,
    createComment,
    fetchCommentsByTask,
    setComments,
  }
})

export default useCommentsStore
