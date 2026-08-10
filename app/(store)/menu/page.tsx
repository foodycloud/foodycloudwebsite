import type { Metadata } from 'next'
import MenuClient from '@/components/store/MenuClient'
import { getCachedMenuData, getCachedBusinessSettings } from '@/lib/db-cache'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore the full Foody Cloud menu: pure vegetarian curries, rotis, parathas, snacks, rice dishes and breakfast items.',
}

export default async function MenuPage() {
  const [categories, settings] = await Promise.all([
    getCachedMenuData(),
    getCachedBusinessSettings(),
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
