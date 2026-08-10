import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkoutSchema } from '@/lib/validations'
import { z } from 'zod'

const placeOrderSchema = z.object({
  customer: checkoutSchema,
  items: z.array(z.object({
    foodId: z.string(),
    quantity: z.number().int().positive(),
    variantName: z.string().optional(),
  })).min(1, 'Cart cannot be empty'),
  offerCode: z.string().optional(),
})

function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 9000) + 1000
  return `FC${year}${month}${day}${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = placeOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid order data', details: parsed.error.flatten() }, { status: 400 })
    }

    const { customer: customerData, items, offerCode } = parsed.data

    // Fetch settings
    const settings = await prisma.businessSettings.findFirst()
    if (!settings?.acceptingOrders) {
      return NextResponse.json({ error: 'We are not accepting orders at the moment. Please try again later.' }, { status: 400 })
    }

    // Validate all food items exist and are available
    const foodIds = items.map(i => i.foodId)
    const foods = await prisma.food.findMany({
      where: { id: { in: foodIds }, isDeleted: false, isAvailable: true },
      include: { category: { select: { name: true } } },
    })

    if (foods.length !== foodIds.length) {
      return NextResponse.json({ error: 'One or more items in your cart are no longer available.' }, { status: 400 })
    }

    const foodMap = new Map(foods.map(f => [f.id, f]))

    // Build order items with snapshots
    const orderItemsData = items.map(item => {
      const food = foodMap.get(item.foodId)!
      const unitPrice = parseFloat(food.discountPrice?.toString() ?? food.price.toString())
      const totalPrice = unitPrice * item.quantity
      return {
        foodId: food.id,
        foodName: food.name,
        foodImageUrl: food.imageUrl,
        categoryName: food.category.name,
        unitPrice: unitPrice.toString(),
        discountPrice: food.discountPrice?.toString() ?? null,
        quantity: item.quantity,
        totalPrice: totalPrice.toString(),
        variantName: item.variantName ?? null,
      }
    })

    const subtotal = orderItemsData.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0)

    // Check minimum order
    const minOrder = parseFloat(settings.minOrderAmount.toString())
    if (subtotal < minOrder) {
      return NextResponse.json({ error: `Minimum order amount is ₹${minOrder}` }, { status: 400 })
    }

    // Delivery charge
    let deliveryCharge = 0
    if (customerData.deliveryType === 'HOME_DELIVERY') {
      deliveryCharge = parseFloat(settings.deliveryCharge.toString())
      const freeAbove = settings.freeDeliveryAbove ? parseFloat(settings.freeDeliveryAbove.toString()) : null
      if (freeAbove && subtotal >= freeAbove) deliveryCharge = 0
    }

    // Apply offer if provided
    let discountAmount = 0
    let appliedOffer = null
    if (offerCode) {
      const offer = await prisma.offer.findFirst({
        where: {
          code: offerCode,
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }],
        },
      })
      if (offer) {
        const minOrderValue = offer.minOrderValue ? parseFloat(offer.minOrderValue.toString()) : 0
        if (subtotal >= minOrderValue) {
          if (offer.type === 'PERCENTAGE') {
            discountAmount = (subtotal * parseFloat(offer.value.toString())) / 100
            const max = offer.maxDiscount ? parseFloat(offer.maxDiscount.toString()) : Infinity
            discountAmount = Math.min(discountAmount, max)
          } else if (offer.type === 'FLAT') {
            discountAmount = parseFloat(offer.value.toString())
          } else if (offer.type === 'FREE_DELIVERY') {
            discountAmount = deliveryCharge
            deliveryCharge = 0
          }
          appliedOffer = offer
        }
      }
    }

    const totalAmount = subtotal + deliveryCharge - discountAmount

    // Find or create customer by phone
    let customer = await prisma.customer.findFirst({ where: { phone: customerData.phone } })
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email || null,
        },
      })
    } else {
      await prisma.customer.update({ where: { id: customer.id }, data: { name: customerData.name } })
    }

    const orderNumber = generateOrderNumber()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        deliveryType: customerData.deliveryType,
        deliveryAddress: customerData.deliveryAddress ?? null,
        deliveryCharge: deliveryCharge.toString(),
        subtotal: subtotal.toString(),
        discountAmount: discountAmount.toString(),
        totalAmount: totalAmount.toString(),
        specialRequest: customerData.specialRequest ?? null,
        orderStatus: 'NEW',
        paymentStatus: 'PENDING',
        paymentMethod: 'CASH_ON_DELIVERY',
        items: { create: orderItemsData },
        ...(appliedOffer ? {
          offers: {
            create: [{
              offerId: appliedOffer.id,
              discountAmount: discountAmount.toString(),
            }],
          },
        } : {}),
      },
      include: { items: true, customer: true },
    })

    // Increment offer usage
    if (appliedOffer) {
      await prisma.offer.update({
        where: { id: appliedOffer.id },
        data: { usageCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ order, orderNumber }, { status: 201 })
  } catch (error) {
    console.error('POST /api/store/orders error:', error)
    return NextResponse.json({ error: 'Failed to place order. Please try again.' }, { status: 500 })
  }
}
