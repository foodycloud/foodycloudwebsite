'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from '@/components/store/AddToCartButton'

type Food = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  discountPrice: number | null
  imageUrl: string | null
  isAvailable: boolean
  isVeg: boolean
  isFeatured: boolean
  isPopular: boolean
}

type Category = {
  id: string
  name: string
  slug: string
  foods: Food[]
}

type Props = {
  categories: Category[]
  isOpen: boolean
  closedMessage: string | null
}

export default function MenuClient({ categories, isOpen, closedMessage }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [showPopularOnly, setShowPopularOnly] = useState(false)

  // Filter foods based on active category, search query, and popular toggle
  const filteredCategories = useMemo(() => {
    return categories.map(category => {
      const filteredFoods = category.foods.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (food.description && food.description.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesPopular = showPopularOnly ? food.isPopular : true
        return matchesSearch && matchesPopular
      })
      return { ...category, foods: filteredFoods }
    }).filter(category => {
      if (activeCategory !== 'all' && category.id !== activeCategory) return false
      return category.foods.length > 0
    })
  }, [categories, searchQuery, activeCategory, showPopularOnly])

  const totalFilteredFoods = filteredCategories.reduce((acc, cat) => acc + cat.foods.length, 0)

  return (
    <div className="min-h-screen bg-[#fbf8f1] pt-[72px]">
      {!isOpen && (
        <div className="bg-amber-100 text-amber-900 px-4 py-3 text-center text-sm font-medium border-b border-amber-200">
          {closedMessage || "We are currently closed for orders."}
        </div>
      )}

      {/* Sticky Filter Bar */}
      <div className="sticky top-[72px] z-30 bg-[#fbf8f1]/95 backdrop-blur-xl border-b border-stone-200 shadow-sm py-4">
        <div className="container-page flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-full border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setShowPopularOnly(!showPopularOnly)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                showPopularOnly 
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                  : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
              }`}
            >
              Popular ✨
            </button>
          </div>

          {/* Category Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              All Menu
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        {totalFilteredFoods === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm mb-6 border border-stone-200">
              🔍
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-950 mb-2">No dishes found</h2>
            <p className="text-stone-500 mb-6 max-w-sm">We couldn't find any dishes matching your filters. Try clearing them to see more.</p>
            <button 
              onClick={() => { setSearchQuery(''); setShowPopularOnly(false); setActiveCategory('all'); }}
              className="btn-primary px-6 py-2.5 rounded-full"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {filteredCategories.map(category => (
              <section key={category.id} id={category.slug} className="scroll-mt-40">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-950">
                    {category.name}
                  </h2>
                  <span className="px-3 py-1 bg-stone-200/50 text-stone-600 text-xs font-bold rounded-full">
                    {category.foods.length}
                  </span>
                  <div className="flex-1 h-px bg-stone-200 ml-2"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {category.foods.map(food => (
                    <article 
                      key={food.id}
                      className={`group flex bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all duration-300 ${!food.isAvailable ? 'opacity-60 grayscale-[0.2]' : ''}`}
                    >
                      {/* Image Side */}
                      <div className="relative w-[120px] sm:w-[160px] shrink-0 bg-stone-50">
                        {food.imageUrl ? (
                          <Image
                            src={food.imageUrl}
                            alt={food.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 120px, 160px"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[#fdfaf5] flex flex-col items-center justify-center p-2 text-center select-none">
                            <svg className="w-8 h-8 text-amber-600/30 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[9px] font-bold text-amber-800/40 uppercase tracking-wider">No Image Added</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur p-1 rounded shadow-sm">
                          <div className="w-3 h-3 border border-green-600 rounded-sm flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="flex-1 p-4 flex flex-col">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-bold text-base md:text-lg text-stone-950 leading-tight">
                            {food.name}
                          </h3>
                          {food.isPopular && (
                            <span className="shrink-0 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        
                        {food.description && (
                          <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 mb-4">
                            {food.description}
                          </p>
                        )}
                        
                        <div className="mt-auto flex items-end justify-between pt-2">
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-stone-950">
                              {formatPrice(food.discountPrice || food.price)}
                            </span>
                            {food.discountPrice && (
                              <span className="text-xs text-stone-400 line-through">
                                {formatPrice(food.price)}
                              </span>
                            )}
                          </div>
                          
                          {food.isAvailable ? (
                            <AddToCartButton
                              food={{
                                foodId: food.id,
                                name: food.name,
                                price: food.discountPrice || food.price,
                                imageUrl: food.imageUrl,
                                categoryName: category.name,
                              }}
                            />
                          ) : (
                            <span className="text-sm font-medium text-red-500 px-3 py-1.5 bg-red-50 rounded-lg">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
