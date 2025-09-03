'use server'

import prisma from '@/lib/prisma'
import { MessageType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export interface CreateMessageInput {
  content: string
  senderId: string
  conversationId: string
  messageType?: MessageType
}

export interface GetMessagesInput {
  conversationId: string
  page?: number
  limit?: number
}

export async function createMessage(data: CreateMessageInput) {
  try {
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: data.senderId,
          conversationId: data.conversationId,
        },
      },
    })

    if (!participant) {
      throw new Error('User is not a participant in this conversation')
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: data.content,
        messageType: data.messageType || MessageType.TEXT,
        senderId: data.senderId,
        conversationId: data.conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    })

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    })

    revalidatePath('/', 'layout')
    return message
  } catch (error) {
    throw error
  }
}

export async function getMessages({ conversationId, page = 1, limit = 50 }: GetMessagesInput) {
  try {
    const skip = (page - 1) * limit

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
        conversation: {
          select: {
            participants: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true,
                    avatar: true,
                  },
                },
              },
            },
            name: true,
            isGroup: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: skip,
    })

    return messages.reverse() // Return in chronological order
  } catch (error) {
    throw error
  }
}

export async function updateMessage(messageId: string, content: string, userId: string) {
  try {
    // Verify user owns the message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new Error('Message not found')
    }

    if (message.senderId !== userId) {
      throw new Error('You can only edit your own messages')
    }

    return await prisma.message.update({
      where: { id: messageId },
      data: {
        content: content,
        updatedAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    })
  } catch (error) {
    throw error
  }
}

export async function deleteMessage(messageId: string, userId: string) {
  try {
    // Verify user owns the message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new Error('Message not found')
    }

    if (message.senderId !== userId) {
      throw new Error('You can only delete your own messages')
    }

    return await prisma.message.delete({
      where: { id: messageId },
    })
  } catch (error) {
    throw error
  }
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  try {
    return await prisma.conversationParticipant.update({
      where: {
        userId_conversationId: {
          userId: userId,
          conversationId: conversationId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    })
  } catch (error) {
    throw error
  }
}
