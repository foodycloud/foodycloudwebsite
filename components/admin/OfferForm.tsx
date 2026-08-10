'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, Ticket, Percent, IndianRupee, Truck } from 'lucide-react';

interface OfferData {
  id?: string;
  title: string;
  description: string | null;
  code: string | null;
  type: 'PERCENTAGE' | 'FLAT' | 'FREE_DELIVERY';
  value: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  isActive: boolean;
  startsAt: string | null; // ISO string
  expiresAt: string | null; // ISO string
}

interface Props {
  initialData?: OfferData;
  offerId?: string;
}

export default function OfferForm({ initialData, offerId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatDateForInput = (isoDate?: string | null) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    // Adjust for local timezone to populate datetime-local correctly
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    code: initialData?.code || '',
    type: initialData?.type || 'PERCENTAGE',
    value: initialData?.value || 0,
    minOrderValue: initialData?.minOrderValue || '',
    maxDiscount: initialData?.maxDiscount || '',
    usageLimit: initialData?.usageLimit || '',
    isActive: initialData?.isActive ?? true,
    startsAt: formatDateForInput(initialData?.startsAt),
    expiresAt: formatDateForInput(initialData?.expiresAt),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData({ ...formData, [name]: value === '' ? '' : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
    setFormData({ ...formData, code: val });
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleToggle = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }
    if (formData.type !== 'FREE_DELIVERY' && (!formData.value || Number(formData.value) <= 0)) {
      toast.error('Discount value is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        code: formData.code.trim() || null,
        value: Number(formData.value) || 0,
        minOrderValue: formData.minOrderValue === '' ? null : Number(formData.minOrderValue),
        maxDiscount: formData.maxDiscount === '' ? null : Number(formData.maxDiscount),
        usageLimit: formData.usageLimit === '' ? null : Number(formData.usageLimit),
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      };

      const url = offerId ? `/api/admin/offers/${offerId}` : '/api/admin/offers';
      const method = offerId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save offer');
      }

      toast.success(offerId ? 'Coupon updated!' : 'Coupon created!');
      router.push('/admin/offers');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-12 pt-6">
      
      {/* SECTION 1: Coupon Code */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h2 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Coupon Code</h2>
        <p className="text-gray-500 mb-6 relative z-10">What customers type at checkout to get the discount.</p>
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 w-6 h-6" />
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleCodeChange}
                placeholder="E.g. SAVE20, WELCOME"
                className="w-full rounded-2xl border-2 border-amber-100 bg-amber-50/30 pl-14 pr-4 py-4 text-2xl font-black font-mono text-amber-700 tracking-widest placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 uppercase transition-all"
              />
            </div>
            <button
              type="button"
              onClick={generateCode}
              className="px-6 py-4 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-2xl transition-colors whitespace-nowrap shadow-sm"
            >
              Generate Random
            </button>
          </div>
          <p className="text-sm font-medium text-amber-600/80">
            Leave empty if this offer applies automatically without a code.
          </p>
        </div>
      </div>

      {/* SECTION 2: Name & Description */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Offer Details</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Offer Name *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. 20% Off Weekend Special"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-lg font-medium text-gray-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            placeholder="Shown to customers..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
          />
        </div>
      </div>

      {/* SECTION 3 & 4: Discount Type & Value */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Discount Settings</h2>
        
        {/* Type selector (Pills) */}
        <div className="flex p-1 bg-gray-100 rounded-xl w-full max-w-md mb-8">
          {[
            { id: 'PERCENTAGE', label: 'Percentage %', icon: Percent },
            { id: 'FLAT', label: 'Fixed Amount ₹', icon: IndianRupee },
            { id: 'FREE_DELIVERY', label: 'Free Delivery', icon: Truck },
          ].map((type) => {
            const Icon = type.icon;
            const isSelected = formData.type === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({ ...formData, type: type.id as any })}
                className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${
                  isSelected 
                    ? 'bg-amber-600 text-white shadow-md scale-100' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 scale-95'
                }`}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">{type.label}</span>
                <span className="sm:hidden">{type.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Fields based on Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          {formData.type === 'PERCENTAGE' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Discount Percentage *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-bold text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Max Discount Cap ₹ (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleChange}
                    min="1"
                    className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-bold"
                  />
                </div>
              </div>
            </>
          )}

          {formData.type === 'FLAT' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Discount Amount *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-bold text-lg"
                />
              </div>
            </div>
          )}

          {formData.type === 'FREE_DELIVERY' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Max Delivery Charge Covered ₹ (Optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-bold"
                />
              </div>
              <p className="text-xs text-gray-500">Leave at 0 to cover all delivery fees.</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: Conditions */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Usage Conditions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Minimum Order Amount ₹</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                name="minOrderValue"
                value={formData.minOrderValue}
                onChange={handleChange}
                min="0"
                className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-bold"
              />
            </div>
            <p className="text-xs text-gray-400">Leave empty for no minimum</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Total Usage Limit</label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 100"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-bold"
            />
            <p className="text-xs text-gray-400">How many times this can be used in total</p>
          </div>
        </div>
      </div>

      {/* SECTION 6: Active Period */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Status & Validity</h2>
        
        <div className="flex items-center justify-between py-4 border-b border-gray-100 mb-6">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Offer Status</h3>
            <p className="text-sm text-gray-500">Turn off to disable this coupon immediately</p>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
              formData.isActive ? 'bg-amber-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition duration-200 ease-in-out ${
                formData.isActive ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Start Date (Optional)</label>
            <input
              type="datetime-local"
              name="startsAt"
              value={formData.startsAt}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Expiry Date (Optional)</label>
            <input
              type="datetime-local"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-xl py-5 rounded-full transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-amber-600/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            Saving...
          </>
        ) : (
          offerId ? 'Update Coupon' : 'Save Coupon'
        )}
      </button>

    </form>
  );
}
