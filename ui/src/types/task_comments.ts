import type { UserType } from '@/types/index'

export type TaskCommentType = {
  guid: string
  task_guid: string
  user_guid: string
  status: 'active' | 'archived' | 'deleted'
  user?: UserType
  comment: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CreateTaskCommentType = {
  task_guid: string
  user_guid: string
  comment: string
}
