# Görsel Hosting - Vercel Image App

Vercel'e deploy edilebilir görsel hosting uygulaması. Görsellerinizi yükleyin ve web üzerinde link ile kullanın.

## Özellikler

- Kullanıcı kayıt ve giriş sistemi
- Görsel yükleme (drag & drop destekli)
- Görselleri link ile paylaşma
- Görsel silme
- Responsive tasarım

## Teknolojiler

- **Next.js 14** - React framework
- **Vercel Postgres** - Veritabanı
- **Vercel Blob** - Görsel depolama
- **Prisma** - ORM
- **Tailwind CSS** - Styling
- **JWT** - Authentication

---

## 🚀 Deploy Talimatları

### 1. GitHub Repository Oluşturma

```bash
# Proje klasörüne gidin
cd Vercel-Image-App

# Git repository başlatın
git init

# Tüm dosyaları ekleyin
git add .

# İlk commit
git commit -m "Initial commit"

# GitHub'da yeni bir repository oluşturun ve bağlayın
git remote add origin https://github.com/KULLANICI_ADINIZ/vercel-image-app.git
git branch -M main
git push -u origin main
```

### 2. Vercel'de Proje Oluşturma

1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub hesabınızla giriş yapın
3. **"New Project"** butonuna tıklayın
4. GitHub repository'nizi seçin (vercel-image-app)
5. **"Import"** butonuna tıklayın
6. Framework olarak **Next.js** otomatik seçilecek
7. Henüz **Deploy** butonuna TIKLAMAYIN!

### 3. Vercel Postgres Kurulumu

1. Vercel Dashboard'da projenize gidin
2. **"Storage"** sekmesine tıklayın
3. **"Create Database"** → **"Postgres"** seçin
4. Database ismi girin (örn: `image-app-db`)
5. **"Create"** butonuna tıklayın
6. Database oluşturulunca otomatik olarak `DATABASE_URL` environment variable eklenecek

### 4. Vercel Blob Kurulumu

1. Yine **"Storage"** sekmesinde
2. **"Create Database"** → **"Blob"** seçin
3. Store ismi girin (örn: `image-app-blob`)
4. **"Create"** butonuna tıklayın
5. Otomatik olarak `BLOB_READ_WRITE_TOKEN` environment variable eklenecek

### 5. JWT Secret Ekleme

1. Projenizin **"Settings"** sekmesine gidin
2. **"Environment Variables"** bölümüne tıklayın
3. Yeni variable ekleyin:
   - Name: `JWT_SECRET`
   - Value: Rastgele uzun bir string (örn: `my-super-secret-jwt-key-12345`)
4. **"Save"** butonuna tıklayın

### 6. Deploy

1. **"Deployments"** sekmesine gidin
2. **"Redeploy"** butonuna tıklayın veya
3. Yeni bir commit push'layın:

```bash
git commit --allow-empty -m "Trigger deploy"
git push
```

### 7. Veritabanı Migrasyonu

İlk deploy'dan sonra Prisma migration'ını çalıştırmanız gerekiyor:

**Seçenek A - Vercel CLI ile:**
```bash
# Vercel CLI kurulumu
npm i -g vercel

# Vercel'e giriş
vercel login

# Projeyi bağlayın 
vercel link

# Environment variables'ları çekin
vercel env pull .env.local

# Prisma migration
npx prisma db push
```

**Seçenek B - Vercel Dashboard'dan:**
1. Projenizin **"Functions"** sekmesine gidin
2. Bir API route çağırarak Prisma'nın şemayı otomatik sync etmesini bekleyin

---

## 📋 Environment Variables Özeti

Vercel projenizde şu environment variables'ların olması gerekiyor:

| Variable | Kaynak | Açıklama |
|----------|--------|----------|
| `DATABASE_URL` | Vercel Postgres | Otomatik eklenir |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob | Otomatik eklenir |
| `JWT_SECRET` | Manuel | Kendiniz eklemeniz gerekir |

---

## 🔧 Lokal Geliştirme

```bash
# Bağımlılıkları yükleyin
npm install

# Environment variables dosyası oluşturun
cp .env.example .env.local
# .env.local dosyasını düzenleyin

# Prisma client oluşturun
npx prisma generate

# Veritabanı şemasını senkronize edin
npx prisma db push

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

---

## 📝 Kullanım

1. Ana sayfadan **"Hesap Oluştur"** butonuna tıklayın
2. Email ve şifre ile kayıt olun
3. Dashboard'a yönlendirileceksiniz
4. Görselleri sürükleyip bırakın veya **"Dosya Seçin"** butonuna tıklayın
5. Yüklenen görsellerin üzerine gelerek **"Link Kopyala"** butonuna tıklayın
6. Kopyalanan linki web'de istediğiniz yerde kullanın

---

## 📄 Lisans

MIT
