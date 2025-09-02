export type User = {
  id: string
  email: string
  username: string
  fullName: string | null
  avatar: string | null
  isOnline: boolean
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}
