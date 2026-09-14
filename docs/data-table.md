# Data table dan URL state

Tabel contoh menggunakan komponen `Table` shadcn-svelte serta array derivation native. Search, filter, sort, dan halaman dibaca dari `page.url.searchParams`; perubahan ditulis dengan `goto` menggunakan `replaceState`, `keepFocus`, dan `noScroll`.

URL adalah sumber kebenaran untuk state yang layak dibagikan. Data row tetap berasal dari repository/storage. Pasang TanStack Table hanya ketika column visibility, selection, grouping, atau server-side pagination membuat implementasi native tidak lagi sederhana.
