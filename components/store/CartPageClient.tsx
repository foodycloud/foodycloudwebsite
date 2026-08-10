'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, X, Minus, Plus, MessageCircle, CheckCircle, Tag, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartPageClient() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart,
    subtotal,
    discountedTotal,
    coupon,
    applyCoupon,
    removeCoupon
  } = useCart()

  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    
    setCouponLoading(true)
    setCouponError('')
    
    try {
      await applyCoupon(couponInput, subtotal)
      setCouponInput('')
    } catch {
      setCouponError('Invalid coupon code or not applicable to current total.')
    } finally {
      setCouponLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fbf8f1] px-4 pt-20">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-stone-200 text-stone-300">
          <ShoppingBag className="w-12 h-12" strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-4xl font-bold text-stone-950 mb-3">Your cart is empty</h1>
        <p className="text-stone-500 mb-8">Discover something delicious from our menu.</p>
        <Link href="/menu" className="btn-primary px-8 py-3.5 rounded-full text-base font-medium shadow-md">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbf8f1] pt-[104px] pb-20">
      <div className="container-page">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          
          {/* Left: Cart Items */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl font-bold text-stone-950">Your Cart</h1>
              <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                {items.length} items
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.foodId} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex items-center gap-4 group transition-all">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-50 shrink-0">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-xl">
                        🍲
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-950 truncate">{item.name}</h3>
                    <p className="text-sm text-stone-500">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-stone-50 rounded-full p-1 border border-stone-200">
                    <button 
                      onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-600 hover:text-amber-600 hover:bg-amber-50 shadow-sm transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-stone-950">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-600 hover:text-amber-600 hover:bg-amber-50 shadow-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right w-24 shrink-0 font-bold text-stone-950 hidden sm:block">
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  <button 
                    onClick={() => removeItem(item.foodId)}
                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                    aria-label="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={clearCart}
                className="text-sm font-medium text-red-500 hover:text-red-600 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="sticky top-28 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col gap-6">
            <h2 className="font-display text-xl font-bold text-stone-950 border-b border-stone-100 pb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              {items.map(item => (
                <div key={item.foodId} className="flex justify-between text-stone-600">
                  <span className="truncate pr-4">{item.quantity}x {item.name}</span>
                  <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-stone-100"></div>

            {/* Coupon Section */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-stone-950 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" /> Have a coupon?
              </h3>
              
              {!coupon.isValid ? (
                <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 rounded-xl border border-stone-300 px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center min-w-[80px]"
                    >
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {(couponError || coupon.message) && !coupon.isValid && (
                    <p className="text-red-500 text-xs">{couponError || coupon.message}</p>
                  )}
                </form>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex flex-col gap-2 relative">
                  <div className="flex items-start gap-2 pr-6">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-800">{coupon.code}</p>
                      <p className="text-xs text-green-600">{coupon.message || 'Coupon applied successfully!'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="h-px bg-stone-100"></div>

            {/* Totals */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              
              {coupon.isValid && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({coupon.code})</span>
                  <span>- {formatPrice(coupon.discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold text-stone-950 pt-2 border-t border-stone-100">
                <span>Total</span>
                <span>{formatPrice(discountedTotal)}</span>
              </div>
              <p className="text-xs text-stone-400 text-center mt-1">
                Delivery charges will be confirmed on WhatsApp.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Link href="/checkout" className="btn-primary w-full py-4 rounded-xl text-center text-base font-bold shadow-md hover:shadow-lg transition-all">
                Proceed to Checkout
              </Link>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium py-2">
                <MessageCircle className="w-4 h-4" />
                Order will be placed via WhatsApp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
