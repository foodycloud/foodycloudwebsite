import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import OfferForm from '@/components/admin/OfferForm'

export default async function EditOfferPage({ params }: { params: { id: string } }) {
  const offer = await prisma.offer.findUnique({ where: { id: params.id } })
  if (!offer) notFound()

  const formattedOffer = {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    code: offer.code,
    type: offer.type,
    value: parseFloat(offer.value.toString()),
    minOrderValue: offer.minOrderValue ? parseFloat(offer.minOrderValue.toString()) : null,
    maxDiscount: offer.maxDiscount ? parseFloat(offer.maxDiscount.toString()) : null,
    usageLimit: offer.usageLimit,
    isActive: offer.isActive,
    startsAt: offer.startsAt ? offer.startsAt.toISOString() : null,
    expiresAt: offer.expiresAt ? offer.expiresAt.toISOString() : null,
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Offer</h1>
      <OfferForm initialData={formattedOffer} offerId={offer.id} />
    </div>
  )
}
