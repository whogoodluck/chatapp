'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { createMessage } from '@/services/message'
import { Message } from '@/types/message.type'
import { ArrowLeft, Loader2Icon, Paperclip, Send, Smile } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

type Conversation = {
  id: string
  name: string | null
  isGroup: boolean
  createdAt: Date
  updatedAt: Date
  participants: {
    id: string
    userId: string
    conversationId: string
    lastReadAt: Date
    joinedAt: Date
    user: {
      id: string
      username: string
      fullName: string
      avatar: string | null
      isOnline: boolean
      lastSeen: Date
    }
  }[]
}

interface MessageContainerProps {
  messages: Message[]
  conversationId: string
  //   setSelectConversationId: Dispatch<SetStateAction<string>>
  conversation: Conversation
}

function MessageContainer({
  messages,
  conversationId,
  conversation,
  //   setSelectConversationId,
}: MessageContainerProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isMsgSending, setIsMsgSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session?.user.id) return

    try {
      setIsMsgSending(true)
      await createMessage({
        content: newMessage,
        senderId: session?.user.id,
        conversationId: conversationId,
      })
      setNewMessage('')
    } catch {
      toast.error('Failed to send message')
    } finally {
      setIsMsgSending(false)
    }
  }

  const formatMessageTime = (date: Date) => {
    const messageDate = new Date(date)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (dateString === today) return 'Today'
    if (dateString === yesterday) return 'Yesterday'

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const groupedMessages = groupMessagesByDate(messages)

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name

    if (!conversation.isGroup) {
      const otherParticipant = conversation.participants.find(p => p.user.id !== session?.user.id)
      return otherParticipant?.user.fullName || 'Unknown User'
    }

    return `Group Chat (${conversation.participants.length} members)`
  }

  const conversationName = getConversationName(conversation)

  const router = useRouter()

  return (
    <div className='bg-background flex h-full w-full flex-col'>
      {/* header */}
      <div className='flex items-center justify-between border-b px-4 py-2'>
        <button className='' onClick={() => router.replace('/chats')}>
          <ArrowLeft className='h-4 w-4' />
        </button>{' '}
        <h2 className='text-lg font-semibold'>{conversationName}</h2>
        <div></div>
      </div>

      {/* Messages Area */}
      <ScrollArea className='flex-1 px-4' ref={scrollAreaRef}>
        <div className='space-y-6 py-4'>
          {Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date Header */}
              <div className='mb-4 flex justify-center'>
                <span className='bg-muted text-foreground/50 rounded-full px-3 py-1 text-xs font-medium'>
                  {formatDateHeader(date)}
                </span>
              </div>

              {/* Messages for this date */}
              <div className='space-y-4'>
                {dayMessages.map((message, index) => {
                  const isCurrentUser = message.sender.id === session?.user.id
                  const showAvatar =
                    !isCurrentUser &&
                    (index === 0 || dayMessages[index - 1]?.sender.id !== message.sender.id)
                  const showSenderName = !isCurrentUser && showAvatar

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        'flex items-start space-x-2',
                        isCurrentUser ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {!isCurrentUser && (
                        <div className='flex-shrink-0'>
                          {showAvatar ? (
                            <Avatar className='h-8 w-8'>
                              {message.sender.avatar && (
                                <AvatarImage
                                  src={message.sender.avatar}
                                  alt={message.sender.fullName || message.sender.username}
                                />
                              )}
                              <AvatarFallback className='text-xs'>
                                {getInitials(message.sender.fullName || message.sender.username)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className='w-8' />
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <div
                        className={cn(
                          'flex max-w-xs flex-col lg:max-w-md',
                          isCurrentUser ? 'items-end' : 'items-start'
                        )}
                      >
                        {/* Message bubble */}
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2 text-base break-words',
                            isCurrentUser
                              ? 'bg-primary text-accent rounded-br-md'
                              : 'bg-muted text-foreground rounded-bl-md'
                          )}
                        >
                          {message.content}
                          <span
                            className={cn(
                              'text-muted-foreground mt-1 px-2 text-xs',
                              isCurrentUser
                                ? 'text-accent/90 text-right'
                                : 'text-foreground/80 text-left'
                            )}
                          >
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className='border-t border-gray-200 bg-white p-4'>
        <form onSubmit={handleSendMessage} className='flex items-center space-x-2'>
          {/* Attachment button */}
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='flex-shrink-0 text-gray-500 hover:text-gray-700'
          >
            <Paperclip className='h-5 w-5' />
          </Button>

          {/* Message input */}
          <div className='relative flex-1'>
            <Input
              placeholder='Type a message...'
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className='pr-12'
            />

            {/* Emoji button */}
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 transform'
            >
              <Smile className='h-4 w-4' />
            </Button>
          </div>

          {/* Send button */}
          <Button
            type='submit'
            size='icon'
            disabled={!newMessage.trim() || isMsgSending}
            className='bg-secondary hover:bg-secondary/90'
          >
            {isMsgSending ? (
              <Loader2Icon className='h-4 w-4 animate-spin' />
            ) : (
              <Send className='h-4 w-4' />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default MessageContainer
