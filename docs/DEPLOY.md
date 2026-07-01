# Deploy ke VPS (PM2 + Nginx)

Panduan ini untuk deploy `fisimate-api` ke VPS pribadi, jalan di PORT **3005**,
di-manage oleh PM2, dan di-expose lewat Nginx reverse proxy ke domain
`fisimate-api.rafiadipramana.dev` (dengan HTTPS via Let's Encrypt).

Asumsi: VPS Ubuntu/Debian, akses root/sudo via SSH. Database sudah di
Supabase Postgres (lihat `docs/MIGRATION.md`), jadi **tidak perlu** setup
Postgres di VPS ini.

## 0. Prasyarat DNS

Sebelum mulai, pastikan domain `fisimate-api.rafiadipramana.dev` sudah punya
DNS record **A** (atau AAAA) yang mengarah ke IP publik VPS ini. Certbot di
langkah 6 butuh ini sudah aktif (propagasi bisa beberapa menit — bisa dicek
dengan `dig fisimate-api.rafiadipramana.dev`).

## 1. Install Node.js, PM2, Nginx di VPS

```bash
# Node.js LTS (pakai NodeSource, sesuaikan versi jika perlu)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 (process manager)
sudo npm install -g pm2

# Nginx
sudo apt-get install -y nginx

# Certbot untuk SSL (Let's Encrypt)
sudo apt-get install -y certbot python3-certbot-nginx
```

## 2. Clone & setup project

```bash
cd /var/www   # atau lokasi lain pilihanmu
git clone <URL_REPO_GIT_KAMU> fisimate-api
cd fisimate-api

npm ci
```

Buat file `.env` di root project (isi sesuai `.env.example`), lalu generate
Prisma client dan jalankan migration:

```bash
cp .env.example .env
nano .env   # isi semua secret: DATABASE_URL, JWT_SECRET, SUPABASE_*, dll.

npx prisma generate
npx prisma migrate deploy   # apply migration ke database Supabase
```

## 3. Jalankan dengan PM2

Repo ini sudah punya `ecosystem.config.cjs` yang di-set jalan di **PORT
3005**. Dari root project:

```bash
pm2 start ecosystem.config.cjs
pm2 save                # simpan process list biar auto-restart saat reboot
pm2 startup             # ikuti instruksi output-nya untuk enable systemd service
```

Cek statusnya:

```bash
pm2 status
pm2 logs fisimate-api
```

Untuk deploy update di kemudian hari:

```bash
cd /var/www/fisimate-api
git pull
npm ci
npx prisma generate
npx prisma migrate deploy
pm2 restart fisimate-api
```

## 4. Konfigurasi Nginx (reverse proxy)

Copy `docs/nginx/fisimate-api.conf` dari repo ini ke
`/etc/nginx/sites-available/fisimate-api.rafiadipramana.dev`:

```bash
sudo cp docs/nginx/fisimate-api.conf /etc/nginx/sites-available/fisimate-api.rafiadipramana.dev
sudo ln -s /etc/nginx/sites-available/fisimate-api.rafiadipramana.dev /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Aktifkan HTTPS dengan Certbot

```bash
sudo certbot --nginx -d fisimate-api.rafiadipramana.dev
```

Certbot akan otomatis mengubah config Nginx untuk redirect HTTP → HTTPS dan
setup auto-renewal (`certbot renew` lewat systemd timer, biasanya sudah
aktif otomatis setelah instalasi).

## 6. Verifikasi

```bash
curl -I https://fisimate-api.rafiadipramana.dev
curl https://fisimate-api.rafiadipramana.dev/api/v1
```

Harus dapat response dari server (bukan connection refused / 502).

## Troubleshooting

- **502 Bad Gateway**: cek `pm2 status` — app harus `online` dan listen di
  port 3005 (`pm2 logs fisimate-api` untuk lihat error boot, biasanya env var
  yang belum diisi — lihat tabel kredensial di `docs/MIGRATION.md`).
- **Certbot gagal**: pastikan DNS sudah propagate dan port 80 tidak diblok
  firewall (`sudo ufw allow 'Nginx Full'` kalau pakai ufw).
- **PM2 tidak restart otomatis setelah reboot server**: pastikan sudah
  jalankan `pm2 save` setelah `pm2 startup`.
