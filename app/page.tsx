import { Metadata } from 'next'
import { getServerSession } from 'next-auth'

import ChatDashboard from '@/components/chat-dashboard'
import { authOptions } from '@/lib/auth'
import { getConversations } from '@/services/conversation'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Your conversations and messages',
}

export default async function ChatPage() {
  const session = await getServerSession(authOptions)

  const conversations = await getConversations({ limit: 50 })

  if (!session) return

  return (
    <div className='h-screen bg-gray-50'>
      <ChatDashboard initialConversations={conversations} currentUser={session?.user} />
    </div>
  )
}
