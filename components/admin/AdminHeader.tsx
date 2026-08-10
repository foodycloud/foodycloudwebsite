'use client'

import { signOut } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'

interface AdminHeaderProps {
  user?: { name?: string | null; email?: string | null }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-amber-700" />
          </div>
          <span className="font-medium">{user?.name || user?.email}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  )
}
