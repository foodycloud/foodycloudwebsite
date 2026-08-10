import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Plus, Search, UtensilsCrossed } from 'lucide-react';
import FoodActions from '@/components/admin/FoodActions';

interface Props {
  searchParams: {
    q?: string;
    category?: string;
  };
}

export default async function FoodsPage({ searchParams }: Props) {
  const query = searchParams.q || '';
  const categoryId = searchParams.category || '';

  const where: any = { isDeleted: false };
  if (query) {
    where.name = { contains: query, mode: 'insensitive' };
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const [foods, categories] = await Promise.all([
    prisma.food.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Menu & Food</h1>
          <p className="text-gray-500 mt-1">Manage your restaurant offerings ({foods.length} items)</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <form className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search foods..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {categoryId && <input type="hidden" name="category" value={categoryId} />}
          </form>
          <Link
            href="/admin/foods/new"
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full transition-colors flex items-center justify-center whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Food
          </Link>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/foods${query ? `?q=${query}` : ''}`}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            !categoryId 
              ? 'bg-stone-900 text-white' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Items
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/foods?category=${cat.id}${query ? `&q=${query}` : ''}`}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              categoryId === cat.id
                ? 'bg-stone-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {foods.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center mt-8">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No food items found</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            {query || categoryId ? "We couldn't find anything matching your filters." : "You haven't added any food items to your menu yet."}
          </p>
          <Link
            href="/admin/foods/new"
            className="px-6 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-colors"
          >
            Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {foods.map((food) => (
            <div key={food.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group">
              {/* Photo Area */}
              <div className="relative aspect-square sm:aspect-[4/3] bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center overflow-hidden">
                {food.imageUrl ? (
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-amber-700/50 font-bold text-xl px-4 text-center">{food.name}</span>
                )}
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {food.isVeg && (
                    <div className="bg-white p-1 rounded shadow-sm border border-green-600">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                  {food.isPopular && (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Popular
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 line-clamp-1">
                  {food.category?.name}
                </p>
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2" title={food.name}>
                  {food.name}
                </h3>
                
                <div className="mt-auto pt-2 space-y-3">
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-black text-gray-900">
                      {formatPrice(food.discountPrice || food.price)}
                    </span>
                    {food.discountPrice && (
                      <span className="text-sm font-medium text-gray-400 line-through pb-0.5">
                        {formatPrice(food.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pb-2">
                    {food.isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Link
                      href={`/admin/foods/${food.id}/edit`}
                      className="flex-1 py-2 text-center border-2 border-amber-500 text-amber-700 font-bold text-sm rounded-xl hover:bg-amber-50 transition-colors"
                    >
                      Edit
                    </Link>
                    <div className="flex-1">
                      <FoodActions foodId={food.id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
