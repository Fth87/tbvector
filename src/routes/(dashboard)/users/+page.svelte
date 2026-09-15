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
  import * as Sidebar from "$lib/components/ui/sidebar";

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
      return toast.error("A valid name and email are required.");
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
    toast.success(editingId ? "User updated." : "User added.");
  }
  function remove(id: number) {
    users = users.filter((user) => user.id !== id);
    userStorage.write(users);
    toast.success("User deleted.");
  }
</script>

<svelte:head><title>Users · Dashboard Kit</title></svelte:head>
<div class="mx-auto flex max-w-6xl flex-col gap-6">
  <header class="flex items-end justify-between gap-4">
    <div class="flex min-w-0 items-center gap-3">
      <Sidebar.Trigger aria-label="Toggle sidebar" />
      <div class="min-w-0">
        <h1 class="text-heading-3 font-bold tracking-tight">Users</h1>
        <p class="text-muted-foreground">
          Search, filter, sort, paginate, and persist CRUD data.
        </p>
      </div>
    </div>
    <Button onclick={() => edit()}
      ><Plus data-icon="inline-start" />Add user</Button
    >
  </header>
  <Card.Root
    ><Card.Header
      ><Card.Title>User list</Card.Title><Card.Description
        >{filtered.length} accounts found.</Card.Description
      ></Card.Header
    ><Card.Content class="flex flex-col gap-4">
      <div class="grid gap-3 sm:grid-cols-3">
        <Input
          aria-label="Search users"
          placeholder="Search by name or email"
          value={query}
          oninput={(event) => setParam("q", event.currentTarget.value)}
        /><select
          class="h-9 rounded-md border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Filter status"
          value={status}
          onchange={(event) => setParam("status", event.currentTarget.value)}
          ><option value="all">All statuses</option><option value="active"
            >Active</option
          ><option value="inactive">Inactive</option></select
        ><select
          class="h-9 rounded-md border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Sort users"
          value={sort}
          onchange={(event) => setParam("sort", event.currentTarget.value)}
          ><option value="name">Sort by name</option><option value="email"
            >Sort by email</option
          ></select
        >
      </div>
      <Table.Root
        ><Table.Header
          ><Table.Row
            ><Table.Head>Name</Table.Head><Table.Head>Role</Table.Head
            ><Table.Head>Status</Table.Head><Table.Head class="text-right"
              >Actions</Table.Head
            ></Table.Row
          ></Table.Header
        ><Table.Body
          >{#each visible as user (user.id)}<Table.Row
              class="transition-colors hover:bg-muted/50"
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
                  aria-label={`Delete ${user.name}`}
                  onclick={() => remove(user.id)}><Trash /></Button
                ></Table.Cell
              ></Table.Row
            >{:else}<Table.Row
              ><Table.Cell colspan={4} class="h-24 text-center"
                >No users found.</Table.Cell
              ></Table.Row
            >{/each}</Table.Body
        ></Table.Root
      >
      <div class="flex items-center justify-between text-sm">
        <span>Page {Math.min(currentPage, pages)} of {pages}</span>
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onclick={() => setParam("page", String(currentPage - 1))}
            >Previous</Button
          ><Button
            variant="outline"
            size="sm"
            disabled={currentPage >= pages}
            onclick={() => setParam("page", String(currentPage + 1))}
            >Next</Button
          >
        </div>
      </div>
    </Card.Content></Card.Root
  >
</div>
<Dialog.Root bind:open
  ><Dialog.Content
    ><Dialog.Header
      ><Dialog.Title>{editingId ? "Edit user" : "Add user"}</Dialog.Title
      ><Dialog.Description>Changes are saved in the browser.</Dialog.Description
      ></Dialog.Header
    ><Field.FieldGroup
      ><Field.Field
        ><Field.Label for="user-name">Name</Field.Label><Input
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
      ><Button variant="outline" onclick={() => (open = false)}>Cancel</Button
      ><Button onclick={save}>Save</Button></Dialog.Footer
    ></Dialog.Content
  ></Dialog.Root
>
