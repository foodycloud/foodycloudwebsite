'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_FLOW = ['NEW', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED']
const STATUS_LABELS: Record<string, string> = {
  NEW: 'New', ACCEPTED: 'Accepted', PREPARING: 'Preparing',
  READY: 'Ready', OUT_FOR_DELIVERY: 'Out for Delivery',
  COMPLETED: 'Completed', CANCELLED: 'Cancelled',
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function updateStatus(newStatus: string, newPaymentStatus?: string) {
    setLoading(true)
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {}),
        }),
      })
      setStatus(newStatus)
      if (newPaymentStatus) setPaymentStatus(newPaymentStatus)
      router.refresh()
    } catch (e) {
      alert('Failed to update. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentIndex = STATUS_FLOW.indexOf(status)
  const nextStatus = currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIndex + 1] : null

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Status:</span>
        <select
          value={status}
          onChange={e => updateStatus(e.target.value)}
          disabled={loading}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {[...STATUS_FLOW, 'CANCELLED'].map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      {nextStatus && (
        <button
          onClick={() => updateStatus(nextStatus)}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Updating...' : `Mark as ${STATUS_LABELS[nextStatus]} →`}
        </button>
      )}
      {paymentStatus === 'PENDING' && (
        <button
          onClick={() => updateStatus(status, 'PAID')}
          disabled={loading}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Mark payment as received
        </button>
      )}
    </div>
  )
}
