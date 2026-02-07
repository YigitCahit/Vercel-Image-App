import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya seçilmedi" },
        { status: 400 }
      );
    }

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Sadece görsel dosyaları yükleyebilirsiniz" },
        { status: 400 }
      );
    }

    // Max file size: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 10MB'dan küçük olmalı" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    });

    // Save to database
    const image = await prisma.image.create({
      data: {
        url: blob.url,
        filename: file.name,
        size: file.size,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Görsel başarıyla yüklendi",
      image: {
        id: image.id,
        url: image.url,
        filename: image.filename,
        size: image.size,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Görsel yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const images = await prisma.image.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Get images error:", error);
    return NextResponse.json(
      { error: "Görseller yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
