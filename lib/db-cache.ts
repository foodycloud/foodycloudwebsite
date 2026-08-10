import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'

// 1. Cache Business Settings
export const getCachedBusinessSettings = unstable_cache(
  async () => {
    return prisma.businessSettings.findFirst()
  },
  ['business-settings-data'],
  {
    tags: ['business-settings'],
    revalidate: 300, // cache for 5 minutes fallback
  }
)

// 2. Cache Homepage Settings
export const getCachedHomepageSettings = unstable_cache(
  async () => {
    return prisma.homepageSettings.findFirst()
  },
  ['homepage-settings-data'],
  {
    tags: ['homepage-settings'],
    revalidate: 300,
  }
)

// 3. Cache Categories with Food Counts
export const getCachedCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { foods: { where: { isAvailable: true } } },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })
  },
  ['categories-list'],
  {
    tags: ['categories', 'foods'],
    revalidate: 300,
  }
)

// 4. Cache Featured Foods
export const getCachedFeaturedFoods = unstable_cache(
  async () => {
    return prisma.food.findMany({
      where: { isFeatured: true, isAvailable: true, category: { isActive: true } },
      include: { category: true },
      take: 6,
    })
  },
  ['featured-foods'],
  {
    tags: ['foods'],
    revalidate: 300,
  }
)

// 5. Cache Popular Foods
export const getCachedPopularFoods = unstable_cache(
  async () => {
    return prisma.food.findMany({
      where: { isPopular: true, isAvailable: true, category: { isActive: true } },
      include: { category: true },
      take: 8,
    })
  },
  ['popular-foods'],
  {
    tags: ['foods'],
    revalidate: 300,
  }
)

// 6. Cache Menu Data (Full categories with food items)
export const getCachedMenuData = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        foods: {
          where: { isDeleted: false, isAvailable: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })
  },
  ['menu-page-data'],
  {
    tags: ['menu-data', 'categories', 'foods'],
    revalidate: 300,
  }
)
