import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, subtotal } = body as { code: string; subtotal: number }

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Please enter a coupon code.' }, { status: 400 })
    }

    const now = new Date()

    const offer = await prisma.offer.findFirst({
      where: {
        code: code.trim().toUpperCase(),
        isActive: true,
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        ],
      },
    })

    if (!offer) {
      return NextResponse.json(
        { valid: false, message: 'This coupon code is invalid or has expired.' },
        { status: 200 }
      )
    }

    // Usage limit check
    if (offer.usageLimit !== null && offer.usageCount >= offer.usageLimit) {
      return NextResponse.json(
        { valid: false, message: 'This coupon has reached its usage limit.' },
        { status: 200 }
      )
    }

    // Minimum order check
    const offerMinOrder = offer.minOrderValue ? parseFloat(offer.minOrderValue.toString()) : 0
    if (subtotal < offerMinOrder) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimum order of ₹${offerMinOrder.toFixed(0)} required for this coupon.`,
        },
        { status: 200 }
      )
    }

    // Calculate discount
    let discount = 0
    const offerValue = parseFloat(offer.value.toString())

    if (offer.type === 'PERCENTAGE') {
      discount = (subtotal * offerValue) / 100
      if (offer.maxDiscount) {
        discount = Math.min(discount, parseFloat(offer.maxDiscount.toString()))
      }
    } else if (offer.type === 'FLAT') {
      discount = Math.min(offerValue, subtotal)
    } else if (offer.type === 'FREE_DELIVERY') {
      // Delivery is free — discount value represents max delivery charge waived
      discount = offerValue
    }

    discount = Math.round(discount * 100) / 100

    const message =
      offer.type === 'PERCENTAGE'
        ? `${offerValue}% off applied! You save ₹${discount.toFixed(0)}.`
        : offer.type === 'FREE_DELIVERY'
        ? `Free delivery applied!`
        : `₹${discount.toFixed(0)} discount applied!`

    return NextResponse.json({
      valid: true,
      discount,
      type: offer.type,
      message,
      offerId: offer.id,
      offerTitle: offer.title,
    })
  } catch (error) {
    console.error('Coupon validate error:', error)
    return NextResponse.json(
      { valid: false, message: 'Could not validate coupon. Please try again.' },
      { status: 500 }
    )
  }
}
