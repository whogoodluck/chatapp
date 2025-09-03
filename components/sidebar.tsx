import { LogOutIcon, MessageSquare, MoreHorizontal, Plus, Search, Users } from 'lucide-react'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
// import { formatDistanceToNow } from 'date-fns'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Conversation } from '@/types/conversation.type'
import { signOut } from 'next-auth/react'

interface ChatDashboardProps {
  initialConversations: Conversation[]
  currentUser: {
    id: string
    username: string
    fullName: string
    email: string
    avatar?: string
  }
  selectedConversation: string | null
  setSelectedConversation: Dispatch<SetStateAction<string | null>>
}

function SideBar({
  initialConversations,
  currentUser,
  selectedConversation,
  setSelectedConversation,
}: ChatDashboardProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations

    return conversations.filter(conversation => {
      const query = searchQuery.toLowerCase()

      // Search in conversation name
      if (conversation.name?.toLowerCase().includes(query)) return true

      // Search in participant names
      const participantMatch = conversation.participants.some(
        p =>
          p.user.username.toLowerCase().includes(query) ||
          p.user.fullName?.toLowerCase().includes(query)
      )

      // Search in latest message
      const messageMatch = conversation.messages[0]?.content.toLowerCase().includes(query)

      return participantMatch || messageMatch
    })
  }, [conversations, searchQuery])

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name

    if (!conversation.isGroup) {
      const otherParticipant = conversation.participants.find(p => p.user.id !== currentUser.id)
      return otherParticipant?.user.fullName || 'Unknown User'
    }

    return `Group Chat (${conversation.participants.length} members)`
  }

  const getConversationAvatar = (conversation: Conversation) => {
    if (!conversation.isGroup) {
      const otherParticipant = conversation.participants.find(p => p.user.id !== currentUser.id)
      return otherParticipant?.user.avatar
    }
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const isUserOnline = (conversation: Conversation) => {
    if (conversation.isGroup) return false
    const otherParticipant = conversation.participants.find(p => p.user.id !== currentUser.id)
    return otherParticipant?.user.isOnline || false
  }

  return (
    <div className='flex w-full flex-col border-r border-gray-200 lg:max-w-md'>
      <div className='border-b border-gray-200 p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-xl font-semibold text-gray-900'>Messages</h1>
          <Button size='sm' className='h-8 w-8 p-0'>
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        {/* Search */}
        <div className='relative'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
          <Input
            placeholder='Search conversations...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className='flex-1'>
        <div className='p-2'>
          {filteredConversations.length === 0 ? (
            <div className='py-8 text-center'>
              <MessageSquare className='mx-auto mb-3 h-12 w-12 text-gray-400' />
              <h3 className='mb-1 text-sm font-medium text-gray-900'>
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </h3>
              <p className='text-sm text-gray-500'>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start a new conversation to get started'}
              </p>
            </div>
          ) : (
            <div className='space-y-1'>
              {filteredConversations.map(conversation => {
                const isSelected = selectedConversation === conversation.id
                const isOnline = isUserOnline(conversation)
                const latestMessage = conversation.messages[0]
                const conversationName = getConversationName(conversation)
                const avatarUrl = getConversationAvatar(conversation)

                return (
                  <Card
                    key={conversation.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      isSelected ? 'border-blue-200 bg-blue-50' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <CardContent className=''>
                      <div className='flex items-start space-x-3'>
                        <div className='relative'>
                          <Avatar className='h-10 w-10'>
                            <AvatarImage src={avatarUrl} alt={conversationName} />
                            <AvatarFallback>
                              {conversation.isGroup ? (
                                <Users className='h-5 w-5' />
                              ) : (
                                getInitials(conversationName)
                              )}
                            </AvatarFallback>
                          </Avatar>
                          {!conversation.isGroup && isOnline && (
                            <div className='absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500'></div>
                          )}
                        </div>

                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center justify-between'>
                            <h3 className='truncate text-sm font-medium text-gray-900'>
                              {conversationName}
                            </h3>
                            <div className='flex items-center space-x-1'>
                              {/* {conversation.isGroup && (
                                  <Badge variant='secondary' className='text-xs'>
                                    {conversation.participants.length}
                                  </Badge>
                                )} */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-6 w-6 p-0 hover:bg-gray-200'
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className='h-4 w-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Mute</DropdownMenuItem>
                                  <DropdownMenuItem>Archive</DropdownMenuItem>
                                  <DropdownMenuItem className='text-red-600'>
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {latestMessage && (
                            <div className='mt-1'>
                              <p className='line-clamp-1 text-sm text-gray-600'>
                                {latestMessage.sender.id === currentUser.id ? 'You: ' : ''}
                                {latestMessage.content}
                              </p>
                              <p className='mt-1 text-xs text-gray-500'>
                                {formatMessageTime(latestMessage.createdAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* user profile */}
      <div className='flex items-center justify-between border-t p-4'>
        <div className='flex items-center space-x-3'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
            <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1'>
            <h3 className='truncate text-sm font-medium text-gray-900'>{currentUser.fullName}</h3>
          </div>
        </div>
        <Button onClick={() => signOut()} variant='destructive'>
          <LogOutIcon />
        </Button>
      </div>
    </div>
  )
}

export default SideBar
