'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function StoreHeader() {
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">FC</span>
          </div>
          <span className="font-display font-bold text-lg text-gray-900">Foody Cloud</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition">Menu</Link>
          <Link href="/menu#categories" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition">Categories</Link>
        </nav>

        {/* Cart + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 text-gray-700 hover:text-amber-600 transition" id="cart-icon">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-700">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          <Link href="/menu" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-gray-700">Menu</Link>
          <Link href="/cart" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-gray-700">Cart ({totalItems})</Link>
        </div>
      )}
    </header>
  )
}
