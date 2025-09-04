import MessageContainer from '@/components/message-container'
import { authOptions } from '@/lib/auth'
import { getConversationById } from '@/services/conversation'
import { getMessages } from '@/services/message'
import { getServerSession } from 'next-auth'

export async function generateMetadata() {
  return {
    title: 'Chat',
  }
}

type ChatPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session) return

  const messages = await getMessages({ conversationId: id })
  const conversation = await getConversationById(id, session.user.id)

  return <MessageContainer messages={messages} conversationId={id} conversation={conversation!} />
}
