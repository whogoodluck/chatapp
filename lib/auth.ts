import { comparePassword } from '@/services/user'
import { NextAuthOptions, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })
          if (!user) return null

          const isPasswordValid = await comparePassword(credentials.password, user.password)
          if (!isPasswordValid) return null

          const { password: _, ...userWithoutPassword } = user
          return userWithoutPassword
        } catch {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as Session['user']
      return session
    },
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },
  },
}
