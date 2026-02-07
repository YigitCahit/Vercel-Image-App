import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Görsel Yükleme
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Görsellerinizi yükleyin, paylaşın ve web üzerinde kullanın
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition border border-blue-200"
          >
            Kayıt Ol
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-3">📤</div>
            <h3 className="font-semibold text-gray-800 mb-2">Kolay Yükleme</h3>
            <p className="text-gray-500 text-sm">
              Sürükle bırak ile hızlıca görsel yükleyin
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-semibold text-gray-800 mb-2">Anında Link</h3>
            <p className="text-gray-500 text-sm">
              Yüklenen görsellerin linkini hemen kopyalayın
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="font-semibold text-gray-800 mb-2">Her Yerde Kullanın</h3>
            <p className="text-gray-500 text-sm">
              Web sitenizde, sosyal medyada veya e-postalarda kullanın
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
