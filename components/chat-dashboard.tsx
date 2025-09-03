'use client'

import { Conversation } from '@/types/conversation.type'
import { User } from '@/types/user.type'
import { MessageSquare } from 'lucide-react'
import { useState } from 'react'
import SideBar from './sidebar'
import UsersDialog from './users-dialog'

interface ChatDashboardProps {
  initialConversations: Conversation[]
  currentUser: User
}

export default function ChatDashboard({ initialConversations, currentUser }: ChatDashboardProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [openUsersDialog, setUsersDialog] = useState(false)

  return (
    <div className='flex h-screen bg-white'>
      <SideBar
        initialConversations={initialConversations}
        currentUser={currentUser}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        setUsersDialog={setUsersDialog}
      />

      <UsersDialog open={openUsersDialog} setOpen={setUsersDialog} />

      <div className='hidden flex-1 items-center justify-center bg-gray-50 lg:flex'>
        {selectedConversation ? (
          <div className='text-center'>
            <MessageSquare className='mx-auto mb-4 h-16 w-16 text-gray-400' />
            <h2 className='mb-2 text-xl font-semibold text-gray-900'>Chat Interface Coming Soon</h2>
            <p className='text-gray-600'>Selected conversation: {selectedConversation}</p>
          </div>
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
