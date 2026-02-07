"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ImageData {
  id: string;
  url: string;
  filename: string;
  size: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchImages();
    }
  }, [status, router]);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      if (res.ok) {
        setImages(data.images);
      }
    } catch {
      setError("Görseller yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Görsel yüklenirken bir hata oluştu");
      } else {
        fetchImages();
      }
    } catch {
      setError("Görsel yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/images/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setImages(images.filter((img) => img.id !== id));
      } else {
        const data = await res.json();
        setError(data.error || "Görsel silinirken bir hata oluştu");
      }
    } catch {
      setError("Görsel silinirken bir hata oluştu");
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("Link kopyalanamadı");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Görsel Yükleme</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Merhaba, <strong>{session?.user?.name}</strong>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Görsel Yükle
          </h2>
          <div className="flex items-center gap-4">
            <label className="flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  ref={fileInputRef}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="text-gray-500">
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span>Yükleniyor...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 48 48"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M24 14v20m-10-10h20"
                        />
                      </svg>
                      <span>Görsel seçmek için tıklayın veya sürükleyin</span>
                      <p className="text-sm text-gray-400 mt-1">
                        PNG, JPG, GIF - Max 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Images Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Görsellerim ({images.length})
          </h2>

          {images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Henüz görsel yüklemediniz
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="border border-gray-200 rounded-lg overflow-hidden group"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyToClipboard(image.url, image.id)}
                        className="px-3 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                      >
                        {copiedId === image.id ? "Kopyalandı!" : "Linki Kopyala"}
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatSize(image.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
