'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className='flex min-h-screen flex-col items-center justify-center gap-4 py-12 lg:py-20'>
      <h2 className='text-foreground text-center text-3xl font-semibold'>Something Went Wrong!</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </section>
  )
}
