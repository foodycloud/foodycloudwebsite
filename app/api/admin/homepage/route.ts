import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const homepageSchema = z.object({
  heroHeading: z.string().max(200).optional(),
  heroSubheading: z.string().max(300).optional(),
  heroImageUrl: z.string().url().optional().nullable(),
  featuredFoodIds: z.array(z.string()).optional(),
  featuredCategoryIds: z.array(z.string()).optional(),
  bannerText: z.string().max(200).optional().nullable(),
  bannerImageUrl: z.string().url().optional().nullable(),
  bannerLinkUrl: z.string().url().optional().nullable(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let settings = await prisma.homepageSettings.findFirst()
    if (!settings) {
      settings = await prisma.homepageSettings.create({
        data: { featuredFoodIds: [], featuredCategoryIds: [] },
      })
    }
    return NextResponse.json({ settings })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch homepage settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = homepageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
    }

    let settings = await prisma.homepageSettings.findFirst()
    if (!settings) {
      settings = await prisma.homepageSettings.create({
        data: { featuredFoodIds: [], featuredCategoryIds: [] },
      })
    }

    const updated = await prisma.homepageSettings.update({
      where: { id: settings.id },
      data: parsed.data,
    })

    return NextResponse.json({ settings: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update homepage settings' }, { status: 500 })
  }
}
