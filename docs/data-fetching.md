# Data dan persistence

Template dapat dijalankan tanpa backend. `src/lib/browser-storage.ts` menyimpan data demo users dan posts ke `localStorage`; kegagalan membaca data akan kembali ke seed typed di `src/lib/data.ts`.

Untuk aplikasi nyata, ganti storage browser dengan repository di `src/lib/server`, ambil data melalui `+page.server.ts`, dan lakukan mutasi melalui Form Actions. Jangan menaruh token, secret, otorisasi, atau data sensitif di browser storage.
