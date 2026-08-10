import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CategoryActions from '@/components/admin/CategoryActions'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { foods: { where: { isDeleted: false } } } } },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Link href="/admin/categories/new" className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
          + Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No categories yet</p>
            <Link href="/admin/categories/new" className="mt-2 inline-block text-amber-600 text-sm font-medium">Add your first category</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Category', 'Items', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{cat.name}</p>
                    {cat.description && <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cat._count.foods} items</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <CategoryActions categoryId={cat.id} categoryName={cat.name} foodCount={cat._count.foods} />
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
