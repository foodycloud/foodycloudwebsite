import { auth } from '@/lib/auth'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  const session = await auth()
  const isAuthenticated = !!session?.user

  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
