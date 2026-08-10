'use client'

import { useCart, type CartItem } from '@/context/CartContext'
import { Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  food: Omit<CartItem, 'quantity'>
}

export default function AddToCartButton({ food }: Props) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find((i) => i.foodId === food.foodId)
  const qty = cartItem?.quantity || 0

  function handleAdd() {
    addItem(food)
    if (qty === 0) toast.success(`${food.name} added`, { duration: 1400 })
  }

  if (qty === 0) {
    return (
      <button
        onClick={handleAdd}
        id={`add-${food.foodId}`}
        className="focus-ring min-h-9 rounded-full bg-stone-950 px-5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-amber-700"
      >
        Add
      </button>
    )
  }

  return (
    <div className="flex h-9 items-center overflow-hidden rounded-full bg-stone-950 text-white shadow-sm">
      <button
        onClick={() => updateQuantity(food.foodId, qty - 1)}
        className="grid h-9 w-9 place-items-center transition hover:bg-stone-800"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-7 text-center text-sm font-black">{qty}</span>
      <button
        onClick={handleAdd}
        className="grid h-9 w-9 place-items-center transition hover:bg-stone-800"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
