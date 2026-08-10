import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import '../globals.css'
import StoreHeader from '@/components/store/StoreHeader'
import StoreFooter from '@/components/store/StoreFooter'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'react-hot-toast'
import CinematicIntro from '@/components/store/CinematicIntro'
import { getCachedHomepageSettings } from '@/lib/db-cache'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: {
    default: 'Foody Cloud | Homely Taste, Every Time',
    template: '%s | Foody Cloud',
  },
  description: 'Pure vegetarian home kitchen based in Chinar Park, Kolupukur. Delivering fresh, hygienic, and delicious homestyle meals across Kolkata.',
  keywords: ['foody cloud', 'veg home kitchen kolkata', 'chinar park home food', 'vegetarian delivery kolkata'],
  openGraph: {
    title: 'Foody Cloud | Homely Taste, Every Time',
    description: 'Pure veg home kitchen delivering fresh, hygienic, and delicious homestyle meals in Kolkata.',
    type: 'website',
  },
}

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const homepageSettings = await getCachedHomepageSettings()

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('introCompleted') !== 'true' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                  document.documentElement.classList.add('intro-active');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-body text-stone-950 antialiased">
        <CartProvider>
          <CinematicIntro />
          <StoreHeader 
            bannerText={homepageSettings?.bannerText} 
            bannerLinkUrl={homepageSettings?.bannerLinkUrl} 
          />
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
