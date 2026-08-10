'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OfferToggle({ offerId, initialActive }: { offerId: string; initialActive: boolean }) {
  const [active, setActive] = useState(initialActive)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    try {
      await fetch(`/api/admin/offers/${offerId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !active }) })
      setActive(!active)
      router.refresh()
    } catch { alert('Failed to update offer.') } finally { setLoading(false) }
  }

  return (
    <button onClick={toggle} disabled={loading} className={`relative w-10 h-5 rounded-full transition-colors ${ active ? 'bg-green-500' : 'bg-gray-300'}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}
