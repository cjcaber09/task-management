export type MemberType = {
  guid: string
  name: string
  email: string
  role: 'owner' | 'member'
  joined_at: Date
}
