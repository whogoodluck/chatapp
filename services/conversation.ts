'use server'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export interface CreateConversationInput {
  name?: string
  isGroup: boolean
  createdBy: string
  participantIds: string[]
}

export interface GetConversationsInput {
  page?: number
  limit?: number
}

export async function createConversation(data: CreateConversationInput) {
  try {
    // For direct messages, check if conversation already exists
    if (!data.isGroup && data.participantIds.length === 2) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          participants: {
            every: {
              userId: {
                in: data.participantIds,
              },
            },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  avatar: true,
                  isOnline: true,
                  lastSeen: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                },
              },
            },
          },
        },
      })

      if (existingConversation && existingConversation.participants.length === 2) {
        return existingConversation
      }
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        name: data.name,
        isGroup: data.isGroup,
        participants: {
          create: data.participantIds.map(userId => ({
            userId: userId,
            joinedAt: new Date(),
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
                isOnline: true,
                lastSeen: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
        },
      },
    })

    return conversation
  } catch (error) {
    throw error
  }
}

export async function getConversations({ page = 1, limit = 20 }: GetConversationsInput) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) throw new Error('Unauthorized')

    const skip = (page - 1) * limit

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
                isOnline: true,
                lastSeen: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
                isOnline: true,
                lastSeen: true,
                email: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
      skip: skip,
    })

    return conversations
  } catch (error) {
    throw error
  }
}

export async function getConversationById(conversationId: string, userId: string) {
  try {
    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: userId,
          conversationId: conversationId,
        },
      },
    })

    if (!participant) {
      throw new Error('You are not a participant in this conversation')
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
                isOnline: true,
                lastSeen: true,
              },
            },
          },
        },
      },
    })

    return conversation
  } catch (error) {
    throw error
  }
}

export async function addParticipant(
  conversationId: string,
  userId: string,
  newParticipantId: string
) {
  try {
    // Verify conversation is a group and user is a participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          where: { userId: userId },
        },
      },
    })

    if (!conversation) {
      throw new Error('Conversation not found')
    }

    if (!conversation.isGroup) {
      throw new Error('Cannot add participants to direct messages')
    }

    if (conversation.participants.length === 0) {
      throw new Error('You are not a participant in this conversation')
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: newParticipantId,
          conversationId: conversationId,
        },
      },
    })

    if (existingParticipant) {
      throw new Error('User is already a participant')
    }

    return await prisma.conversationParticipant.create({
      data: {
        userId: newParticipantId,
        conversationId: conversationId,
        joinedAt: new Date(),
      },
      include: {
        user: {
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

export async function removeParticipant(
  conversationId: string,
  userId: string,
  participantId: string
) {
  try {
    // Verify conversation is a group and user is a participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          where: { userId: userId },
        },
      },
    })

    if (!conversation) {
      throw new Error('Conversation not found')
    }

    if (!conversation.isGroup) {
      throw new Error('Cannot remove participants from direct messages')
    }

    if (conversation.participants.length === 0) {
      throw new Error('You are not a participant in this conversation')
    }

    // Allow users to remove themselves or check if they have permission
    if (userId !== participantId) {
      // Add admin check here if you implement admin roles
      throw new Error('You can only remove yourself from the conversation')
    }

    return await prisma.conversationParticipant.delete({
      where: {
        userId_conversationId: {
          userId: participantId,
          conversationId: conversationId,
        },
      },
    })
  } catch (error) {
    throw error
  }
}

export async function updateConversation(
  conversationId: string,
  userId: string,
  data: { name?: string }
) {
  try {
    // Verify user is a participant and conversation is a group
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          where: { userId: userId },
        },
      },
    })

    if (!conversation) {
      throw new Error('Conversation not found')
    }

    if (!conversation.isGroup) {
      throw new Error('Cannot update direct message conversations')
    }

    if (conversation.participants.length === 0) {
      throw new Error('You are not a participant in this conversation')
    }

    return await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        name: data.name,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    throw error
  }
}
