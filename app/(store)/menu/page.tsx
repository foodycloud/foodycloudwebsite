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

  const formattedCategories = categories.map((cat) => ({
    ...cat,
    foods: cat.foods.map((food) => ({
      ...food,
      price: parseFloat(food.price.toString()),
      discountPrice: food.discountPrice ? parseFloat(food.discountPrice.toString()) : null,
    })),
  }))

  return (
    <MenuClient
      categories={formattedCategories}
      isOpen={settings?.isOpen ?? true}
      closedMessage={settings?.closedMessage ?? null}
    />
  )
}
