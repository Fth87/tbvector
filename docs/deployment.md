# Deployment

Proyek menggunakan adapter static resmi SvelteKit dengan fallback `200.html`. `bun run build` menghasilkan folder `build/` yang dapat dipasang pada static hosting.

Konfigurasikan hosting agar route yang tidak cocok mengarah ke `200.html`. Jika aplikasi memakai database, secret, atau Form Actions, ganti adapter sesuai platform dan aktifkan SSR pada route terkait.

## Docker dan VPS

Production memakai Docker image multi-stage: Bun membangun aplikasi, lalu Caddy menyajikan folder `build/` dan mengelola HTTPS. Konfigurasi deployment ada di `deploy/`.

1. Salin `deploy/.env.example` menjadi `.env` di VPS dan isi domain serta nama image GHCR.
2. Login Docker ke `ghcr.io` dengan token yang memiliki scope minimal `read:packages` jika image bersifat private.
3. Jalankan `docker compose --env-file .env -f deploy/compose.yaml pull` lalu `docker compose --env-file .env -f deploy/compose.yaml up -d`.

Workflow `.github/workflows/ci-cd.yml` menjalankan `bun install --frozen-lockfile`, formatting check, typecheck, build, publish ke GHCR, lalu deploy image SHA ke VPS melalui SSH. Isi secrets `VPS_HOST`, `VPS_USER`, `VPS_APP_DIR`, `VPS_SSH_PRIVATE_KEY`, dan `VPS_KNOWN_HOSTS`. Isi repository variable `PUBLIC_R2_VIDEO_BASE_URL` untuk nilai yang ditanam saat build static.

## Backend

Backend berada di repo terpisah `tbvector-server` dengan CI/CD sendiri. Caddy di image ini meneruskan `/api/*` ke container `api:8000` melalui network Docker eksternal `tbvector-edge`, yang dibuat otomatis oleh job deploy kedua repo. Selama backend belum berjalan, `/api/*` menjawab `502` dan frontend tetap normal.
