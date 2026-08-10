'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

interface Category { id: string; name: string }
interface FoodData {
  name: string
  description?: string | null
  price: number
  discountPrice?: number | null
  categoryId: string
  isAvailable: boolean
  isFeatured: boolean
  isPopular: boolean
  isVeg: boolean
  isJainAvail: boolean
  sortOrder: number
  imageUrl?: string | null
}

interface FoodFormProps {
  categories: Category[]
  initialData?: FoodData & { id?: string }
  foodId?: string
}

export default function FoodForm({ categories, initialData, foodId }: FoodFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState<FoodData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    discountPrice: initialData?.discountPrice || null,
    categoryId: initialData?.categoryId || (categories[0]?.id || ''),
    isAvailable: initialData?.isAvailable ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isPopular: initialData?.isPopular ?? false,
    isVeg: initialData?.isVeg ?? true,
    isJainAvail: initialData?.isJainAvail ?? false,
    sortOrder: initialData?.sortOrder ?? 0,
    imageUrl: initialData?.imageUrl || null,
  })

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      // Get signed upload params
      const sigRes = await fetch('/api/admin/media', { method: 'POST' })
      const sigData = await sigRes.json()

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', sigData.api_key)
      formData.append('timestamp', sigData.timestamp)
      formData.append('signature', sigData.signature)
      formData.append('folder', sigData.folder)

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const uploadData = await uploadRes.json()

      if (uploadData.secure_url) {
        setImageUrl(uploadData.secure_url)
        setForm(prev => ({ ...prev, imageUrl: uploadData.secure_url }))
        // Save to media library
        await fetch('/api/admin/media', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
            filename: file.name,
            width: uploadData.width,
            height: uploadData.height,
            sizeBytes: file.size,
          }),
        })
      }
    } catch {
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const payload = { ...form, imageUrl: imageUrl || null }
      const url = foodId ? `/api/admin/foods/${foodId}` : '/api/admin/foods'
      const method = foodId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save. Please check your inputs.')
      } else {
        setSuccess(foodId ? 'Food updated successfully!' : 'Food added to your menu!')
        if (!foodId) {
          setTimeout(() => router.push('/admin/foods'), 1000)
        }
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Food Image</label>
        <div className="flex items-start gap-4">
          {imageUrl ? (
            <div className="relative">
              <Image src={imageUrl} alt="Food" width={96} height={96} className="w-24 h-24 rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => { setImageUrl(''); setForm(prev => ({ ...prev, imageUrl: null })) }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
              <span className="text-2xl">🍲</span>
            </div>
          )}
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {uploadingImage ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
          </label>
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="food-name" className="block text-sm font-medium text-gray-700 mb-1">Food Name <span className="text-red-500">*</span></label>
        <input
          id="food-name"
          type="text"
          required
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
          placeholder="e.g. Paneer Butter Masala"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="food-desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="food-desc"
          rows={3}
          value={form.description || ''}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 resize-none"
          placeholder="Describe this food item..."
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="food-category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
        <select
          id="food-category"
          value={form.categoryId}
          onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="food-price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹) <span className="text-red-500">*</span></label>
          <input
            id="food-price"
            type="number"
            min="0"
            step="1"
            required
            value={form.price}
            onChange={e => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="food-discount" className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
          <input
            id="food-discount"
            type="number"
            min="0"
            step="1"
            value={form.discountPrice || ''}
            onChange={e => setForm(prev => ({ ...prev, discountPrice: e.target.value ? parseFloat(e.target.value) : null }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-3">
        {([
          ['isAvailable', 'Available on Menu'],
          ['isFeatured', 'Featured Item'],
          ['isPopular', 'Popular Item'],
          ['isVeg', 'Vegetarian'],
          ['isJainAvail', 'Jain Available'],
        ] as [keyof FoodData, string][]).map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
            <input
              type="checkbox"
              checked={Boolean(form[key])}
              onChange={e => setForm(prev => ({ ...prev, [key]: e.target.checked }))}
              className="w-4 h-4 text-amber-600 rounded"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          id="save-food-btn"
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          {loading ? 'Saving...' : (foodId ? 'Save Changes' : 'Add to Menu')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
