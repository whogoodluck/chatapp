import { Metadata } from 'next'

import SigninForm from './signin-form'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default async function Signin() {
  return (
    <section className='bg-muted mx-auto flex h-screen items-center justify-center'>
      <SigninForm />
    </section>
  )
}
