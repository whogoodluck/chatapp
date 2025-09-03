// export type Participant = {
//   conversationId: string
//   id: string
//   joinedAt: Date
//   lastReadAt: Date
//   user: User
//   userId: string
// }

// export type Conversation = {
//   id: string
//   isGroup: boolean
//   name: string | null
//   messages: Message[]
//   participants: Participant[]
//   createdAt: Date
//   updatedAt: Date
// }

// __define-ocg__
import { MessageType } from '@prisma/client'

export type Conversation = {
  id: string
  name: string | null
  isGroup: boolean
  createdAt: Date
  updatedAt: Date
  participants: {
    user: {
      id: string
      username: string
      fullName: string
      avatar: string | null
      isOnline: boolean
      lastSeen: Date
    }
  }[]
  messages: {
    id: string
    content: string
    messageType: MessageType
    senderId: string
    conversationId: string
    createdAt: Date
    updatedAt: Date
    sender: {
      id: string
      username: string
      fullName: string
      avatar: string | null
      isOnline: boolean
      lastSeen: Date
      email: string
      createdAt: Date
      updatedAt: Date
    }
  }[]
}
