'use client'

import { searchUsers } from '@/services/user'
import { User } from '@/types/user.type'
import { Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import toast from 'react-hot-toast'
import SingleUser from './single-user'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'

interface UsersDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

function UsersDialog({ open, setOpen }: UsersDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

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
