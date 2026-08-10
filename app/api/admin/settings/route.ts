import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { businessSettingsSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let settings = await prisma.businessSettings.findFirst()
    if (!settings) {
      settings = await prisma.businessSettings.create({ data: {} })
    }
    return NextResponse.json({ settings })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = businessSettingsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
    }

    let settings = await prisma.businessSettings.findFirst()
    if (!settings) {
      settings = await prisma.businessSettings.create({ data: {} })
    }

    const updated = await prisma.businessSettings.update({
      where: { id: settings.id },
      data: {
        ...parsed.data,
        deliveryCharge: parsed.data.deliveryCharge.toString(),
        freeDeliveryAbove: parsed.data.freeDeliveryAbove?.toString() ?? null,
        minOrderAmount: parsed.data.minOrderAmount.toString(),
      },
    })

    return NextResponse.json({ settings: updated })
  } catch (error) {
    console.error('PUT /api/admin/settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
