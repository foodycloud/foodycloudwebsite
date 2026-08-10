import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import OfferToggle from '@/components/admin/OfferToggle'

export default async function OffersPage() {
  const offers = await prisma.offer.findMany({ orderBy: { createdAt: 'desc' } })
  const now = new Date()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Offers & Discounts</h1>
        <Link href="/admin/offers/new" className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">+ Create Offer</Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {offers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No offers yet</p>
            <Link href="/admin/offers/new" className="mt-2 inline-block text-amber-600 text-sm font-medium">Create your first offer</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Offer', 'Code', 'Type', 'Value', 'Min Order', 'Expires', 'Active', ''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {offers.map(offer => {
                const expired = offer.expiresAt ? offer.expiresAt < now : false
                return (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><p className="font-semibold text-gray-900 text-sm">{offer.title}</p>{offer.description && <p className="text-xs text-gray-400">{offer.description}</p>}</td>
                    <td className="px-4 py-3"><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{offer.code || 'Auto'}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{offer.type}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{offer.type === 'PERCENTAGE' ? `${offer.value}%` : formatPrice(offer.value.toString())}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{offer.minOrderValue ? formatPrice(offer.minOrderValue.toString()) : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{offer.expiresAt ? <span className={expired ? 'text-red-500' : ''}>{format(offer.expiresAt, 'dd MMM yy')}</span> : '-'}</td>
                    <td className="px-4 py-3"><OfferToggle offerId={offer.id} initialActive={offer.isActive && !expired} /></td>
                    <td className="px-4 py-3"><Link href={`/admin/offers/${offer.id}/edit`} className="text-amber-600 hover:text-amber-700 text-sm font-medium">Edit</Link></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
