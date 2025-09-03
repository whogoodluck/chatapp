'use client'

import { startConversation } from '@/services/conversation'
import { User } from '@/types/user.type'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Dispatch, SetStateAction, useState } from 'react'
import toast from 'react-hot-toast'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

interface SingleUserProps {
  user: User
  setOpen: Dispatch<SetStateAction<boolean>>
}

function SingleUser({ user, setOpen }: SingleUserProps) {
  const [isInviting, setIsInviting] = useState(false)
  const { data: session } = useSession()

  const handleInvite = async (userId: string) => {
    try {
      setIsInviting(true)
      const response = await startConversation(session!.user.id, userId)

      if (response) {
        setOpen(false)
      }
    } catch {
      toast.error('Failed to invite user. Please try again.')
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className='mt-2 flex flex-col gap-2'>
      <div className='rounded-2xl p-1'>
        <div className='fles items-center'>
          <div className='flex items-center justify-between'>
            <div className='flex items-start space-x-3'>
              <Avatar className='h-10 w-10'>
                {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
                <AvatarFallback>
                  {user.username
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className=''>
                <h3 className='text-foreground text-sm font-semibold'>{user.fullName}</h3>
                <p className='text-muted-foreground text-sm'>{user.username}</p>
              </div>
            </div>

            <Button
              variant='outline'
              className='text-primary w-[100px]'
              onClick={() => handleInvite(user.id)}
            >
              {isInviting ? <Loader2 className='animate-spin' /> : 'Invite'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleUser
