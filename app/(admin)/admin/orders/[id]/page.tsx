import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { customer: true, items: true, offers: { include: { offer: true } } },
  })

  if (!order) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{format(order.createdAt, 'EEEE, dd MMMM yyyy \u2022 HH:mm')}</p>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.orderStatus} currentPaymentStatus={order.paymentStatus} />
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Customer</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-gray-500">Name</p><p className="font-medium text-gray-900">{order.customer.name}</p></div>
          <div><p className="text-gray-500">Phone</p><p className="font-medium text-gray-900">{order.customer.phone}</p></div>
          {order.customer.email && <div><p className="text-gray-500">Email</p><p className="font-medium text-gray-900">{order.customer.email}</p></div>}
          <div><p className="text-gray-500">Delivery Type</p><p className="font-medium text-gray-900">{order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Self Pickup'}</p></div>
          {order.deliveryAddress && <div className="col-span-2"><p className="text-gray-500">Address</p><p className="font-medium text-gray-900">{order.deliveryAddress}</p></div>}
          {order.specialRequest && <div className="col-span-2"><p className="text-gray-500">Special Request</p><p className="font-medium text-gray-900">{order.specialRequest}</p></div>}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.foodName}</p>
                {item.variantName && <p className="text-xs text-gray-500">{item.variantName}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatPrice(item.totalPrice.toString())}</p>
                <p className="text-xs text-gray-500">{item.quantity} × {formatPrice(item.unitPrice.toString())}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>{formatPrice(order.subtotal.toString())}</span>
          </div>
          {parseFloat(order.deliveryCharge.toString()) > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Charge</span><span>{formatPrice(order.deliveryCharge.toString())}</span>
            </div>
          )}
          {parseFloat(order.discountAmount.toString()) > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span><span>- {formatPrice(order.discountAmount.toString())}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
            <span>Total</span><span>{formatPrice(order.totalAmount.toString())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment</span>
            <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
              {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Manual payment' : 'Online prepaid'}
              {' - '}{order.paymentStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
