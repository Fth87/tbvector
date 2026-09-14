<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import Plus from "@lucide/svelte/icons/plus";
  import Pencil from "@lucide/svelte/icons/pencil";
  import Trash from "@lucide/svelte/icons/trash-2";
  import { toast } from "svelte-sonner";
  import { initialPosts, type Post } from "$lib/data";
  import { postStorage } from "$lib/browser-storage";
  import RichTextEditor from "$lib/components/RichTextEditor.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Badge } from "$lib/components/ui/badge";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Field from "$lib/components/ui/field";
  import * as Table from "$lib/components/ui/table";

  let posts = $state<Post[]>(structuredClone(initialPosts));
  let open = $state(false),
    editingId = $state<number | null>(null);
  let title = $state(""),
    content = $state("");
  const query = $derived(page.url.searchParams.get("q") ?? "");
  const status = $derived(page.url.searchParams.get("status") ?? "all");
  const visible = $derived(
    posts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) &&
          (status === "all" || post.status === status),
      )
      .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  );
  onMount(() => {
    posts = postStorage.read(initialPosts);
  });
  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  function setParam(key: string, value: string) {
    const url = new URL(page.url);
    value && value !== "all"
      ? url.searchParams.set(key, value)
      : url.searchParams.delete(key);
    void goto(resolve("/posts") + url.search, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  }
  function edit(post?: Post) {
    editingId = post?.id ?? null;
    title = post?.title ?? "";
    content = post?.content ?? "";
    open = true;
  }
  function save() {
    if (!title.trim()) return toast.error("Judul wajib diisi.");
    const entry: Post = {
      id: editingId ?? Date.now(),
      title: title.trim(),
      slug: slugify(title),
      content,
      status: editingId
        ? (posts.find((post) => post.id === editingId)?.status ?? "draft")
        : "draft",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    posts = editingId
      ? posts.map((post) => (post.id === editingId ? entry : post))
      : [entry, ...posts];
    postStorage.write(posts);
    open = false;
    toast.success(editingId ? "Post diperbarui." : "Post dibuat.");
  }
  function remove(id: number) {
    posts = posts.filter((post) => post.id !== id);
    postStorage.write(posts);
    toast.success("Post dihapus.");
  }
  function toggle(post: Post) {
    posts = posts.map((item) =>
      item.id === post.id
        ? { ...item, status: item.status === "draft" ? "published" : "draft" }
        : item,
    );
    postStorage.write(posts);
  }
</script>

<svelte:head><title>Posts · Dashboard Kit</title></svelte:head>
<div class="mx-auto flex max-w-6xl flex-col gap-6">
  <header class="flex items-end justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Posts</h1>
      <p class="text-muted-foreground">
        Kelola konten rich text dan publikasi.
      </p>
    </div>
    <Button onclick={() => edit()}
      ><Plus data-icon="inline-start" />Tambah post</Button
    >
  </header>
  <Card.Root
    ><Card.Header
      ><Card.Title>Daftar posts</Card.Title><Card.Description
        >{visible.length} konten ditemukan.</Card.Description
      ></Card.Header
    ><Card.Content class="flex flex-col gap-4"
      ><div class="grid gap-3 sm:grid-cols-2">
        <Input
          aria-label="Cari post"
          placeholder="Cari judul"
          value={query}
          oninput={(event) => setParam("q", event.currentTarget.value)}
        /><select
          class="h-9 rounded-md border bg-background px-3 text-sm"
          aria-label="Filter status"
          value={status}
          onchange={(event) => setParam("status", event.currentTarget.value)}
          ><option value="all">Semua status</option><option value="draft"
            >Draft</option
          ><option value="published">Published</option></select
        >
      </div>
      <Table.Root
        ><Table.Header
          ><Table.Row
            ><Table.Head>Judul</Table.Head><Table.Head>Status</Table.Head
            ><Table.Head>Diperbarui</Table.Head><Table.Head class="text-right"
              >Aksi</Table.Head
            ></Table.Row
          ></Table.Header
        ><Table.Body
          >{#each visible as post (post.id)}<Table.Row
              ><Table.Cell
                ><strong>{post.title}</strong><span
                  class="block text-xs text-muted-foreground">/{post.slug}</span
                ></Table.Cell
              ><Table.Cell
                ><button onclick={() => toggle(post)}
                  ><Badge
                    variant={post.status === "published"
                      ? "default"
                      : "secondary"}>{post.status}</Badge
                  ></button
                ></Table.Cell
              ><Table.Cell
                >{new Intl.DateTimeFormat("id-ID").format(
                  new Date(post.updatedAt),
                )}</Table.Cell
              ><Table.Cell class="text-right"
                ><Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${post.title}`}
                  onclick={() => edit(post)}><Pencil /></Button
                ><Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Hapus ${post.title}`}
                  onclick={() => remove(post.id)}><Trash /></Button
                ></Table.Cell
              ></Table.Row
            >{:else}<Table.Row
              ><Table.Cell colspan={4} class="h-24 text-center"
                >Tidak ada post.</Table.Cell
              ></Table.Row
            >{/each}</Table.Body
        ></Table.Root
      ></Card.Content
    ></Card.Root
  >
</div>
<Dialog.Root bind:open
  ><Dialog.Content class="sm:max-w-3xl"
    ><Dialog.Header
      ><Dialog.Title>{editingId ? "Edit post" : "Tambah post"}</Dialog.Title
      ><Dialog.Description
        >Judul, slug otomatis, dan konten rich text.</Dialog.Description
      ></Dialog.Header
    ><Field.FieldGroup
      ><Field.Field
        ><Field.Label for="post-title">Judul</Field.Label><Input
          id="post-title"
          bind:value={title}
        /></Field.Field
      ><Field.Field
        ><Field.Label>Konten</Field.Label>{#key editingId}<RichTextEditor
            value={content}
            onchange={(html) => (content = html)}
          />{/key}</Field.Field
      ></Field.FieldGroup
    ><Dialog.Footer
      ><Button variant="outline" onclick={() => (open = false)}>Batal</Button
      ><Button onclick={save}>Simpan</Button></Dialog.Footer
    ></Dialog.Content
  ></Dialog.Root
>
