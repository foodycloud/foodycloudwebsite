import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, Clock, MessageCircle, PackageCheck, Truck, XCircle, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { getWhatsAppUrl, WHATSAPP_DISPLAY } from '@/lib/storefront'

export const metadata: Metadata = { title: 'Order Confirmation' }

const STATUS_INFO: Record<string, { label: string; desc: string; color: string; Icon: LucideIcon }> = {
  NEW: { label: 'Order received', desc: 'Your order is waiting for kitchen confirmation.', color: 'text-blue-700 bg-blue-50 border-blue-200', Icon: Clock },
  ACCEPTED: { label: 'Order accepted', desc: 'Your order has been accepted by the kitchen.', color: 'text-amber-800 bg-amber-50 border-amber-200', Icon: CheckCircle },
  PREPARING: { label: 'Being prepared', desc: 'The kitchen is preparing your food fresh right now.', color: 'text-orange-800 bg-orange-50 border-orange-200', Icon: Clock },
  READY: { label: 'Ready', desc: 'Your order is ready for pickup or delivery.', color: 'text-green-800 bg-green-50 border-green-200', Icon: PackageCheck },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', desc: 'Your order is on its way to you.', color: 'text-purple-800 bg-purple-50 border-purple-200', Icon: Truck },
  COMPLETED: { label: 'Completed', desc: 'Your order has been completed. Enjoy your meal.', color: 'text-green-800 bg-green-50 border-green-200', Icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', desc: 'This order has been cancelled. Please contact us if you have questions.', color: 'text-red-800 bg-red-50 border-red-200', Icon: XCircle },
}

export default async function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { customer: { select: { name: true, phone: true } }, items: true },
  })

  if (!order) notFound()

  const statusInfo = STATUS_INFO[order.orderStatus] || STATUS_INFO.NEW
  const StatusIcon = statusInfo.Icon

  return (
    <div className="container-page max-w-3xl py-10">
      <div className={`rounded-2xl border p-6 text-center ${statusInfo.color}`}>
        <StatusIcon className="mx-auto mb-3 h-10 w-10" />
        <h1 className="font-display text-3xl font-bold">{statusInfo.label}</h1>
        <p className="mt-2 text-sm">{statusInfo.desc}</p>
        <div className="mt-5 inline-flex rounded-full bg-white px-4 py-2 font-mono text-sm font-black text-stone-950">
          {order.orderNumber}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-stone-950">Order details</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm">
              <div>
                <span className="font-bold text-stone-950">{item.foodName}</span>
                <span className="text-stone-500"> x {item.quantity}</span>
              </div>
              <span className="font-bold text-stone-950">{formatPrice(item.totalPrice.toString())}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span><span>{formatPrice(order.subtotal.toString())}</span>
          </div>
          {parseFloat(order.deliveryCharge.toString()) > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Delivery</span><span>{formatPrice(order.deliveryCharge.toString())}</span>
            </div>
          )}
          {parseFloat(order.discountAmount.toString()) > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount</span><span>-{formatPrice(order.discountAmount.toString())}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 text-lg font-black text-stone-950">
            <span>Total</span><span>{formatPrice(order.totalAmount.toString())}</span>
          </div>
        </div>
        <div className="mt-5 grid gap-3 border-t border-stone-200 pt-4 text-sm sm:grid-cols-3">
          <Detail label="Customer" value={order.customer.name} />
          <Detail label="Delivery" value={order.deliveryType === 'HOME_DELIVERY' ? 'Home delivery' : 'Self pickup'} />
          <Detail label="Payment" value={order.paymentMethod === 'ONLINE' ? 'Online prepaid' : 'Manual payment'} />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5 text-center text-sm text-green-900">
        <p className="font-semibold">Need help with this order?</p>
        <a href={getWhatsAppUrl(`Hi Foody Cloud, I need help with order ${order.orderNumber}.`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-3 font-black text-white">
          <MessageCircle className="h-4 w-4" />
          WhatsApp {WHATSAPP_DISPLAY}
        </a>
      </div>

      <div className="mt-6 text-center">
        <Link href="/menu" className="text-sm font-bold text-amber-700 hover:text-stone-950">
          Order more food
        </Link>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-50 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p>
      <p className="mt-1 font-bold text-stone-950">{value}</p>
    </div>
  )
}
