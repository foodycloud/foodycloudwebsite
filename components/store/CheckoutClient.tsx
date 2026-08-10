'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'

export default function CheckoutClient() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryType: 'HOME_DELIVERY' as 'HOME_DELIVERY' | 'SELF_PICKUP',
    deliveryAddress: '',
    specialRequest: '',
  })

  function updateField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 mb-6">Your cart is empty.</p>
        <Link href="/menu" className="bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl">Browse Menu</Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.deliveryType === 'HOME_DELIVERY' && !form.deliveryAddress.trim()) {
      setError('Please enter your delivery address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map(i => ({ foodId: i.foodId, quantity: i.quantity })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to place order. Please try again.')
      } else {
        clearCart()
        router.push(`/order/${data.orderNumber}`)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid gap-6">
        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Your Order ({items.length} items)</h2>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.foodId} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3">
            <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Delivery charge (if applicable) will be confirmed on your order.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Your Details</h2>

          <div>
            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
            <input type="text" required value={form.name} onChange={e => updateField('name', e.target.value)} className={inputClass} placeholder="Enter your name" />
          </div>

          <div>
            <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
            <input type="tel" required value={form.phone} onChange={e => updateField('phone', e.target.value)} className={inputClass} placeholder="10-digit mobile number" maxLength={10} />
          </div>

          <div>
            <label className={labelClass}>Email (optional)</label>
            <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={inputClass} placeholder="for order updates" />
          </div>

          {/* Delivery Type */}
          <div>
            <label className={labelClass}>Delivery Option <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {(['HOME_DELIVERY', 'SELF_PICKUP'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField('deliveryType', type)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                    form.deliveryType === type
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {type === 'HOME_DELIVERY' ? '🚚 Home Delivery' : '🛍️ Self Pickup'}
                </button>
              ))}
            </div>
          </div>

          {form.deliveryType === 'HOME_DELIVERY' && (
            <div>
              <label className={labelClass}>Delivery Address <span className="text-red-500">*</span></label>
              <textarea
                rows={2}
                required
                value={form.deliveryAddress}
                onChange={e => updateField('deliveryAddress', e.target.value)}
                className={inputClass}
                placeholder="Street address, landmark, area..."
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Special Request (optional)</label>
            <textarea rows={2} value={form.specialRequest} onChange={e => updateField('specialRequest', e.target.value)} className={inputClass} placeholder="Any special instructions for the kitchen?" />
          </div>

          {/* Payment info */}
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-800">💵 Cash on Delivery</p>
            <p className="text-xs text-amber-700 mt-0.5">Payment is collected at the time of delivery or pickup.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            id="place-order-btn"
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold py-4 rounded-xl transition"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  )
}
