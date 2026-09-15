# Deployment

Proyek menggunakan adapter static resmi SvelteKit dengan fallback `200.html`. `bun run build` menghasilkan folder `build/` yang dapat dipasang pada static hosting.

Konfigurasikan hosting agar route yang tidak cocok mengarah ke `200.html`. Jika aplikasi memakai database, secret, atau Form Actions, ganti adapter sesuai platform dan aktifkan SSR pada route terkait.
