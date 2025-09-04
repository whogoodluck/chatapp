import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Loader2 size={40} strokeWidth={2} className='text-primary animate-spin' />
    </div>
  )
}
