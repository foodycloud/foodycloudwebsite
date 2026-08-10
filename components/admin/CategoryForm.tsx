'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CategoryData { name: string; description?: string | null; isActive: boolean; sortOrder: number }
interface CategoryFormProps { initialData?: CategoryData; categoryId?: string }

export default function CategoryForm({ initialData, categoryId }: CategoryFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<CategoryData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    isActive: initialData?.isActive ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      const url = categoryId ? `/api/admin/categories/${categoryId}` : '/api/admin/categories'
      const method = categoryId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to save.') }
      else { setSuccess(categoryId ? 'Category updated!' : 'Category created!'); if (!categoryId) setTimeout(() => router.push('/admin/categories'), 1000) }
    } catch { setError('Something went wrong.') } finally { setLoading(false) }
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900'
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
        <input type="text" required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className={inputClass} placeholder="e.g. Roti & Paratha" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea rows={2} value={form.description || ''} onChange={e => setForm(p => ({...p, description: e.target.value}))} className={inputClass} placeholder="Short description..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
          <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({...p, sortOrder: parseInt(e.target.value)||0}))} className={inputClass} />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({...p, isActive: e.target.checked}))} className="w-4 h-4 text-amber-600 rounded" />
            <span className="text-sm text-gray-700">Show on Menu</span>
          </label>
        </div>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold px-6 py-3 rounded-xl transition">{loading ? 'Saving...' : (categoryId ? 'Save Changes' : 'Add Category')}</button>
        <button type="button" onClick={() => router.back()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition">Cancel</button>
      </div>
    </form>
  )
}
