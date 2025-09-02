import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

export default async function Home() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <h1 className='text-3xl font-bold text-red-600'>Home</h1>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  )
}
