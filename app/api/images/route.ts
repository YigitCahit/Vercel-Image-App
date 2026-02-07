import { NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya gerekli' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Sadece resim dosyaları yüklenebilir' },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 10MB\'dan küçük olmalı' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(`images/${session.userId}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    // Save to database
    const image = await prisma.image.create({
      data: {
        url: blob.url,
        filename: file.name,
        size: file.size,
        userId: session.userId,
      },
    })

    return NextResponse.json({
      message: 'Resim yüklendi',
      image: {
        id: image.id,
        url: image.url,
        filename: image.filename,
        size: image.size,
        createdAt: image.createdAt,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Yükleme sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const images = await prisma.image.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Get images error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
