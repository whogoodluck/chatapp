export type User = {
  id: string
  email: string
  username: string
  fullName: string
  avatar: string | undefined
  isOnline: boolean
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}
