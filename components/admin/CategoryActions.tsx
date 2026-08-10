'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

export default function CategoryActions({ categoryId, categoryName, foodCount }: { categoryId: string; categoryName: string; foodCount: number }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (foodCount > 0) {
      alert(`Cannot remove "${categoryName}" - it has ${foodCount} food item(s). Remove or move those first.`)
      return
    }
    if (!confirm(`Remove the category "${categoryName}"? This cannot be undone.`)) return
    setLoading(true)
    try {
      await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' })
      router.refresh()
    } catch { alert('Failed to remove category.') } finally { setLoading(false) }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/categories/${categoryId}/edit`} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"><Pencil className="w-4 h-4" /></Link>
      <button onClick={handleDelete} disabled={loading} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
    </div>
  )
}
