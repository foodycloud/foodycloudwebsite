import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = categorySchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
    }

    const updateData: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.name) {
      updateData.slug = slugify(parsed.data.name)
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('PUT /api/admin/categories/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const foodCount = await prisma.food.count({
      where: { categoryId: params.id, isDeleted: false },
    })

    if (foodCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: this category has ${foodCount} active food item(s). Move or remove those first.` },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/categories/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
