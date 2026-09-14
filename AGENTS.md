# Aturan proyek

## Stack dan package manager

- Gunakan SvelteKit, Svelte 5 runes, TypeScript strict, Tailwind CSS 4, dan shadcn-svelte.
- Gunakan PNPM untuk install dan seluruh script.

## Sebelum menulis kode

1. Baca `docs/architecture.md`, `docs/conventions.md`, dan `docs/features.md`.
2. Cari bagian relevan melalui `npx @sveltejs/mcp list-sections`, lalu baca dengan `get-documentation`.
3. Cek komponen resmi shadcn-svelte sebelum membuat primitive UI baru.
4. Jalankan `svelte-autofixer` untuk setiap `.svelte` yang diubah.

## Verifikasi

Jalankan `pnpm format`, `pnpm check`, dan `pnpm build` sebelum selesai.
