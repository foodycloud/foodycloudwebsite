'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Camera, Loader2, Upload, Trash2 } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);
  
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a web-optimized image format (WebP, AVIF, PNG, or JPEG).');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading('Uploading image asset...');

    try {
      const sigRes = await fetch('/api/admin/media', { method: 'POST' });
      if (!sigRes.ok) throw new Error('Failed to get upload signature');
      const sigData = await sigRes.json();

      const formDataPayload = new FormData();
      formDataPayload.append('file', file);
      formDataPayload.append('api_key', sigData.api_key);
      formDataPayload.append('timestamp', sigData.timestamp);
      formDataPayload.append('signature', sigData.signature);
      formDataPayload.append('folder', sigData.folder);

      const cleanSlug = formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'food-photo';
      formDataPayload.append('public_id', `menu-${cleanSlug}-${Date.now()}`);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`,
        { method: 'POST', body: formDataPayload }
      );
      if (!uploadRes.ok) throw new Error('Cloudinary upload request failed');
      const uploadData = await uploadRes.json();

      if (!uploadData.secure_url) {
        throw new Error('Image secure URL not found');
      }

      setFormData(prev => ({ ...prev, imageUrl: uploadData.secure_url }));
      toast.success('Image uploaded successfully!', { id: loadingToast });

      await fetch('/api/admin/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadData.secure_url,
          publicId: uploadData.public_id,
          filename: file.name,
          width: uploadData.width,
          height: uploadData.height,
          sizeBytes: file.size
        }),
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Image upload failed', { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    toast.success('Image removed from form');
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
        <p className="text-gray-500 mb-6">Upload a photo from your computer or paste an image URL</p>
        
        <div className="space-y-6">
          {/* File Upload Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white px-5 py-3 rounded-xl text-sm font-semibold transition cursor-pointer select-none">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Local File
                </>
              )}
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            <span className="text-gray-400 text-sm font-medium">or</span>
            <div className="flex-1 w-full">
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                placeholder="Paste image URL (https://...)"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-900 text-sm"
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-400">
            💡 Acceptable formats: WebP, AVIF, PNG, JPEG. Paste URLs from Google Images or upload local files.
          </p>

          <div className="relative h-64 w-full md:w-96 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
            {formData.imageUrl && formData.imageUrl.startsWith('http') ? (
              <>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center');
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl transition shadow-sm z-10"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center">
                <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <span className="text-gray-400 font-medium">No image uploaded</span>
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
