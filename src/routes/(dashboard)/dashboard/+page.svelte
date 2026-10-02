<script lang="ts">
  import { resolve } from "$app/paths";
  import Activity from "@lucide/svelte/icons/activity";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import Clock3 from "@lucide/svelte/icons/clock-3";
  import Monitor from "@lucide/svelte/icons/monitor";
  import Video from "@lucide/svelte/icons/video";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Table from "$lib/components/ui/table";
  import { cn } from "$lib/utils.js";
  import {
    SECTORS,
    formatDay,
    formatTimestamp,
    resultOf,
    timeOf,
  } from "$features/events/format";

  let { data } = $props();

  const stats = $derived(data.stats);
  const online = $derived(data.devices.filter((device) => device.connected));
  const recent = $derived(data.events.slice(0, 6));
  const matchedShare = $derived(
    stats.total
      ? Math.round(((stats.by.result.matched ?? 0) / stats.total) * 100)
      : 0,
  );
  const sectors = $derived(
    SECTORS.map((sector) => ({
      sector,
      count: stats.by.sector[sector] ?? 0,
    })).filter((entry) => entry.count > 0),
  );
  const unknownSector = $derived(stats.by.sector.unknown ?? 0);
  const sectorPeak = $derived(
    Math.max(1, ...sectors.map((entry) => entry.count)),
  );
  const days = $derived(stats.per_day.slice(-14));
  const dayPeak = $derived(Math.max(1, ...days.map((day) => day.count)));

  const tiles = $derived([
    {
      label: "Cough events",
      value: String(stats.total),
      hint: "all time",
      icon: Activity,
    },
    {
      label: "Today",
      value: String(stats.today),
      hint: "since 00:00 UTC",
      icon: Clock3,
    },
    {
      label: "Matched to a person",
      value: `${matchedShare}%`,
      hint: `${stats.by.result.matched ?? 0} of ${stats.total}`,
      icon: Monitor,
    },
    {
      label: "Devices online",
      value: `${online.length}/${data.devices.length}`,
      hint: online.length ? "heartbeat received" : "no device connected",
      icon: Video,
    },
  ]);
</script>

