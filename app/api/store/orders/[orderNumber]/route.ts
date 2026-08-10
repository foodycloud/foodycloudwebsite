import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: {
        customer: { select: { name: true, phone: true } },
        items: true,
      },
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Only expose safe fields to the public
    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        deliveryType: order.deliveryType,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        discountAmount: order.discountAmount,
        totalAmount: order.totalAmount,
        items: order.items,
        customerName: order.customer.name,
        createdAt: order.createdAt,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
