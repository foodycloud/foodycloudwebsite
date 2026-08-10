import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><p>No customers yet. They will appear here after their first order.</p></div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Name', 'Phone', 'Orders', 'Joined'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="font-medium text-gray-900">{c.name}</p>{c.email && <p className="text-xs text-gray-400">{c.email}</p>}</td>
                  <td className="px-4 py-3"><a href={`tel:${c.phone}`} className="text-sm text-amber-600 hover:text-amber-700">{c.phone}</a></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c._count.orders} order{c._count.orders !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{format(c.createdAt, 'dd MMM yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
