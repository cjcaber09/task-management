export type CompanyType = {
  guid: string
  name: string
  description: string
  status: 'active' | 'archived'
  company_guid: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}
