import type { CompanyType } from '@/types/company'
import type { MemberType } from '@/types/member'

export type ProjectType = {
  guid: string
  owner_guid: string
  name: string
  description: string
  status: 'active' | 'archived'
  task_count: number
  members?: MemberType[]
  company_guid: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export type AddProjectType = Pick<CompanyType, 'name' | 'status'> &
  Partial<Pick<CompanyType, 'description' | 'company_guid'>> & {
    members?: Pick<MemberType, 'email'>[]
  }
