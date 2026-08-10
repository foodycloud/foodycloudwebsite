import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from '@/components/store/AddToCartButton'
import { Leaf, Clock, Truck, Star } from 'lucide-react'

export const revalidate = 60

export const metadata = {
  title: 'Foody Cloud — Pure Veg Home Kitchen | Order Online',
  description: 'Homely Taste, Every Time. Fresh homemade vegetarian food in Chinar Park, Kolupukur. Lunch from 12PM, Dinner from 6PM.',
}

export default async function HomePage() {
  const [settings, categories, featuredFoods, popularFoods] = await Promise.all([
    prisma.businessSettings.findFirst(),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { foods: { where: { isDeleted: false, isAvailable: true } } } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.food.findMany({
      where: { isFeatured: true, isDeleted: false, isAvailable: true },
      include: { category: { select: { name: true } } },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    }),
    prisma.food.findMany({
      where: { isPopular: true, isDeleted: false, isAvailable: true },
      include: { category: { select: { name: true } } },
      orderBy: { sortOrder: 'asc' },
      take: 8,
    }),
  ])

  const isOpen = settings?.isOpen ?? true
  const acceptingOrders = settings?.acceptingOrders ?? true

  return (
    <div>
      {/* Kitchen Closed Banner */}
      {(!isOpen || !acceptingOrders) && (
        <div className="bg-amber-50 border-b border-amber-200 text-center py-3 px-4">
          <p className="text-amber-800 text-sm font-medium">
            🍲 {settings?.closedMessage || 'We are currently closed. Please check back later.'}
          </p>
        </div>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <Leaf className="w-4 h-4 text-green-400" />
              <span>100% Pure Vegetarian</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
              Homely Taste,<br />
              <span className="text-amber-400">Every Time</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Freshly cooked. Purely homemade. Made with love.<br />
              <span className="text-gray-400 text-base">Chinar Park, Kolupukur</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/menu"
                id="hero-order-btn"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3.5 rounded-xl transition text-sm"
              >
                Order Now
              </Link>
              <a
                href="https://wa.me/919007182421"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition text-sm"
              >
                WhatsApp Us
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Lunch 12PM • Dinner 6PM</div>
              <div className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> Home Delivery Available</div>
            </div>
          </div>

          {/* Hero visual — categories badge grid */}
          <div className="hidden md:grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map(cat => (
              <Link
                key={cat.id}
                href={`/menu#${cat.slug}`}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-5 transition group"
              >
                <p className="font-display font-semibold text-white group-hover:text-amber-300 transition">{cat.name}</p>
                <p className="text-gray-400 text-sm mt-1">{cat._count.foods} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section id="categories" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="flex gap-3 flex-wrap">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/menu#${cat.slug}`}
              className="bg-white border border-gray-200 hover:border-amber-400 hover:bg-amber-50 rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-amber-700 transition"
            >
              {cat.name}
              <span className="text-gray-400 ml-1.5">({cat._count.foods})</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Foods */}
      {featuredFoods.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-gray-900">Must Try</h2>
            <Link href="/menu" className="text-sm text-amber-600 font-medium hover:text-amber-700">See all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredFoods.map(food => (
              <FoodCard key={food.id} food={food} acceptingOrders={acceptingOrders && isOpen} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Foods */}
      {popularFoods.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-gray-900">Popular Choices</h2>
            <Link href="/menu" className="text-sm text-amber-600 font-medium hover:text-amber-700">Full menu →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularFoods.map(food => (
              <FoodCard key={food.id} food={food} acceptingOrders={acceptingOrders && isOpen} />
            ))}
          </div>
        </section>
      )}

      {/* Info strip */}
      <section className="bg-amber-950 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🌿', title: 'Fresh Ingredients', desc: 'Sourced fresh daily' },
            { icon: '❤️', title: 'Cooked with Love', desc: 'Homestyle preparation' },
            { icon: '🧹', title: 'Hygienic Kitchen', desc: 'FSSAI certified' },
            { icon: '🏠', title: 'Homely Taste', desc: 'Every single time' },
          ].map(item => (
            <div key={item.title}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

interface Food {
  id: string
  name: string
  slug: string
  price: { toString(): string }
  discountPrice: { toString(): string } | null
  imageUrl: string | null
  isAvailable: boolean
  isVeg: boolean
  category: { name: string }
}

function FoodCard({ food, acceptingOrders }: { food: Food; acceptingOrders: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition group">
      <div className="relative h-44 bg-gray-100">
        {food.imageUrl ? (
          <Image src={food.imageUrl} alt={food.name} fill className="object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-amber-50">🍲</div>
        )}
        {/* Veg indicator */}
        <div className="absolute top-2 left-2 w-5 h-5 border-2 border-green-600 rounded-sm bg-white flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{food.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{food.category.name}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-gray-900">{formatPrice(food.price.toString())}</span>
            {food.discountPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">{formatPrice(food.discountPrice.toString())}</span>
            )}
          </div>
          {acceptingOrders && food.isAvailable ? (
            <AddToCartButton
              food={{
                foodId: food.id,
                name: food.name,
                price: parseFloat(food.discountPrice?.toString() ?? food.price.toString()),
                imageUrl: food.imageUrl,
                categoryName: food.category.name,
              }}
            />
          ) : (
            <span className="text-xs text-gray-400">{food.isAvailable ? 'Currently closed' : 'Unavailable'}</span>
          )}
        </div>
      </div>
    </div>
  )
}
