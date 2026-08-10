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
  couponCode?: string
  couponDiscount?: number
  customer: {
    name: string
    phone: string
    email?: string
    deliveryType: 'HOME_DELIVERY' | 'SELF_PICKUP'
    deliveryAddress?: string
    specialRequest?: string
  }
}) {
  const finalTotal = Math.max(0, input.subtotal - (input.couponDiscount ?? 0))

  const lines = [
    '🍽️ *New Order — Foody Cloud*',
    '',
    '*Items:*',
    ...input.items.map(
      (item) => `  • ${item.name}  ×${item.quantity}  =  ₹${(item.price * item.quantity).toFixed(0)}`
    ),
    '',
    `*Subtotal:* ₹${input.subtotal.toFixed(0)}`,
  ]

  if (input.couponCode && input.couponDiscount && input.couponDiscount > 0) {
    lines.push(`*Coupon (${input.couponCode}):* -₹${input.couponDiscount.toFixed(0)}`)
    lines.push(`*Total Payable:* ₹${finalTotal.toFixed(0)}`)
  }

  lines.push('')
  lines.push('*Customer Details:*')
  lines.push(`Name: ${input.customer.name || '-'}`)
  lines.push(`Phone: ${input.customer.phone || '-'}`)
  lines.push(
    `Delivery: ${input.customer.deliveryType === 'HOME_DELIVERY' ? '🚗 Home delivery' : '🏃 Self pickup'}`
  )

  if (input.customer.deliveryType === 'HOME_DELIVERY') {
    lines.push(`Address: ${input.customer.deliveryAddress || '-'}`)
  }

  if (input.customer.email) lines.push(`Email: ${input.customer.email}`)
  if (input.customer.specialRequest)
    lines.push(`Special request: ${input.customer.specialRequest}`)

  lines.push('')
  lines.push('Please share the prepaid payment details. 🙏')

  return lines.join('\n')
}
