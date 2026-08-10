import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import MenuClient from '@/components/store/MenuClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore the full Foody Cloud menu: pure vegetarian curries, rotis, parathas, snacks, rice dishes and breakfast items.',
}

export default async function MenuPage() {
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

  return (
    <MenuClient
      categories={categories}
      isOpen={settings?.isOpen ?? true}
      acceptingOrders={settings?.acceptingOrders ?? true}
      closedMessage={settings?.closedMessage ?? null}
    />
  )
}
