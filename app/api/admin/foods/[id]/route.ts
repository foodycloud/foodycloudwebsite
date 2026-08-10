import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { foodSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const food = await prisma.food.findFirst({
      where: { id: params.id, isDeleted: false },
      include: { category: true, variants: true, addOns: true },
    })
    if (!food) return NextResponse.json({ error: 'Food not found' }, { status: 404 })

    return NextResponse.json({ food })
  } catch (error) {
    console.error('GET /api/admin/foods/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch food' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = foodSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    const updateData: Record<string, unknown> = {}

    if (data.name !== undefined) {
      updateData.name = data.name
      const existing = await prisma.food.findFirst({ where: { slug: slugify(data.name), NOT: { id: params.id } } })
      if (!existing) updateData.slug = slugify(data.name)
    }
    if (data.description !== undefined) updateData.description = data.description
    if (data.price !== undefined) updateData.price = data.price.toString()
    if (data.discountPrice !== undefined) updateData.discountPrice = data.discountPrice?.toString() ?? null
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
    if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured
    if (data.isPopular !== undefined) updateData.isPopular = data.isPopular
    if (data.isVeg !== undefined) updateData.isVeg = data.isVeg
    if (data.isJainAvail !== undefined) updateData.isJainAvail = data.isJainAvail
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl

    const food = await prisma.food.update({
      where: { id: params.id },
      data: updateData,
      include: { category: { select: { id: true, name: true } } },
    })

    const { revalidateTag } = await import('next/cache')
    revalidateTag('foods')

    return NextResponse.json({ food })
  } catch (error) {
    console.error('PUT /api/admin/foods/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 })
  }
}

export const PATCH = PUT

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Soft delete — preserve historical order integrity
    await prisma.food.update({
      where: { id: params.id },
      data: { isDeleted: true, isAvailable: false },
    })

    const { revalidateTag } = await import('next/cache')
    revalidateTag('foods')

    return NextResponse.json({ success: true, message: 'Food removed successfully' })
  } catch (error) {
    console.error('DELETE /api/admin/foods/[id] error:', error)
    return NextResponse.json({ error: 'Failed to remove food' }, { status: 500 })
  }
}
