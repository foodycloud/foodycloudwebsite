import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { offerSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ offers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = offerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
    }

    const offer = await prisma.offer.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        code: parsed.data.code ?? null,
        type: parsed.data.type,
        value: parsed.data.value.toString(),
        minOrderValue: parsed.data.minOrderValue?.toString() ?? null,
        maxDiscount: parsed.data.maxDiscount?.toString() ?? null,
        usageLimit: parsed.data.usageLimit ?? null,
        isActive: parsed.data.isActive,
        startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
    })

    return NextResponse.json({ offer }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/offers error:', error)
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 })
  }
}
