import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://foodycloud.in'

  const foods = await prisma.food.findMany({
    where: { isDeleted: false, isAvailable: true },
    select: { slug: true, updatedAt: true },
  })

  const foodUrls = foods.map(f => ({
    url: `${baseUrl}/menu/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/menu`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...foodUrls,
  ]
}
