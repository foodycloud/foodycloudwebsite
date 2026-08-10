import { prisma } from '@/lib/prisma'
import MediaLibrary from '@/components/admin/MediaLibrary'

export default async function MediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Image Library</h1>
      <p className="text-gray-500 text-sm">Upload and manage images for your food items. Images are stored securely in the cloud.</p>
      <MediaLibrary initialMedia={media} />
    </div>
  )
}
