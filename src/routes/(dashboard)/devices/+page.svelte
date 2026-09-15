<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import Camera from "@lucide/svelte/icons/camera";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Cpu from "@lucide/svelte/icons/cpu";
  import Database from "@lucide/svelte/icons/database";
  import MapPin from "@lucide/svelte/icons/map-pin";
  import Mic from "@lucide/svelte/icons/mic";
  import Search from "@lucide/svelte/icons/search";
  import Wifi from "@lucide/svelte/icons/wifi";
  import Zap from "@lucide/svelte/icons/zap";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as InputGroup from "$lib/components/ui/input-group";
  import * as Pagination from "$lib/components/ui/pagination";
  import * as Select from "$lib/components/ui/select";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import * as Table from "$lib/components/ui/table";
  import { cn } from "$lib/utils.js";

  type DeviceStatus = "Online" | "Offline";
  type Device = {
    id: string;
    serialNumber: string;
    location: string;
    facility: string;
    zone: string;
    status: DeviceStatus;
    microphone: "OK" | "Error";
    camera: "OK" | "Error";
    aiEngine: "OK" | "Error";
    network: "Connected" | "Disconnected";
    storage: number;
    temperature: number;
    lastCough: string;
    firmware: string;
    lastSync: string;
  };

  type DeviceActivity = {
    device: string;
    activity: string;
    time: string;
  };

  const devices: Device[] = [
    {
      id: "TBV-001",
      serialNumber: "TBV-001-2025-0001",
      location: "Waiting Area A",
      facility: "City General Hospital",
      zone: "Zone 1",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 40,
      temperature: 42,
      lastCough: "1 min ago",
      firmware: "1.2.4",
      lastSync: "1 minute ago",
    },
    {
      id: "TBV-002",
      serialNumber: "TBV-002-2025-0002",
      location: "Reception",
      facility: "City General Hospital",
      zone: "Zone 2",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 22,
      temperature: 39,
      lastCough: "2 min ago",
      firmware: "1.2.4",
      lastSync: "2 minutes ago",
    },
    {
      id: "TBV-003",
      serialNumber: "TBV-003-2025-0003",
      location: "Waiting Area B",
      facility: "City General Hospital",
      zone: "Zone 3",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 35,
      temperature: 41,
      lastCough: "2 min ago",
      firmware: "1.2.4",
      lastSync: "2 minutes ago",
    },
    {
      id: "TBV-004",
      serialNumber: "TBV-004-2025-0004",
      location: "Corridor",
      facility: "City General Hospital",
      zone: "Zone 4",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 71,
      temperature: 38,
      lastCough: "3 min ago",
      firmware: "1.2.3",
      lastSync: "3 minutes ago",
    },
    {
      id: "TBV-005",
      serialNumber: "TBV-005-2025-0005",
      location: "Pharmacy",
      facility: "City General Hospital",
      zone: "Zone 5",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 60,
      temperature: 40,
      lastCough: "2 min ago",
      firmware: "1.2.4",
      lastSync: "2 minutes ago",
    },
    {
      id: "TBV-006",
      serialNumber: "TBV-006-2025-0006",
      location: "Consultation Room 1",
      facility: "City General Hospital",
      zone: "Zone 6",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 70,
      temperature: 39,
      lastCough: "4 min ago",
      firmware: "1.2.3",
      lastSync: "4 minutes ago",
    },
    {
      id: "TBV-007",
      serialNumber: "TBV-007-2025-0007",
      location: "Consultation Room 2",
      facility: "City General Hospital",
      zone: "Zone 7",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 28,
      temperature: 37,
      lastCough: "5 min ago",
      firmware: "1.2.4",
      lastSync: "5 minutes ago",
    },
    {
      id: "TBV-008",
      serialNumber: "TBV-008-2025-0008",
      location: "Laboratory",
      facility: "City General Hospital",
      zone: "Zone 8",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 48,
      temperature: 40,
      lastCough: "6 min ago",
      firmware: "1.2.4",
      lastSync: "6 minutes ago",
    },
    {
      id: "TBV-009",
      serialNumber: "TBV-009-2025-0009",
      location: "Emergency Room",
      facility: "City General Hospital",
      zone: "Zone 9",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 52,
      temperature: 43,
      lastCough: "7 min ago",
      firmware: "1.2.4",
      lastSync: "7 minutes ago",
    },
    {
      id: "TBV-010",
      serialNumber: "TBV-010-2025-0010",
      location: "Main Lobby",
      facility: "City General Hospital",
      zone: "Zone 10",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 31,
      temperature: 38,
      lastCough: "8 min ago",
      firmware: "1.2.4",
      lastSync: "8 minutes ago",
    },
    {
      id: "TBV-011",
      serialNumber: "TBV-011-2025-0011",
      location: "Staff Lounge",
      facility: "City General Hospital",
      zone: "Zone 11",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 44,
      temperature: 39,
      lastCough: "9 min ago",
      firmware: "1.2.3",
      lastSync: "9 minutes ago",
    },
    {
      id: "TBV-012",
      serialNumber: "TBV-012-2025-0012",
      location: "Outdoor Entrance",
      facility: "City General Hospital",
      zone: "Zone 12",
      status: "Online",
      microphone: "OK",
      camera: "OK",
      aiEngine: "OK",
      network: "Connected",
      storage: 66,
      temperature: 41,
      lastCough: "10 min ago",
      firmware: "1.2.4",
      lastSync: "10 minutes ago",
    },
  ];

  const activities: DeviceActivity[] = [
    { device: "TBV-01", activity: "Heartbeat received", time: "1 min ago" },
    { device: "TBV-04", activity: "Configuration updated", time: "12 min ago" },
    {
      device: "TBV-02",
      activity: "Reconnected to network",
      time: "18 min ago",
    },
    { device: "TBV-07", activity: "Storage cleaned", time: "25 min ago" },
    {
      device: "TBV-03",
      activity: "Temperature back to normal",
      time: "32 min ago",
    },
  ];

  const healthItems = [
    { label: "Acoustic System", value: "SNR 32 dB", icon: Mic },
    { label: "Vision System", value: "99% uptime", icon: Camera },
    { label: "AI Inference", value: "12 ms latency", icon: Cpu },
    { label: "Network", value: "< 50 ms", icon: Wifi },
    { label: "Storage", value: "68% used", icon: Database },
    { label: "Power", value: "Stable (220V)", icon: Zap },
  ] as const;

  const pageSize = 6;
  const facilityItems = [
    { value: "all", label: "All Facilities" },
    { value: "City General Hospital", label: "City General Hospital" },
  ];
  const statusItems = [
    { value: "all", label: "All Status" },
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];
  const zoneItems = [
    { value: "all", label: "All Zones" },
    ...Array.from({ length: 12 }, (_, index) => ({
      value: `Zone ${index + 1}`,
      label: `Zone ${index + 1}`,
    })),
  ];

  const query = $derived(page.url.searchParams.get("q") ?? "");
  const facility = $derived(page.url.searchParams.get("facility") ?? "all");
  const status = $derived(page.url.searchParams.get("status") ?? "all");
  const zone = $derived(page.url.searchParams.get("zone") ?? "all");
  const currentPage = $derived(
    Math.max(1, Number(page.url.searchParams.get("page")) || 1),
  );
  const filtered = $derived.by(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return devices.filter((device) => {
      const searchable =
        `${device.id} ${device.serialNumber} ${device.location} ${device.facility}`.toLowerCase();
      return (
        searchable.includes(normalizedQuery) &&
        (facility === "all" || device.facility === facility) &&
        (status === "all" || device.status === status) &&
        (zone === "all" || device.zone === zone)
      );
    });
  });
  const pages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
  const safePage = $derived(Math.min(currentPage, pages));
  const visible = $derived(
    filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
  );
  let selectedDevice = $state<Device | null>(null);
  let detailsOpen = $state(false);

  function setParam(key: string, value: string) {
    const url = new URL(page.url);
    value && value !== "all"
      ? url.searchParams.set(key, value)
      : url.searchParams.delete(key);
    if (key !== "page") url.searchParams.delete("page");
    void goto(resolve("/devices") + url.search, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  }

  function showDetails(device: Device) {
    selectedDevice = device;
    detailsOpen = true;
  }
</script>

<svelte:head>
  <title>Devices · TB Vector</title>
  <meta
    name="description"
    content="Device management, hardware health, connectivity, and configuration"
  />
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col gap-4">
  <header class="flex items-start gap-3">
    <Sidebar.Trigger aria-label="Toggle sidebar" />
    <div class="min-w-0">
      <h1 class="text-heading-3 font-bold tracking-tight">Devices</h1>
      <p class="text-sm text-muted-foreground">
        Device management, hardware health, connectivity, and configuration
      </p>
    </div>
  </header>

  <section class="grid gap-4 xl:grid-cols-[1.1fr_1.1fr_1fr]">
    <Card.Root>
      <Card.Header class="pb-2">
        <Card.Title class="text-sm">Infrastructure Health</Card.Title>
        <Card.Action>
          <Badge
            variant="outline"
            class="gap-1 border-success/20 bg-success/5 text-[10px] text-success"
          >
            <span class="size-1.5 rounded-full bg-current" aria-hidden="true"
            ></span>
            All systems operational
          </Badge>
        </Card.Action>
      </Card.Header>
      <Card.Content class="grid grid-cols-2 gap-2">
        {#each healthItems as item (item.label)}
          {@const Icon = item.icon}
          <div class="rounded-lg bg-device-surface px-2.5 py-2">
            <div class="flex items-center gap-1.5 text-xs font-medium">
              <Icon class="size-3.5 text-primary" aria-hidden="true" />
              <span class="truncate">{item.label}</span>
            </div>
            <div class="mt-1 flex items-center justify-between gap-2">
              <span
                class="inline-flex items-center gap-1 text-[10px] text-success"
              >
                <span
                  class="size-1.5 rounded-full bg-current"
                  aria-hidden="true"
                ></span>
                Healthy
              </span>
              <span class="truncate font-mono text-[9px] text-muted-foreground"
                >{item.value}</span
              >
            </div>
          </div>
        {/each}
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="pb-2">
        <Card.Title class="text-sm">Device Coverage</Card.Title>
      </Card.Header>
      <Card.Content class="flex flex-col items-center gap-2">
        <img
          src="/device/device-coverage.png"
          alt="Acoustic coverage and camera field of view"
          class="h-36 w-full object-contain"
        />
        <div
          class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground"
        >
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full bg-primary"></span>Acoustic (360°)</span
          >
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full bg-info"></span>Camera FOV</span
          >
          <span class="inline-flex items-center gap-1.5"
            ><span class="size-2 rounded-full bg-secondary"></span>Monitored
            zone</span
          >
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="pb-2">
        <Card.Title class="text-sm">Recent Device Activity</Card.Title>
        <Card.Action>
          <Button variant="link" size="sm" class="h-auto px-0 text-xs">
            View all <ChevronRight data-icon="inline-end" />
          </Button>
        </Card.Action>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-2 text-xs">
          <div
            class="grid grid-cols-[3.5rem_1fr_auto] gap-2 text-[9px] uppercase tracking-wider text-muted-foreground"
          >
            <span>Device</span><span>Activity</span><span>Time</span>
          </div>
          {#each activities as activity (activity.device)}
            <div
              class="grid grid-cols-[3.5rem_1fr_auto] items-center gap-2 border-t border-border/50 pt-2"
            >
              <span class="font-semibold">{activity.device}</span>
              <span class="truncate text-muted-foreground"
                >{activity.activity}</span
              >
              <span class="whitespace-nowrap text-muted-foreground"
                >{activity.time}</span
              >
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>
  </section>

  <Card.Root>
    <Card.Content class="flex flex-col gap-3 pt-4">
      <div
        class="grid gap-3 md:grid-cols-[minmax(14rem,1.5fr)_minmax(10rem,1fr)_minmax(9rem,1fr)_minmax(9rem,1fr)]"
      >
        <label class="flex min-w-0 flex-col gap-1">
          <span class="invisible text-xs leading-4">Search devices</span>
          <InputGroup.Root class="h-8 bg-background">
            <InputGroup.Addon>
              <Search aria-hidden="true" />
            </InputGroup.Addon>
            <InputGroup.Input
              aria-label="Search devices"
              placeholder="Search devices..."
              class="text-xs"
              value={query}
              oninput={(event) => setParam("q", event.currentTarget.value)}
            />
          </InputGroup.Root>
        </label>

        <div class="grid grid-cols-3 gap-3 md:contents">
          <label
            class="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground"
          >
            <span>Facility</span>
            <Select.Root
              type="single"
              items={facilityItems}
              value={facility}
              onValueChange={(value) => setParam("facility", value)}
            >
              <Select.Trigger
                class="w-full bg-background"
                size="sm"
                aria-label="Filter by facility"
              >
                <Select.Value placeholder="All Facilities" />
              </Select.Trigger>
              <Select.Content>
                {#each facilityItems as item (item.value)}
                  <Select.Item value={item.value} label={item.label}
                    >{item.label}</Select.Item
                  >
                {/each}
              </Select.Content>
            </Select.Root>
          </label>

          <label
            class="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground"
          >
            <span>Status</span>
            <Select.Root
              type="single"
              items={statusItems}
              value={status}
              onValueChange={(value) => setParam("status", value)}
            >
              <Select.Trigger
                class="w-full bg-background"
                size="sm"
                aria-label="Filter by status"
              >
                <Select.Value placeholder="All Status" />
              </Select.Trigger>
              <Select.Content>
                {#each statusItems as item (item.value)}
                  <Select.Item value={item.value} label={item.label}
                    >{item.label}</Select.Item
                  >
                {/each}
              </Select.Content>
            </Select.Root>
          </label>

          <label
            class="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground"
          >
            <span>Zone</span>
            <Select.Root
              type="single"
              items={zoneItems}
              value={zone}
              onValueChange={(value) => setParam("zone", value)}
            >
              <Select.Trigger
                class="w-full bg-background"
                size="sm"
                aria-label="Filter by zone"
              >
                <Select.Value placeholder="All Zones" />
              </Select.Trigger>
              <Select.Content>
                {#each zoneItems as item (item.value)}
                  <Select.Item value={item.value} label={item.label}
                    >{item.label}</Select.Item
                  >
                {/each}
              </Select.Content>
            </Select.Root>
          </label>
        </div>
      </div>

      <div class="overflow-x-auto">
        <Table.Root class="min-w-[1120px] text-xs">
          <Table.Caption class="sr-only"
            >Device health and connectivity status.</Table.Caption
          >
          <Table.Header class="[&_tr]:border-0">
            <Table.Row class="bg-primary/[0.035] hover:bg-primary/[0.035]">
              {#each ["Device", "Location", "Status", "Microphone", "Camera", "AI Engine", "Network", "Storage", "Temp", "Last Cough", "Actions"] as heading (heading)}
                <Table.Head
                  scope="col"
                  class="whitespace-nowrap text-[10px] uppercase tracking-[0.1em] text-primary/60"
                  >{heading}</Table.Head
                >
              {/each}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each visible as device (device.id)}
              <Table.Row class="h-[68px] hover:bg-muted/30">
                <Table.Cell>
                  <div class="font-semibold">{device.id}</div>
                  <div class="font-mono text-[9px] text-muted-foreground">
                    {device.serialNumber}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div class="font-medium">{device.location}</div>
                  <div class="text-[10px] text-muted-foreground">
                    {device.facility}
                  </div>
                </Table.Cell>
                <Table.Cell
                  ><Badge
                    variant="outline"
                    class="gap-1.5 border-success/20 bg-success/5 text-[11px] text-success"
                    ><span class="size-1.5 rounded-full bg-current"
                    ></span>{device.status}</Badge
                  ></Table.Cell
                >
                <Table.Cell>{@render HealthValue(device.microphone)}</Table.Cell
                >
                <Table.Cell>{@render HealthValue(device.camera)}</Table.Cell>
                <Table.Cell>{@render HealthValue(device.aiEngine)}</Table.Cell>
                <Table.Cell>{@render HealthValue(device.network)}</Table.Cell>
                <Table.Cell>
                  <div class="flex min-w-12 flex-col gap-1">
                    <span
                      class={cn(
                        "text-[10px] font-medium",
                        device.storage > 65 ? "text-warning" : "text-primary",
                      )}>{device.storage}%</span
                    >
                    <div class="h-1 w-11 overflow-hidden rounded-full bg-muted">
                      <div
                        class={cn(
                          "h-full rounded-full",
                          device.storage > 65 ? "bg-warning" : "bg-primary",
                        )}
                        style={`width: ${device.storage}%`}
                      ></div>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell
                  class={cn(
                    "font-mono text-[11px]",
                    device.temperature > 40
                      ? "text-warning"
                      : "text-destructive",
                  )}>{device.temperature}°C</Table.Cell
                >
                <Table.Cell class="whitespace-nowrap text-muted-foreground"
                  >{device.lastCough}</Table.Cell
                >
                <Table.Cell
                  ><Button
                    variant="outline"
                    size="sm"
                    class="h-7 border-primary/40 px-3 text-xs text-primary hover:bg-primary/5"
                    onclick={() => showDetails(device)}>View</Button
                  ></Table.Cell
                >
              </Table.Row>
            {:else}
              <Table.Row
                ><Table.Cell
                  colspan={11}
                  class="h-24 text-center text-muted-foreground"
                  >No devices found.</Table.Cell
                ></Table.Row
              >
            {/each}
          </Table.Body>
        </Table.Root>
      </div>

      <div
        class="flex flex-col gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          Showing {filtered.length === 0
            ? 0
            : (safePage - 1) * pageSize + 1}–{Math.min(
            safePage * pageSize,
            filtered.length,
          )} of {filtered.length} devices
        </p>
        <Pagination.Root
          count={filtered.length}
          perPage={pageSize}
          page={safePage}
          siblingCount={0}
          onPageChange={(nextPage) => setParam("page", String(nextPage))}
          class="mx-0 w-auto justify-end"
        >
          {#snippet children({ pages: paginationPages, currentPage })}
            <Pagination.Content>
              <Pagination.Item><Pagination.Previous /></Pagination.Item>
              {#each paginationPages as paginationPage (paginationPage.key)}
                {#if paginationPage.type === "ellipsis"}
                  <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
                {:else}
                  <Pagination.Item
                    ><Pagination.Link
                      page={paginationPage}
                      isActive={currentPage === paginationPage.value}
                      size="sm"
                    /></Pagination.Item
                  >
                {/if}
              {/each}
              <Pagination.Item><Pagination.Next /></Pagination.Item>
            </Pagination.Content>
          {/snippet}
        </Pagination.Root>
      </div>
    </Card.Content>
  </Card.Root>
</div>

{#snippet HealthValue(value: string)}
  <span
    class="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] text-success"
    ><span class="size-1.5 rounded-full bg-current"></span>{value}</span
  >
{/snippet}

<Dialog.Root bind:open={detailsOpen}>
  {#if selectedDevice}
    <Dialog.Content class="max-h-[90vh] overflow-y-auto p-0 sm:max-w-xl">
      <Dialog.Header class="border-b border-border/60 px-6 py-5">
        <p
          class="text-xs font-semibold uppercase tracking-[0.12em] text-primary/60"
        >
          Device Details
        </p>
        <Dialog.Title class="mt-5 text-xl font-bold"
          >{selectedDevice.id}</Dialog.Title
        >
        <Dialog.Description
          class="flex flex-col gap-3 text-sm text-muted-foreground"
        >
          <span
            class="inline-flex items-center gap-1.5 font-medium text-success"
            ><span class="size-1.5 rounded-full bg-current"
            ></span>{selectedDevice.status}</span
          >
          <span class="flex items-start gap-2"
            ><MapPin
              class="mt-0.5 size-4 shrink-0 text-info"
              aria-hidden="true"
            /><span
              ><strong class="block text-foreground"
                >{selectedDevice.location}</strong
              ><span>{selectedDevice.facility}</span></span
            ></span
          >
        </Dialog.Description>
      </Dialog.Header>

      <div class="px-6 py-5">
        <h2
          class="text-xs font-semibold uppercase tracking-[0.12em] text-primary/60"
        >
          Device Specifications
        </h2>
        <dl class="mt-2 divide-y divide-border/60 border-y border-border/60">
          <div class="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <dt class="text-muted-foreground">Device ID</dt>
            <dd class="font-mono font-medium">{selectedDevice.id}</dd>
          </div>
          <div class="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <dt class="text-muted-foreground">Location</dt>
            <dd class="text-right font-medium">{selectedDevice.location}</dd>
          </div>
          <div class="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <dt class="text-muted-foreground">Facility</dt>
            <dd class="text-right font-medium">{selectedDevice.facility}</dd>
          </div>
          <div class="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <dt class="text-muted-foreground">Device Status</dt>
            <dd class="font-medium text-success">{selectedDevice.status}</dd>
          </div>
          <div class="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <dt class="text-muted-foreground">Installation Zone</dt>
            <dd class="font-medium">{selectedDevice.zone}</dd>
          </div>
          <div class="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <dt class="text-muted-foreground">Firmware Version</dt>
            <dd class="font-mono font-medium">{selectedDevice.firmware}</dd>
          </div>
          <div class="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <dt class="text-muted-foreground">Serial Number</dt>
            <dd class="font-mono text-right font-medium">
              {selectedDevice.serialNumber}
            </dd>
          </div>
          <div class="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <dt class="text-muted-foreground">Last Sync</dt>
            <dd class="font-medium">{selectedDevice.lastSync}</dd>
          </div>
        </dl>
      </div>
    </Dialog.Content>
  {/if}
</Dialog.Root>
