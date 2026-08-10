import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Update food item imageUrl
    const updatedFood = await prisma.food.update({
      where: { id: params.id },
      data: { imageUrl },
    })

    return NextResponse.json({ success: true, food: updatedFood })
  } catch (error) {
    console.error('PUT /api/admin/foods/[id]/image error:', error)
    return NextResponse.json({ error: 'Failed to update food image' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clear food item imageUrl
    const updatedFood = await prisma.food.update({
      where: { id: params.id },
      data: { imageUrl: null },
    })

    return NextResponse.json({ success: true, food: updatedFood })
  } catch (error) {
    console.error('DELETE /api/admin/foods/[id]/image error:', error)
    return NextResponse.json({ error: 'Failed to clear food image' }, { status: 500 })
  }
}
