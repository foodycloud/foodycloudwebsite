'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type OfferType = 'PERCENTAGE' | 'FLAT' | 'FREE_DELIVERY'
interface OfferData {
  title: string; description: string; code: string; type: OfferType
  value: number; minOrderValue: number | null; maxDiscount: number | null
  usageLimit: number | null; isActive: boolean
  startsAt: string; expiresAt: string
}

export default function OfferForm({ initialData, offerId }: { initialData?: Record<string, unknown>; offerId?: string }) {
  const router = useRouter()
  const [form, setForm] = useState<OfferData>({
    title: (initialData?.title as string) || '',
    description: (initialData?.description as string) || '',
    code: (initialData?.code as string) || '',
    type: (initialData?.type as OfferType) || 'PERCENTAGE',
    value: initialData?.value ? parseFloat((initialData.value as { toString(): string }).toString()) : 0,
    minOrderValue: initialData?.minOrderValue ? parseFloat((initialData.minOrderValue as { toString(): string }).toString()) : null,
    maxDiscount: null, usageLimit: null, isActive: (initialData?.isActive as boolean) ?? true,
    startsAt: '', expiresAt: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      const url = offerId ? `/api/admin/offers/${offerId}` : '/api/admin/offers'
      const method = offerId ? 'PUT' : 'POST'
      const payload = { ...form, code: form.code || null, startsAt: form.startsAt || null, expiresAt: form.expiresAt || null }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Failed to save.')
      else { setSuccess('Offer saved!'); if (!offerId) setTimeout(() => router.push('/admin/offers'), 1000) }
    } catch { setError('Something went wrong.') } finally { setLoading(false) }
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div><label className={labelClass}>Offer Title *</label><input type="text" required value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} className={inputClass} placeholder="e.g. 10% Off on First Order" /></div>
      <div><label className={labelClass}>Description</label><textarea rows={2} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} className={inputClass} /></div>
      <div><label className={labelClass}>Coupon Code (optional)</label><input type="text" value={form.code} onChange={e=>setForm(p=>({...p,code:e.target.value.toUpperCase()}))} className={inputClass} placeholder="e.g. WELCOME10" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Discount Type</label>
          <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value as OfferType}))} className={inputClass}>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FLAT">Flat Amount (Rs)</option>
            <option value="FREE_DELIVERY">Free Delivery</option>
          </select>
        </div>
        <div><label className={labelClass}>Value {form.type==='PERCENTAGE'?'(%)':'(Rs)'}</label><input type="number" min="0" step="0.01" value={form.value} onChange={e=>setForm(p=>({...p,value:parseFloat(e.target.value)||0}))} className={inputClass} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Min Order Amount</label><input type="number" min="0" value={form.minOrderValue||''} onChange={e=>setForm(p=>({...p,minOrderValue:e.target.value?parseFloat(e.target.value):null}))} className={inputClass} placeholder="Optional" /></div>
        <div><label className={labelClass}>Max Discount</label><input type="number" min="0" value={form.maxDiscount||''} onChange={e=>setForm(p=>({...p,maxDiscount:e.target.value?parseFloat(e.target.value):null}))} className={inputClass} placeholder="Optional" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>Start Date</label><input type="datetime-local" value={form.startsAt} onChange={e=>setForm(p=>({...p,startsAt:e.target.value}))} className={inputClass} /></div>
        <div><label className={labelClass}>Expiry Date</label><input type="datetime-local" value={form.expiresAt} onChange={e=>setForm(p=>({...p,expiresAt:e.target.value}))} className={inputClass} /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.isActive} onChange={e=>setForm(p=>({...p,isActive:e.target.checked}))} className="w-4 h-4 text-amber-600 rounded" />
        <span className="text-sm text-gray-700">Offer is active</span>
      </label>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold px-6 py-3 rounded-xl transition">{loading?'Saving...':(offerId?'Save Changes':'Create Offer')}</button>
        <button type="button" onClick={()=>router.back()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition">Cancel</button>
      </div>
    </form>
  )
}
