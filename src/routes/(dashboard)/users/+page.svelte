<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import Plus from "@lucide/svelte/icons/plus";
  import Pencil from "@lucide/svelte/icons/pencil";
  import Trash from "@lucide/svelte/icons/trash-2";
  import { toast } from "svelte-sonner";
  import { initialUsers, type User } from "$lib/data";
  import { userStorage } from "$lib/browser-storage";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Badge } from "$lib/components/ui/badge";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Field from "$lib/components/ui/field";
  import * as Table from "$lib/components/ui/table";

  const pageSize = 5;
  let users = $state<User[]>(structuredClone(initialUsers));
  let open = $state(false),
    editingId = $state<number | null>(null);
  let name = $state(""),
    email = $state("");
  const query = $derived(page.url.searchParams.get("q") ?? "");
  const status = $derived(page.url.searchParams.get("status") ?? "all");
  const sort = $derived(page.url.searchParams.get("sort") ?? "name");
  const currentPage = $derived(
    Math.max(1, Number(page.url.searchParams.get("page")) || 1),
  );
  const filtered = $derived.by(() =>
    users
      .filter(
        (user) =>
          `${user.name} ${user.email}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === "all" || user.status === status),
      )
      .toSorted((a, b) =>
        String(a[sort as "name" | "email"]).localeCompare(
          String(b[sort as "name" | "email"]),
        ),
      ),
  );
  const pages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
  const visible = $derived(
    filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
  );

  onMount(() => {
    users = userStorage.read(initialUsers);
  });
  function setParam(key: string, value: string) {
    const url = new URL(page.url);
    value && value !== "all"
      ? url.searchParams.set(key, value)
      : url.searchParams.delete(key);
    if (key !== "page") url.searchParams.delete("page");
    void goto(resolve("/users") + url.search, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  }
  function edit(user?: User) {
    editingId = user?.id ?? null;
    name = user?.name ?? "";
    email = user?.email ?? "";
    open = true;
  }
  function save() {
    if (!name.trim() || !email.includes("@"))
      return toast.error("Nama dan email valid wajib diisi.");
    users = editingId
      ? users.map((user) =>
          user.id === editingId
            ? { ...user, name: name.trim(), email: email.trim() }
            : user,
        )
      : [
          ...users,
          {
            id: Date.now(),
            name: name.trim(),
            email: email.trim(),
            role: "viewer",
            status: "active",
          },
        ];
    userStorage.write(users);
    open = false;
    toast.success(editingId ? "User diperbarui." : "User ditambahkan.");
  }
  function remove(id: number) {
    users = users.filter((user) => user.id !== id);
    userStorage.write(users);
    toast.success("User dihapus.");
  }
</script>

<svelte:head><title>Users · Dashboard Kit</title></svelte:head>
<div class="mx-auto flex max-w-6xl flex-col gap-6">
  <header class="flex items-end justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Users</h1>
      <p class="text-muted-foreground">
        Search, filter, sort, pagination, dan CRUD persistent.
      </p>
    </div>
    <Button onclick={() => edit()}
      ><Plus data-icon="inline-start" />Tambah user</Button
    >
  </header>
  <Card.Root
    ><Card.Header
      ><Card.Title>Daftar users</Card.Title><Card.Description
        >{filtered.length} akun ditemukan.</Card.Description
      ></Card.Header
    ><Card.Content class="flex flex-col gap-4">
      <div class="grid gap-3 sm:grid-cols-3">
        <Input
          aria-label="Cari user"
          placeholder="Cari nama atau email"
          value={query}
          oninput={(event) => setParam("q", event.currentTarget.value)}
        /><select
          class="h-9 rounded-md border bg-background px-3 text-sm"
          aria-label="Filter status"
          value={status}
          onchange={(event) => setParam("status", event.currentTarget.value)}
          ><option value="all">Semua status</option><option value="active"
            >Aktif</option
          ><option value="inactive">Nonaktif</option></select
        ><select
          class="h-9 rounded-md border bg-background px-3 text-sm"
          aria-label="Urutkan"
          value={sort}
          onchange={(event) => setParam("sort", event.currentTarget.value)}
          ><option value="name">Urutkan nama</option><option value="email"
            >Urutkan email</option
          ></select
        >
      </div>
      <Table.Root
        ><Table.Header
          ><Table.Row
            ><Table.Head>Nama</Table.Head><Table.Head>Role</Table.Head
            ><Table.Head>Status</Table.Head><Table.Head class="text-right"
              >Aksi</Table.Head
            ></Table.Row
          ></Table.Header
        ><Table.Body
          >{#each visible as user (user.id)}<Table.Row
              ><Table.Cell
                ><strong>{user.name}</strong><span
                  class="block text-xs text-muted-foreground">{user.email}</span
                ></Table.Cell
              ><Table.Cell
                ><Badge variant="outline">{user.role}</Badge></Table.Cell
              ><Table.Cell
                ><Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                  >{user.status}</Badge
                ></Table.Cell
              ><Table.Cell class="text-right"
                ><Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${user.name}`}
                  onclick={() => edit(user)}><Pencil /></Button
                ><Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Hapus ${user.name}`}
                  onclick={() => remove(user.id)}><Trash /></Button
                ></Table.Cell
              ></Table.Row
            >{:else}<Table.Row
              ><Table.Cell colspan={4} class="h-24 text-center"
                >Tidak ada user.</Table.Cell
              ></Table.Row
            >{/each}</Table.Body
        ></Table.Root
      >
      <div class="flex items-center justify-between text-sm">
        <span>Halaman {Math.min(currentPage, pages)} dari {pages}</span>
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onclick={() => setParam("page", String(currentPage - 1))}
            >Sebelumnya</Button
          ><Button
            variant="outline"
            size="sm"
            disabled={currentPage >= pages}
            onclick={() => setParam("page", String(currentPage + 1))}
            >Berikutnya</Button
          >
        </div>
      </div>
    </Card.Content></Card.Root
  >
</div>
<Dialog.Root bind:open
  ><Dialog.Content
    ><Dialog.Header
      ><Dialog.Title>{editingId ? "Edit user" : "Tambah user"}</Dialog.Title
      ><Dialog.Description>Perubahan tersimpan di browser.</Dialog.Description
      ></Dialog.Header
    ><Field.FieldGroup
      ><Field.Field
        ><Field.Label for="user-name">Nama</Field.Label><Input
          id="user-name"
          bind:value={name}
        /></Field.Field
      ><Field.Field
        ><Field.Label for="user-email">Email</Field.Label><Input
          id="user-email"
          type="email"
          bind:value={email}
        /></Field.Field
      ></Field.FieldGroup
    ><Dialog.Footer
      ><Button variant="outline" onclick={() => (open = false)}>Batal</Button
      ><Button onclick={save}>Simpan</Button></Dialog.Footer
    ></Dialog.Content
  ></Dialog.Root
>
