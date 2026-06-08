import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Comment {
  [key: string]: string | number | boolean | Record<string, unknown>
}

const useCommentsStore = defineStore('comments', () => {
  const comments = ref<Comment[]>([])
  const latestTaskGuid = ref<string | null>(null)
  const createComment = async (task_guid: string, comment: string) => {
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
    comments.value.push(data)
  }
  const fetchCommentsByTask = async (task_guid: string) => {
    latestTaskGuid.value = task_guid
    const response = await fetch(`${import.meta.env.VITE_API_URI_DEV}/comments/task/${task_guid}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
    const data = await response.json()
    if (latestTaskGuid.value !== task_guid) {
      return
    }
    setComments(data)
  }
  const setComments = (newComments: typeof comments.value) => {
    comments.value = newComments
  }

  const getComments = computed(() => comments.value)
  return {
    comments,
    getComments,
    createComment,
    fetchCommentsByTask,
    setComments,
  }
})

export default useCommentsStore
