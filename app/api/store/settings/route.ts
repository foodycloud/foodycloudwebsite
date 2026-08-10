import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 30

export async function GET() {
  try {
    const settings = await prisma.businessSettings.findFirst()
    if (!settings) return NextResponse.json({ settings: null })

    // Only expose safe public fields
    return NextResponse.json({
      settings: {
        businessName: settings.businessName,
        tagline: settings.tagline,
        logoUrl: settings.logoUrl,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        address: settings.address,
        instagramUrl: settings.instagramUrl,
        isOpen: settings.isOpen,
        acceptingOrders: settings.acceptingOrders,
        closedMessage: settings.closedMessage,
        lunchStartTime: settings.lunchStartTime,
        dinnerStartTime: settings.dinnerStartTime,
        deliveryCharge: settings.deliveryCharge,
        freeDeliveryAbove: settings.freeDeliveryAbove,
        minOrderAmount: settings.minOrderAmount,
        selfPickupEnabled: settings.selfPickupEnabled,
        homeDeliveryEnabled: settings.homeDeliveryEnabled,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}
