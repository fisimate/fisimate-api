# Setup Lokal

Panduan menjalankan Fisimate API di mesin lokal.

## Prasyarat

- Node.js 20+ (project menargetkan Node LTS terbaru; sudah diverifikasi jalan di Node 25)
- Database Postgres — project ini pakai **Supabase Postgres** (lihat
  [MIGRATION.md](./MIGRATION.md#migrasi-database-ke-supabase-postgres-2026-07-01)),
  tapi Postgres lokal (Homebrew/native atau Docker) tetap bisa dipakai untuk dev offline.
- npm (project menggunakan `package-lock.json`, bukan `yarn.lock`)

## Langkah

1. **Install dependencies**

   ```bash
   npm install
   ```

   Saat instalasi, npm mungkin meminta approval untuk script `prisma` dan
   `@prisma/engines` (dibutuhkan untuk mengunduh query engine Prisma):

   ```bash
   npm approve-scripts prisma @prisma/engines
   ```

2. **Siapkan database**

   **Opsi A — Supabase Postgres (dipakai project ini):**

   Ambil connection string dari Supabase Dashboard → Project Settings →
   Database → Connect → tab "ORMs" → "Prisma". Akan ada dua string:
   - Transaction pooler (port `6543`, `?pgbouncer=true`) → untuk `DATABASE_URL`
   - Session pooler (port `5432`) → untuk `DIRECT_URL` (dipakai Prisma Migrate)

   **Opsi B — Postgres lokal (untuk dev offline):**

   ```bash
   psql -d postgres -c "CREATE ROLE fisimate WITH LOGIN PASSWORD 'fisimate';"
   psql -d postgres -c "CREATE DATABASE fisimate OWNER fisimate;"
   ```

   Atau jalankan via Docker (lihat `docker-compose.yml`, service `postgres`):

   ```bash
   npm run db
   ```

   Untuk opsi lokal, `DATABASE_URL` dan `DIRECT_URL` boleh sama persis (atau
   `DIRECT_URL` dikosongkan saja — otomatis fallback ke `DATABASE_URL`, lihat
   `prisma.config.js`).

3. **Buat file `.env`**

   Salin dari `.env.example` dan isi minimal. Contoh untuk Supabase Postgres:

   ```
   DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
   JWT_SECRET=<random string>
   JWT_EXP=1d
   JWT_REFRESH_SECRET=<random string>
   JWT_REFRESH_EXP=7d
   ```

   Atau untuk Postgres lokal:

   ```
   DATABASE_URL="postgresql://fisimate:fisimate@localhost:5432/fisimate?schema=public"
   JWT_SECRET=<random string>
   JWT_EXP=1d
   JWT_REFRESH_SECRET=<random string>
   JWT_REFRESH_EXP=7d
   ```

   Var lain (`SUPABASE_PROJECT_URL`, `SUPABASE_API_KEY`, `GOOGLE_CLIENT_*`,
   `FACEBOOK_CLIENT_*`, `GEMINI_API_KEY`) **wajib diisi dengan sesuatu** (boleh
   placeholder) agar server bisa boot, karena beberapa modul
   (`src/lib/supabase.js`, `src/lib/passport.js`) menginisialisasi client-nya
   secara eager saat modul di-import — bukan lazy saat dipakai. Lihat
   [MIGRATION.md](./MIGRATION.md#kredensial-eksternal-yang-dibutuhkan-untuk-boot)
   untuk detail.

   `SUPABASE_BUCKET_NAME` opsional, default `fisimate-bucket` kalau dikosongkan.

   Fitur yang bergantung pada kredensial asli (upload file ke Supabase Storage,
   OAuth Google/Facebook, generate soal AI) tidak akan berfungsi sampai diisi
   kredensial sungguhan. Untuk upload file, bucket dengan nama tersebut juga
   harus sudah dibuat sebagai **public bucket** di dashboard Supabase — lihat
   [MIGRATION.md](./MIGRATION.md#migrasi-penuh-ke-supabase-storage-2026-07-01).

4. **Migrasi & seed database**

   ```bash
   npx prisma migrate deploy   # terapkan migrasi yang ada
   npm run db:seed             # isi data awal (roles, users, chapters, dst.)
   ```

   Untuk reset total (hapus semua data lalu migrasi + seed ulang):

   ```bash
   npm run db:reset
   ```

   > Perintah ini destruktif. Jangan jalankan terhadap database produksi.

5. **Jalankan server**

   ```bash
   npm run dev     # dengan nodemon, auto-reload
   # atau
   npm start
   ```

   Server berjalan di `http://localhost:8080` (atau `PORT` di `.env`).

## Verifikasi cepat

```bash
curl http://localhost:8080/
# -> "Hello world"

curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"siswa@gmail.com","password":"siswa123"}'
# -> access_token, refresh_token, data user (kredensial dari seed data)
```

Akun hasil seed (lihat `prisma/seeders/user.seed.js`):

| Role | Email | Password |
|---|---|---|
| user (siswa) | siswa@gmail.com | siswa123 |
| teacher (guru) | guru@gmail.com | guru12345 |
| admin | admin@gmail.com | admin |

## Docker

```bash
npm run docker        # build & jalankan fisimate-api + postgres
npm run docker-down   # matikan
```
