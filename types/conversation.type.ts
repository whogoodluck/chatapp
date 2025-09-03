import { Message } from './message.type'

export type Participant = {
  conversationId: string
  id: string
  joinedAt: Date
  lastReadAt: Date
  user: any
  userId: string
}

// export type Conversation = {
//   id: string
//   isGroup: boolean
//   name: any
//   messages: Message[]
//   participants: Participant[]
//   createdAt: Date
//   updatedAt: Date
// }

export type Conversation = {
  id: string
  isGroup: boolean
  name: string | null
  messages: Message[]
  participants: Participant[]
  createdAt: Date
  updatedAt: Date
}
