import { prisma } from '@/lib/prisma'
import BusinessSettingsForm from '@/components/admin/BusinessSettingsForm'

export default async function SettingsPage() {
  let settings = await prisma.businessSettings.findFirst()
  if (!settings) {
    settings = await prisma.businessSettings.create({ data: {} })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your restaurant details, delivery settings and opening hours.</p>
      <BusinessSettingsForm initialData={settings} />
    </div>
  )
}
