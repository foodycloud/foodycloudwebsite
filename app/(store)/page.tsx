import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from '@/components/store/AddToCartButton'
import { MessageCircle } from 'lucide-react'
import {
  getCachedBusinessSettings,
  getCachedCategories,
  getCachedFeaturedFoods,
  getCachedPopularFoods
} from '@/lib/db-cache'

function FoodCard({ food, categoryName }: { food: any, categoryName: string }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white card-hover flex flex-col h-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {food.imageUrl ? (
          <Image
            src={food.imageUrl}
            alt={food.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#fdfaf5] flex flex-col items-center justify-center p-6 text-center select-none">
            <svg className="w-12 h-12 text-amber-600/35 mb-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold text-amber-800/40 uppercase tracking-wider">No Image Added</span>
          </div>
        )}
        
        {/* Veg Badge Overlay */}
        <div className="absolute top-3 left-3 bg-white p-1 rounded-sm shadow-sm border border-stone-200">
          <div className="w-3 h-3 border border-green-600 rounded-sm flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
          </div>
        </div>

        {/* Popular Badge */}
        {food.isPopular && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
            Popular
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs uppercase tracking-wider text-stone-500 font-medium mb-1">
          {categoryName}
        </span>
        <h3 className="text-base font-bold text-stone-950 mb-1">{food.name}</h3>
        {food.description && (
          <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-grow">
            {food.description}
          </p>
        )}
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-stone-950">
                {formatPrice(food.discountPrice || food.price)}
              </span>
              {food.discountPrice && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(food.price)}
                </span>
              )}
            </div>
          </div>
          <AddToCartButton food={food} />
        </div>
      </div>
    </article>
  )
}

export default async function HomePage() {
  const [settings, categories, featuredFoods, popularFoods] = await Promise.all([
    getCachedBusinessSettings(),
    getCachedCategories(),
    getCachedFeaturedFoods(),
    getCachedPopularFoods(),
  ])
  const canOrder = settings?.isAcceptingOrders ?? true

  const heroImageFood = featuredFoods.find(f => f.imageUrl)

  return (
    <main className="min-h-screen bg-[#fbf8f1] pt-[72px]">
      {/* Hero Section */}
      <section className="container-page min-h-[calc(100vh-72px)] py-12 md:py-20 flex items-center">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-8 items-center w-full">
          {/* Left Content */}
          <div className="flex flex-col items-start max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${canOrder ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${canOrder ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                </span>
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                  {canOrder ? 'Open Now' : 'Currently Closed'}
                </span>
              </div>
              <div className="bg-green-100 text-green-800 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">
                100% Pure Veg
              </div>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-stone-950 leading-[1.1] mb-6">
              Foody Cloud
            </h1>
            <h2 className="text-xl md:text-2xl text-stone-500 font-medium mb-6">
              Homely Taste, Every Time
            </h2>
            <p className="text-base md:text-lg text-stone-600 mb-10 max-w-lg leading-relaxed">
              Experience the warmth of home-cooked vegetarian meals, crafted with love and premium ingredients. Delivered fresh to your doorstep in Kolkata.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link href="/menu" className="btn-primary px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Browse Menu
              </Link>
              <a href="https://wa.me/919007182421" target="_blank" rel="noopener noreferrer" className="btn-green px-8 py-4 rounded-full text-lg flex items-center gap-2 shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <MessageCircle className="w-5 h-5" />
                Order on WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium text-stone-600">
              <div className="flex items-center gap-2"><span className="text-xl">📋</span> FSSAI Listed</div>
              <div className="flex items-center gap-2"><span className="text-xl">🌿</span> 100% Veg</div>
              <div className="flex items-center gap-2"><span className="text-xl">❤️</span> Made with Love</div>
              <div className="flex items-center gap-2"><span className="text-xl">🛵</span> Fast Delivery</div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block h-full min-h-[500px]">
            {heroImageFood ? (
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={heroImageFood.imageUrl!}
                  alt={heroImageFood.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="food-overlay absolute inset-0"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 inline-block">
                    <span className="text-amber-200 text-sm font-bold uppercase tracking-wider mb-1 block">Featured</span>
                    <h3 className="font-display text-2xl font-bold mb-2">{heroImageFood.name}</h3>
                    <p className="text-xl font-medium">{formatPrice(heroImageFood.discountPrice || heroImageFood.price)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-[500px] rounded-3xl bg-gradient-to-br from-amber-900 to-amber-600 shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                <h2 className="font-display text-5xl font-bold text-white/90 text-center px-8 z-10 drop-shadow-lg">
                  Homely Taste,<br/>Every Time
                </h2>
              </div>
            )}
            
            <div className="absolute -left-8 top-12 bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex items-center gap-4 animate-fade-in-up delay-300">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl font-bold">
                {categories.length}
              </div>
              <div>
                <p className="text-sm text-stone-500 font-medium">Explore</p>
                <p className="text-stone-950 font-bold">Delicious Categories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-20 bg-white">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-stone-950 mb-10 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <Link 
                key={cat.id} 
                href={`/menu#${cat.slug}`}
                className={`group bg-[#fbf8f1] rounded-2xl p-6 border border-stone-200 card-hover flex flex-col items-center text-center animate-fade-in-up`}
                style={{ animationDelay: `${(i % 4) * 75}ms` }}
              >
                <h3 className="font-display text-xl font-bold text-stone-950 mb-2 group-hover:text-amber-700 transition-colors">
                  {cat.name}
                </h3>
                <span className="bg-white border border-stone-200 px-3 py-1 rounded-full text-xs font-medium text-stone-600 mb-4">
                  {cat._count.foods} items
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* House Favourites */}
      {featuredFoods.length > 0 && (
        <section className="py-20 bg-[#fbf8f1]">
          <div className="container-page">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-950">House Favourites</h2>
              <Link href="/menu" className="text-amber-700 font-medium hover:text-amber-800 flex items-center gap-1">
                See all <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredFoods.map(food => (
                <FoodCard key={food.id} food={food} categoryName={food.category.name} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Choices */}
      {popularFoods.length > 0 && (
        <section className="py-20 bg-white border-t border-stone-200">
          <div className="container-page">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-950">Popular Choices</h2>
              <Link href="/menu" className="text-amber-700 font-medium hover:text-amber-800 flex items-center gap-1">
                Full menu <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularFoods.map(food => (
                <FoodCard key={food.id} food={food} categoryName={food.category.name} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Foody Cloud */}
      <section className="py-24 bg-stone-950 text-white text-center md:text-left">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Why Choose Us?</h2>
            <p className="text-stone-400 text-lg">We bring the authentic taste of home right to your dining table.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mb-6">🌿</div>
              <h3 className="text-xl font-bold mb-3">100% Pure Vegetarian</h3>
              <p className="text-stone-400">FSSAI licensed kitchen with strictly no meat or eggs. Pure, clean, and hygienic.</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mb-6">🏠</div>
              <h3 className="text-xl font-bold mb-3">Home Kitchen</h3>
              <p className="text-stone-400">Prepared in small batches daily to ensure freshness and that homely touch.</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mb-6">❤️</div>
              <h3 className="text-xl font-bold mb-3">Made with Love</h3>
              <p className="text-stone-400">Authentic recipes passed down through generations, cooked with utmost care.</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center text-3xl mb-6">📞</div>
              <h3 className="text-xl font-bold mb-3">Easy WhatsApp Order</h3>
              <p className="text-stone-400">No complex apps required. Just send a message and we'll handle the rest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919007182421"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform group"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-stone-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Order on WhatsApp
        </span>
      </a>
    </main>
  )
}
