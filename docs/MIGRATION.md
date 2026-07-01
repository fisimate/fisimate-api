# Catatan Revival & Modernisasi (2026-07-01)

Project ini sempat lama tidak disentuh. Dokumen ini mencatat apa yang rusak,
apa yang diperbaiki, dan apa yang sengaja belum dikerjakan — supaya siapa pun
(termasuk future you) tidak perlu menebak-nebak lagi.

## Ringkasan

1. Perbaikan bug struktural yang membuat project tidak bisa jalan sama sekali.
2. Upgrade seluruh dependency ke versi major terbaru, termasuk migrasi semua
   breaking change yang menyertainya (Prisma 5→7, Express 4→5, Zod 3→4, Multer 1→2).
3. Server sekarang jalan normal di Node LTS terbaru (diverifikasi di Node 25),
   tidak perlu lagi pin ke versi Node lama.

## Bug struktural yang diperbaiki

- **`package.json` `start`/`dev` menunjuk ke `src/index.js`** yang tidak pernah
  ada — entrypoint sebenarnya `index.js` di root. Begitu juga `CMD` di `Dockerfile`.
- **`docker-compose.yml`** tidak punya service `postgres`, padahal script
  `npm run db` (`docker-compose up postgres`) mengasumsikan itu ada. Ditambahkan.
