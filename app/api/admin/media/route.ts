import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ media })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Generate signed upload params for client-side Cloudinary upload
    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = 'foody-cloud'
    const params = { timestamp, folder }
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!)

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { url, publicId, filename, altText, width, height, sizeBytes } = body

    const media = await prisma.media.create({
      data: { url, publicId, filename, altText, width, height, sizeBytes },
    })

    return NextResponse.json({ media }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save media record' }, { status: 500 })
  }
}
