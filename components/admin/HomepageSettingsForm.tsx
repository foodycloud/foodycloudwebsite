'use client'
import { useState } from 'react'

interface Food { id: string; name: string }
interface Category { id: string; name: string }
interface Settings {
  heroHeading?: string | null
  heroSubheading?: string | null
  heroImageUrl?: string | null
  featuredFoodIds: string[]
  featuredCategoryIds: string[]
  bannerText?: string | null
  bannerImageUrl?: string | null
  bannerLinkUrl?: string | null
}

export default function HomepageSettingsForm({
  initialSettings, foods, categories
}: { initialSettings: Settings | null; foods: Food[]; categories: Category[] }) {
  const [form, setForm] = useState({
    heroHeading: initialSettings?.heroHeading || 'Homely Taste, Every Time',
    heroSubheading: initialSettings?.heroSubheading || 'Freshly cooked. Purely homemade. Made with love.',
    heroImageUrl: initialSettings?.heroImageUrl || '',
    featuredFoodIds: initialSettings?.featuredFoodIds || [],
    featuredCategoryIds: initialSettings?.featuredCategoryIds || [],
    bannerText: initialSettings?.bannerText || '',
    bannerLinkUrl: initialSettings?.bannerLinkUrl || '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function toggleId(key: 'featuredFoodIds' | 'featuredCategoryIds', id: string) {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((i: string) => i !== id) : [...prev[key], id]
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      const res = await fetch('/api/admin/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Failed to save.')
      else setSuccess('Homepage settings saved!')
    } catch { setError('Something went wrong.') } finally { setLoading(false) }
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Hero Section</h2>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label><input type="text" value={form.heroHeading} onChange={e=>setForm(p=>({...p,heroHeading:e.target.value}))} className={inputClass} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label><input type="text" value={form.heroSubheading} onChange={e=>setForm(p=>({...p,heroSubheading:e.target.value}))} className={inputClass} /></div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <h2 className="font-semibold text-gray-900">Featured Foods (Must Try section)</h2>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {foods.map(food => (
            <label key={food.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
              <input type="checkbox" checked={form.featuredFoodIds.includes(food.id)} onChange={() => toggleId('featuredFoodIds', food.id)} className="w-4 h-4 text-amber-600 rounded" />
              <span className="text-sm text-gray-700">{food.name}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <h2 className="font-semibold text-gray-900">Featured Categories</h2>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
              <input type="checkbox" checked={form.featuredCategoryIds.includes(cat.id)} onChange={() => toggleId('featuredCategoryIds', cat.id)} className="w-4 h-4 text-amber-600 rounded" />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Announcement Banner</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text (Leave empty to disable)</label>
          <input
            type="text"
            value={form.bannerText}
            onChange={e => setForm(p => ({ ...p, bannerText: e.target.value }))}
            className={inputClass}
            placeholder="e.g. 🌿 Special Weekend Menu is now live! Order via WhatsApp."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner Link URL (Optional)</label>
          <input
            type="text"
            value={form.bannerLinkUrl}
            onChange={e => setForm(p => ({ ...p, bannerLinkUrl: e.target.value }))}
            className={inputClass}
            placeholder="e.g. /menu or external link"
          />
        </div>
      </section>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold px-8 py-3 rounded-xl transition">
        {loading ? 'Saving...' : 'Save Homepage Settings'}
      </button>
    </form>
  )
}
