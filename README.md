# Pemantauan & Pengelolaan PJP

Aplikasi web untuk memantau dan mengelola Perusahaan Jasa Pertambangan (PJP), dibangun dengan Laravel + Inertia.js + React.

Terdiri dari 3 tahapan utama:
1. Persyaratan, Seleksi, dan Penetapan
2. Tanggung Jawab, Pemantauan, dan Pelaporan
3. Evaluasi

## Menjalankan secara lokal

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

Jalankan server backend dan build asset frontend secara bersamaan:

```bash
composer run dev
```

Atau secara terpisah:

```bash
php artisan serve
npm run dev
```

Buka [http://localhost:8000](http://localhost:8000) di browser.
