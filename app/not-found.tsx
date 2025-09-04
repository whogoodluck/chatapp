'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <section className='flex min-h-screen flex-col items-center justify-center gap-4 py-12 lg:py-20'>
      <h2 className='text-center text-3xl font-semibold text-black'>Page Not Found</h2>
      <Button onClick={() => router.back()}>Go Back</Button>
    </section>
  )
}
