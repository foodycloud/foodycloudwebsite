import { prisma } from '@/lib/prisma'
import HomepageSettingsForm from '@/components/admin/HomepageSettingsForm'

export default async function HomepageSettingsPage() {
  const [settings, foods, categories] = await Promise.all([
    prisma.homepageSettings.findFirst(),
    prisma.food.findMany({ where: { isDeleted: false, isAvailable: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } }),
  ])
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Homepage Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Control what appears on your homepage.</p>
      <HomepageSettingsForm initialSettings={settings} foods={foods} categories={categories} />
    </div>
  )
}
