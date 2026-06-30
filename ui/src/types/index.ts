import type { MemberType } from '@/types/member'
import type { ProjectType } from './projects'
export interface TaskType {
  guid: string
  name: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  project_guid: string
  project?: ProjectType
  company_guid: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  members?: MemberType[]
  assigned_to?: string
}
export type CreateTaskPayload = Pick<
  TaskType,
  'project_guid' | 'name' | 'description' | 'status' | 'priority'
>
export interface UserType {
  guid: string
  email: string
  name: string
  profile_image_url?: string
  attachment_info?: {
    profile_image_name: string
    profile_image_mimetype: string
    profile_image_size: number
    uploaded_at: Date
  } | null
  first_name: string
  last_name: string
  password: string
  company_guid: string
  address?: {
    city: string
    state: string
    zipCode: string
    street: string
  }
  contact_info?: {
    phone: string
    email: string
  }
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
