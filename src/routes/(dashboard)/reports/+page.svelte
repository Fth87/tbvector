<script lang="ts">
  import Download from "@lucide/svelte/icons/download";
  import * as Card from "$lib/components/ui/card";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import * as Table from "$lib/components/ui/table";
  import { Button } from "$lib/components/ui/button";
  import {
    RESULTS,
    formatDay,
    formatTimestamp,
    timeOf,
  } from "$features/events/format";

  let { data } = $props();

  const stats = $derived(data.stats);
  const resultRows = $derived(
    Object.entries(stats.by.result).map(([key, count]) => ({
      key,
      label: RESULTS[key]?.label ?? key,
      count,
      share: stats.total ? Math.round((count / stats.total) * 100) : 0,
    })),
  );
  const bandRows = $derived(
    Object.entries(stats.by.band).map(([key, count]) => ({
      // "unknown" is normal: the distance is missing for outside_view and unmatched events.
      label: key === "unknown" ? "distance unknown" : key,
      count,
    })),
  );
  const deviceRows = $derived(Object.entries(stats.by.device));

  function escapeCsv(value: string) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  /** Exports the newest 500 events, the same window the Event History page shows. */
  function exportCsv() {
    const header = [
      "Time",
      "Event ID",
      "Device ID",
      "Result",
      "Zone",
      "Sector",
      "Band",
      "Cough score",
    ];
    const rows = data.events.map((event) => [
      formatTimestamp(timeOf(event)),
      event.event_id,
      event.device_id,
      event.result ?? "",
      event.zone_label ?? "",
      event.zone_sector ?? "",
      event.zone_band ?? "",
      event.p_cough_final === null ? "" : String(event.p_cough_final),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "tbvector-events.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>Reports · TB Vector</title>
  <meta name="description" content="Aggregated cough event reports" />
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-5">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div class="flex min-w-0 items-center gap-3">
      <Sidebar.Trigger aria-label="Toggle sidebar" />
      <div class="min-w-0">
        <h1 class="text-heading-3 font-bold tracking-tight">Reports</h1>
        <p class="text-sm text-muted-foreground">
          {stats.total} event{stats.total === 1 ? "" : "s"} recorded{stats.first_utc
            ? ` since ${formatTimestamp(stats.first_utc)}`
            : ""}
        </p>
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
      class="gap-2 font-semibold text-primary"
      onclick={exportCsv}
      disabled={!data.events.length}
    >
      <Download data-icon="inline-start" />
      Export CSV
    </Button>
  </header>

  <section class="grid gap-5 lg:grid-cols-2">
    <Card.Root>
      <Card.Header class="pb-3">
        <Card.Title class="text-base">Match result</Card.Title>
        <Card.Description
          >Whether the cough could be tied to a visible person.</Card.Description
        >
      </Card.Header>
      <Card.Content class="flex flex-col gap-2">
        {#each resultRows as row (row.key)}
          <div class="flex items-center gap-3 text-xs">
            <span class="w-28 shrink-0 text-muted-foreground">{row.label}</span>
            <div
              class="h-2 flex-1 overflow-hidden rounded-full bg-primary/[0.07]"
            >
              <div
                class="h-full rounded-full bg-primary"
                style:width={`${row.share}%`}
              ></div>
            </div>
            <span class="w-16 shrink-0 text-right font-semibold tabular-nums">
              {row.count} · {row.share}%
            </span>
          </div>
        {:else}
          <p class="py-6 text-center text-sm text-muted-foreground">
            No events yet.
          </p>
        {/each}
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="pb-3">
        <Card.Title class="text-base">Distance band</Card.Title>
        <Card.Description
          >near &lt; 1.5 m, mid 1.5–3 m, far &gt; 3 m.</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <Table.Root class="text-xs">
          <Table.Caption class="sr-only"
            >Events per distance band.</Table.Caption
          >
          <Table.Body>
            {#each bandRows as row (row.label)}
              <Table.Row>
                <Table.Cell class="text-muted-foreground"
                  >{row.label}</Table.Cell
                >
                <Table.Cell class="text-right font-semibold tabular-nums"
                  >{row.count}</Table.Cell
                >
              </Table.Row>
            {:else}
              <Table.Row>
                <Table.Cell class="h-16 text-center text-muted-foreground"
                  >No events yet.</Table.Cell
                >
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </Card.Content>
    </Card.Root>
  </section>

  <Card.Root>
    <Card.Header class="pb-3">
      <Card.Title class="text-base">Per day</Card.Title>
      <Card.Description>Up to the last 30 days with events.</Card.Description>
    </Card.Header>
    <Card.Content>
      <Table.Root class="text-xs">
        <Table.Caption class="sr-only"
          >Events per day and per device.</Table.Caption
        >
        <Table.Header>
          <Table.Row class="bg-primary/[0.035] hover:bg-primary/[0.035]">
            <Table.Head scope="col">Day</Table.Head>
            <Table.Head scope="col" class="text-right">Events</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each [...stats.per_day].reverse() as day (day.day)}
            <Table.Row>
              <Table.Cell>{formatDay(day.day)}</Table.Cell>
              <Table.Cell class="text-right font-semibold tabular-nums"
                >{day.count}</Table.Cell
              >
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell
                colspan={2}
                class="h-16 text-center text-muted-foreground"
              >
                No events yet.
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>

  {#if deviceRows.length}
    <Card.Root>
      <Card.Header class="pb-3"
        ><Card.Title class="text-base">Per device</Card.Title></Card.Header
      >
      <Card.Content class="flex flex-wrap gap-3">
        {#each deviceRows as [deviceId, count] (deviceId)}
          <div class="rounded-xl bg-primary/[0.035] px-3 py-2">
            <p class="text-xs font-semibold">{deviceId}</p>
            <p class="text-[11px] text-muted-foreground">{count} events</p>
          </div>
        {/each}
      </Card.Content>
    </Card.Root>
  {/if}
</div>
