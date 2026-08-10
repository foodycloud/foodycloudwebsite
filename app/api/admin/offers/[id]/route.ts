import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { offerSchema } from '@/lib/validations'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = offerSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.code !== undefined) updateData.code = data.code
    if (data.type !== undefined) updateData.type = data.type
    if (data.value !== undefined) updateData.value = data.value.toString()
    if (data.minOrderValue !== undefined) updateData.minOrderValue = data.minOrderValue?.toString() ?? null
    if (data.maxDiscount !== undefined) updateData.maxDiscount = data.maxDiscount?.toString() ?? null
    if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.startsAt !== undefined) updateData.startsAt = data.startsAt ? new Date(data.startsAt) : null
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null

    const offer = await prisma.offer.update({ where: { id: params.id }, data: updateData })
    return NextResponse.json({ offer })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.offer.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 })
  }
}