<svelte:head>
  <title>Dashboard · TB Vector</title>
  <meta name="description" content="Cough events and device status" />
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col gap-6">
  <section
    class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    aria-label="Summary"
  >
    {#each tiles as tile (tile.label)}
      {@const Icon = tile.icon}
      <Card.Root class="border-0 shadow-xs">
        <Card.Content class="flex items-center gap-3 px-4 py-4">
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/5 text-primary"
          >
            <Icon class="size-4" aria-hidden="true" />
          </span>
          <div class="min-w-0">
            <p class="text-xs text-muted-foreground">{tile.label}</p>
            <p class="text-heading-4 font-bold tabular-nums">{tile.value}</p>
            <p class="truncate text-[11px] text-muted-foreground">
              {tile.hint}
            </p>
          </div>
        </Card.Content>
      </Card.Root>
    {/each}
  </section>

  <section class="grid gap-6 lg:grid-cols-2">
    <Card.Root>
      <Card.Header class="pb-3">
        <Card.Title class="text-base">Where the coughs came from</Card.Title>
        <Card.Description>
          Direction relative to the device camera. Floor-plan mapping is not
          implemented yet.
        </Card.Description>
      </Card.Header>
      <Card.Content class="flex flex-col gap-2">
        {#each sectors as entry (entry.sector)}
          <div class="flex items-center gap-3 text-xs">
            <span class="w-24 shrink-0 text-muted-foreground"
              >{entry.sector}</span
            >
            <div
              class="h-2 flex-1 overflow-hidden rounded-full bg-primary/[0.07]"
            >
              <div
                class="h-full rounded-full bg-primary"
                style:width={`${(entry.count / sectorPeak) * 100}%`}
              ></div>
            </div>
            <span class="w-8 shrink-0 text-right font-semibold tabular-nums"
              >{entry.count}</span
            >
          </div>
        {:else}
          <p class="py-6 text-center text-sm text-muted-foreground">
            No events with a known direction yet.
          </p>
        {/each}
        {#if unknownSector}
          <p class="pt-1 text-[11px] text-muted-foreground">
            {unknownSector} event{unknownSector === 1 ? "" : "s"} without a direction
            (<code>no_direction</code>).
          </p>
        {/if}
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header class="pb-3">
        <Card.Title class="text-base">Events per day</Card.Title>
        <Card.Description
          >Last {days.length} day(s) with recorded events.</Card.Description
        >
      </Card.Header>
      <Card.Content>
        {#if days.length}
          <div
            class="flex h-40 items-end gap-1.5"
            role="img"
            aria-label="Events per day"
          >
            {#each days as day (day.day)}
              <div class="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div
                  class="w-full rounded-t bg-primary/80"
                  style:height={`${Math.max(4, (day.count / dayPeak) * 100)}%`}
                  title={`${formatDay(day.day)}: ${day.count}`}
                ></div>
                <span class="truncate text-[9px] text-muted-foreground"
                  >{formatDay(day.day)}</span
                >
              </div>
            {/each}
          </div>
        {:else}
          <p class="py-10 text-center text-sm text-muted-foreground">
            No events yet.
          </p>
        {/if}
      </Card.Content>
    </Card.Root>
  </section>

  <Card.Root>
    <Card.Header class="flex-row items-center justify-between gap-3 pb-3">
      <Card.Title class="text-base">Latest events</Card.Title>
      <Button
        href={resolve("/posts")}
        variant="ghost"
        size="sm"
        class="gap-1 text-primary"
      >
        Event history <ArrowRight class="size-3.5" aria-hidden="true" />
      </Button>
    </Card.Header>
    <Card.Content>
      <Table.Root class="text-xs">
        <Table.Caption class="sr-only"
          >The six most recent cough events.</Table.Caption
        >
        <Table.Header>
          <Table.Row class="bg-primary/[0.035] hover:bg-primary/[0.035]">
            <Table.Head scope="col">Time</Table.Head>
            <Table.Head scope="col">Device</Table.Head>
            <Table.Head scope="col">Result</Table.Head>
            <Table.Head scope="col">Zone</Table.Head>
            <Table.Head scope="col">Cough score</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each recent as event (event.event_id)}
            {@const result = resultOf(event)}
            <Table.Row>
              <Table.Cell
                class="whitespace-nowrap tabular-nums text-muted-foreground"
              >
                {formatTimestamp(timeOf(event))}
              </Table.Cell>
              <Table.Cell class="font-semibold">{event.device_id}</Table.Cell>
              <Table.Cell>
                <Badge
                  variant="outline"
                  class={cn("px-2.5 text-[11px]", result.tone)}
                >
                  {result.label}
                </Badge>
              </Table.Cell>
              <Table.Cell class="text-muted-foreground"
                >{event.zone_label ?? "—"}</Table.Cell
              >
              <Table.Cell class="tabular-nums">
                {event.p_cough_final === null
                  ? "—"
                  : `${Math.round(event.p_cough_final * 100)}%`}
              </Table.Cell>
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell
                colspan={5}
                class="h-20 text-center text-muted-foreground"
              >
                No events received yet.
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Header class="flex-row items-center justify-between gap-3 pb-3">
      <Card.Title class="text-base">Devices</Card.Title>
      <Button
        href={resolve("/monitoring")}
        variant="ghost"
        size="sm"
        class="gap-1 text-primary"
      >
        Live monitoring <ArrowRight class="size-3.5" aria-hidden="true" />
      </Button>
    </Card.Header>
    <Card.Content class="grid gap-3 sm:grid-cols-2">
      {#each data.devices as device (device.device_id)}
        <div
          class="flex items-center gap-3 rounded-xl bg-primary/[0.035] px-3 py-2.5"
        >
          <span
            class={cn(
              "size-2 shrink-0 rounded-full",
              device.connected ? "bg-success" : "bg-muted-foreground/40",
            )}
            aria-hidden="true"
          ></span>
          <div class="min-w-0">
            <p class="text-xs font-semibold">{device.device_id}</p>
            <p class="truncate text-[11px] text-muted-foreground">
              {device.connected ? "Connected" : `Last seen ${device.last_seen}`}
            </p>
          </div>
        </div>
      {:else}
        <p class="py-4 text-center text-sm text-muted-foreground sm:col-span-2">
          No device has connected yet.
        </p>
      {/each}
    </Card.Content>
  </Card.Root>
</div>
