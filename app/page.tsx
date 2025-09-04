import { Metadata } from 'next'

import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Your conversations and messages',
}

export default function ChatPage() {
  return redirect('/chats')
}
