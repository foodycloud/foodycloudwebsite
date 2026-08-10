'use client'

import { useState } from 'react'
import { Power } from 'lucide-react'

interface KitchenToggleProps {
  initialOpen: boolean
  settingsId: string
}

export default function KitchenToggle({ initialOpen }: KitchenToggleProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: !isOpen }),
      })
      if (res.ok) {
        setIsOpen(!isOpen)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      id="kitchen-toggle"
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
        isOpen
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-red-100 text-red-700 hover:bg-red-200'
      }`}
    >
      <Power className="w-4 h-4" />
      Kitchen is {isOpen ? 'OPEN' : 'CLOSED'}
    </button>
  )
}
