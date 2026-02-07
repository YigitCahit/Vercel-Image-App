# Görsel Yükleme - Image Hosting

Vercel için görsel yükleme ve paylaşma uygulaması.

## Özellikler

- ✅ Kullanıcı kaydı ve girişi
- ✅ Görsel yükleme (PNG, JPG, GIF - max 10MB)
- ✅ Görsel silme
- ✅ Link kopyalama
- ✅ Vercel Blob ile görsel depolama
- ✅ PostgreSQL veritabanı

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Ortam değişkenlerini ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri doldurun:

```bash
cp .env.example .env
```

### 3. Veritabanını ayarlayın

PostgreSQL veritabanı oluşturun ve migration yapın:

```bash
npx prisma migrate dev --name init
```

### 4. Uygulamayı çalıştırın

```bash
npm run dev
```

## Vercel Deployment

### 1. Vercel'de Blob Storage oluşturun

1. Vercel Dashboard'a gidin
2. Storage > Create Database > Blob
3. Token'ı kopyalayın

### 2. Vercel Postgres oluşturun

1. Storage > Create Database > Postgres
2. Bağlantı bilgilerini kopyalayın

### 3. Environment Variables

Vercel projesinde aşağıdaki environment variables'ı ekleyin:

- `DATABASE_URL` - PostgreSQL bağlantı URL'i
- `NEXTAUTH_SECRET` - Güvenli bir secret key
- `NEXTAUTH_URL` - Production URL'iniz (örn: https://your-app.vercel.app)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token

### 4. Deploy

```bash
vercel
```

## Kullanım

1. Kayıt olun veya giriş yapın
2. Dashboard'da görsel yükleyin
3. Yüklenen görselin linkini kopyalayın
4. Web sitenizde veya başka yerlerde kullanın

## Teknolojiler

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js
- Prisma ORM
- PostgreSQL
- Vercel Blob Storage

## Lisans

MIT
