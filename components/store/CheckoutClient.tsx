'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Phone, Mail, MapPin, MessageSquare, AlertCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { buildOrderWhatsAppMessage, getWhatsAppUrl } from '@/lib/storefront'

export default function CheckoutClient() {
  const router = useRouter()
  const { items, subtotal, discountedTotal, coupon, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryType: 'DELIVERY' as 'DELIVERY' | 'PICKUP',
    address: '',
    specialRequest: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.push('/cart')
    }
  }, [items.length, router, isSubmitting])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit phone number'
    }
    if (formData.deliveryType === 'DELIVERY' && !formData.address.trim()) {
      newErrors.address = 'Delivery address is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    
    // Prepare data for WhatsApp message
    const orderData = {
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: subtotal,
      customerName: formData.name,
      customerPhone: formData.phone,
      deliveryType: formData.deliveryType,
      address: formData.address || undefined,
      specialRequest: formData.specialRequest || undefined,
      couponCode: coupon?.code,
      couponDiscount: coupon?.discount
    }

    const message = buildOrderWhatsAppMessage(orderData)
    const url = getWhatsAppUrl('919007182421', message)

    // Clear cart and redirect
    clearCart()
    window.location.href = url
  }

  if (items.length === 0 && !isSubmitting) return null

  return (
    <div className="min-h-screen bg-[#fbf8f1] pt-[104px] pb-20">
      <div className="container-page max-w-4xl">
        <Link href="/cart" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-950 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
          
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <h1 className="font-display text-2xl font-bold text-stone-950 mb-6 border-b border-stone-100 pb-4">
              Checkout Details
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Delivery Type */}
              <div className="flex gap-4 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'DELIVERY' }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    formData.deliveryType === 'DELIVERY' 
                      ? 'bg-white text-stone-950 shadow-sm' 
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'PICKUP' }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    formData.deliveryType === 'PICKUP' 
                      ? 'bg-white text-stone-950 shadow-sm' 
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Store Pickup
                </button>
              </div>

              {/* Personal Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" /> Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`input-base ${errors.name ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</span>}
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-500" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`input-base ${errors.phone ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                    placeholder="9876543210"
                  />
                  {errors.phone && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</span>}
                </div>
              </div>

              {/* Address (conditional) */}
              {formData.deliveryType === 'DELIVERY' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" /> Delivery Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className={`input-base min-h-[80px] resize-none ${errors.address ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                    placeholder="Complete address with landmark"
                  />
                  {errors.address && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</span>}
                </div>
              )}

              {/* Special Request */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" /> Special Instructions
                </label>
                <textarea
                  value={formData.specialRequest}
                  onChange={e => setFormData(prev => ({ ...prev, specialRequest: e.target.value }))}
                  className="input-base min-h-[80px] resize-none"
                  placeholder="E.g. Less spicy, extra plates, etc. (Optional)"
                />
              </div>
            </form>
          </div>

          {/* Right Summary */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm sticky top-28">
            <h2 className="font-display text-xl font-bold text-stone-950 mb-4">
              Your Order
            </h2>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 mb-4 scrollbar-hide flex flex-col gap-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-stone-600 truncate pr-2">
                    <span className="font-bold text-stone-900">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="font-medium text-stone-900 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-stone-100 mb-4"></div>

            <div className="flex flex-col gap-2 mb-6 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {coupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({coupon.code})</span>
                  <span>- {formatPrice(coupon.discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold text-stone-950 pt-2 mt-1 border-t border-stone-100">
                <span>Total</span>
                <span>{formatPrice(discountedTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              <MessageSquare className="w-5 h-5" />
              {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
            </button>
            <p className="text-xs text-stone-400 text-center mt-3">
              You will be redirected to WhatsApp to confirm and place your order.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
