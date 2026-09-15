<script lang="ts">
  import { onMount } from "svelte";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import UserRound from "@lucide/svelte/icons/user-round";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import AppSidebar from "$lib/components/layout/AppSidebar.svelte";

  let now = $state<Date | null>(null);

  onMount(() => {
    const updateTime = () => (now = new Date());
    updateTime();
    const timer = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(timer);
  });

  const formatDate = (date: Date | null) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date)
      : "—";

  const formatTime = (date: Date | null) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(date)
      : "--:--:--";

  let { children } = $props();
</script>

<Sidebar.Provider
  class="!bg-gradient-to-br from-[#F1F8F9]  to-[#97E3E8]"
  ><AppSidebar /><Sidebar.Inset class="!bg-transparent"
    ><header
      class="flex min-h-20 items-center justify-between gap-4 bg-transparent px-4 lg:px-8"
    >
      <div class="flex min-w-0 items-center gap-3">
        <Sidebar.Trigger aria-label="Toggle sidebar" />
        <div class="min-w-0">
          <p class="truncate text-xs text-muted-foreground">
            Hi Andri Setiawan,
          </p>
          <h1
            class="truncate text-lg font-bold tracking-tight text-foreground lg:text-xl"
          >
            Welcome Back!
          </h1>
        </div>
      </div>

      <div
        class="hidden shrink-0 items-stretch rounded-2xl bg-card p-2 shadow-xs lg:flex"
      >
        <div class="flex items-center gap-2 px-3">
          <span
            class="grid size-8 place-items-center rounded-lg bg-success/10 text-success"
          >
            <span
              class="size-2 rounded-full bg-success shadow-[0_0_0_3px] shadow-success/10"
              aria-hidden="true"
            ></span>
          </span>
          <div class="leading-tight">
            <p
              class="text-[11px] font-bold uppercase tracking-wide text-success"
            >
              System Online
            </p>
            <p class="text-[11px] text-muted-foreground">
              All devices operational
            </p>
          </div>
        </div>

        <button class="flex items-center gap-3 px-4 text-left" type="button">
          <div class="leading-tight">
            <p class="text-[10px] text-muted-foreground">Facility</p>
            <p class="text-xs font-semibold">Main Facility</p>
          </div>
          <ChevronDown
            class="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
        </button>

        <div class="px-4 leading-tight">
          <p class="text-[11px] text-muted-foreground">{formatDate(now)}</p>
          <p class="text-sm font-bold tabular-nums tracking-tight">
            {formatTime(now)}
          </p>
        </div>

        <div class="flex items-center gap-2 pl-4 pr-2">
          <span
            class="grid size-8 place-items-center rounded-full border border-primary/15 bg-primary/5 text-primary"
          >
            <UserRound class="size-4" aria-hidden="true" />
          </span>
          <div class="leading-tight">
            <p class="text-xs font-semibold">Admin</p>
            <p class="text-[11px] text-muted-foreground">Operator</p>
          </div>
        </div>
      </div>
    </header>
    <main class="flex-1 p-4 lg:p-8">{@render children()}</main></Sidebar.Inset
  ></Sidebar.Provider
>
