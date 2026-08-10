import { prisma } from '@/lib/prisma'
import KitchenToggle from '@/components/admin/KitchenToggle'
import Link from 'next/link'
import { ShoppingBag, IndianRupee, UtensilsCrossed, Users, Plus, Ticket, Settings, Info } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export default async function AdminDashboard() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    totalOrders,
    newOrders,
    totalFoods,
    totalCustomers,
    settings,
    recentOrders,
    todayOrders
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: 'NEW' } }),
    prisma.food.count({ where: { isDeleted: false } }),
    prisma.customer.count(),
    prisma.businessSettings.findFirst(),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { customer: true, items: true }
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: todayStart }, orderStatus: { not: 'CANCELLED' } },
      select: { totalAmount: true }
    })
  ])

  const todayRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0)
  const isKitchenOpen = settings?.isOpen ?? true

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    ACCEPTED: 'bg-yellow-100 text-yellow-700',
    PREPARING: 'bg-orange-100 text-orange-700',
    READY: 'bg-green-100 text-green-700',
    OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Kitchen Status Hero */}
      <div className="bg-gradient-to-r from-stone-950 to-stone-800 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
        <div className="flex items-center space-x-6 mb-6 md:mb-0">
          <div className="relative flex h-16 w-16 items-center justify-center">
            {isKitchenOpen ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20"></span>
                <span className="relative inline-flex rounded-full h-8 w-8 bg-green-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-8 w-8 bg-red-500"></span>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              {isKitchenOpen ? 'KITCHEN IS OPEN' : 'KITCHEN IS CLOSED'}
            </h2>
            <p className="text-stone-400 text-lg mt-1">
              {isKitchenOpen ? 'Accepting new orders from customers' : 'Not accepting orders right now'}
            </p>
          </div>
        </div>
        {settings && (
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <KitchenToggle initialOpen={isKitchenOpen} settingsId={settings.id} />
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/orders?status=NEW" className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col group hover:-translate-y-1 transition-transform shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="text-amber-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{newOrders}</p>
            </div>
          </div>
        </Link>
        
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <IndianRupee className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{formatPrice(todayRevenue)}</p>
            </div>
          </div>
        </div>

        <Link href="/admin/foods" className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col group hover:-translate-y-1 transition-transform shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Menu Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalFoods}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/customers" className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col group hover:-translate-y-1 transition-transform shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/foods/new" className="bg-white hover:bg-amber-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center group transition-colors shadow-sm h-32">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-amber-700" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">Add Food</span>
          </Link>

          <Link href="/admin/orders" className="bg-white hover:bg-blue-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center group transition-colors shadow-sm h-32">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5 text-blue-700" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">Manage Orders</span>
          </Link>

          <Link href="/admin/offers/new" className="bg-white hover:bg-green-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center group transition-colors shadow-sm h-32">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Ticket className="w-5 h-5 text-green-700" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">Create Coupon</span>
          </Link>

          <Link href="/admin/settings" className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center group transition-colors shadow-sm h-32">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5 text-gray-700" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">Settings</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          <Link href="/admin/orders" className="text-amber-600 font-semibold text-sm hover:text-amber-700">View All</Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No orders received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="p-4 pl-6">
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        <span className="font-mono font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                          {order.orderNumber}
                        </span>
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="block text-gray-900 font-medium">
                        {order.customer?.name || 'Guest'}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="block text-gray-600">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="block font-bold text-gray-900">
                        {formatPrice(order.totalAmount.toString())}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                          {order.orderStatus}
                        </span>
                      </Link>
                    </td>
                    <td className="p-4 pr-6">
                      <Link href={`/admin/orders/${order.id}`} className="block text-gray-500 text-sm">
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
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
