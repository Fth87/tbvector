# Arsitektur

## Prinsip

- Route SvelteKit hanya berada di `src/routes`.
- Kode domain berada di `src/lib/features/<feature>` ketika sebuah route mulai kompleks.
- Primitive resmi shadcn-svelte berada di `src/lib/components/ui`; layout lintas route di `src/lib/components/layout`.
- Kode rahasia atau akses database wajib berada di `src/lib/server` dan hanya diimpor server load/action.
- Gunakan `$lib` untuk shared code. Jangan membuat alias atau lapisan baru tanpa kebutuhan nyata.

## Rendering dan data

Area dashboard memakai CSR dan prerender karena persistence demo berada di browser. Gunakan `+page.server.ts` untuk data rahasia dan Form Actions untuk mutasi server. Ganti `browser-storage.ts` dengan repository server ketika persistence nyata dibutuhkan.

## Dependency

`routes → features → components/data`. Shared code tidak boleh mengimpor route. Feature tidak boleh saling mengimpor internal feature lain.
