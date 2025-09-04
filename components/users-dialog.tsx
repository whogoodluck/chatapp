'use client'

import SingleUser from '@/components/single-user'
import { buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { searchUsers } from '@/services/user'
import { User } from '@/types/user.type'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

function UsersDialog() {
  const [isLoading, setIsLoading] = useState(false)

  const [open, setOpen] = useState(false)

  const [users, setUsers] = useState<User[]>([])

  const handleSearchUser = async (query: string) => {
    try {
      setIsLoading(true)
      const response = await searchUsers(query)
      setUsers(response)
    } catch (error) {
      toast.error('Failed to search users. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span
          className={cn(
            'flex cursor-pointer items-center gap-2',
            buttonVariants({ size: 'lg', className: 'font-bold' })
          )}
        >
          <Plus className='h-4 w-4' size={16} strokeWidth={4} />
          <p className='hidden md:block'> Invite Users</p>
        </span>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogTitle>Invite Users</DialogTitle>

        <Input
          type='text'
          placeholder='Enter user name'
          onChange={e => handleSearchUser(e.target.value)}
        />
        {isLoading ? (
          <div className='mt-2 flex flex-col items-center p-4'>
            <Loader2 className='animate-spin' />
          </div>
        ) : (
          <>
            {users.map(user => (
              <SingleUser key={user.id} user={user} setOpen={setOpen} />
            ))}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UsersDialog
