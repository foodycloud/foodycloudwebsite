import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New', ACCEPTED: 'Accepted', PREPARING: 'Preparing',
  READY: 'Ready', OUT_FOR_DELIVERY: 'Out for Delivery',
  COMPLETED: 'Completed', CANCELLED: 'Cancelled', ALL: 'All Orders',
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-yellow-100 text-yellow-700',
  PREPARING: 'bg-orange-100 text-orange-700',
  READY: 'bg-green-100 text-green-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
}

export default async function OrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status || 'ALL'

  const where = status !== 'ALL' ? { orderStatus: status as never } : {}

  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: true,
      items: { select: { foodName: true, quantity: true, totalPrice: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const statusTabs = ['ALL', 'NEW', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED']

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map(s => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition ${
              status === s ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm mt-1">Orders will appear here once customers start ordering.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order', 'Customer', 'Items', 'Total', 'Type', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-gray-900">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.items.slice(0, 2).map(i => i.foodName).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{formatPrice(order.totalAmount.toString())}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">
                        {order.deliveryType === 'HOME_DELIVERY' ? '🚚 Delivery' : '🛒 Pickup'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
                        {STATUS_LABELS[order.orderStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {format(order.createdAt, 'dd MMM, HH:mm')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
