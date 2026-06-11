export interface TaskType {
  guid: string
  name: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  project_guid: string
}

export interface UserType {
  guid: string
  email: string
  name: string
  profileImage?: string
  password: string
  company_guid: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
