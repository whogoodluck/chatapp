'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Conversation } from '@/types/conversation.type'
import { MoreVertical, Users } from 'lucide-react'
import React from 'react'

interface ConversationComponentProps {
  conversation: Conversation
  currentUserId: string
}

const ConversationComponent: React.FC<ConversationComponentProps> = ({
  conversation,
  currentUserId,
}) => {
  // Get the other participant for direct messages
  const getOtherParticipant = () => {
    return conversation.participants.find(p => p.userId !== currentUserId)
  }

  // Get conversation display name
  const getConversationName = (): string => {
    if (conversation.isGroup) {
      return conversation.name || 'Group Chat'
    }

    const otherParticipant = getOtherParticipant()
    return otherParticipant
      ? otherParticipant.user.fullName || otherParticipant.user.username
      : 'Unknown User'
  }

  // Check if other user is online (for direct messages)
  const isOtherUserOnline = (): boolean => {
    if (conversation.isGroup) {
      // For groups, check if any participant is online
      return conversation.participants.some(p => p.user.isOnline && p.userId !== currentUserId)
    }

    const otherParticipant = getOtherParticipant()
    return otherParticipant?.user.isOnline || false
  }

  // Get last message preview
  const getLastMessagePreview = (): string => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'No messages yet'
    }

    // Sort messages by createdAt to get the latest
    const sortedMessages = [...conversation.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const lastMessage = sortedMessages[0]
    const isCurrentUser = lastMessage.senderId === currentUserId
    const prefix = isCurrentUser ? 'You: ' : ''

    return `${prefix}${lastMessage.content}`
  }

  // Format timestamp
  const formatTime = (date: Date): string => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  // Calculate unread count
  const getUnreadCount = (): number => {
    const currentUserParticipant = conversation.participants.find(p => p.userId === currentUserId)
    if (!currentUserParticipant || !conversation.messages) return 0

    const lastReadAt = new Date(currentUserParticipant.lastReadAt)
    return conversation.messages.filter(
      message => new Date(message.createdAt) > lastReadAt && message.senderId !== currentUserId
    ).length
  }

  // Get the latest message timestamp for sorting
  const getLatestMessageTime = (): Date => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return conversation.updatedAt
    }

    const sortedMessages = [...conversation.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return sortedMessages[0].createdAt
  }

  const conversationName = getConversationName()
  const lastMessagePreview = getLastMessagePreview()
  const isOnline = isOtherUserOnline()
  const unreadCount = getUnreadCount()
  const latestMessageTime = getLatestMessageTime()

  const handleClick = () => {
    // onSelect(conversation.id)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      onClick={handleClick}
      className={`hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors ${
        // isSelected ? 'bg-accent' : ''
        ''
      }`}
    >
      {/* Avatar */}
      <div className='relative'>
        <Avatar className='h-12 w-12'>
          <AvatarImage src={''} alt={conversation.name || 'Group Chat'} />
          <AvatarFallback>
            {conversation.isGroup ? (
              <Users className='h-6 w-6' />
            ) : (
              (conversation.name || 'Unknown User').charAt(0).toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
        {/* Online indicator for direct messages */}
        {!conversation.isGroup && isOnline && (
          <div className='border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500' />
        )}
      </div>

      {/* Content */}
      <div className='min-w-0 flex-1'>
        {/* Header */}
        <div className='mb-1 flex items-center justify-between'>
          <h3 className='truncate text-sm font-semibold'>
            {conversation.isGroup
              ? conversation.name
              : conversation.participants.find(p => p.userId !== currentUserId)?.user.fullName}
          </h3>
          <span className='text-muted-foreground flex-shrink-0 text-xs'>
            {formatTime(latestMessageTime)}
          </span>
        </div>

        {/* Message preview and actions */}
        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground mr-2 flex-1 truncate text-sm'>{lastMessagePreview}</p>

          <div className='flex flex-shrink-0 items-center gap-2'>
            {/* Unread badge */}
            {unreadCount > 0 && (
              <Badge variant='default' className='h-5 min-w-5 px-1.5 text-xs'>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}

            {/* Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100'
                  onClick={handleMenuClick}
                >
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem onClick={() => {}}>Mark as read</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>Pin conversation</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>Mute notifications</DropdownMenuItem>
                {conversation.isGroup && (
                  <DropdownMenuItem onClick={() => {}}>Leave group</DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className='text-destructive focus:text-destructive'
                  onClick={() => {}}
                >
                  Delete conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversationComponent
