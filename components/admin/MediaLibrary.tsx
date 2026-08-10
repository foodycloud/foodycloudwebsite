'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

interface MediaItem { id: string; url: string; filename: string; publicId: string; createdAt: Date }

export default function MediaLibrary({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia] = useState(initialMedia)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const sigRes = await fetch('/api/admin/media', { method: 'POST' })
      const sigData = await sigRes.json()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', sigData.api_key)
      formData.append('timestamp', sigData.timestamp)
      formData.append('signature', sigData.signature)
      formData.append('folder', sigData.folder)
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`, { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (uploadData.secure_url) {
        const saveRes = await fetch('/api/admin/media', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: uploadData.secure_url, publicId: uploadData.public_id, filename: file.name, width: uploadData.width, height: uploadData.height, sizeBytes: file.size }),
        })
        const saved = await saveRes.json()
        setMedia(prev => [saved.media, ...prev])
        toast.success('Image uploaded!')
      }
    } catch { toast.error('Upload failed.') } finally { setUploading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this image?')) return
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    setMedia(prev => prev.filter(m => m.id !== id))
    toast.success('Image removed')
  }

  return (
    <div>
      <label className="cursor-pointer inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition mb-6">
        <Upload className="w-4 h-4" />
        {uploading ? 'Uploading...' : 'Upload Image'}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>

      {media.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><p>No images yet. Upload your first image above.</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map(item => (
            <div key={item.id} className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="relative h-32">
                <Image src={item.url} alt={item.filename} fill className="object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-500 truncate">{item.filename}</p>
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button onClick={() => { navigator.clipboard.writeText(item.url); toast.success('URL copied!') }} className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100"><Copy className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
