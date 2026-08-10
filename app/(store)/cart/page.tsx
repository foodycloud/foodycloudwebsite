import type { Metadata } from 'next'
import CartPageClient from '@/components/store/CartPageClient'

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your Foody Cloud order before checkout.',
}

export default function CartPage() {
  return <CartPageClient />
}
