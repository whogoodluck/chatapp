import { MessageSquare } from 'lucide-react'

export default function page() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='text-center'>
        <div className='bg-secondary/10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full'>
          <MessageSquare className='text-secondary h-12 w-12' />
        </div>
        <h2 className='text-foreground mb-2 text-2xl font-semibold'>Welcome to Chat</h2>
        <p className='text-muted-foreground max-w-md'>
          Select a conversation from the sidebar to start messaging, or create a new conversation.
        </p>
      </div>
    </div>
  )
}
