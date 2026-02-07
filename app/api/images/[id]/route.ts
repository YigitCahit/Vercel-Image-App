import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Find image
    const image = await prisma.image.findUnique({
      where: { id },
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Resim bulunamadı' },
        { status: 404 }
      )
    }

    // Check ownership
    if (image.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Bu resmi silme yetkiniz yok' },
        { status: 403 }
      )
    }

    // Delete from Vercel Blob
    try {
      await del(image.url)
    } catch (error) {
      console.error('Blob delete error:', error)
    }

    // Delete from database
    await prisma.image.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Resim silindi' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Silme sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}
