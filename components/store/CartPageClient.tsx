'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartPageClient() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center py-16 text-center">
        <div className="max-w-md">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-white text-stone-300 shadow-sm">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="font-display text-4xl font-bold text-stone-950">Your cart is empty</h1>
          <p className="mt-3 text-stone-500">Add your favourites from the menu and come back here to review everything.</p>
          <Link href="/menu" className="focus-ring mt-8 inline-flex rounded-full bg-stone-950 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-amber-700">
            Browse menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8 md:py-12">
      <Link href="/menu" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition hover:text-amber-700">
        <ArrowLeft className="h-4 w-4" />
        Continue browsing
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <section>
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Review</p>
            <h1 className="font-display text-4xl font-bold text-stone-950">Your cart</h1>
            <p className="mt-2 text-sm text-stone-500">{totalItems} item{totalItems === 1 ? '' : 's'} selected</p>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.foodId} className="grid grid-cols-[72px_1fr] gap-4 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-[84px_1fr_auto] sm:items-center">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} width={84} height={84} className="h-[72px] w-[72px] rounded-xl object-cover sm:h-[84px] sm:w-[84px]" />
                ) : (
                  <div className="grid h-[72px] w-[72px] place-items-center rounded-xl bg-amber-50 text-xs font-bold text-amber-900 sm:h-[84px] sm:w-[84px]">FC</div>
                )}

                <div className="min-w-0">
                  <p className="font-bold leading-snug text-stone-950">{item.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">{item.categoryName}</p>
                  <p className="mt-2 text-sm font-black text-stone-950">{formatPrice(item.price)}</p>
                </div>

                <div className="col-span-2 flex items-center justify-between gap-3 border-t border-stone-100 pt-3 sm:col-span-1 sm:border-t-0 sm:pt-0">
                  <div className="flex h-10 items-center overflow-hidden rounded-full bg-stone-100">
                    <button onClick={() => updateQuantity(item.foodId, item.quantity - 1)} className="grid h-10 w-10 place-items-center hover:bg-stone-200" aria-label="Decrease">
                      <Minus className="h-4 w-4 text-stone-700" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-black text-stone-950">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.foodId, item.quantity + 1)} className="grid h-10 w-10 place-items-center hover:bg-stone-200" aria-label="Increase">
                      <Plus className="h-4 w-4 text-stone-700" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.foodId)} className="grid h-10 w-10 place-items-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-600" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="sticky top-28 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-950">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-bold text-stone-950">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery</span>
              <span>Confirmed on WhatsApp</span>
            </div>
            <div className="border-t border-stone-200 pt-4">
              <div className="flex justify-between text-lg font-black text-stone-950">
                <span>Payable</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-500">Prepaid payment will be shared manually until Razorpay checkout is enabled.</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            id="proceed-checkout-btn"
            className="focus-ring mt-6 w-full rounded-full bg-stone-950 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-amber-700"
          >
            Continue
          </button>
        </aside>
      </div>
    </div>
  )
}
