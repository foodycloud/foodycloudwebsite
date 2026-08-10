import FoodForm from '@/components/admin/FoodForm'
import { prisma } from '@/lib/prisma'

export default async function NewFoodPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Food</h1>
      <FoodForm categories={categories} />
    </div>
  )
}
