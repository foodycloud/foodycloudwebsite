import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return ''
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return `₹${num.toFixed(0)}`
}

export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `FC-${year}-${random}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
