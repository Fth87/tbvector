<script lang="ts">
  import Users from "@lucide/svelte/icons/users";
  import FileText from "@lucide/svelte/icons/file-text";
  import Activity from "@lucide/svelte/icons/activity";
  import { resolve } from "$app/paths";
  import * as Card from "$lib/components/ui/card";
  import { initialPosts, initialUsers } from "$lib/data";
  const stats = [
    {
      label: "Total users",
      value: initialUsers.length,
      detail: "2 akun aktif",
      icon: Users,
    },
    {
      label: "Total posts",
      value: initialPosts.length,
      detail: "1 sudah terbit",
      icon: FileText,
    },
    {
      label: "Aktivitas",
      value: 12,
      detail: "7 hari terakhir",
      icon: Activity,
    },
  ];
</script>

<svelte:head
  ><title>Dashboard · Dashboard Kit</title><meta
    name="description"
    content="Ringkasan template dashboard SvelteKit"
  /></svelte:head
>
<div class="mx-auto flex max-w-6xl flex-col gap-6">
  <header>
    <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
    <p class="text-muted-foreground">Ringkasan data dan aktivitas aplikasi.</p>
  </header>
  <section class="grid gap-4 md:grid-cols-3" aria-label="Statistik">
    {#each stats as stat (stat.label)}{@const Icon = stat.icon}<Card.Root
        ><Card.Header class="flex-row items-center justify-between"
          ><Card.Title class="text-sm font-medium">{stat.label}</Card.Title
          ><Icon class="text-muted-foreground" /></Card.Header
        ><Card.Content
          ><p class="text-3xl font-bold">{stat.value}</p>
          <p class="text-xs text-muted-foreground">
            {stat.detail}
          </p></Card.Content
        ></Card.Root
      >{/each}
  </section>
  <Card.Root
    ><Card.Header
      ><Card.Title>Mulai dari sini</Card.Title><Card.Description
        >Template siap dikembangkan tanpa domain bisnis bawaan.</Card.Description
      ></Card.Header
    ><Card.Content class="grid gap-3 sm:grid-cols-2"
      ><a class="rounded-md border p-4 hover:bg-muted" href={resolve("/users")}
        ><strong>Kelola users</strong>
        <p class="text-sm text-muted-foreground">
          Contoh tabel dan CRUD dialog.
        </p></a
      ><a class="rounded-md border p-4 hover:bg-muted" href={resolve("/posts")}
        ><strong>Kelola posts</strong>
        <p class="text-sm text-muted-foreground">
          Contoh konten dengan status publikasi.
        </p></a
      ></Card.Content
    ></Card.Root
  >
</div>
