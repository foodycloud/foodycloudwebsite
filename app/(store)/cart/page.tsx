import type { Metadata } from 'next'
import CartPageClient from '@/components/store/CartPageClient'

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your Foody Cloud order before sending it for prepaid confirmation.',
}

export default function CartPage() {
  return <CartPageClient />
}
