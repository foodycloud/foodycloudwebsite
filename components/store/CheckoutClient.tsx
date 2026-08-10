'use client'

import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { buildOrderWhatsAppMessage, getWhatsAppUrl, WHATSAPP_DISPLAY } from '@/lib/storefront'
import { ArrowLeft, MessageCircle, ShieldCheck, ShoppingBag, Truck, Utensils } from 'lucide-react'

export default function CheckoutClient() {
  const { items, subtotal } = useCart()
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
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const whatsAppUrl = useMemo(() => {
    return getWhatsAppUrl(buildOrderWhatsAppMessage({ items, subtotal, customer: form }))
  }, [form, items, subtotal])

  function validateBeforeWhatsApp(e: MouseEvent<HTMLAnchorElement>) {
    setError('')
    if (!form.name.trim()) {
      e.preventDefault()
      setError('Please enter your name before sending the order on WhatsApp.')
      return
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      e.preventDefault()
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }
    if (form.deliveryType === 'HOME_DELIVERY' && !form.deliveryAddress.trim()) {
      e.preventDefault()
      setError('Please enter your delivery address.')
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center py-16 text-center">
        <div className="max-w-md">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-stone-300" />
          <h1 className="font-display text-4xl font-bold text-stone-950">Your cart is empty</h1>
          <p className="mt-3 text-stone-500">Choose something from the menu first.</p>
          <Link href="/menu" className="focus-ring mt-8 inline-flex rounded-full bg-stone-950 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white">
            Browse menu
          </Link>
        </div>
      </div>
    )
  }

  const inputClass = 'focus-ring w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-950 placeholder:text-stone-400'
  const labelClass = 'mb-1.5 block text-sm font-bold text-stone-700'

  return (
    <div className="container-page py-8 md:py-12">
      <Link href="/cart" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition hover:text-amber-700">
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Checkout</p>
        <h1 className="font-display text-4xl font-bold text-stone-950">Send order for prepaid confirmation</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Online payment through Razorpay is being prepared. For now, review your details and send this order on WhatsApp so payment can be shared before preparation.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
        <form className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-display text-2xl font-bold text-stone-950">Your details</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Full name <span className="text-red-500">*</span></label>
              <input type="text" required value={form.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass} placeholder="Enter your name" />
            </div>

            <div>
              <label className={labelClass}>Phone number <span className="text-red-500">*</span></label>
              <input type="tel" required value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} placeholder="10-digit mobile number" maxLength={10} />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} placeholder="For order updates" />
          </div>

          <div className="mt-5">
            <label className={labelClass}>Delivery option <span className="text-red-500">*</span></label>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['HOME_DELIVERY', 'SELF_PICKUP'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField('deliveryType', type)}
                  className={`focus-ring flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    form.deliveryType === type ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {type === 'HOME_DELIVERY' ? <Truck className="h-5 w-5" /> : <Utensils className="h-5 w-5" />}
                  <span className="font-bold">{type === 'HOME_DELIVERY' ? 'Home delivery' : 'Self pickup'}</span>
                </button>
              ))}
            </div>
          </div>

          {form.deliveryType === 'HOME_DELIVERY' && (
            <div className="mt-4">
              <label className={labelClass}>Delivery address <span className="text-red-500">*</span></label>
              <textarea rows={3} required value={form.deliveryAddress} onChange={(e) => updateField('deliveryAddress', e.target.value)} className={inputClass} placeholder="Street address, landmark, area" />
            </div>
          )}

          <div className="mt-4">
            <label className={labelClass}>Special request (optional)</label>
            <textarea rows={3} value={form.specialRequest} onChange={(e) => updateField('specialRequest', e.target.value)} className={inputClass} placeholder="Any special instructions for the kitchen?" />
          </div>

          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-800" />
              <div>
                <p className="font-bold text-green-950">Prepaid orders only</p>
                <p className="mt-1 text-sm leading-6 text-green-800">
                  Cash on delivery is temporarily unavailable. Send the order on WhatsApp at {WHATSAPP_DISPLAY}; payment details will be shared before cooking starts.
                </p>
              </div>
            </div>
          </div>

          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        </form>

        <aside className="sticky top-28 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-950">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.foodId} className="flex justify-between gap-4 text-sm">
                <span className="text-stone-600">{item.name} x {item.quantity}</span>
                <span className="font-bold text-stone-950">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-stone-200 pt-4">
            <div className="flex justify-between text-lg font-black text-stone-950">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-stone-500">Delivery charge, final payable amount, and prepaid payment link are confirmed on WhatsApp.</p>
          </div>

          <a
            href={whatsAppUrl}
            onClick={validateBeforeWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            id="place-order-btn"
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-green-800"
          >
            <MessageCircle className="h-4 w-4" />
            Send on WhatsApp
          </a>
        </aside>
      </div>
    </div>
  )
}
