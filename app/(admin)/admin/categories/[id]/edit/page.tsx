import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({ where: { id: params.id } })
  if (!category) notFound()
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit: {category.name}</h1>
      <CategoryForm initialData={category} categoryId={category.id} />
    </div>
  )
}
