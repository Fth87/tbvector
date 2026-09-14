# Menambah fitur

1. Buat route di `src/routes/(dashboard)/<feature>/+page.svelte`.
2. Untuk fitur kecil, simpan komposisi di route. Jika membesar, pindahkan UI/domain ke `src/lib/features/<feature>`.
3. Letakkan tipe/data demo feature di feature tersebut; shared type yang dipakai beberapa fitur boleh naik ke `src/lib`.
4. Gunakan server load untuk query rahasia dan form actions untuk mutasi persistent.
5. Tambahkan menu di `src/lib/components/layout/AppSidebar.svelte`.
6. Jalankan autofixer pada komponen yang diubah, lalu `pnpm format`, `pnpm check`, dan `pnpm build`.

Jangan menyalin satu feature sebagai boilerplate. Mulai dari route terkecil yang bekerja dan ekstrak pola setelah benar-benar berulang.
