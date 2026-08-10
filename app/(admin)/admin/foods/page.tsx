import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import FoodActions from '@/components/admin/FoodActions'
import Image from 'next/image'

export default async function FoodsPage({ searchParams }: { searchParams: { search?: string; categoryId?: string } }) {
  const { search, categoryId } = searchParams

  const where: Record<string, unknown> = { isDeleted: false }
  if (search) where.name = { contains: search, mode: 'insensitive' }
  if (categoryId) where.categoryId = categoryId

  const [foods, categories] = await Promise.all([
    prisma.food.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu & Food</h1>
        <Link
          href="/admin/foods/new"
          id="add-food-btn"
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          + Add Food
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form method="get" className="flex gap-2 flex-wrap">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search food..."
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <select
            name="categoryId"
            defaultValue={categoryId}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition">
            Filter
          </button>
          <Link href="/admin/foods" className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm">
            Clear
          </Link>
        </form>
      </div>

      {/* Food List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {foods.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No food items found</p>
            <Link href="/admin/foods/new" className="mt-3 inline-block text-amber-600 font-medium text-sm">
              Add your first food item
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Food', 'Category', 'Price', 'Status', 'Featured', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {foods.map(food => (
                <tr key={food.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {food.imageUrl ? (
                        <Image src={food.imageUrl} alt={food.name} width={40} height={40} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">🍲</div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{food.name}</p>
                        {food.description && (
                          <p className="text-xs text-gray-400 truncate max-w-xs">{food.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{food.category.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{formatPrice(food.price.toString())}</span>
                      {food.discountPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(food.discountPrice.toString())}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      food.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {food.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {food.isFeatured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Featured</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <FoodActions foodId={food.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
