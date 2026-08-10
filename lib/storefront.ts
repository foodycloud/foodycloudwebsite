import type { CartItem } from '@/context/CartContext'

export const WHATSAPP_DISPLAY = '90071 82421'
export const WHATSAPP_INTERNATIONAL = '919007182421'

export function getWhatsAppUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_INTERNATIONAL}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function buildOrderWhatsAppMessage(input: {
  items: CartItem[]
  subtotal: number
  customer: {
    name: string
    phone: string
    email?: string
    deliveryType: 'HOME_DELIVERY' | 'SELF_PICKUP'
    deliveryAddress?: string
    specialRequest?: string
  }
}) {
  const lines = [
    'Hi Foody Cloud, I want to place an order.',
    '',
    'Items:',
    ...input.items.map((item) => `- ${item.name} x ${item.quantity} = Rs ${item.price * item.quantity}`),
    '',
    `Subtotal: Rs ${input.subtotal}`,
    '',
    'Customer details:',
    `Name: ${input.customer.name || '-'}`,
    `Phone: ${input.customer.phone || '-'}`,
    `Delivery: ${input.customer.deliveryType === 'HOME_DELIVERY' ? 'Home delivery' : 'Self pickup'}`,
  ]

  if (input.customer.deliveryType === 'HOME_DELIVERY') {
    lines.push(`Address: ${input.customer.deliveryAddress || '-'}`)
  }

  if (input.customer.email) lines.push(`Email: ${input.customer.email}`)
  if (input.customer.specialRequest) lines.push(`Special request: ${input.customer.specialRequest}`)

  lines.push('', 'Please share the prepaid payment details.')

  return lines.join('\n')
}
