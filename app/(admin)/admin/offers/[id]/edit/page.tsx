import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import OfferForm from '@/components/admin/OfferForm'
export default async function EditOfferPage({ params }: { params: { id: string } }) {
  const offer = await prisma.offer.findUnique({ where: { id: params.id } })
  if (!offer) notFound()
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Offer</h1>
      <OfferForm initialData={offer} offerId={offer.id} />
    </div>
  )
}
