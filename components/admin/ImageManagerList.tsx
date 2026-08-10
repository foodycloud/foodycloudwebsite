'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Search, ImageIcon, AlertTriangle, CheckCircle, Copy, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface FoodItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  imageUrl: string | null;
  categoryId: string;
  categoryName: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  initialFoods: FoodItem[];
  categories: Category[];
}

export default function ImageManagerList({ initialFoods, categories }: Props) {
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'missing' | 'verified'>('all');
  
  // Upload state tracking per food item ID
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});

  // Filter foods list
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            food.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || food.categoryId === selectedCategory;
      
      const matchesStatus = 
        filterStatus === 'all' ||
        (filterStatus === 'missing' && !food.imageUrl) ||
        (filterStatus === 'verified' && food.imageUrl);
        
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [foods, searchQuery, selectedCategory, filterStatus]);

  // Extract filename from URL helper
  const getFilenameFromUrl = (url: string | null) => {
    if (!url) return 'Not Assigned';
    try {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1]);
    } catch {
      return 'external-asset';
    }
  };

  // Perform Cloudinary image upload and associate to food
  const handleUpload = async (foodId: string, slug: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enforce web-friendly formats
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a web-optimized image format (WebP, AVIF, PNG, or JPEG).');
      return;
    }

    setUploadingMap(prev => ({ ...prev, [foodId]: true }));
    const loadingToast = toast.loading(`Uploading image for ${slug}...`);

    try {
      // 1. Get signed signature params from our API
      const sigRes = await fetch('/api/admin/media', { method: 'POST' });
      if (!sigRes.ok) throw new Error('Failed to get upload signature');
      const sigData = await sigRes.json();

      // 2. Prepare FormData for direct Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.api_key);
      formData.append('timestamp', sigData.timestamp);
      formData.append('signature', sigData.signature);
      formData.append('folder', sigData.folder);
      
      // Override public_id with the menu item slug for clean descriptive filenames
      const cleanPublicId = `menu-${slug}`;
      formData.append('public_id', cleanPublicId);

      // 3. Post to Cloudinary api
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`,
        { method: 'POST', body: formData }
      );
      if (!uploadRes.ok) throw new Error('Cloudinary upload request failed');
      const uploadData = await uploadRes.json();

      if (!uploadData.secure_url) {
        throw new Error('Image secure URL not found in Cloudinary response');
      }

      // 4. Update the Food item in our database
      const saveRes = await fetch(`/api/admin/foods/${foodId}/image`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadData.secure_url }),
      });

      if (!saveRes.ok) throw new Error('Failed to save image path in database');
      const savedData = await saveRes.json();

      // 5. Update local state
      setFoods(prev => prev.map(f => f.id === foodId ? { ...f, imageUrl: uploadData.secure_url } : f));
      
      // Save to media log too
      await fetch('/api/admin/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadData.secure_url,
          publicId: uploadData.public_id,
          filename: `${slug}.webp`,
          width: uploadData.width,
          height: uploadData.height,
          sizeBytes: file.size
        }),
      });

      toast.success('Image uploaded and associated successfully!', { id: loadingToast });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Image upload failed', { id: loadingToast });
    } finally {
      setUploadingMap(prev => ({ ...prev, [foodId]: false }));
    }
  };

  // Remove image association
  const handleRemoveImage = async (foodId: string, foodName: string) => {
    if (!confirm(`Are you sure you want to remove the image from ${foodName}?`)) return;

    const loadingToast = toast.loading(`Removing image from ${foodName}...`);
    try {
      const res = await fetch(`/api/admin/foods/${foodId}/image`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove image path');

      // Update local state
      setFoods(prev => prev.map(f => f.id === foodId ? { ...f, imageUrl: null } : f));
      toast.success('Image association removed successfully.', { id: loadingToast });
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove image', { id: loadingToast });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Selectors */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'all' ? 'bg-stone-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('missing')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                filterStatus === 'missing' ? 'bg-red-600 text-white shadow-sm' : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Missing
            </button>
            <button
              onClick={() => setFilterStatus('verified')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'verified' ? 'bg-green-600 text-white shadow-sm' : 'text-green-600 hover:bg-green-50'
              }`}
            >
              Verified
            </button>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredFoods.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No matching items</h2>
          <p className="text-gray-500 max-w-sm">Try tweaking your search term, category filter, or status selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food) => {
            const isUploading = uploadingMap[food.id] || false;
            const altText = `Fresh hot ${food.name} served at Foody Cloud Kitchen`;
            
            return (
              <div 
                key={food.id} 
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm flex flex-col transition-all duration-300 hover:shadow-md ${
                  !food.imageUrl ? 'border-red-100 hover:border-red-200' : 'border-gray-100 hover:border-amber-200'
                }`}
              >
                {/* Visual Preview Side */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-100">
                  {food.imageUrl ? (
                    <>
                      <img 
                        src={food.imageUrl} 
                        alt={altText}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center p-6 text-center select-none">
                      <AlertTriangle className="w-10 h-10 text-red-500 mb-2.5 animate-bounce" />
                      <span className="text-sm font-black text-red-600 uppercase tracking-widest">
                        ❌ Missing Image Asset
                      </span>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <span className="text-xs font-bold tracking-wider">Uploading WebP File...</span>
                    </div>
                  )}
                </div>

                {/* Info and Properties Panel */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {food.categoryName}
                    </span>
                    <span className="text-gray-400 font-mono text-[9px]">ID: {food.id.slice(-6).toUpperCase()}</span>
                  </div>
                  
                  <h3 className="text-lg font-black text-gray-900 leading-snug mb-1">{food.name}</h3>
                  <p className="text-xs font-mono text-gray-400 truncate mb-4">Slug: {food.slug}</p>
                  
                  <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 text-xs space-y-3.5 mt-auto">
                    {/* Filename mapping */}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-500">Asset File:</span>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-700 max-w-[180px] truncate">
                        <span>{food.imageUrl ? `${food.slug}.webp` : 'Not Assigned'}</span>
                        {food.imageUrl && (
                          <button 
                            onClick={() => { navigator.clipboard.writeText(`${food.slug}.webp`); toast.success('Filename copied!'); }}
                            className="text-gray-400 hover:text-gray-700 shrink-0"
                            title="Copy filename"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Alt Text derived description */}
                    <div>
                      <span className="font-semibold text-gray-500 block mb-1">Alt Text Description:</span>
                      <p className="text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-lg leading-relaxed italic text-[11px]">
                        "{altText}"
                      </p>
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <div className="flex gap-2.5 pt-6 mt-6 border-t border-gray-100">
                    <label className="flex-1 flex items-center justify-center gap-1.5 py-3 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/20 hover:bg-amber-50/40 text-amber-800 font-bold text-xs rounded-2xl transition-all cursor-pointer text-center">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{food.imageUrl ? 'Replace' : 'Upload WebP'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleUpload(food.id, food.slug, e)}
                        className="hidden" 
                        disabled={isUploading}
                      />
                    </label>
                    
                    {food.imageUrl && (
                      <button
                        onClick={() => handleRemoveImage(food.id, food.name)}
                        className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center"
                        title="Remove mapping"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
