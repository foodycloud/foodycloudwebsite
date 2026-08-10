'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, MessageCircle, ShoppingBag, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { getWhatsAppUrl } from '@/lib/storefront'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/cart', label: 'Cart' },
]

export default function StoreHeader() {
  const { totalItems } = useCart()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#fffaf1]/90 backdrop-blur-xl">
      <div className="container-page h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-md">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/logo.png"
              alt="Foody Cloud logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="font-display text-xl font-bold text-stone-950">Foody Cloud</p>
            <p className="hidden text-xs font-medium uppercase tracking-[0.18em] text-stone-500 sm:block">Pure veg kitchen</p>
          </div>
        </Link>

        <nav className="hidden items-center rounded-full border border-stone-200 bg-white/70 p-1 md:flex">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? 'bg-stone-950 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hidden items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-800 transition hover:bg-green-100 sm:flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <Link
            href="/cart"
            className="focus-ring relative grid h-11 w-11 place-items-center rounded-full bg-stone-950 text-white transition hover:bg-stone-800"
            id="cart-icon"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1 text-[11px] font-black text-stone-950">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-stone-200 bg-white text-stone-800 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-[#fffaf1] md:hidden">
          <nav className="container-page grid gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-stone-800 hover:bg-white"
              >
                {item.label}{item.href === '/cart' && totalItems > 0 ? ` (${totalItems})` : ''}
              </Link>
            ))}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-700 px-3 py-3 text-sm font-bold text-white"
            >
              Order on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
