'use client'

import { LogOutIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

import { Button, buttonVariants } from './ui/button'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className='h-24'>
      <div className='container mx-auto flex h-full w-[90%] items-center justify-between'>
        <Link href='/'>ChatApp</Link>

        <nav className='flex items-center gap-4'>
          {session ? (
            <Button onClick={() => signOut()} variant='destructive'>
              <LogOutIcon />
            </Button>
          ) : (
            <Link href='/signin' className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
