<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import LayoutDashboard from "@lucide/svelte/icons/layout-dashboard";
  import Users from "@lucide/svelte/icons/users";
  import FileText from "@lucide/svelte/icons/file-text";
  import * as Sidebar from "$lib/components/ui/sidebar";
  const items = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/users", icon: Users },
    { label: "Posts", href: "/posts", icon: FileText },
  ] as const;
</script>

<Sidebar.Root collapsible="icon">
  <Sidebar.Header class="p-3"
    ><Sidebar.Menu
      ><Sidebar.MenuItem
        ><Sidebar.MenuButton
          size="lg"
          tooltipContent="Dashboard Kit"
          class="justify-start group-data-[collapsible=icon]:justify-center"
          >{#snippet child({ props })}<a
              href={resolve("/dashboard")}
              aria-label="Dashboard Kit"
              {...props}
              ><span
                class="grid size-8 shrink-0 place-items-center rounded-md bg-primary font-bold text-primary-foreground"
                >D</span
              ><span
                class="truncate font-semibold group-data-[collapsible=icon]:hidden"
                >Dashboard Kit</span
              ></a
            >{/snippet}</Sidebar.MenuButton
        ></Sidebar.MenuItem
      ></Sidebar.Menu
    ></Sidebar.Header
  >
  <Sidebar.Content
    ><Sidebar.Group
      ><Sidebar.GroupLabel>Menu</Sidebar.GroupLabel><Sidebar.GroupContent
        ><Sidebar.Menu
          >{#each items as item (item.href)}{@const Icon =
              item.icon}<Sidebar.MenuItem
              ><Sidebar.MenuButton
                isActive={page.url.pathname.startsWith(item.href)}
                tooltipContent={item.label}
                >{#snippet child({ props })}<a
                    href={resolve(item.href)}
                    {...props}><Icon /><span>{item.label}</span></a
                  >{/snippet}</Sidebar.MenuButton
              ></Sidebar.MenuItem
            >{/each}</Sidebar.Menu
        ></Sidebar.GroupContent
      ></Sidebar.Group
    ></Sidebar.Content
  >
  <Sidebar.Footer class="p-3 text-xs text-muted-foreground"
    >Template v0.2</Sidebar.Footer
  >
</Sidebar.Root>
