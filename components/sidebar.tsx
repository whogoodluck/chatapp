import {
  Loader2Icon,
  LogOutIcon,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  User,
  Users,
} from 'lucide-react'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { deleteConversation } from '@/services/conversation'
import { Conversation } from '@/types/conversation.type'
import { User as UserType } from '@/types/user.type'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'

interface ChatDashboardProps {
  initialConversations: Conversation[]
  currentUser: UserType
  selectedConversationId: string | null
  setSelectedConversationId: Dispatch<SetStateAction<string>>
  setUsersDialog: Dispatch<SetStateAction<boolean>>
}

function SideBar({
  initialConversations,
  currentUser,
  selectedConversationId,
  setSelectedConversationId,
  setUsersDialog,
}: ChatDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return initialConversations

    const query = searchQuery.toLowerCase()

    return initialConversations.filter(conversation => {
      if (conversation.name?.toLowerCase().includes(query)) return true

      const participantMatch = conversation.participants.some(
        p =>
          p.user.username.toLowerCase().includes(query) ||
          p.user.fullName?.toLowerCase().includes(query)
      )

      const messageMatch = conversation.messages[0]?.content.toLowerCase().includes(query)

      return participantMatch || messageMatch
    })
  }, [initialConversations, searchQuery])

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

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      setIsDeleting(true)
      await deleteConversation(conversationId, currentUser.id)
      setSelectedConversationId('')
    } catch (error) {
      console.error('Error deleting conversation:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='border-muted flex w-full flex-col border-r lg:max-w-md'>
      <div className='border-muted border-b p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-primary text-2xl font-semibold'>ChatApp</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='icon'>
                <User className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <div className='p-2'>
                <h2 className='text-lg font-semibold'>{currentUser.fullName}</h2>
                <p className='text-sm text-gray-600'>{currentUser.email}</p>
              </div>
              <DropdownMenuItem onClick={() => signOut()} className='text-red-600'>
                <LogOutIcon className='mr-2 h-4 w-4' /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                const isSelected = selectedConversationId === conversation.id
                const latestMessage = conversation.messages[0]
                const conversationName = getConversationName(conversation)
                const avatarUrl = getConversationAvatar(conversation)

                return (
                  <Card
                    key={conversation.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      isSelected ? 'bg-secondary/5 border-secondary/20' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedConversationId(conversation.id)}
                  >
                    <CardContent className=''>
                      <div className='flex items-start space-x-3'>
                        <Avatar className='h-10 w-10'>
                          {avatarUrl && <AvatarImage src={avatarUrl} alt={conversationName} />}
                          <AvatarFallback>
                            {conversation.isGroup ? (
                              <Users className='h-5 w-5' />
                            ) : (
                              getInitials(conversationName)
                            )}
                          </AvatarFallback>
                        </Avatar>

                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center justify-between'>
                            <h3 className='truncate text-sm font-medium text-gray-900'>
                              {conversationName}
                            </h3>
                            <div className='flex items-center space-x-1'>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <MoreHorizontal className='h-4 w-4' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <button
                                    className='w-full cursor-pointer p-1 text-start text-sm hover:text-red-600'
                                    onClick={() => {
                                      handleDeleteConversation(conversation.id)
                                    }}
                                  >
                                    {isDeleting ? (
                                      <span className='flex items-center'>
                                        <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />{' '}
                                        Deleting...
                                      </span>
                                    ) : (
                                      <>Delete</>
                                    )}
                                  </button>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {latestMessage ? (
                            <div className='mt-1'>
                              <p className='line-clamp-1 text-sm text-gray-600'>
                                {latestMessage.sender.id === currentUser.id ? 'You: ' : ''}
                                {latestMessage.content}
                              </p>
                              <p className='mt-1 text-xs text-gray-500'>
                                {formatMessageTime(latestMessage.createdAt)}
                              </p>
                            </div>
                          ) : (
                            <p className='mt-1 text-xs text-gray-500'>No messages yet</p>
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

      {/* Add a new conversation */}
      <div className='flex items-center justify-end p-4'>
        <Button className='p-1' onClick={() => setUsersDialog(true)}>
          <Plus strokeWidth={4} /> <span className='ml-1 font-semibold'>New Conversation</span>
        </Button>
      </div>
    </div>
  )
}

export default SideBar
