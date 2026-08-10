import { prisma } from '@/lib/prisma'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from '@/components/store/AddToCartButton'
import { getWhatsAppUrl } from '@/lib/storefront'
import { ArrowRight, Clock, Leaf, MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Foody Cloud - Pure Veg Home Kitchen | Order Online',
  description: 'Homely taste, every time. Fresh homemade vegetarian food in Chinar Park, Kolupukur.',
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
  const canOrder = isOpen && acceptingOrders
  const heroFood = featuredFoods[0] ?? popularFoods[0]

  return (
    <div>
      {!canOrder && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-900">
          {settings?.closedMessage || 'Orders are paused right now. You can still browse the menu.'}
        </div>
      )}

      <section className="container-page grid min-h-[calc(100vh-72px)] gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-14">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-800">
            <Leaf className="h-4 w-4" />
            100% pure vegetarian home kitchen
          </div>
          <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-normal text-stone-950 md:text-7xl">
            Foody Cloud
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">
            Fresh, small-batch vegetarian meals from Chinar Park, built for quick browsing and easy ordering.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/menu"
              id="hero-order-btn"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-amber-700"
            >
              Browse menu
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-stone-950 transition hover:border-green-700 hover:text-green-800"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <Proof icon={<Clock className="h-4 w-4" />} label="Lunch 12 PM" />
            <Proof icon={<Truck className="h-4 w-4" />} label="Delivery available" />
            <Proof icon={<ShieldCheck className="h-4 w-4" />} label="FSSAI listed" />
          </div>
        </div>

        <div className="relative">
          <div className="soft-shadow overflow-hidden rounded-[2rem] border border-white bg-stone-950">
            <div className="relative aspect-[4/3] bg-stone-900">
              {heroFood?.imageUrl ? (
                <Image src={heroFood.imageUrl} alt={heroFood.name} fill priority className="object-cover opacity-95" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#2b2118,#8a5c27)] p-10 text-center text-2xl font-bold text-white">
                  Fresh vegetarian meals, cooked daily
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              {heroFood && (
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-white/92 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">Today&apos;s pick</p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-stone-950">{heroFood.name}</h2>
                      <p className="text-sm text-stone-500">{heroFood.category.name}</p>
                    </div>
                    <span className="text-lg font-black text-stone-950">{formatPrice(heroFood.discountPrice?.toString() ?? heroFood.price.toString())}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-5 -left-4 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-stone-200 md:block">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Categories</p>
            <p className="mt-1 font-display text-3xl font-bold text-stone-950">{categories.length}</p>
          </div>
        </div>
      </section>

      <section id="categories" className="border-y border-stone-200 bg-white/60">
        <div className="container-page py-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Explore</p>
              <h2 className="font-display text-3xl font-bold text-stone-950">Browse by category</h2>
            </div>
            <Link href="/menu" className="hidden text-sm font-bold text-stone-700 hover:text-amber-700 sm:inline-flex">Full menu</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/menu#${cat.slug}`}
                className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="font-display text-xl font-bold text-stone-950 group-hover:text-amber-800">{cat.name}</p>
                <p className="mt-1 text-sm text-stone-500">{cat._count.foods} available items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredFoods.length > 0 && (
        <FoodSection title="House favourites" hrefLabel="See all" foods={featuredFoods} canOrder={canOrder} />
      )}

      {popularFoods.length > 0 && (
        <FoodSection title="Popular choices" hrefLabel="Full menu" foods={popularFoods} canOrder={canOrder} compact />
      )}
    </div>
  )
}

function Proof({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white/70 px-4 py-3 text-sm font-bold text-stone-700">
      <span className="text-amber-700">{icon}</span>
      {label}
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

function FoodSection({ title, hrefLabel, foods, canOrder, compact = false }: { title: string; hrefLabel: string; foods: Food[]; canOrder: boolean; compact?: boolean }) {
  return (
    <section className="container-page py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-bold text-stone-950">{title}</h2>
        <Link href="/menu" className="text-sm font-bold text-amber-700 hover:text-stone-950">{hrefLabel}</Link>
      </div>
      <div className={`grid gap-4 ${compact ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} acceptingOrders={canOrder} />
        ))}
      </div>
    </section>
  )
}

function FoodCard({ food, acceptingOrders }: { food: Food; acceptingOrders: boolean }) {
  const price = parseFloat(food.price.toString())
  const discountPrice = food.discountPrice ? parseFloat(food.discountPrice.toString()) : null
  const displayPrice = discountPrice ?? price

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative aspect-[5/3] bg-stone-100">
        {food.imageUrl ? (
          <Image src={food.imageUrl} alt={food.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-amber-50 text-sm font-bold text-amber-900">Foody Cloud</div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-green-800 shadow-sm">Pure veg</div>
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{food.category.name}</p>
        <h3 className="mt-1 min-h-11 text-base font-bold leading-snug text-stone-950">{food.name}</h3>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-lg font-black text-stone-950">{formatPrice(displayPrice)}</span>
            {discountPrice && <span className="ml-2 text-sm text-stone-400 line-through">{formatPrice(price)}</span>}
          </div>
          {acceptingOrders && food.isAvailable ? (
            <AddToCartButton food={{ foodId: food.id, name: food.name, price: displayPrice, imageUrl: food.imageUrl, categoryName: food.category.name }} />
          ) : (
            <span className="text-xs font-semibold text-stone-400">{food.isAvailable ? 'Closed' : 'Unavailable'}</span>
          )}
        </div>
      </div>
    </article>
  )
}
