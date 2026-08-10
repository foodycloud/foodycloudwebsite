'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface CartItem {
  foodId: string
  name: string
  price: number
  imageUrl?: string | null
  quantity: number
  categoryName: string
}

interface CouponState {
  code: string
  discount: number
  type: 'PERCENTAGE' | 'FLAT' | 'FREE_DELIVERY' | null
  message: string
  isValid: boolean
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (foodId: string) => void
  updateQuantity: (foodId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  coupon: CouponState
  applyCoupon: (code: string, subtotal: number) => Promise<void>
  removeCoupon: () => void
  discountedTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const INITIAL_COUPON: CouponState = {
  code: '',
  discount: 0,
  type: null,
  message: '',
  isValid: false,
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [coupon, setCoupon] = useState<CouponState>(INITIAL_COUPON)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('foody-cart')
      if (saved) setItems(JSON.parse(saved))
      const savedCoupon = localStorage.getItem('foody-coupon')
      if (savedCoupon) setCoupon(JSON.parse(savedCoupon))
    } catch {}
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('foody-cart', JSON.stringify(items))
    }
  }, [items, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('foody-coupon', JSON.stringify(coupon))
    }
  }, [coupon, mounted])

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.foodId === newItem.foodId)
      if (existing) {
        return prev.map(i =>
          i.foodId === newItem.foodId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((foodId: string) => {
    setItems(prev => prev.filter(i => i.foodId !== foodId))
  }, [])

  const updateQuantity = useCallback((foodId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.foodId !== foodId))
    } else {
      setItems(prev => prev.map(i => i.foodId === foodId ? { ...i, quantity } : i))
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCoupon(INITIAL_COUPON)
  }, [])

  const applyCoupon = useCallback(async (code: string, subtotal: number) => {
    try {
      const res = await fetch('/api/store/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), subtotal }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setCoupon({
          code: code.trim().toUpperCase(),
          discount: data.discount,
          type: data.type,
          message: data.message,
          isValid: true,
        })
      } else {
        setCoupon({
          ...INITIAL_COUPON,
          code: code.trim().toUpperCase(),
          message: data.message || 'Invalid coupon code',
          isValid: false,
        })
      }
    } catch {
      setCoupon({
        ...INITIAL_COUPON,
        code,
        message: 'Could not validate coupon. Please try again.',
        isValid: false,
      })
    }
  }, [])

  const removeCoupon = useCallback(() => {
    setCoupon(INITIAL_COUPON)
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const discountedTotal = Math.max(0, subtotal - coupon.discount)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, subtotal, coupon, applyCoupon, removeCoupon, discountedTotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
