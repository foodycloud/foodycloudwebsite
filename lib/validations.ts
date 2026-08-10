import { z } from 'zod'

export const foodSchema = z.object({
  name: z.string().min(1, 'Food name is required').max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive('Price must be greater than 0'),
  discountPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isVeg: z.boolean().default(true),
  isJainAvail: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  imageUrl: z.string().url().optional().nullable(),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50),
  description: z.string().max(200).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  imageUrl: z.string().url().optional().nullable(),
})

export const offerSchema = z.object({
  title: z.string().min(1, 'Offer title is required').max(100),
  description: z.string().max(300).optional(),
  code: z.string().max(20).optional().nullable(),
  type: z.enum(['PERCENTAGE', 'FLAT', 'FREE_DELIVERY']),
  value: z.number().positive('Discount value must be greater than 0'),
  minOrderValue: z.number().min(0).optional().nullable(),
  maxDiscount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
})

export const checkoutSchema = z
  .object({
    name: z.string().min(1, 'Your name is required').max(100),
    phone: z
      .string()
      .min(10, 'Please enter a valid 10-digit phone number')
      .max(15)
      .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'),
    email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    deliveryType: z.enum(['HOME_DELIVERY', 'SELF_PICKUP']),
    deliveryAddress: z.string().max(300).optional(),
    specialRequest: z.string().max(300).optional(),
  })
  .refine(
    (data) => {
      if (data.deliveryType === 'HOME_DELIVERY') {
        return data.deliveryAddress && data.deliveryAddress.trim().length > 0
      }
      return true
    },
    {
      message: 'Delivery address is required for home delivery',
      path: ['deliveryAddress'],
    },
  )

export const businessSettingsSchema = z.object({
  businessName: z.string().min(1).max(100),
  tagline: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(300).optional(),
  fssaiNumber: z.string().max(20).optional(),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  isOpen: z.boolean(),
  acceptingOrders: z.boolean(),
  closedMessage: z.string().max(300).optional(),
  lunchStartTime: z.string().optional(),
  dinnerStartTime: z.string().optional(),
  deliveryCharge: z.number().min(0),
  freeDeliveryAbove: z.number().positive().optional().nullable(),
  minOrderAmount: z.number().min(0),
  selfPickupEnabled: z.boolean(),
  homeDeliveryEnabled: z.boolean(),
})
