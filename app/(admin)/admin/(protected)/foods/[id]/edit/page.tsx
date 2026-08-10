import FoodForm from '@/components/admin/FoodForm'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditFoodPage({ params }: { params: { id: string } }) {
  const [food, categories] = await Promise.all([
    prisma.food.findFirst({ where: { id: params.id, isDeleted: false } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ])

  if (!food) notFound()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit: {food.name}</h1>
      <FoodForm
        categories={categories}
        initialData={{
          ...food,
          price: parseFloat(food.price.toString()),
          discountPrice: food.discountPrice ? parseFloat(food.discountPrice.toString()) : null,
        }}
        foodId={food.id}
      />
    </div>
  )
}
