# mehmetanil.dev — Kişisel Site

Backend, SQL & Full-Stack Engineer portfolyo sitesi. Next.js App Router, TypeScript, Tailwind CSS, Prisma ve PostgreSQL ile yapıldı.

## Özellikler

- Public portfolio (Ana sayfa, Hakkımda, Deneyim, Projeler)
- Blog sistemi (kategori, taslak/yayında, SEO meta)
- İletişim formu (veritabanına kayıt)
- Admin paneli (post CRUD, kategori yönetimi, dashboard)
- Dark mode (varsayılan)
- Tam TypeScript
- Zod validasyon

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS + shadcn/ui |
| ORM | Prisma |
| Veritabanı | PostgreSQL (Supabase / Neon) |
| Auth | Auth.js (Credentials) |
| Deploy | Vercel |

## Kurulum

### 1. Bağımlılıkları kur

```bash
npm install
```

### 2. Environment dosyasını oluştur

```bash
cp .env.example .env
```

`.env` içini doldur:

```env
DATABASE_URL="postgresql://user:password@host:5432/personal_site"
AUTH_SECRET="openssl rand -base64 32 ile üretilen değer"
ADMIN_PASSWORD="en az 12 karakterlik güçlü bir parola"
SUPABASE_URL="https://proje-ref.supabase.co"
SUPABASE_SECRET_KEY="Supabase server-side secret key"
SUPABASE_STORAGE_BUCKET="blog-images"
NEXTAUTH_URL="http://localhost:3000"
```

### Supabase Storage

Supabase Dashboard → Storage bölümünde `blog-images` adında **public** bir bucket oluştur.
`SUPABASE_SECRET_KEY` yalnızca sunucu ortamında ve `.env` dosyasında tutulmalıdır;
`NEXT_PUBLIC_` önekiyle tanımlanmamalı ve istemci koduna gönderilmemelidir.

### 3. Veritabanını hazırla

```bash
npm run db:push
```

### 4. Admin kullanıcı ve kategorileri oluştur

```bash
npm run db:seed
```

> Admin e-posta adresi: `admin@mehmetanil.dev`
> Parola `.env` içindeki `ADMIN_PASSWORD` değerinden alınır ve en az 12 karakter olmalıdır.

### 5. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.
Admin panel: `http://localhost:3000/admin`

## Klasör Yapısı

```
personal-site/
├── prisma/
│   ├── schema.prisma       # DB modeli
│   └── seed.ts             # Admin kullanıcı + kategoriler
├── src/
│   ├── app/
│   │   ├── (public)/       # Public sayfalar
│   │   │   ├── page.tsx            # Ana sayfa
│   │   │   ├── about/              # Hakkımda
│   │   │   ├── experience/         # Deneyim
│   │   │   ├── projects/           # Projeler
│   │   │   ├── blog/               # Blog listesi
│   │   │   ├── blog/[slug]/        # Blog detay
│   │   │   └── contact/            # İletişim
│   │   └── (admin)/
│   │       └── admin/
│   │           ├── page.tsx        # Dashboard
│   │           ├── login/          # Giriş
│   │           ├── posts/          # Post listesi + CRUD
│   │           └── categories/     # Kategori yönetimi
│   ├── actions/            # Server actions
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   ├── admin/          # PostForm
│   │   └── ui/             # shadcn/ui bileşenleri
│   ├── hooks/              # useToast
│   ├── lib/
│   │   ├── auth.ts         # Auth.js config
│   │   ├── db.ts           # Prisma client
│   │   ├── utils.ts        # cn, slugify, formatDate
│   │   ├── data.ts         # Statik proje + deneyim verisi
│   │   └── validations/    # Zod şemaları
│   └── types/              # TypeScript tipleri
└── middleware.ts            # Admin route koruması
```

## Önemli Notlar

- Telefon numarası ve kişisel e-posta **public sitede görünmüyor**
- İletişim için sadece form kullanılıyor
- GitHub ve LinkedIn URL'lerini `src/components/layout/footer.tsx` ve `src/app/(public)/contact/page.tsx` içinde güncelle
- Proje ve deneyim verisi `src/lib/data.ts` dosyasında statik olarak tutuluyor

## Deploy (Vercel)

1. GitHub'a push et
2. Vercel'de yeni proje oluştur
3. Environment variable'ları ekle (`DATABASE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_STORAGE_BUCKET`, `NEXTAUTH_URL`)
4. Deploy et

## Geliştirme Komutları

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run db:push      # DB şemasını uygula
npm run db:studio    # Prisma Studio (görsel DB)
npm run db:seed      # Seed verisi ekle
npm run lint         # ESLint
```
