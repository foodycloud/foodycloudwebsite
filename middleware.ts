import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

export default NextAuth(authConfig).auth

export const config = {
  matcher: [
    '/admin',
    '/admin/foods/:path*',
    '/admin/categories/:path*',
    '/admin/orders/:path*',
    '/admin/offers/:path*',
    '/admin/settings/:path*',
    '/admin/media/:path*',
    '/admin/images/:path*',
    '/admin/customers/:path*',
  ],
}
