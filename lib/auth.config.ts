import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'foodycloud2026secretkey32charsmin',
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isLoginPage = nextUrl.pathname === '/admin/login'

      if (isAdminRoute && !isLoginPage) {
        if (isLoggedIn) return true
        return false
      }
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl))
      }
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
