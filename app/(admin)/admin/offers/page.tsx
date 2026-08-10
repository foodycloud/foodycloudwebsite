import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Ticket, Info, Check, Copy, Pencil } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import OfferToggle from '@/components/admin/OfferToggle';
import CouponCopyButton from './CouponCopyButton';

export default async function OffersPage() {
  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const getStatus = (offer: any) => {
    const now = new Date();
    if (!offer.isActive) return { label: 'Inactive', color: 'bg-gray-100 text-gray-700' };
    if (offer.expiresAt && new Date(offer.expiresAt) < now) return { label: 'Expired', color: 'bg-red-100 text-red-700' };
    if (offer.startsAt && new Date(offer.startsAt) > now) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    return { label: 'Active', color: 'bg-green-100 text-green-700' };
  };

  const formatDiscount = (type: string, value: number) => {
    if (type === 'PERCENTAGE') return `${value}% OFF`;
    if (type === 'FLAT') return `${formatPrice(value)} OFF`;
    if (type === 'FREE_DELIVERY') return 'FREE DELIVERY';
    return '';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Coupons & Offers</h1>
          <p className="text-gray-500 mt-1">Create coupon codes customers can enter at checkout</p>
        </div>
        <Link
          href="/admin/offers/new"
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full transition-colors flex items-center justify-center shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Coupon
        </Link>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm font-medium">
          <span className="font-bold">💡 How coupons work:</span> Create a code like SAVE20. Customers enter it at cart checkout to get a discount. If you don't set a code, the offer applies automatically to all qualifying orders.
        </p>
      </div>

      {/* Grid */}
      {offers.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center mt-8">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Ticket className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No coupons yet</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Create your first discount code to boost sales and reward customers.
          </p>
          <Link
            href="/admin/offers/new"
            className="px-6 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-colors"
          >
            Create Coupon
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const status = getStatus(offer);
            return (
              <div key={offer.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                
                {/* Top Row */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-gray-900 pr-4 leading-tight">{offer.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Coupon Code Block */}
                {offer.code ? (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">🎟️ Coupon Code</p>
                    <div className="bg-amber-50 rounded-xl p-3 flex items-center justify-between border border-amber-100">
                      <span className="text-xl font-black font-mono text-amber-700 tracking-widest pl-2">
                        {offer.code}
                      </span>
                      <CouponCopyButton code={offer.code} />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 bg-gray-50 rounded-xl p-3 flex items-center justify-center border border-gray-100">
                    <span className="text-sm font-bold text-gray-500">Auto-applied offer</span>
                  </div>
                )}

                {/* Discount Details */}
                <div className="mb-6 space-y-1">
                  <p className={`text-3xl font-black ${status.label === 'Active' ? 'bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                    {formatDiscount(offer.type, offer.value)}
                  </p>
                  {offer.minOrderValue && offer.minOrderValue > 0 && (
                    <p className="text-sm font-medium text-gray-500">Min order {formatPrice(offer.minOrderValue)}</p>
                  )}
                  {offer.type === 'PERCENTAGE' && offer.maxDiscount && offer.maxDiscount > 0 && (
                    <p className="text-sm font-medium text-gray-500">Max discount cap {formatPrice(offer.maxDiscount)}</p>
                  )}
                </div>

                {/* Usage Progress */}
                {offer.usageLimit && offer.usageLimit > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                      <span>Usage</span>
                      <span>{offer.usageCount} / {offer.usageLimit}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${Math.min(100, (offer.usageCount / offer.usageLimit) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Expiry */}
                <div className="mb-6 text-sm font-medium text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  {offer.expiresAt ? `Expires: ${new Date(offer.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No expiry date'}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <OfferToggle offerId={offer.id} initialStatus={offer.isActive} />
                  <Link
                    href={`/admin/offers/${offer.id}/edit`}
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
