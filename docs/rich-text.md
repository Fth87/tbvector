# Rich text

`src/lib/components/RichTextEditor.svelte` adalah integrasi Tiptap minimal dengan bold, italic, dan bullet list. Nilai disimpan sebagai HTML di data demo.

HTML dari pengguna wajib disanitasi di server sebelum ditampilkan dengan `{@html}`. Tambahkan ekstensi Tiptap hanya bila produk benar-benar memerlukan format tersebut.
