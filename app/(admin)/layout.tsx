import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-body text-stone-950 antialiased bg-gray-50">
        {children}
      </body>
    </html>
  )
}
