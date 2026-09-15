# Konvensi kode

- Use English for identifiers and all user-facing UI copy, including labels, buttons, placeholders, validation messages, toast notifications, empty states, metadata, and accessibility labels. Keep product names and user-provided content unchanged.
- Gunakan runes Svelte 5: `$state` hanya untuk state reaktif, `$derived` untuk nilai turunan, dan `$props` untuk props.
- Gunakan keyed `{#each}` dengan key stabil.
- Hindari `$effect` jika event handler atau `$derived` sudah cukup.
- Gunakan elemen semantik, label form, nama tombol aksesibel, dan fokus keyboard.
- Gunakan token Tailwind semantik seperti `bg-background`, `text-muted-foreground`, dan `border-border`.
- Cek shadcn-svelte lebih dulu; compose komponen resminya dan jangan menulis ulang primitive.
- Gunakan `gap-*`, bukan `space-*`; gunakan `size-*` ketika lebar dan tinggi sama.
- Maksimal satu tanggung jawab utama per file. Ekstrak komponen hanya ketika benar-benar dipakai ulang atau file sulit dibaca.

## Design system

- Gunakan Inter sebagai font utama melalui `font-sans`; jangan menambahkan font lain tanpa alasan produk yang jelas.
- Gunakan token brand dari `src/app.css`, bukan hex ad hoc di komponen: `primary` `#026B7F`, `primary-hover` `#03596E`, `secondary` `#97E3E8`, `info` `#197485`, `destructive` `#E11D48`, `warning` `#F97316`, `success` `#15803D`, `background` `#F3F3F3`, dan `card` `#FFFFFF`.
- Surface khusus device memakai token `device-surface` `#F9FBFC`; jangan menulis warna hex langsung di komponen.
- Hierarki tipografi memakai skala compact untuk dashboard: Display 1 48px, Heading 1 32px, Heading 2 28px, Heading 3 24px, Heading 4 18px, Paragraph 1 16px, Paragraph 2 14px, Button/Hyperlink 14px. Gunakan token `text-display-1`, `text-heading-*`, `text-body-*`, `text-button`, dan `text-link` agar ukuran tetap konsisten.
- Tabel, navigasi, metadata, dan kontrol sekunder boleh memakai `text-xs` 12px untuk menjaga scanability; jangan mencampur ukuran besar tanpa kebutuhan hierarki yang jelas.
- Elevation memakai satu sumber kedalaman: card tanpa border visual dan hanya shadow tipis. Radius komponen utama mengikuti token `--radius`.
- Status wajib memakai token semantik (`success`, `warning`, `destructive`, atau `info`) agar warna status konsisten dan tetap mudah diubah.
