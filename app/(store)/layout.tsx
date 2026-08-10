import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import '../globals.css'
import StoreHeader from '@/components/store/StoreHeader'
import StoreFooter from '@/components/store/StoreFooter'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: { default: 'Foody Cloud - Pure Veg Home Kitchen', template: '%s | Foody Cloud' },
  description: 'Freshly cooked vegetarian meals from Foody Cloud. Browse the menu and order through WhatsApp while prepaid checkout is being prepared.',
  keywords: ['foody cloud', 'pure veg', 'home kitchen', 'kolupukur', 'chinar park', 'homemade food', 'vegetarian', 'food delivery'],
  openGraph: {
    siteName: 'Foody Cloud',
    title: 'Foody Cloud - Pure Veg Home Kitchen',
    description: 'Freshly cooked, purely homemade vegetarian food.',
    type: 'website',
  },
}

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body text-stone-950 antialiased">
        <CartProvider>
          <StoreHeader />
          <main>{children}</main>
          <StoreFooter />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                borderRadius: '999px',
                background: '#18140F',
                color: '#fff',
                fontWeight: 700,
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}
