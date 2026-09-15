<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import Download from "@lucide/svelte/icons/download";
  import Search from "@lucide/svelte/icons/search";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as InputGroup from "$lib/components/ui/input-group";
  import * as Pagination from "$lib/components/ui/pagination";
  import * as Select from "$lib/components/ui/select";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import * as Table from "$lib/components/ui/table";
  import { cn } from "$lib/utils.js";

  type EventStatus = "Under Monitoring" | "Resolved";
  type EventRecord = {
    id: number;
    timestamp: string;
    uuid: string;
    deviceId: string;
    status: EventStatus;
    photo: string;
  };

  const events: EventRecord[] = [
    {
      id: 1,
      timestamp: "2025-08-08T14:53:35",
      uuid: "me2j4fxx",
      deviceId: "TBV-02",
      status: "Under Monitoring",
      photo: "/overview/live%20camera%20feed.jpeg",
    },
    {
      id: 2,
      timestamp: "2025-08-08T14:53:52",
      uuid: "me2j4t5d",
      deviceId: "TBV-03",
      status: "Under Monitoring",
      photo: "/overview/Live%20Camera%20Feed2.png",
    },
    {
      id: 3,
      timestamp: "2025-08-08T15:02:11",
      uuid: "me2j5aax",
      deviceId: "TBV-01",
      status: "Resolved",
      photo: "/overview/Live%20Camera%20Feed3.png",
    },
    {
      id: 4,
      timestamp: "2025-08-08T15:15:44",
      uuid: "me2j6bbc",
      deviceId: "TBV-04",
      status: "Resolved",
      photo: "/overview/Live%20Camera%20Feed4.png",
    },
    {
      id: 5,
      timestamp: "2025-08-08T15:28:09",
      uuid: "me2j7ccd",
      deviceId: "TBV-02",
      status: "Under Monitoring",
      photo: "/overview/Live%20Camera%20Feed5.png",
    },
    {
      id: 6,
      timestamp: "2025-08-08T15:41:22",
      uuid: "me2j8dde",
      deviceId: "TBV-03",
      status: "Resolved",
      photo: "/overview/live%20camera%20feed.jpeg",
    },
    {
      id: 7,
      timestamp: "2025-08-08T16:03:18",
      uuid: "me2j9eef",
      deviceId: "TBV-01",
      status: "Resolved",
      photo: "/overview/Live%20Camera%20Feed2.png",
    },
    {
      id: 8,
      timestamp: "2025-08-08T16:17:45",
      uuid: "me2jaffg",
      deviceId: "TBV-04",
      status: "Under Monitoring",
      photo: "/overview/Live%20Camera%20Feed3.png",
    },
    {
      id: 9,
      timestamp: "2025-08-08T16:29:06",
      uuid: "me2jbggs",
      deviceId: "TBV-02",
      status: "Resolved",
      photo: "/overview/Live%20Camera%20Feed4.png",
    },
    {
      id: 10,
      timestamp: "2025-08-08T16:44:31",
      uuid: "me2jchht",
      deviceId: "TBV-03",
      status: "Under Monitoring",
      photo: "/overview/Live%20Camera%20Feed5.png",
    },
    {
      id: 11,
      timestamp: "2025-08-08T17:01:04",
      uuid: "me2jdiix",
      deviceId: "TBV-01",
      status: "Resolved",
      photo: "/overview/live%20camera%20feed.jpeg",
    },
    {
      id: 12,
      timestamp: "2025-08-08T17:18:29",
      uuid: "me2jejya",
      deviceId: "TBV-04",
      status: "Under Monitoring",
      photo: "/overview/Live%20Camera%20Feed2.png",
    },
  ];

  const pageSize = 6;
  const devices = ["all", ...new Set(events.map((event) => event.deviceId))];
  const deviceItems = devices.map((value) => ({
    value,
    label: value === "all" ? "All" : value,
  }));
  const statusItems = [
    { value: "all", label: "All" },
    { value: "Under Monitoring", label: "Under Monitoring" },
    { value: "Resolved", label: "Resolved" },
  ];
  const sortItems = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "status", label: "Status" },
  ];

  const query = $derived(page.url.searchParams.get("q") ?? "");
  const device = $derived(page.url.searchParams.get("device") ?? "all");
  const status = $derived(page.url.searchParams.get("status") ?? "all");
  const sort = $derived(page.url.searchParams.get("sort") ?? "newest");
  const currentPage = $derived(
    Math.max(1, Number(page.url.searchParams.get("page")) || 1),
  );
  const filtered = $derived.by(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return events
      .filter((event) => {
        const searchable =
          `${event.uuid} ${event.deviceId} ${event.status}`.toLowerCase();
        return (
          searchable.includes(normalizedQuery) &&
          (device === "all" || event.deviceId === device) &&
          (status === "all" || event.status === status)
        );
      })
      .toSorted((a, b) => {
        if (sort === "oldest") return a.timestamp.localeCompare(b.timestamp);
        if (sort === "status") return a.status.localeCompare(b.status);
        return b.timestamp.localeCompare(a.timestamp);
      });
  });
  const pages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
  const safePage = $derived(Math.min(currentPage, pages));
  const visible = $derived(
    filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
  );

  const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  function setParam(key: string, value: string) {
    const url = new URL(page.url);
    value && value !== "all" && value !== "newest"
      ? url.searchParams.set(key, value)
      : url.searchParams.delete(key);
    if (key !== "page") url.searchParams.delete("page");
    void goto(resolve("/posts") + url.search, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  }

  function formatTimestamp(timestamp: string) {
    return dateTimeFormatter.format(new Date(timestamp));
  }

  function escapeCsv(value: string) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  function exportCsv() {
    const header = ["No.", "Time", "UUID", "Device ID", "Status"];
    const rows = filtered.map((event) => [
      String(event.id),
      formatTimestamp(event.timestamp),
      event.uuid,
      event.deviceId,
      event.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "event-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>Event History · TB Vector</title>
  <meta
    name="description"
    content="Complete log of acoustic detection events"
  />
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col gap-4">
  <header class="flex items-start justify-between gap-4">
    <div class="flex min-w-0 items-start gap-3">
      <Sidebar.Trigger aria-label="Toggle sidebar" />
      <div class="min-w-0">
        <h1 class="text-heading-3 font-bold tracking-tight">Event History</h1>
        <p class="text-sm text-muted-foreground">
          Complete log of acoustic detection events
        </p>
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
      class="h-9 shrink-0 gap-2 px-3 font-semibold text-primary"
      aria-label="Export event history as CSV"
      title="Export event history as CSV"
      onclick={exportCsv}
    >
      <Download data-icon="inline-start" />
      <span>Export CSV</span>
    </Button>
  </header>

  <Card.Root>
    <Card.Header class="pb-3">
      <Card.Title class="text-base">Related Cough Data</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col gap-3">
      <div
        role="status"
        class="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs text-primary"
      >
        The following data is suspected to originate from the same person.
      </div>

      <div
        class="grid gap-3 md:grid-cols-[minmax(14rem,1.5fr)_minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(10rem,1fr)]"
      >
        <label class="flex flex-col gap-1 md:min-w-0">
          <span class="invisible text-xs leading-4">Search</span>
          <InputGroup.Root class="h-8 bg-background">
            <InputGroup.Addon>
              <Search aria-hidden="true" />
            </InputGroup.Addon>
            <InputGroup.Input
              aria-label="Search events"
              placeholder="Search..."
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
            <span>Device</span>
            <Select.Root
              type="single"
              items={deviceItems}
              value={device}
              onValueChange={(value) => setParam("device", value)}
            >
              <Select.Trigger
                class="w-full bg-background"
                size="sm"
                aria-label="Filter by device"
              >
                <Select.Value placeholder="All" />
              </Select.Trigger>
              <Select.Content>
                {#each deviceItems as item (item.value)}
                  <Select.Item value={item.value} label={item.label}>
                    {item.label}
                  </Select.Item>
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
                <Select.Value placeholder="All" />
              </Select.Trigger>
              <Select.Content>
                {#each statusItems as item (item.value)}
                  <Select.Item value={item.value} label={item.label}>
                    {item.label}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </label>

          <label
            class="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground"
          >
            <span>Sort by</span>
            <Select.Root
              type="single"
              items={sortItems}
              value={sort}
              onValueChange={(value) => setParam("sort", value)}
            >
              <Select.Trigger
                class="w-full bg-background"
                size="sm"
                aria-label="Sort events"
              >
                <Select.Value placeholder="Newest" />
              </Select.Trigger>
              <Select.Content>
                {#each sortItems as item (item.value)}
                  <Select.Item value={item.value} label={item.label}>
                    {item.label}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </label>
        </div>
      </div>

      <Table.Root class="min-w-[720px] text-xs">
        <Table.Caption class="sr-only">
          Acoustic detection event history.
        </Table.Caption>
        <Table.Header class="[&_tr]:border-0">
          <Table.Row class="bg-primary/[0.035] hover:bg-primary/[0.035]">
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >No.</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >Time</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >UUID</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >Device ID</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >Status</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >Photo</Table.Head
            >
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each visible as event (event.id)}
            <Table.Row class="h-[78px] hover:bg-muted/30">
              <Table.Cell class="pl-4 tabular-nums text-muted-foreground"
                >{event.id}</Table.Cell
              >
              <Table.Cell
                class="whitespace-nowrap tabular-nums text-muted-foreground"
                >{formatTimestamp(event.timestamp)}</Table.Cell
              >
              <Table.Cell class="font-mono text-muted-foreground"
                >{event.uuid}</Table.Cell
              >
              <Table.Cell class="font-semibold">{event.deviceId}</Table.Cell>
              <Table.Cell>
                <Badge
                  variant="outline"
                  class={cn(
                    "gap-1.5 px-2.5 text-[11px]",
                    event.status === "Resolved"
                      ? "border-success/20 bg-success/5 text-success"
                      : "border-warning/25 bg-warning/5 text-warning",
                  )}
                >
                  <span
                    class="size-1.5 rounded-full bg-current"
                    aria-hidden="true"
                  ></span>
                  {event.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <img
                  src={event.photo}
                  alt={`Event ${event.id} camera capture`}
                  loading="lazy"
                  class="h-12 w-20 rounded-lg object-cover"
                />
              </Table.Cell>
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell
                colspan={6}
                class="h-24 text-center text-muted-foreground"
                >No events found.</Table.Cell
              >
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>

      <div
        class="flex flex-col gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          Showing {filtered.length === 0
            ? 0
            : (safePage - 1) * pageSize + 1}–{Math.min(
            safePage * pageSize,
            filtered.length,
          )} of {filtered.length} events
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
