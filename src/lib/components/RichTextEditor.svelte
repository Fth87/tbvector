<script lang="ts">
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Bold from "@lucide/svelte/icons/bold";
  import Italic from "@lucide/svelte/icons/italic";
  import List from "@lucide/svelte/icons/list";
  import { Button } from "$lib/components/ui/button";

  let {
    value = "",
    onchange,
  }: { value?: string; onchange?: (html: string) => void } = $props();
  let editor = $state<Editor | null>(null);

  function setupEditor(element: HTMLDivElement) {
    const instance = new Editor({
      element,
      extensions: [StarterKit],
      content: value,
      editorProps: {
        attributes: {
          class: "min-h-40 p-3 focus:outline-none",
          role: "textbox",
          "aria-label": "Post content",
        },
      },
      onUpdate: ({ editor }) => onchange?.(editor.getHTML()),
    });
    editor = instance;
    return () => {
      instance.destroy();
      editor = null;
    };
  }
</script>

<div class="overflow-hidden rounded-md border bg-background">
  <div class="flex gap-1 border-b p-2" aria-label="Format teks">
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Tebal"
      onclick={() => editor?.chain().focus().toggleBold().run()}
      ><Bold /></Button
    >
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Miring"
      onclick={() => editor?.chain().focus().toggleItalic().run()}
      ><Italic /></Button
    >
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="List"
      onclick={() => editor?.chain().focus().toggleBulletList().run()}
      ><List /></Button
    >
  </div>
  <div {@attach setupEditor}></div>
</div>
