export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

export type Message = {
  content: string
  conversationId: string
  createdAt: Date
  id: string
  messageType: 'TEXT' | 'IMAGE' | 'FILE'
  senderId: string
  sender: any
  updatedAt: Date
}
