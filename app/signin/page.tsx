import { Metadata } from 'next'

import SigninForm from './signin-form'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default async function Signin() {
  return (
    <section className='container mx-auto w-[90%]'>
      <SigninForm />
    </section>
  )
}
