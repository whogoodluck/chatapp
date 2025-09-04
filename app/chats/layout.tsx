import SideBar from '@/components/sidebar'
import { authOptions } from '@/lib/auth'
import { getConversations } from '@/services/conversation'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your conversations and messages',
}

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions)
  const conversations = await getConversations({})
  return (
    <div className='flex h-screen bg-white'>
      <SideBar currentUser={session!.user} initialConversations={conversations} />
      <main className='flex-1 overflow-hidden'>{children}</main>
    </div>
  )
}
