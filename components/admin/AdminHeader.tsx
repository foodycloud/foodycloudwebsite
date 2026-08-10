'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();
  
  let title = 'Dashboard';
  if (pathname.includes('/orders')) title = 'Orders';
  else if (pathname.includes('/foods')) title = 'Menu & Food';
  else if (pathname.includes('/categories')) title = 'Categories';
  else if (pathname.includes('/offers')) title = 'Offers & Coupons';
  else if (pathname.includes('/settings')) title = 'Business Settings';
  else if (pathname.includes('/homepage')) title = 'Homepage Settings';
  else if (pathname.includes('/images')) title = 'Image Gallery';
  else if (pathname.includes('/customers')) title = 'Customers';

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
          A
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center text-gray-500 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-lg"
          title="Sign out"
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
