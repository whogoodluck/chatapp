import { Metadata } from 'next'

import SignupForm from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default async function Signup() {
  return (
    <section className='bg-muted flex h-screen items-center justify-center'>
      <SignupForm />
    </section>
  )
}
