import { Metadata } from 'next'

import SignupForm from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default async function Signup() {
  return (
    <section className='container mx-auto w-[90%]'>
      <SignupForm />
    </section>
  )
}
