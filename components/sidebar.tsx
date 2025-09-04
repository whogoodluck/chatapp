'use client'

import {
  Loader2Icon,
  LogOutIcon,
  MessageSquare,
  MoreHorizontal,
  Search,
  User,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'

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
import { cn } from '@/lib/utils'
import { deleteConversation } from '@/services/conversation'
import { Conversation } from '@/types/conversation.type'
import { User as UserType } from '@/types/user.type'
import { signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { ModeToggle } from './theme-toggle'
import UsersDialog from './users-dialog'

interface SideBarProps {
  initialConversations: Conversation[]
  currentUser: UserType
}

function SideBar({ initialConversations, currentUser }: SideBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

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
      //   setSelectedConversationId('')
    } catch (error) {
      console.error('Error deleting conversation:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={cn('border-muted relative flex w-full flex-col border-r lg:max-w-md', {
        'hidden lg:block': pathname !== '/chats',
      })}
    >
      <div className='border-muted border-b p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-primary text-2xl font-semibold'>ChatApp</h1>
          <div className='flex items-center gap-3'>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='secondary' size='icon'>
                  <User className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <div className='p-2'>
                  <h2 className='text-lg font-semibold'>{currentUser.fullName}</h2>
                  <p className='text-muted-foreground text-sm'>{currentUser.email}</p>
                </div>
                <DropdownMenuItem onClick={() => signOut()} className='text-red-600'>
                  <LogOutIcon className='mr-2 h-4 w-4' /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
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
              <MessageSquare className='text-muted-foreground mx-auto mb-3 h-12 w-12' />
              <h3 className='text-foreground mb-1 text-sm font-medium'>
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </h3>
              <p className='text-muted-foreground text-sm'>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start a new conversation to get started'}
              </p>
            </div>
          ) : (
            <div className='space-y-1'>
              {filteredConversations.map(conversation => {
                const latestMessage = conversation.messages[0]
                const conversationName = getConversationName(conversation)
                const avatarUrl = getConversationAvatar(conversation)

                return (
                  <Card
                    key={conversation.id}
                    className={`hover:bg-secondary/5 hover:border-secondary/20 cursor-pointer transition-colors ${
                      pathname === `/chats/${conversation.id}`
                        ? 'bg-secondary/5 border-secondary/20'
                        : 'border-transparent'
                    }`}
                    onClick={() => router.replace(`/chats/${conversation.id}`)}
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
                            <h3 className='text-foreground truncate text-sm font-medium'>
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
                                    onClick={e => {
                                      e.stopPropagation()
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
                              <p className='text-muted-foreground line-clamp-1 text-sm'>
                                {latestMessage.sender.id === currentUser.id ? 'You: ' : ''}
                                {latestMessage.content}
                              </p>
                              <p className='text-muted-foreground mt-1 text-xs'>
                                {formatMessageTime(latestMessage.createdAt)}
                              </p>
                            </div>
                          ) : (
                            <p className='text-muted-foreground mt-1 text-xs'>No messages yet</p>
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
      <div className='absolute right-10 bottom-12'>
        <UsersDialog />
      </div>
    </div>
  )
}

export default SideBar
