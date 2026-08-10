'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from './AddToCartButton'

interface Food {
  id: string
  name: string
  slug: string
  description: string | null
  price: { toString(): string }
  discountPrice: { toString(): string } | null
  imageUrl: string | null
  isAvailable: boolean
  isVeg: boolean
  isFeatured: boolean
  isPopular: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  foods: Food[]
}

interface MenuClientProps {
  categories: Category[]
  isOpen: boolean
  acceptingOrders: boolean
  closedMessage: string | null
}

export default function MenuClient({ categories, isOpen, acceptingOrders, closedMessage }: MenuClientProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug || '')
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const canOrder = isOpen && acceptingOrders
  const totalItems = categories.reduce((sum, cat) => sum + cat.foods.length, 0)

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase()
    return categories
      .map((cat) => ({
        ...cat,
        foods: cat.foods.filter((food) => {
          const matchesSearch = !query || food.name.toLowerCase().includes(query) || food.description?.toLowerCase().includes(query)
          const matchesPopular = !showPopularOnly || food.isPopular
          return matchesSearch && matchesPopular
        }),
      }))
      .filter((cat) => cat.foods.length > 0 || (!query && !showPopularOnly))
  }, [categories, search, showPopularOnly])

  function scrollToCategory(slug: string) {
    const el = sectionRefs.current[slug]
    if (el) {
      const offset = 158
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setActiveCategory(slug)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveCategory(entry.target.id)
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    )
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [categories])

  return (
    <div>
      {!canOrder && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-900">
          {closedMessage || 'Orders are paused right now. The menu is open for browsing.'}
        </div>
      )}

      <section className="container-page py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_0.25fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Foody Cloud menu</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-stone-950 md:text-5xl">Choose your meal</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
              Search, browse by category, add items to cart, then send the order details on WhatsApp for prepaid confirmation.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">Available now</p>
            <p className="mt-1 font-display text-3xl font-bold text-stone-950">{totalItems}</p>
            <p className="text-sm text-stone-500">pure veg items</p>
          </div>
        </div>
      </section>

      <div className="sticky top-[72px] z-30 border-y border-stone-200 bg-[#fffaf1]/95 backdrop-blur-xl">
        <div className="container-page py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes, ingredients, categories..."
                className="focus-ring h-12 w-full rounded-full border border-stone-200 bg-white pl-11 pr-11 text-sm font-medium text-stone-900 shadow-sm placeholder:text-stone-400"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowPopularOnly((value) => !value)}
              className={`focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition ${
                showPopularOnly ? 'bg-stone-950 text-white' : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Popular
            </button>
          </div>

          <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => scrollToCategory(cat.slug)}
                className={`focus-ring whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeCategory === cat.slug ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page pb-16 pt-4">
        {filteredCategories.map((cat) => (
          <section
            key={cat.slug}
            id={cat.slug}
            ref={(el) => {
              sectionRefs.current[cat.slug] = el
            }}
            className="scroll-mt-44 py-7"
          >
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-stone-200 pb-3">
              <div>
                <h2 className="font-display text-3xl font-bold text-stone-950">{cat.name}</h2>
                <p className="text-sm text-stone-500">{cat.foods.length} items</p>
              </div>
            </div>

            {cat.foods.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-6 text-sm text-stone-500">No active items in this category yet.</p>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {cat.foods.map((food) => (
                  <MenuFoodRow key={food.id} food={food} canOrder={canOrder} categoryName={cat.name} />
                ))}
              </div>
            )}
          </section>
        ))}

        {filteredCategories.length === 0 && (
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="font-display text-3xl font-bold text-stone-950">No dishes found</p>
            <p className="mt-2 text-sm text-stone-500">Try another search or turn off the popular filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MenuFoodRow({ food, canOrder, categoryName }: { food: Food; canOrder: boolean; categoryName: string }) {
  const price = parseFloat(food.price.toString())
  const discountPrice = food.discountPrice ? parseFloat(food.discountPrice.toString()) : null
  const displayPrice = discountPrice ?? price

  return (
    <article className={`group flex min-h-40 gap-4 rounded-2xl border border-stone-200 bg-white p-3 transition hover:border-amber-300 hover:shadow-lg ${!food.isAvailable ? 'opacity-60' : ''}`}>
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-amber-50 sm:h-36 sm:w-40">
        {food.imageUrl ? (
          <Image src={food.imageUrl} alt={food.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs font-bold text-amber-900">Foody Cloud</div>
        )}
        <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-green-800">Veg</div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-start gap-2">
          <h3 className="text-base font-bold leading-snug text-stone-950">{food.name}</h3>
          {food.isPopular && <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-800">Popular</span>}
        </div>
        {food.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">{food.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div>
            <span className="text-lg font-black text-stone-950">{formatPrice(displayPrice)}</span>
            {discountPrice && <span className="ml-2 text-sm text-stone-400 line-through">{formatPrice(price)}</span>}
          </div>
          {canOrder && food.isAvailable ? (
            <AddToCartButton food={{ foodId: food.id, name: food.name, price: displayPrice, imageUrl: food.imageUrl, categoryName }} />
          ) : (
            <span className="text-xs font-semibold text-stone-400">{!food.isAvailable ? 'Unavailable' : 'Closed'}</span>
          )}
        </div>
      </div>
    </article>
  )
}
