'use client'

import { getConversationById } from '@/services/conversation'
import { getMessages } from '@/services/message'
import { Conversation } from '@/types/conversation.type'
import { Message } from '@/types/message.type'
import { User } from '@/types/user.type'
import { Loader2, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import MessageContainer from './messages-container'
import SideBar from './sidebar'
import UsersDialog from './users-dialog'

interface ChatDashboardProps {
  initialConversations: Conversation[]
  currentUser: User
}

export default function ChatDashboard({ initialConversations, currentUser }: ChatDashboardProps) {
  const [selectedConversationId, setSelectedConversationId] = useState('')
  const [openUsersDialog, setUsersDialog] = useState(false)
  const [isMessageLoading, setMessageLoading] = useState(false)

  const [messages, setMessages] = useState<Message[] | null>(null)

  useEffect(() => {
    if (selectedConversationId) {
      const fetchMessages = async () => {
        try {
          setMessageLoading(true)
          const response = await getMessages({ conversationId: selectedConversationId })
          setMessages(response)
        } catch {
          toast.error('Failed to fetch messages. Please try again.')
        } finally {
          setMessageLoading(false)
        }
      }

      fetchMessages()
    }
  }, [selectedConversationId])

  const [conversation, setConversation] = useState<Conversation | null>(null)
  useEffect(() => {
    if (selectedConversationId) {
      const fetchConversation = async () => {
        try {
          setMessageLoading(true)
          const response = await getConversationById(selectedConversationId, currentUser.id)
          // setConversation(response)
        } catch {
          toast.error('Failed to fetch conversation. Please try again.')
        } finally {
          setMessageLoading(false)
        }
      }

      fetchConversation()
    }
  }, [selectedConversationId, currentUser.id])

  return (
    <div className='flex h-screen bg-white'>
      <SideBar
        initialConversations={initialConversations}
        currentUser={currentUser}
        selectedConversationId={selectedConversationId}
        setSelectedConversationId={setSelectedConversationId}
        setUsersDialog={setUsersDialog}
      />

      <UsersDialog open={openUsersDialog} setOpen={setUsersDialog} />

      <div className='hidden flex-1 items-center justify-center bg-gray-50 lg:flex'>
        {selectedConversationId ? (
          <>
            {isMessageLoading ? (
              <div className='flex h-full items-center justify-center'>
                <Loader2 className='animate-spin' />
              </div>
            ) : (
              messages && (
                <MessageContainer
                  messages={messages}
                  conversationId={selectedConversationId}
                  setSelectConversationId={setSelectedConversationId}
                  // conversation={conversation!}
                />
              )
            )}
          </>
        ) : (
          <div className='text-center'>
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100'>
              <MessageSquare className='h-12 w-12 text-blue-600' />
            </div>
            <h2 className='mb-2 text-2xl font-semibold text-gray-900'>Welcome to Chat</h2>
            <p className='max-w-md text-gray-600'>
              Select a conversation from the sidebar to start messaging, or create a new
              conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
