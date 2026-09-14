# Konvensi kode

- Identifier berbahasa Inggris; copy UI boleh disesuaikan produk.
- Gunakan runes Svelte 5: `$state` hanya untuk state reaktif, `$derived` untuk nilai turunan, dan `$props` untuk props.
- Gunakan keyed `{#each}` dengan key stabil.
- Hindari `$effect` jika event handler atau `$derived` sudah cukup.
- Gunakan elemen semantik, label form, nama tombol aksesibel, dan fokus keyboard.
- Gunakan token Tailwind semantik seperti `bg-background`, `text-muted-foreground`, dan `border-border`.
- Cek shadcn-svelte lebih dulu; compose komponen resminya dan jangan menulis ulang primitive.
- Gunakan `gap-*`, bukan `space-*`; gunakan `size-*` ketika lebar dan tinggi sama.
- Maksimal satu tanggung jawab utama per file. Ekstrak komponen hanya ketika benar-benar dipakai ulang atau file sulit dibaca.
