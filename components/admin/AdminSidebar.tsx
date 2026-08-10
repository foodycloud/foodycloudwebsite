'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Tag, Percent,
  Users, Image, Settings, Home, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/foods', label: 'Menu & Food', icon: UtensilsCrossed },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/offers', label: 'Offers', icon: Percent },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/media', label: 'Images', icon: Image },
  { href: '/admin/settings', label: 'Business Settings', icon: Settings },
  { href: '/admin/settings/homepage', label: 'Homepage', icon: Home },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 shrink-0">
            <Image
              src="/logo.png"
              alt="Foody Cloud logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">Foody Cloud</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-4 h-4', isActive ? 'text-amber-600' : 'text-gray-400')} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-amber-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Foody Cloud © 2024</p>
      </div>
    </aside>
  )
}
