import type { Metadata } from 'next'
import CheckoutClient from '@/components/store/CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Foody Cloud order.',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
