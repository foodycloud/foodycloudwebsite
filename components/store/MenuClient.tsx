'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Search, Leaf, X } from 'lucide-react'
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
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const canOrder = isOpen && acceptingOrders

  const filteredCategories = categories.map(cat => ({
    ...cat,
    foods: cat.foods.filter(f =>
      search === '' || f.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.foods.length > 0 || search === '')

  function scrollToCategory(slug: string) {
    const el = sectionRefs.current[slug]
    if (el) {
      const offset = 130
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setActiveCategory(slug)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id)
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [categories])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Closed banner */}
      {!canOrder && (
        <div className="bg-amber-50 border-b border-amber-200 text-center py-3 px-4">
          <p className="text-amber-800 text-sm font-medium">
            🍲 {closedMessage || 'Orders are currently paused. Menu is available to browse.'}
          </p>
        </div>
      )}

      {/* Sticky header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => scrollToCategory(cat.slug)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeCategory === cat.slug
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pure veg badge */}
      <div className="flex items-center gap-2 px-4 pt-5 pb-2">
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
          <Leaf className="w-3.5 h-3.5 text-green-600" />
          <span className="text-green-700 text-xs font-semibold">Pure Veg</span>
        </div>
        <span className="text-xs text-gray-400">All items are 100% vegetarian</span>
      </div>

      {/* Menu sections */}
      <div className="px-4 pb-16">
        {filteredCategories.map(cat => (
          <section
            key={cat.slug}
            id={cat.slug}
            ref={el => { sectionRefs.current[cat.slug] = el }}
            className="mt-8"
          >
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {cat.name}
              <span className="text-sm font-normal text-gray-400 ml-2">({cat.foods.length})</span>
            </h2>

            {cat.foods.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">No items in this category yet.</p>
            ) : (
              <div className="space-y-3">
                {cat.foods.map(food => (
                  <MenuFoodRow key={food.id} food={food} canOrder={canOrder} categoryName={cat.name} />
                ))}
              </div>
            )}
          </section>
        ))}

        {filteredCategories.length === 0 && search && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No dishes found</p>
            <p className="text-sm mt-1">Try a different search term</p>
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
    <div className={`bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3 ${
      !food.isAvailable ? 'opacity-60' : ''
    }`}>
      {/* Veg dot */}
      <div className="mt-0.5 w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center shrink-0">
        <div className="w-2 h-2 bg-green-600 rounded-full" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{food.name}</h3>
          {food.isPopular && (
            <span className="shrink-0 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md">Popular</span>
          )}
        </div>
        {food.description && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{food.description}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm">{formatPrice(displayPrice)}</span>
          {discountPrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(price)}</span>
          )}
        </div>
      </div>

      {/* Image + CTA */}
      <div className="shrink-0 flex flex-col items-center gap-2">
        {food.imageUrl ? (
          <div className="relative w-24 h-20 rounded-xl overflow-hidden">
            <Image src={food.imageUrl} alt={food.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-24 h-20 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">🍲</div>
        )}
        {canOrder && food.isAvailable ? (
          <AddToCartButton
            food={{
              foodId: food.id,
              name: food.name,
              price: displayPrice,
              imageUrl: food.imageUrl,
              categoryName,
            }}
          />
        ) : (
          <span className="text-xs text-gray-400">{!food.isAvailable ? 'Unavailable' : 'Closed'}</span>
        )}
      </div>
    </div>
  )
}
