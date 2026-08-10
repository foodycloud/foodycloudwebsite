import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 60 // revalidate every 60 seconds

export async function GET() {
  try {
    const [categories, settings] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          foods: {
            where: { isDeleted: false },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.businessSettings.findFirst(),
    ])

    return NextResponse.json({ categories, settings })
  } catch (error) {
    console.error('GET /api/store/menu error:', error)
    return NextResponse.json({ error: 'Failed to load menu' }, { status: 500 })
  }
}
