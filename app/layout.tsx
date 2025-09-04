import AuthProvider from '@/context/auth-provider'
import { ThemeProvider } from '@/context/theme-provider'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Next Chat App',
  description: 'A chat app built with Next.js, Next-Auth, and Prisma',
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
