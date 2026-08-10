'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Camera, Loader2 } from 'lucide-react';

interface FoodData {
  id?: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  discountPrice: number | null;
  categoryId: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isVeg: boolean;
  isJainAvail: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  initialData?: FoodData;
  foodId?: string;
}

export default function FoodForm({ categories, initialData, foodId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FoodData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    price: initialData?.price || 0,
    discountPrice: initialData?.discountPrice || null,
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    isAvailable: initialData?.isAvailable ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isPopular: initialData?.isPopular ?? false,
    isVeg: initialData?.isVeg ?? true,
    isJainAvail: initialData?.isJainAvail ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData({ ...formData, [name]: value === '' ? null : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleToggle = (field: keyof FoodData) => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0 || !formData.categoryId) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      const url = foodId ? `/api/admin/foods/${foodId}` : '/api/admin/foods';
      const method = foodId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Something went wrong');
      }

      toast.success(foodId ? 'Food updated successfully!' : 'Food added successfully!');
      router.push('/admin/foods');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-12 pt-6">
      
      {/* Image Section */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Food Photo</h2>
        <p className="text-gray-500 mb-6">Paste any image URL from Google, Unsplash, or any website</p>
        
        <div className="space-y-4">
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-900"
          />
          <p className="text-sm text-gray-400">
            💡 Tip: Search on Google Images, right-click → Copy image address
          </p>

          <div className="relative h-64 w-full md:w-96 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            {formData.imageUrl && formData.imageUrl.startsWith('http') ? (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="h-full w-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center');
                }}
              />
            ) : (
              <div className="text-center">
                <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <span className="text-gray-400 font-medium">No image yet</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Basic Info</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Food Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-lg font-medium text-gray-900"
            placeholder="e.g. Paneer Butter Masala"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
            placeholder="Brief description of the dish..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Category *</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-gray-900 appearance-none font-medium"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Pricing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Regular Price *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Sale Price (Optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 font-bold"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Leave empty if no discount</p>
          </div>
        </div>
      </div>

      {/* Badges & Availability */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Availability & Badges</h2>
        
        <div className="space-y-6">
          {[
            { id: 'isAvailable', label: 'Available on menu', desc: 'Turn off to hide from customers temporarily' },
            { id: 'isVeg', label: 'Vegetarian', desc: 'Mark this item as pure veg' },
            { id: 'isFeatured', label: 'Featured on homepage', desc: 'Show this prominently on the main page' },
            { id: 'isPopular', label: 'Show as Popular', desc: 'Adds a "Popular" badge to this item' },
            { id: 'isJainAvail', label: 'Jain option available', desc: 'Customers can request Jain preparation' },
          ].map((toggle) => (
            <div key={toggle.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <h3 className="font-bold text-gray-900">{toggle.label}</h3>
                <p className="text-sm text-gray-500">{toggle.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(toggle.id as keyof FoodData)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  formData[toggle.id as keyof FoodData] ? 'bg-amber-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    formData[toggle.id as keyof FoodData] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg py-4 rounded-full transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          foodId ? 'Update Food Item' : 'Save Food Item'
        )}
      </button>

    </form>
  );
}
