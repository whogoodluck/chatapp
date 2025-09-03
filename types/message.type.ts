// export enum MessageType {
//   TEXT = 'TEXT',
//   IMAGE = 'IMAGE',
//   FILE = 'FILE',
// }

import { MessageType } from '@prisma/client'

export type Message = {
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
  }
  conversation: {
    name: string | null
    participants: {
      user: {
        id: string
        username: string
        fullName: string
        avatar: string | null
      }
    }[]
  }
}
