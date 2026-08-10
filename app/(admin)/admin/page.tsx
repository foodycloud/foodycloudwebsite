import { prisma } from '@/lib/prisma'
import { ShoppingBag, UtensilsCrossed, Users, IndianRupee, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import KitchenToggle from '@/components/admin/KitchenToggle'

export default async function AdminDashboardPage() {
  const [totalOrders, newOrders, totalFoods, totalCustomers, settings, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: 'NEW' } }),
    prisma.food.count({ where: { isDeleted: false } }),
    prisma.customer.count(),
    prisma.businessSettings.findFirst(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { name: true } }, items: { select: { foodName: true } } },
    }),
  ])

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayOrders = await prisma.order.findMany({
    where: { createdAt: { gte: todayStart } },
    select: { totalAmount: true },
  })
  const todayRevenue = todayOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount.toString()), 0)

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    ACCEPTED: 'bg-yellow-100 text-yellow-700',
    PREPARING: 'bg-orange-100 text-orange-700',
    READY: 'bg-green-100 text-green-700',
    OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
    COMPLETED: 'bg-gray-100 text-gray-600',
    CANCELLED: 'bg-red-100 text-red-600',
  }

  const statusLabels: Record<string, string> = {
    NEW: 'New', ACCEPTED: 'Accepted', PREPARING: 'Preparing',
    READY: 'Ready', OUT_FOR_DELIVERY: 'Out for Delivery',
    COMPLETED: 'Completed', CANCELLED: 'Cancelled',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        {settings && <KitchenToggle initialOpen={settings.isOpen} settingsId={settings.id} />}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="New Orders" value={newOrders.toString()} color="blue" href="/admin/orders" />
        <StatCard icon={IndianRupee} label="Today's Revenue" value={formatPrice(todayRevenue)} color="green" />
        <StatCard icon={UtensilsCrossed} label="Menu Items" value={totalFoods.toString()} color="amber" href="/admin/foods" />
        <StatCard icon={Users} label="Customers" value={totalCustomers.toString()} color="purple" href="/admin/customers" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/foods/new"
            id="quick-add-food"
            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            + Add Food
          </Link>
          <Link
            href="/admin/orders"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            View Orders
          </Link>
          <Link
            href="/admin/offers/new"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Create Offer
          </Link>
          <Link
            href="/admin/settings"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Business Settings
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700 font-medium">View all</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customer.name} • {order.items.length} item(s)</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                  {statusLabels[order.orderStatus]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, href }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: 'blue' | 'green' | 'amber' | 'purple'
  href?: string
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  const card = (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )

  return href ? <Link href={href}>{card}</Link> : card
}
