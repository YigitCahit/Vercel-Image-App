import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { del } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Görsel bulunamadı" },
        { status: 404 }
      );
    }

    if (image.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bu görseli silme yetkiniz yok" },
        { status: 403 }
      );
    }

    // Delete from Vercel Blob
    await del(image.url);

    // Delete from database
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Görsel başarıyla silindi",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Görsel silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
