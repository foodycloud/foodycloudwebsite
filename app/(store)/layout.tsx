import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import '../globals.css'
import StoreHeader from '@/components/store/StoreHeader'
import StoreFooter from '@/components/store/StoreFooter'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: { default: 'Foody Cloud — Pure Veg Home Kitchen', template: '%s | Foody Cloud' },
  description: 'Freshly cooked, purely homemade vegetarian food from Foody Cloud. Order online for home delivery or self pickup. Located in Chinar Park, Kolupukur.',
  keywords: ['foody cloud', 'pure veg', 'home kitchen', 'kolupukur', 'chinar park', 'homemade food', 'vegetarian', 'food delivery'],
  openGraph: {
    siteName: 'Foody Cloud',
    title: 'Foody Cloud — Pure Veg Home Kitchen',
    description: 'Freshly cooked, purely homemade vegetarian food. Order online.',
    type: 'website',
  },
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body bg-cream-50 text-gray-900 antialiased">
        <CartProvider>
          <StoreHeader />
          <main>{children}</main>
          <StoreFooter />
          <Toaster position="bottom-center" />
        </CartProvider>
      </body>
    </html>
  )
}
