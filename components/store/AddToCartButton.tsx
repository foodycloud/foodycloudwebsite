'use client'

import { useCart, type CartItem } from '@/context/CartContext'
import { Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  food: Omit<CartItem, 'quantity'>
}

export default function AddToCartButton({ food }: Props) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find(i => i.foodId === food.foodId)
  const qty = cartItem?.quantity || 0

  function handleAdd() {
    addItem(food)
    if (qty === 0) toast.success(`${food.name} added to cart`, { duration: 1500 })
  }

  if (qty === 0) {
    return (
      <button
        onClick={handleAdd}
        id={`add-${food.foodId}`}
        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition"
      >
        ADD
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1 bg-amber-600 rounded-lg overflow-hidden">
      <button
        onClick={() => updateQuantity(food.foodId, qty - 1)}
        className="text-white px-2 py-1.5 hover:bg-amber-700 transition"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="text-white text-xs font-bold px-1 min-w-[20px] text-center">{qty}</span>
      <button
        onClick={handleAdd}
        className="text-white px-2 py-1.5 hover:bg-amber-700 transition"
        aria-label="Increase quantity"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  )
}
