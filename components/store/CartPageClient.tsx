'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartPageClient() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some delicious food from our menu!</p>
        <Link href="/menu" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-xl transition">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Your Cart ({totalItems} items)</h1>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.foodId} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="w-15 h-15 rounded-lg object-cover" />
            ) : (
              <div className="w-15 h-15 bg-amber-50 rounded-lg flex items-center justify-center text-xl">🍲</div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">{item.categoryName}</p>
              <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                  className="px-2.5 py-2 hover:bg-gray-200 transition"
                  aria-label="Decrease"
                >
                  <Minus className="w-3 h-3 text-gray-600" />
                </button>
                <span className="px-3 text-sm font-semibold text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                  className="px-2.5 py-2 hover:bg-gray-200 transition"
                  aria-label="Increase"
                >
                  <Plus className="w-3 h-3 text-gray-600" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.foodId)}
                className="p-2 text-gray-400 hover:text-red-500 transition"
                aria-label="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>Delivery</span><span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-3">
          <span>Total</span><span>{formatPrice(subtotal)}</span>
        </div>
      </div>

      <button
        onClick={() => router.push('/checkout')}
        id="proceed-checkout-btn"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl transition text-base"
      >
        Proceed to Checkout →
      </button>

      <Link href="/menu" className="block text-center text-sm text-amber-600 hover:text-amber-700 mt-4">
        ← Continue Shopping
      </Link>
    </div>
  )
}
