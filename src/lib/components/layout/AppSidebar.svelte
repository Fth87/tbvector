<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import LayoutGrid from "@lucide/svelte/icons/layout-grid";
  import Video from "@lucide/svelte/icons/video";
  import Clock3 from "@lucide/svelte/icons/clock-3";
  import Monitor from "@lucide/svelte/icons/monitor";
  import FileText from "@lucide/svelte/icons/file-text";
  import Settings from "@lucide/svelte/icons/settings";
  import LogOut from "@lucide/svelte/icons/log-out";
  import { goto } from "$app/navigation";
  import * as Sidebar from "$lib/components/ui/sidebar";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    await goto(resolve("/login"));
  }

  const items = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "Live Monitoring", href: "/monitoring", icon: Video },
    { label: "Event History", href: "/posts", icon: Clock3 },
    { label: "Devices", href: "/devices", icon: Monitor },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ] as const;

  const isItemActive = (
    label: (typeof items)[number]["label"],
    pathname: string,
  ) =>
    label === "Overview" && pathname === "/dashboard"
      ? true
      : label === "Event History" && pathname.startsWith("/posts")
        ? true
        : label === "Live Monitoring" && pathname.startsWith("/monitoring")
          ? true
          : label === "Devices" && pathname.startsWith("/devices")
            ? true
            : label === "Reports" && pathname.startsWith("/reports")
              ? true
              : label === "Settings" && pathname.startsWith("/settings")
                ? true
                : false;
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
              ><img
                src="/Logo%20horizontal.png"
                alt="Dashboard Kit"
                class="h-8 w-auto max-w-36 object-contain group-data-[collapsible=icon]:hidden"
              /><img
                src="/logo%20vertical.png"
                alt=""
                aria-hidden="true"
                class="hidden size-8 object-contain group-data-[collapsible=icon]:block"
              /></a
            >{/snippet}</Sidebar.MenuButton
        ></Sidebar.MenuItem
      ></Sidebar.Menu
    ></Sidebar.Header
  >
  <Sidebar.Content
    ><Sidebar.Group
      ><Sidebar.GroupLabel>Menu</Sidebar.GroupLabel><Sidebar.GroupContent
        ><Sidebar.Menu class="gap-2"
          >{#each items as item (item.label)}{@const Icon =
              item.icon}{@const isActive = isItemActive(
              item.label,
              page.url.pathname,
            )}<Sidebar.MenuItem
              ><Sidebar.MenuButton {isActive} tooltipContent={item.label}
                >{#snippet child({ props })}<a
                    href={resolve(item.href)}
                    {...props}
                    ><Icon aria-hidden="true" /><span>{item.label}</span></a
                  >{/snippet}</Sidebar.MenuButton
              ></Sidebar.MenuItem
            >{/each}</Sidebar.Menu
        ></Sidebar.GroupContent
      ></Sidebar.Group
    ></Sidebar.Content
  ><Sidebar.Footer class="p-3"
    ><Sidebar.Menu
      ><Sidebar.MenuItem
        ><Sidebar.MenuButton tooltipContent="Logout" onclick={logout}
          ><LogOut /><span>Logout</span></Sidebar.MenuButton
        ></Sidebar.MenuItem
      ></Sidebar.Menu
    ></Sidebar.Footer
  >
</Sidebar.Root>
