import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find image by ID
    const image = await prisma.image.findUnique({
      where: { id },
    })

    if (!image) {
      return new NextResponse('Resim bulunamadı', { status: 404 })
    }

    // Fetch the image from Vercel Blob
    const response = await fetch(image.url)
    
    if (!response.ok) {
      return new NextResponse('Resim yüklenemedi', { status: 500 })
    }

    const blob = await response.blob()
    
    // Return the image with proper headers
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${image.filename}"`,
      },
    })
  } catch (error) {
    console.error('Image fetch error:', error)
    return new NextResponse('Bir hata oluştu', { status: 500 })
  }
}
