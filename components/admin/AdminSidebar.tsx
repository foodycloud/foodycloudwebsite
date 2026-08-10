'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Ticket,
  Settings,
  Home,
  Image as ImageIcon,
  Users,
  ExternalLink
} from 'lucide-react';

const navGroups = [
  {
    label: '',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    label: 'MANAGEMENT',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { name: 'Menu & Food', href: '/admin/foods', icon: UtensilsCrossed },
      { name: 'Categories', href: '/admin/categories', icon: Tag },
      { name: 'Offers & Coupons', href: '/admin/offers', icon: Ticket },
    ]
  },
  {
    label: 'SETTINGS',
    items: [
      { name: 'Business Settings', href: '/admin/settings', icon: Settings },
      { name: 'Homepage', href: '/admin/homepage', icon: Home },
      { name: 'Images', href: '/admin/images', icon: ImageIcon },
    ]
  },
  {
    label: 'TEAM',
    items: [
      { name: 'Customers', href: '/admin/customers', icon: Users },
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-stone-950 text-stone-300 h-full flex flex-col w-64 flex-shrink-0">
      <div className="p-6 flex items-center space-x-3">
        <div className="relative w-9 h-9">
          <Image src="/logo.png" alt="Logo" fill className="object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg leading-tight">Foody Cloud</span>
          <span className="text-stone-500 text-xs uppercase tracking-wider font-semibold">Admin</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
        {navGroups.map((group, i) => (
          <div key={i}>
            {group.label && (
              <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-3 px-3">
                {group.label}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-150 ease-in-out ${
                      isActive
                        ? 'bg-stone-800 text-white shadow-sm'
                        : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-stone-800">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-400 hover:bg-stone-900 hover:text-white transition-all duration-150"
        >
          <span className="text-sm font-medium">View Store</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
        <div className="mt-4 px-3 text-xs text-stone-600 font-medium">
          Foody Cloud OS v2.0
        </div>
      </div>
    </div>
  );
}
