import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const url = req.nextUrl.clone()

  if (req.nextUrl.pathname === '/signin' || req.nextUrl.pathname === '/signup') {
    if (token) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.includes('/chats')) {
    if (!token) {
      url.pathname = '/signin'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/signin', '/signup', '/chats', '/chats/:id'],
}
