import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, Clock, Truck } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Order Confirmation' }

const STATUS_INFO: Record<string, { label: string; icon: string; desc: string; color: string }> = {
  NEW: { label: 'Order Received', icon: '✅', desc: 'Your order has been received and is waiting for confirmation.', color: 'blue' },
  ACCEPTED: { label: 'Order Accepted', icon: '👍', desc: 'Great! Your order has been accepted by the kitchen.', color: 'yellow' },
  PREPARING: { label: 'Being Prepared', icon: '🍳', desc: 'The kitchen is preparing your food fresh right now.', color: 'orange' },
  READY: { label: 'Ready', icon: '📦', desc: 'Your order is ready! It will be on its way soon.', color: 'green' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: '🚚', desc: 'Your order is on its way to you!', color: 'purple' },
  COMPLETED: { label: 'Delivered', icon: '🎉', desc: 'Your order has been delivered. Enjoy your meal!', color: 'green' },
  CANCELLED: { label: 'Cancelled', icon: '❌', desc: 'This order has been cancelled. Please contact us if you have questions.', color: 'red' },
}

export default async function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { customer: { select: { name: true, phone: true } }, items: true },
  })

  if (!order) notFound()

  const statusInfo = STATUS_INFO[order.orderStatus] || STATUS_INFO['NEW']

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* Status */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{statusInfo.icon}</div>
        <h1 className="font-display text-2xl font-bold text-gray-900">{statusInfo.label}</h1>
        <p className="text-gray-500 text-sm mt-2">{statusInfo.desc}</p>
        <div className="mt-4 inline-block bg-gray-100 rounded-full px-4 py-1.5">
          <span className="font-mono font-bold text-gray-800">{order.orderNumber}</span>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <span className="font-medium text-gray-900">{item.foodName}</span>
                <span className="text-gray-500"> × {item.quantity}</span>
              </div>
              <span className="font-semibold text-gray-900">{formatPrice(item.totalPrice.toString())}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>{formatPrice(order.subtotal.toString())}</span>
          </div>
          {parseFloat(order.deliveryCharge.toString()) > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span><span>{formatPrice(order.deliveryCharge.toString())}</span>
            </div>
          )}
          {parseFloat(order.discountAmount.toString()) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span><span>-{formatPrice(order.discountAmount.toString())}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span><span>{formatPrice(order.totalAmount.toString())}</span>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Customer</span>
            <span className="text-gray-900 font-medium">{order.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery</span>
            <span className="text-gray-900">{order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Self Pickup'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="text-gray-900">Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-amber-50 rounded-xl p-4 text-center text-sm text-amber-800">
        <p>Questions? Call or WhatsApp us at</p>
        <a href="tel:+919007182421" className="font-bold text-lg text-amber-900">90071 82421</a>
      </div>

      <div className="text-center mt-6">
        <Link href="/menu" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
          ← Order more food
        </Link>
      </div>
    </div>
  )
}
