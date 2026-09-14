<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar";
  import AppSidebar from "$lib/components/layout/AppSidebar.svelte";
  let { children } = $props();
</script>

<Sidebar.Provider
  ><AppSidebar /><Sidebar.Inset
    ><header class="flex h-14 items-center gap-3 border-b px-4">
      <Sidebar.Trigger aria-label="Buka atau tutup menu" /><span
        class="font-medium">Template Dashboard</span
      >
    </header>
    <main class="flex-1 p-4 md:p-8">{@render children()}</main></Sidebar.Inset
  ></Sidebar.Provider
>