- **`.env.example`** tidak mendokumentasikan semua env var yang benar-benar
  dibaca kode (semula termasuk `BUCKET_NAME` untuk GCS — sudah dihapus lagi,
  lihat [Migrasi penuh ke Supabase Storage](#migrasi-penuh-ke-supabase-storage-2026-07-01) —
  serta `GEMINI_API_KEY`, `SUPABASE_PROJECT_URL`, `SUPABASE_API_KEY`,
  `FACEBOOK_CLIENT_REDIRECT`). Dilengkapi.
- **`src/lib/supabase.js`** meng-import `"../configs"` tanpa ekstensi file —
  ditolak oleh ESM resolver modern (`ERR_UNSUPPORTED_DIR_IMPORT`). Diperbaiki
  jadi `"../configs/index.js"`.
- Dependency **`crypto`** (package npm, bukan modul bawaan Node) dihapus —
  usang dan tidak diperlukan; `src/lib/crypto.js` sebenarnya sudah memakai
  modul bawaan Node (`import crypto from "crypto"` selalu resolve ke core
  module, bukan ke package npm ini).

## Kredensial eksternal yang dibutuhkan untuk boot

Beberapa module menginisialisasi client pihak ketiga **secara eager saat
di-import**, bukan lazy saat dipakai. Akibatnya server akan crash saat start
kalau env var terkait kosong, meskipun fitur itu tidak sedang dipakai:

> Catatan: `src/lib/bucket.js` (GCS) sudah dihapus, lihat
> [Migrasi penuh ke Supabase Storage](#migrasi-penuh-ke-supabase-storage-2026-07-01).
> Tabel di bawah mencerminkan state saat ini.

| File | Butuh env var | Constructor dipanggil di |
|---|---|---|
| `src/lib/supabase.js` | `SUPABASE_PROJECT_URL`, `SUPABASE_API_KEY` | top-level module |
| `src/lib/passport.js` (dipanggil dari `src/routes/auth.route.js`) | `GOOGLE_CLIENT_ID/SECRET`, `FACEBOOK_CLIENT_ID/SECRET` | saat route module di-import |

Untuk dev lokal tanpa kredensial asli, isi dengan placeholder string apa saja
(lihat `.env.example`). Fiturnya sendiri (upload file, OAuth) baru akan gagal
saat benar-benar dipanggil, bukan saat boot.

## Upgrade dependency (major version bump)

Dilakukan dengan `npx npm-check-updates -u` lalu memperbaiki setiap breaking
change satu per satu, bukan sekadar menaikkan angka versi.

### Prisma 5.8 → 7.8

Perubahan paling besar. Prisma 7 menghapus dukungan `url` langsung di
`datasource` block schema, dan `PrismaClient` sekarang **wajib** diberi driver
adapter (tidak bisa lagi hanya `new PrismaClient()`).

- `prisma/schema.prisma`: baris `url = env("DATABASE_URL")` dihapus dari
  `datasource db`.
- **`prisma.config.js`** (baru, di root): mendefinisikan `schema` path,
  `datasource.url`, dan `migrations.seed` untuk kebutuhan CLI (`migrate`,
  `db seed`, dst).
- **`src/lib/prisma.js`**: sekarang pakai `@prisma/adapter-pg` (+ package `pg`)
  untuk koneksi. Karena constructor adapter langsung membaca
  `process.env.DATABASE_URL` saat module di-import — dan urutan eksekusi ESM
  meng-hoist semua `import`, sehingga `dotenv.config()` di `index.js` bisa
  belum jalan saat module ini dievaluasi — file ini memanggil
  `dotenv.config()` sendiri di top-level-nya (pola yang sama dipakai
  `src/configs/index.js`).
- CLI Prisma (`migrate deploy`, `migrate reset`, `db seed`) sudah diverifikasi
  jalan dengan konfigurasi baru ini.
- **Peringatan keamanan bawaan Prisma 7**: CLI akan menolak menjalankan
  `migrate reset` kalau mendeteksi dipanggil oleh AI agent, kecuali env var
  `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` diisi teks persetujuan
  eksplisit dari user. Ini perilaku yang diinginkan — jangan di-bypass tanpa
  benar-benar dapat persetujuan.

### Express 4.18 → 5.2

- **Temuan penting**: di Express 5, `req.query` adalah getter tanpa setter.
  `src/middlewares/xss.js` sebelumnya melakukan `req.query = clean(req.query)`
  — assignment ini **diam-diam tidak berefek** (tidak throw, tidak error, tapi
  juga tidak mengubah apa pun), yang berarti sanitasi XSS untuk query string
  **berhenti berfungsi** begitu saja tanpa ada tanda kegagalan. Diperbaiki
  dengan memutasi object `req.query` in-place (`delete` semua key lama lalu
  `Object.assign` hasil bersih) alih-alih reassignment.
- Tidak ada route yang pakai wildcard (`*`) atau pattern regex, jadi tidak
  kena breaking change `path-to-regexp` v8 di Express 5.
- `req.body`/`req.params` masih boleh direassign seperti biasa (bukan getter).

### Zod 3.22 → 4.4

- Opsi `required_error` pada schema (`z.string({ required_error: "..." })`)
  dihapus di Zod v4, diganti `error`. Kalau tidak diganti, **tidak error saat
  runtime** — pesan custom-nya diam-diam kembali ke pesan default bahasa
  Inggris bawaan Zod. Sudah dimigrasi di `src/validations/auth.validation.js`
  dan `src/validations/user.validation.js` (satu-satunya file yang memakai
  `required_error`; tidak ada yang memakai `invalid_type_error` sehingga
  migrasi ke `error` tunggal aman/setara).
- Pattern lain (`.min()`, `.refine()`, `.string()`, `.boolean()`) tidak
  berubah perilakunya.

### Multer 1.4 → 2.2

Dicek kompatibel tanpa perubahan kode — `multer.memoryStorage()`,
`multer.diskStorage()`, `upload.single()` API-nya sama.

### Lainnya

`bcryptjs` 2→3, `nodemailer` 6→9, `helmet` 7→8, `@google-cloud/storage`
(sebelum akhirnya dihapus total, lihat
[Migrasi penuh ke Supabase Storage](#migrasi-penuh-ke-supabase-storage-2026-07-01)),
`@supabase/supabase-js`, `socket.io`, dll di-bump ke versi terbaru — dicek
tidak ada breaking change yang menyentuh kode di project ini.

## Keamanan (`npm audit`)

- `npm audit fix` membereskan 1 kerentanan **critical** (`form-data`, unsafe
  random boundary) dan 2 **high** (`ws`, `socket.io-parser`).
- Sisa kerentanan **moderate** di `@hono/node-server` (lewat tooling dev
  Prisma, `@prisma/dev`) sengaja tidak diperbaiki karena perbaikan otomatisnya
  berarti *downgrade* Prisma ke versi lama, dan tidak tersentuh di runtime
  aplikasi. Kerentanan moderate lain yang sebelumnya ada di `uuid` (lewat
  `gaxios`/`teeny-request`, transitive dependency `@google-cloud/storage`)
  ikut hilang begitu `@google-cloud/storage` dihapus total.

## Yarn → npm

`yarn` tidak terpasang di mesin dev ini. `yarn.lock` dihapus, project
sekarang pakai `package-lock.json`. Script di `package.json` yang tadinya
memanggil `yarn ...` (di dalam `db:up`, `db:down`, `db:reset`) diganti jadi
`prisma ...` / `npm run ...`. `Dockerfile` diganti dari `yarn install` ke
`npm ci`.

Kalau tim lebih suka tetap pakai yarn: `brew install yarn`, lalu
`yarn install` akan generate ulang `yarn.lock` dari `package.json` yang sudah
diupdate ini.

## Belum dikerjakan / sengaja dibiarkan

- **`src/socket.js`** (fitur generate soal via Gemini AI + Socket.IO) **tidak
  pernah di-wire** ke `index.js` — `setupSocket()` tidak pernah dipanggil.
  Fitur ini mati secara efektif sejak sebelum revival ini. `@google/generative-ai`
  di-bump ke versi terbaru (0.24.1) tapi **belum** dimigrasi ke SDK
  penerusnya (`@google/genai`) karena kodenya memang tidak aktif dipakai.
- Kredensial Supabase (database + storage) sudah diisi dengan project asli
  (lihat [Migrasi database ke Supabase Postgres](#migrasi-database-ke-supabase-postgres-2026-07-01)
  dan [Migrasi penuh ke Supabase Storage](#migrasi-penuh-ke-supabase-storage-2026-07-01)).
  Google/Facebook OAuth dan Gemini API masih placeholder — fitur terkait
  (login sosial, generate soal AI) tidak akan berfungsi sampai diisi.
- Kerentanan moderate di atas (lihat bagian Keamanan).

## Migrasi penuh ke Supabase Storage (2026-07-01)

Sebelumnya project ini punya dua jalur storage: Google Cloud Storage (legacy)
dan Supabase Storage (baru, sudah dipakai sebagian besar controller). Atas
permintaan user, semuanya dimigrasi total ke Supabase — GCS dihapus
sepenuhnya.

Eksplorasi menemukan migrasi **sebagian besar sudah dilakukan** oleh
developer sebelumnya — hampir semua controller (`chapter`, `examBank`,
`materialBank`, `formulaBank`, `simulation`, `material`, `quiz`, `quizReview`)
sudah memanggil `uploadToBucket()` versi Supabase lewat
`src/utils/uploadToBucket.js`. Tapi ada dua masalah yang membuat migrasi ini
belum benar-benar "penuh" dan belum benar-benar berfungsi:

1. **Satu jalur masih GCS mentah**: `src/services/user.service.js`
   (`updateProfilePicture`, endpoint `POST /users/profile/picture`) masih
   import langsung `src/lib/bucket.js` dan menulis lewat GCS
   `createWriteStream`. Ini persis error 500 ("Server error, tidak bisa
   upload image") yang muncul saat smoke test revival sebelumnya.
2. **Implementasi Supabase yang sudah ada punya 2 bug nyata**, baru ketahuan
   sekarang karena sebelumnya cuma dites dengan credential placeholder (belum
   pernah benar-benar tersambung ke project Supabase asli):
   - `uploadToBucket()` mengoper `file` (seluruh object multer:
     `{fieldname, originalname, mimetype, buffer, size, ...}`) sebagai body
     upload, padahal seharusnya `file.buffer`. Tipe `FileBody` Supabase SDK
     (`Buffer | Blob | ArrayBuffer | ...`) tidak menerima object sembarangan
     seperti itu.
   - Tidak mengirim `contentType` (mimetype asli file) — Supabase fallback ke
     `text/plain`, jadi gambar/PDF yang ter-upload akan salah content-type
     saat diakses.
   - Return value-nya `data.fullPath` (contoh:
     `"fisimate-bucket/chapters/icons/xxx.png"`) — ini bukan URL yang bisa
     diakses browser, hanya path internal bucket. Yang benar dipakai adalah
     `getPublicUrl()` untuk mendapat URL publik penuh
     (`https://{project}.supabase.co/storage/v1/object/public/...`), setara
     dengan URL GCS lama (`https://storage.googleapis.com/...`).

### Perubahan yang dilakukan

- **`src/utils/uploadToBucket.js`** — diperbaiki total: upload pakai
  `file.buffer` + `contentType: file.mimetype`, return lewat
  `getPublicUrl()`, nama bucket dari `configs.supabaseBucketName` (bukan
  hardcoded), dan export `uploadToBucketGCP` dihapus.
- **`src/services/user.service.js`** — `updateProfilePicture` dipindah dari
  GCS mentah ke `uploadToBucket()`, mengikuti pola yang sama seperti
  controller lain (mis. `chapter.service.js`).
- **Dihapus total**: `src/lib/bucket.js`, `src/utils/deleteFromBucket.js`
  (sudah tidak dipakai di mana pun sebelumnya), `src/utils/extractFilePath.js`
  (khusus parsing URL GCS), dependency `@google-cloud/storage`.
- **`src/configs/index.js`** — `bucketName`/`BUCKET_NAME` (GCS) dihapus,
  diganti `supabaseBucketName`/`SUPABASE_BUCKET_NAME` (opsional, default
  `"fisimate-bucket"`).
- **`prisma/seeders/user.seed.js`** — URL GCS hardcoded untuk user siswa
  diganti URL gambar publik eksternal (pola yang sama dengan 2 user lain yang
  sudah pakai `static.independent.co.uk`), bukan URL Supabase palsu, supaya
  tidak menyiratkan file itu ada di storage kita padahal tidak.

### Yang perlu disiapkan di sisi Supabase (infra, di luar kode)

Bucket dengan nama sesuai `SUPABASE_BUCKET_NAME` (default `fisimate-bucket`)
harus dibuat manual di dashboard Supabase project, dan **wajib public**
(supaya `getPublicUrl()` menghasilkan URL yang benar-benar bisa diakses tanpa
signed URL/expiry). `SUPABASE_API_KEY` yang dipakai backend harus **Secret
Key** (pengganti `service_role` key lama, bukan `anon`/Publishable Key)
supaya upload tidak terhalang RLS policy — detail di
[Supabase API keys: publishable vs secret](#supabase-api-keys-publishable-vs-secret-2026-07-01).

### Verifikasi end-to-end (setelah credential asli diisi)

Setelah user mengisi `SUPABASE_PROJECT_URL` dan `SUPABASE_API_KEY` (Secret
Key asli, lihat [Supabase API keys: publishable vs secret](#supabase-api-keys-publishable-vs-secret-2026-07-01)),
`POST /api/v1/users/profile/picture` dites ulang dan **berhasil**: response
berisi URL publik
`https://{project}.supabase.co/storage/v1/object/public/fisimate-bucket/profile-pictures/{file}.jpg`,
dan URL tersebut dikonfirmasi bisa diakses langsung via `curl -I` dengan
`content-type: image/jpeg` (bukan `text/plain`) — mengonfirmasi kedua bug di
`uploadToBucket.js` (body upload & content-type) benar-benar sudah ke-fix
oleh perbaikan di atas, bukan cuma asumsi teoretis.

## Supabase API keys: publishable vs secret (2026-07-01)

Supabase mengganti sistem key lama (`anon` / `service_role`, format JWT) ke
sistem baru: **Publishable Key** (`sb_publishable_...`, pengganti `anon`,
untuk client-side) dan **Secret Key** (`sb_secret_...`, pengganti
`service_role`, untuk server-side). Kedua sistem berjalan paralel — key lama
belum dimatikan otomatis.

`SUPABASE_API_KEY` yang dipakai project ini **harus Secret Key**, bukan
Publishable Key, karena backend melakukan operasi privileged (upload ke
Storage) memakai auth sendiri (JWT custom di `src/lib/jwt.js`), bukan lewat
Supabase Auth/RLS. Secret key tidak bisa dipakai dari browser (Supabase
otomatis menolak dengan 401 kalau terdeteksi request dari browser).

Sempat muncul pertanyaan apakah perlu pakai package `@supabase/server` (ada
di opsi dashboard) — **tidak perlu**. Package itu untuk aplikasi yang
autentikasi requestnya lewat Supabase Auth sendiri (named-key routing,
validasi JWT/session Supabase), cocok untuk Edge Functions atau app yang
Auth-nya didelegasikan ke Supabase. Fisimate API punya sistem auth sendiri,
jadi cukup `@supabase/supabase-js` yang sudah dipakai di `src/lib/supabase.js`
— tidak ada perubahan kode, cukup isi `SUPABASE_API_KEY` dengan secret key.

## Migrasi database ke Supabase Postgres (2026-07-01)

Sekalian dengan migrasi Storage, database juga dipindah dari Postgres lokal
ke Postgres bawaan project Supabase yang sama.

### Kenapa butuh dua connection string

Supabase Postgres diakses lewat PgBouncer pooler, bukan koneksi langsung.
Ada dua mode:
- **Transaction pooler** (port `6543`, perlu `?pgbouncer=true`) — cocok untuk
  query aplikasi biasa, tapi tidak mendukung fitur session-level (advisory
  lock, `SET` persisten) yang dibutuhkan Prisma Migrate untuk operasi DDL.
- **Session pooler** (port `5432`) — koneksi yang berperilaku seperti
  Postgres biasa, dipakai khusus untuk migrasi.

Karena Prisma 7 (lihat [Prisma 5.8 → 7.8](#prisma-58--78)) sudah tidak
mendukung field `url`/`directUrl` di `datasource` block schema, pemisahan dua
connection string ini dipindah ke level env var + `prisma.config.js`:

- **`DATABASE_URL`** (transaction pooler, `:6543`) — dipakai
  `src/lib/prisma.js` (runtime client via `@prisma/adapter-pg`) untuk query
  aplikasi sehari-hari.
- **`DIRECT_URL`** (session pooler, `:5432`) — dipakai `prisma.config.js`
  untuk operasi CLI (`migrate deploy`, `migrate reset`, `db seed`). Kalau
  tidak diisi, otomatis fallback ke `DATABASE_URL` (lihat
  `prisma.config.js`) — supaya setup Postgres lokal non-pooled (satu
  connection string, tanpa pooler) tetap jalan tanpa perlu isi dua var yang
  identik.

### Verifikasi

`prisma migrate deploy` (lewat `DIRECT_URL`/session pooler) berhasil
menerapkan seluruh 5 migrasi ke Postgres Supabase yang masih kosong, lalu
`npm run db:seed` (lewat `DATABASE_URL`/transaction pooler, jalur yang sama
dengan runtime app) berhasil mengisi data awal. Server di-boot ulang dan
smoke test penuh (login → JWT → fetch data terproteksi → upload file) semua
berhasil terhadap database Supabase yang baru, tidak lagi terhadap Postgres
lokal.

### Catatan

- Setup Postgres lokal (Homebrew/Docker, lihat [SETUP.md](./SETUP.md)) tetap
  didukung sebagai alternatif untuk dev offline — tidak dihapus, hanya bukan
  lagi yang dipakai `.env` aktif di mesin ini.
- `.env` berisi credential database asli (password, connection string) —
  sudah dipastikan `.env` ada di `.gitignore` sehingga tidak akan ke-commit.
