import { prisma } from '@/lib/prisma'
import ImageManagerList from '@/components/admin/ImageManagerList'

export const dynamic = 'force-dynamic'

export default async function AdminImagesPage() {
  const [foods, categories] = await Promise.all([
    prisma.food.findMany({
      where: { isDeleted: false },
      include: { category: true },
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  // Compute overall stats
  const totalItems = foods.length
  const withImages = foods.filter(f => f.imageUrl).length
  const missingImages = totalItems - withImages

  const serializedFoods = foods.map(food => ({
    id: food.id,
    name: food.name,
    slug: food.slug,
    description: food.description,
    price: parseFloat(food.price.toString()),
    discountPrice: food.discountPrice ? parseFloat(food.discountPrice.toString()) : null,
    imageUrl: food.imageUrl,
    categoryId: food.categoryId,
    categoryName: food.category.name,
  }))

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Visual Asset & Image Management</h1>
        <p className="text-gray-500 mt-1">Assign, upload, and validate verified WebP photography mapping for each menu item.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Menu Items</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{totalItems}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 text-xl font-bold">
            🍽️
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified Images</p>
            <p className="text-3xl font-black text-green-600 mt-1">{withImages}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xl font-bold">
            ✅
          </div>
        </div>

        <div className={`bg-white rounded-3xl border p-6 flex items-center justify-between shadow-sm transition-colors ${
          missingImages > 0 ? 'border-red-200 bg-red-50/10' : 'border-gray-100'
        }`}>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Missing Image Assets</p>
            <p className={`text-3xl font-black mt-1 ${missingImages > 0 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
              {missingImages}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
            missingImages > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
          }`}>
            ⚠️
          </div>
        </div>
      </div>

      {/* Main Image Mappings & Controls */}
      <ImageManagerList 
        initialFoods={serializedFoods} 
        categories={categories}
      />
    </div>
  )
}
