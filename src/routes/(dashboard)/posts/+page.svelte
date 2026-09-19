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
  import type { CoughEvent } from "./+page";

  let { data } = $props();

  // Meanings from server-handoff.md, section 2 ("result").
  const results: Record<string, { label: string; tone: string }> = {
    matched: {
      label: "Matched",
      tone: "border-success/20 bg-success/5 text-success",
    },
    ambiguous: {
      label: "Ambiguous",
      tone: "border-warning/25 bg-warning/5 text-warning",
    },
    unmatched: {
      label: "Unmatched",
      tone: "border-info/20 bg-info/5 text-info",
    },
    outside_view: {
      label: "Outside view",
      tone: "border-border bg-muted text-muted-foreground",
    },
    no_direction: {
      label: "No direction",
      tone: "border-border bg-muted text-muted-foreground",
    },
  };
  const resultOf = (event: CoughEvent) =>
    results[event.result ?? ""] ?? {
      label: event.result ?? "Unknown",
      tone: "border-border bg-muted text-muted-foreground",
    };
  const timeOf = (event: CoughEvent) => event.utc ?? event.received_at;
  const mediaUrl = (event: CoughEvent, kind: "image" | "audio") =>
    `/api/events/${encodeURIComponent(event.event_id)}/${kind}`;

  const pageSize = 6;
  const deviceItems = $derived(
    ["all", ...new Set(data.events.map((event) => event.device_id))].map(
      (value) => ({ value, label: value === "all" ? "All" : value }),
    ),
  );
  const statusItems = [
    { value: "all", label: "All" },
    ...Object.entries(results).map(([value, { label }]) => ({ value, label })),
  ];
  const sortItems = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "status", label: "Result" },
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

    return data.events
      .filter((event) => {
        const searchable =
          `${event.event_id} ${event.device_id} ${resultOf(event).label} ${event.zone_label ?? ""}`.toLowerCase();
        return (
          searchable.includes(normalizedQuery) &&
          (device === "all" || event.device_id === device) &&
          (status === "all" || event.result === status)
        );
      })
      .toSorted((a, b) => {
        if (sort === "oldest") return timeOf(a).localeCompare(timeOf(b));
        if (sort === "status")
          return resultOf(a).label.localeCompare(resultOf(b).label);
        return timeOf(b).localeCompare(timeOf(a));
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
    const header = ["No.", "Time", "Event ID", "Device ID", "Result", "Zone"];
    const rows = filtered.map((event, index) => [
      String(index + 1),
      formatTimestamp(timeOf(event)),
      event.event_id,
      event.device_id,
      resultOf(event).label,
      event.zone_label ?? "",
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
      <Card.Title class="text-base">Cough Events</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col gap-3">
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
            <span>Result</span>
            <Select.Root
              type="single"
              items={statusItems}
              value={status}
              onValueChange={(value) => setParam("status", value)}
            >
              <Select.Trigger
                class="w-full bg-background"
                size="sm"
                aria-label="Filter by result"
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

      <Table.Root class="min-w-[960px] text-xs">
        <Table.Caption class="sr-only">Cough event history.</Table.Caption>
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
              >Event ID</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >Device ID</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >Result</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >Zone</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >Photo</Table.Head
            >
            <Table.Head
              scope="col"
              class="text-[10px] uppercase tracking-[0.12em] text-primary/60"
              >Audio</Table.Head
            >
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each visible as event, index (event.event_id)}
            {@const result = resultOf(event)}
            <Table.Row class="h-[78px] hover:bg-muted/30">
              <Table.Cell class="pl-4 tabular-nums text-muted-foreground"
                >{(safePage - 1) * pageSize + index + 1}</Table.Cell
              >
              <Table.Cell
                class="whitespace-nowrap tabular-nums text-muted-foreground"
                >{formatTimestamp(timeOf(event))}</Table.Cell
              >
              <Table.Cell class="font-mono text-muted-foreground"
                >{event.event_id}</Table.Cell
              >
              <Table.Cell class="font-semibold">{event.device_id}</Table.Cell>
              <Table.Cell>
                <Badge
                  variant="outline"
                  class={cn("gap-1.5 px-2.5 text-[11px]", result.tone)}
                >
                  <span
                    class="size-1.5 rounded-full bg-current"
                    aria-hidden="true"
                  ></span>
                  {result.label}
                </Badge>
              </Table.Cell>
              <Table.Cell class="text-muted-foreground"
                >{event.zone_label ?? "—"}</Table.Cell
              >
              <Table.Cell>
                {#if event.has_image}
                  <a
                    href={mediaUrl(event, "image")}
                    target="_blank"
                    rel="external noopener"
                    aria-label={`Open camera capture for event ${event.event_id}`}
                  >
                    <img
                      src={mediaUrl(event, "image")}
                      alt=""
                      loading="lazy"
                      class="h-12 w-20 rounded-lg object-cover"
                    />
                  </a>
                {:else}
                  <span class="text-muted-foreground">No image</span>
                {/if}
              </Table.Cell>
              <Table.Cell>
                <audio
                  controls
                  preload="none"
                  src={mediaUrl(event, "audio")}
                  aria-label={`Cough audio for event ${event.event_id}`}
                  class="h-8 w-48"
                ></audio>
              </Table.Cell>
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell
                colspan={8}
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
