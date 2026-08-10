import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { foodSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const available = searchParams.get('available')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {
      isDeleted: false,
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }
    if (categoryId) {
      where.categoryId = categoryId
    }
    if (available === 'true') where.isAvailable = true
    if (available === 'false') where.isAvailable = false

    const [foods, total] = await Promise.all([
      prisma.food.findMany({
        where,
        include: { category: { select: { id: true, name: true } } },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.food.count({ where }),
    ])

    return NextResponse.json({ foods, total, page, limit })
  } catch (error) {
    console.error('GET /api/admin/foods error:', error)
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = foodSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    let slug = slugify(data.name)

    // Ensure unique slug
    const existing = await prisma.food.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const food = await prisma.food.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price.toString(),
        discountPrice: data.discountPrice?.toString() ?? null,
        categoryId: data.categoryId,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        isPopular: data.isPopular,
        isVeg: data.isVeg,
        isJainAvail: data.isJainAvail,
        sortOrder: data.sortOrder,
        imageUrl: data.imageUrl ?? null,
      },
      include: { category: { select: { id: true, name: true } } },
    })

    const { revalidateTag } = await import('next/cache')
    revalidateTag('foods')

    return NextResponse.json({ food }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/foods error:', error)
    return NextResponse.json({ error: 'Failed to create food' }, { status: 500 })
  }
}
