'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, MessageCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

export default function StoreHeader({
  bannerText,
  bannerLinkUrl,
}: {
  bannerText?: string | null
  bannerLinkUrl?: string | null
}) {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [bounce, setBounce] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bounce animation on cart item change
  useEffect(() => {
    if (totalItems > 0) {
      setBounce(true)
      const timer = setTimeout(() => setBounce(false), 300)
      return () => clearTimeout(timer)
    }
  }, [totalItems])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Cart', href: '/cart' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'bg-[#fbf8f1]/90 backdrop-blur-xl border-b border-amber-100/80 shadow-sm'
          : 'bg-[#fbf8f1] border-b border-transparent'
      )}
    >
      {/* Announcement Banner */}
      {bannerText && (
        <div
          className={cn(
            'bg-amber-600 text-white text-center text-[11px] md:text-xs font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden',
            isScrolled ? 'h-0 opacity-0' : 'py-2.5 px-4 h-9 opacity-100'
          )}
        >
          <span className="truncate">{bannerText}</span>
          {bannerLinkUrl && (
            <Link
              href={bannerLinkUrl}
              className="underline hover:text-amber-100 transition-colors shrink-0"
            >
              Order Now &rarr;
            </Link>
          )}
        </div>
      )}

      <div className={cn(
        "container-page flex items-center justify-between transition-all duration-300",
        isScrolled ? "py-3" : "py-4"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Foody Cloud Logo"
              fill
              className="object-contain"
              sizes="40px"
              priority
            />
          </div>
          <span className="font-display text-xl font-bold text-stone-950 tracking-tight hidden sm:block">
            Foody Cloud
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                )}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2 text-stone-700 hover:text-stone-950 transition-colors"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span
                className={cn(
                  'absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm transition-transform',
                  bounce && 'animate-bounce scale-110'
                )}
              >
                {totalItems}
              </span>
            )}
          </Link>

          <a
            href="https://wa.me/919007182421"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex btn-green px-5 py-2.5 rounded-full items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Order via WhatsApp</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-950 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#fbf8f1] shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="Foody Cloud" fill className="object-contain" />
            </div>
            <span className="font-display font-bold text-lg text-stone-950">Foody Cloud</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-stone-500 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-5 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-3.5 rounded-2xl text-base font-medium transition-all duration-200 flex items-center justify-between',
                  isActive
                    ? 'bg-amber-100/50 text-amber-900 border border-amber-200/50'
                    : 'text-stone-700 hover:bg-white hover:text-stone-950 border border-transparent'
                )}
              >
                {link.name}
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </Link>
            )
          })}
        </div>

        <div className="p-5 border-t border-amber-100 bg-white">
          <a
            href="https://wa.me/919007182421"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#20bd5a] hover:shadow-md transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp Order</span>
          </a>
        </div>
      </div>
    </header>
  )
}
