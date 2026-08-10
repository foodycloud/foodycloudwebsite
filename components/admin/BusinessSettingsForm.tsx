'use client'

import { useState } from 'react'

interface SettingsData {
  id: string
  businessName: string
  tagline: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  fssaiNumber: string | null
  instagramUrl: string | null
  facebookUrl: string | null
  isOpen: boolean
  acceptingOrders: boolean
  closedMessage: string | null
  lunchStartTime: string | null
  dinnerStartTime: string | null
  deliveryCharge: { toString(): string }
  freeDeliveryAbove: { toString(): string } | null
  minOrderAmount: { toString(): string }
  selfPickupEnabled: boolean
  homeDeliveryEnabled: boolean
}

export default function BusinessSettingsForm({ initialData }: { initialData: SettingsData }) {
  const [form, setForm] = useState({
    businessName: initialData.businessName || 'Foody Cloud',
    tagline: initialData.tagline || '',
    phone: initialData.phone || '',
    whatsapp: initialData.whatsapp || '',
    email: initialData.email || '',
    address: initialData.address || '',
    fssaiNumber: initialData.fssaiNumber || '',
    instagramUrl: initialData.instagramUrl || '',
    facebookUrl: initialData.facebookUrl || '',
    isOpen: initialData.isOpen,
    acceptingOrders: initialData.acceptingOrders,
    closedMessage: initialData.closedMessage || '',
    lunchStartTime: initialData.lunchStartTime || '12:00',
    dinnerStartTime: initialData.dinnerStartTime || '18:00',
    deliveryCharge: parseFloat(initialData.deliveryCharge.toString()) || 0,
    freeDeliveryAbove: initialData.freeDeliveryAbove ? parseFloat(initialData.freeDeliveryAbove.toString()) : null,
    minOrderAmount: parseFloat(initialData.minOrderAmount.toString()) || 0,
    selfPickupEnabled: initialData.selfPickupEnabled,
    homeDeliveryEnabled: initialData.homeDeliveryEnabled,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function updateField(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save settings.')
      } else {
        setSuccess('Settings saved successfully!')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Info */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Business Information</h2>
        <div>
          <label className={labelClass}>Business Name</label>
          <input type="text" value={form.businessName} onChange={e => updateField('businessName', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input type="text" value={form.tagline} onChange={e => updateField('tagline', e.target.value)} className={inputClass} placeholder="e.g. Homely Taste, Every Time" />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <textarea rows={2} value={form.address} onChange={e => updateField('address', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>FSSAI License Number</label>
          <input type="text" value={form.fssaiNumber} onChange={e => updateField('fssaiNumber', e.target.value)} className={inputClass} />
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Contact Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input type="text" value={form.phone} onChange={e => updateField('phone', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input type="text" value={form.whatsapp} onChange={e => updateField('whatsapp', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={inputClass} />
        </div>
      </section>

      {/* Kitchen Status */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Kitchen Status</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.isOpen} onChange={e => updateField('isOpen', e.target.checked)} className="w-5 h-5 text-amber-600 rounded" />
          <div>
            <p className="font-medium text-gray-900">Kitchen is Open</p>
            <p className="text-sm text-gray-500">Turn off to show a closed message to customers</p>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.acceptingOrders} onChange={e => updateField('acceptingOrders', e.target.checked)} className="w-5 h-5 text-amber-600 rounded" />
          <div>
            <p className="font-medium text-gray-900">Accepting Orders</p>
            <p className="text-sm text-gray-500">Turn off to pause new orders without closing the kitchen</p>
          </div>
        </label>
        <div>
          <label className={labelClass}>Closed Message</label>
          <textarea rows={2} value={form.closedMessage} onChange={e => updateField('closedMessage', e.target.value)} className={inputClass} />
        </div>
      </section>

      {/* Operating Hours */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Operating Hours</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Lunch Start Time</label>
            <input type="time" value={form.lunchStartTime || ''} onChange={e => updateField('lunchStartTime', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Dinner Start Time</label>
            <input type="time" value={form.dinnerStartTime || ''} onChange={e => updateField('dinnerStartTime', e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Delivery Settings */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Delivery Settings</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.homeDeliveryEnabled} onChange={e => updateField('homeDeliveryEnabled', e.target.checked)} className="w-4 h-4 text-amber-600 rounded" />
            <span className="text-sm text-gray-700">Home Delivery</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.selfPickupEnabled} onChange={e => updateField('selfPickupEnabled', e.target.checked)} className="w-4 h-4 text-amber-600 rounded" />
            <span className="text-sm text-gray-700">Self Pickup</span>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Delivery Charge (₹)</label>
            <input type="number" min="0" step="1" value={form.deliveryCharge} onChange={e => updateField('deliveryCharge', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Free Delivery Above (₹)</label>
            <input type="number" min="0" step="1" value={form.freeDeliveryAbove || ''} onChange={e => updateField('freeDeliveryAbove', e.target.value ? parseFloat(e.target.value) : null)} className={inputClass} placeholder="Leave empty to disable" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Minimum Order Amount (₹)</label>
          <input type="number" min="0" step="1" value={form.minOrderAmount} onChange={e => updateField('minOrderAmount', parseFloat(e.target.value) || 0)} className={inputClass} />
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Social Links</h2>
        <div>
          <label className={labelClass}>Instagram URL</label>
          <input type="url" value={form.instagramUrl} onChange={e => updateField('instagramUrl', e.target.value)} className={inputClass} placeholder="https://www.instagram.com/foody.cloud" />
        </div>
        <div>
          <label className={labelClass}>Facebook URL</label>
          <input type="url" value={form.facebookUrl} onChange={e => updateField('facebookUrl', e.target.value)} className={inputClass} placeholder="https://www.facebook.com/..." />
        </div>
      </section>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        id="save-settings-btn"
        className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold px-8 py-3 rounded-xl transition"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}
