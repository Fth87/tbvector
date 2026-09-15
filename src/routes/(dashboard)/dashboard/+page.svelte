<script lang="ts">
  import { resolve } from "$app/paths";
  import Activity from "@lucide/svelte/icons/activity";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Camera from "@lucide/svelte/icons/camera";
  import Clock3 from "@lucide/svelte/icons/clock-3";
  import MapPin from "@lucide/svelte/icons/map-pin";
  import Mic from "@lucide/svelte/icons/mic";
  import Monitor from "@lucide/svelte/icons/monitor";
  import ScanSearch from "@lucide/svelte/icons/scan-search";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import UserRound from "@lucide/svelte/icons/user-round";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import { cn } from "$lib/utils.js";

  const events = [
    {
      id: "event-143208",
      time: "14:32:08",
      classification: "TB-like cough signal",
      confidence: 91,
      location: "Waiting Area A",
      personId: "P-024",
      status: "Requires Review",
    },
    {
      id: "event-143144",
      time: "14:31:44",
      classification: "Non-TB cough signal",
      confidence: 87,
      location: "Reception",
      personId: "P-017",
      status: "Resolved",
    },
    {
      id: "event-143012",
      time: "14:30:12",
      classification: "TB-like cough signal",
      confidence: 89,
      location: "Waiting Area B",
      personId: "P-031",
      status: "Requires Review",
    },
    {
      id: "event-142851",
      time: "14:28:51",
      classification: "Acoustic event",
      confidence: 76,
      location: "Corridor",
      personId: "P-012",
      status: "Resolved",
    },
    {
      id: "event-142633",
      time: "14:26:33",
      classification: "Non-TB cough signal",
      confidence: 82,
      location: "Waiting Area A",
      personId: "P-008",
      status: "Resolved",
    },
  ];

  const devices = ["TBV-01", "TBV-02", "TBV-03", "TBV-04"];
  const zones = ["Waiting Area A", "Reception", "Waiting Area B", "Corridor"];
  const cameraFeeds = [
    {
      id: "TBV-01",
      location: "Waiting Area A",
      image: "/overview/live%20camera%20feed.jpeg",
    },
    {
      id: "TBV-02",
      location: "Reception",
      image: "/overview/Live%20Camera%20Feed2.png",
    },
    {
      id: "TBV-03",
      location: "Waiting Area B",
      image: "/overview/Live%20Camera%20Feed3.png",
    },
    {
      id: "TBV-04",
      location: "Corridor",
      image: "/overview/Live%20Camera%20Feed4.png",
    },
  ];

  let activeFeed = $state(0);
  let feedViewport: HTMLDivElement;

  function selectFeed(index: number) {
    activeFeed = index;
    feedViewport?.children[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  function moveFeed(direction: -1 | 1) {
    const nextIndex =
      (activeFeed + direction + cameraFeeds.length) % cameraFeeds.length;
    selectFeed(nextIndex);
  }

  function updateActiveFeed(event: Event) {
    const element = event.currentTarget;
    if (element instanceof HTMLDivElement && element.clientWidth > 0) {
      activeFeed = Math.round(element.scrollLeft / element.clientWidth);
    }
  }
</script>

<svelte:head>
  <title>Dashboard · TB Vector</title>
  <meta
    name="description"
    content="Monitor acoustic events and TB Vector devices"
  />
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col gap-6">
  <section class="grid gap-6 lg:grid-cols-2" aria-label="Facility overview">
    <Card.Root>
      <Card.Header class="flex-row items-center justify-between gap-3">
        <Card.Title>Facility Map</Card.Title>
      </Card.Header>
      <Card.Content>
        <div
          class="relative aspect-video min-h-[300px] overflow-hidden rounded-lg bg-primary/[0.035]"
        >
          <img
            src="/overview/facility-maps.jpg"
            alt="Facility map showing rooms, waiting areas, an acoustic event, and TBV-01"
            class="size-full object-cover"
          />
        </div>
        <div
          class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"
        >
          <span class="inline-flex items-center gap-2"
            ><i class="size-2.5 rounded-full bg-primary"></i>TB Vector device</span
          >
          <span class="inline-flex items-center gap-2"
            ><i class="size-2.5 rounded-full bg-destructive"></i>Acoustic event</span
          >
          <span class="inline-flex items-center gap-2"
            ><i class="size-2.5 rounded-full bg-brand-cyan"></i>Coverage area</span
          >
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root size="sm" class="@container/live min-w-0 h-full">
      <div
        bind:this={feedViewport}
        onscroll={updateActiveFeed}
        role="region"
        aria-roledescription="carousel"
        aria-label="Live camera feeds"
        class="flex min-h-0 min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {#each cameraFeeds as feed, index (feed.id)}
          <article
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${cameraFeeds.length}: ${feed.id} ${feed.location}`}
            class="flex min-h-full min-w-0 shrink-0 snap-start flex-col basis-full"
          >
            <Card.Header class="gap-1">
              <div>
                <Card.Title class="text-base">Live Camera Feed</Card.Title
                ><Card.Description class="text-xs"
                  >{feed.id} · {feed.location}</Card.Description
                >
              </div>
              <Card.Action
                ><Badge
                  variant="destructive"
                  class="h-7 rounded-full border border-destructive/20 bg-destructive/5 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-destructive"
                  >Live</Badge
                ></Card.Action
              >
            </Card.Header>
            <Card.Content
              class="grid min-w-0 flex-1 gap-4 @md/live:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
            >
              <div class="min-w-0">
                <div
                  class="relative aspect-[16/10] min-w-0 overflow-hidden rounded-xl bg-foreground p-3 text-white"
                >
                  <img
                    src={feed.image}
                    alt={`Live camera view of ${feed.location}`}
                    class="absolute inset-0 size-full object-cover"
                  />
                  <div
                    class="relative flex flex-wrap items-start gap-2 text-[10px] font-semibold"
                  >
                    <span
                      class="rounded bg-foreground/80 px-2 py-1 text-brand-cyan"
                      >{feed.id} · CAM-{String(index + 1).padStart(
                        2,
                        "0",
                      )}</span
                    ><span
                      class="rounded bg-foreground/80 px-2 py-1 text-brand-cyan"
                      >1920×1080 · 30fps</span
                    ><span
                      class="rounded bg-foreground/80 px-2 py-1 text-brand-cyan"
                      >14:32:08</span
                    >
                  </div>
                  <div
                    class="absolute bottom-3 left-3 rounded-md bg-brand-cyan/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-info"
                  >
                    Zone {String.fromCharCode(65 + index)} · {feed.location}
                  </div>
                </div>

                <div
                  class="mt-4 grid gap-3 @md/live:grid-cols-[minmax(0,1fr)_minmax(6.75rem,0.8fr)]"
                >
                  <div class="min-w-0">
                    <p
                      class="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      Associated Person
                    </p>
                    <div class="flex min-w-0 items-center gap-2">
                      <span
                        class="grid size-8 shrink-0 place-items-center rounded-full bg-primary/5 text-primary ring-2 ring-primary/10"
                      >
                        <UserRound class="size-4" aria-hidden="true" />
                      </span>
                      <div class="min-w-0">
                        <p
                          class="whitespace-nowrap text-sm font-bold leading-none tracking-tight"
                        >
                          P-024
                        </p>
                        <p
                          class="mt-1 whitespace-nowrap text-[10px] text-muted-foreground"
                        >
                          <span
                            class="mr-1 inline-block size-1.5 rounded-full bg-success"
                            aria-hidden="true"
                          ></span>
                          Tracking:
                          <strong class="font-semibold text-success"
                            >ACTIVE</strong
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p
                      class="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      Visual Confidence
                    </p>
                    <div class="mt-2 h-1 min-w-0 rounded-full bg-muted">
                      <div class="h-1 w-[94%] rounded-full bg-primary"></div>
                    </div>
                    <p
                      class="mt-1 text-lg font-bold leading-none tracking-tight text-primary"
                    >
                      94%
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex min-w-0 flex-col gap-3">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-xs font-bold tracking-tight">
                    Current Event
                  </h3>
                  <Badge
                    variant="destructive"
                    class="h-6 rounded-lg border border-destructive/20 bg-destructive/5 px-2 text-[10px] font-semibold text-destructive"
                    >Requires Attention</Badge
                  >
                </div>

                <div
                  class="rounded-xl border border-destructive/20 bg-destructive/10 p-2.5"
                >
                  <div class="flex items-center gap-2.5">
                    <span
                      class="grid size-8 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive"
                    >
                      <Activity class="size-4" aria-hidden="true" />
                    </span>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between gap-2">
                        <p class="truncate text-[11px] font-semibold">
                          TB-like cough signal
                        </p>
                        <strong class="text-[11px] text-destructive">91%</strong
                        >
                      </div>
                      <div class="mt-1.5 flex items-center gap-2">
                        <div
                          class="h-1 min-w-0 flex-1 rounded-full bg-destructive/20"
                        >
                          <div
                            class="h-1 w-[91%] rounded-full bg-destructive"
                          ></div>
                        </div>
                        <span class="text-[10px] text-muted-foreground"
                          >confidence</span
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <Button
                    href={resolve("/monitoring")}
                    size="sm"
                    class="h-7 text-[11px] bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >Review Event <ArrowRight data-icon="inline-end" /></Button
                  ><Button
                    href={resolve("/posts")}
                    size="sm"
                    variant="outline"
                    class="h-7 bg-device-surface text-[11px]"
                    >View Analysis</Button
                  >
                </div>

                <div class="grid gap-2">
                  <span class="flex items-start gap-2.5">
                    <span
                      class="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"
                      ><Clock3 class="size-3.5" aria-hidden="true" /></span
                    >
                    <span>
                      <strong class="block text-[11px] font-semibold"
                        >14:32:08</strong
                      >
                      <small class="block text-[10px] text-muted-foreground"
                        >Today, 16 Dec 2024</small
                      >
                    </span>
                  </span>
                  <span class="flex items-start gap-2.5">
                    <span
                      class="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"
                      ><MapPin class="size-3.5" aria-hidden="true" /></span
                    >
                    <span>
                      <strong class="block text-[11px] font-semibold"
                        >Waiting Area A</strong
                      >
                      <small class="block text-[10px] text-muted-foreground"
                        >Zone 1</small
                      >
                    </span>
                  </span>
                  <span class="flex items-start gap-2.5">
                    <span
                      class="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"
                      ><ScanSearch class="size-3.5" aria-hidden="true" /></span
                    >
                    <span>
                      <strong class="block text-[11px] font-semibold"
                        >DoA 128°</strong
                      >
                      <small class="block text-[10px] text-muted-foreground"
                        >Estimated distance: 3.2 m</small
                      >
                    </span>
                  </span>
                </div>
              </div>
            </Card.Content>
          </article>
        {/each}
      </div>
      <Card.Footer
        class="flex shrink-0 items-center justify-between gap-2 bg-transparent pt-0"
      >
        <div
          class="flex items-center gap-1"
          role="tablist"
          aria-label="Select camera feed"
        >
          {#each cameraFeeds as feed, index (feed.id)}
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Show ${feed.id} ${feed.location}`}
              aria-pressed={activeFeed === index}
              onclick={() => selectFeed(index)}
            >
              <span
                class={cn(
                  "size-1.5 rounded-full transition-colors",
                  activeFeed === index ? "bg-primary" : "bg-primary/30",
                )}
              ></span>
            </Button>
          {/each}
        </div>
        <div class="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Previous camera feed"
            onclick={() => moveFeed(-1)}
            ><ChevronLeft data-icon="inline-start" /></Button
          >
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Next camera feed"
            onclick={() => moveFeed(1)}
            ><ChevronRight data-icon="inline-end" /></Button
          >
        </div>
      </Card.Footer>
    </Card.Root>
  </section>

  <section
    class="grid gap-6 lg:grid-cols-[1.15fr_1fr]"
    aria-label="Monitoring details"
  >
    <Card.Root>
      <Card.Header
        ><Card.Title>Recent Events</Card.Title><Card.Action
          ><Button variant="link" size="sm" href={resolve("/devices")}
            >View All <ArrowRight data-icon="inline-end" /></Button
          ></Card.Action
        ></Card.Header
      >
      <Card.Content
        ><Table.Root class="text-xs">
          <Table.Caption class="sr-only"
            >Recent acoustic events detected by the system.</Table.Caption
          >
          <Table.Header class="[&_tr]:border-0"
            ><Table.Row
              ><Table.Head
                scope="col"
                class="bg-primary/[0.035] text-[10px] font-semibold uppercase tracking-[0.1em] text-primary/55"
                >Time</Table.Head
              ><Table.Head
                scope="col"
                class="bg-primary/[0.035] text-[10px] font-semibold uppercase tracking-[0.1em] text-primary/55"
                >Classification</Table.Head
              ><Table.Head
                scope="col"
                class="bg-primary/[0.035] text-[10px] font-semibold uppercase tracking-[0.1em] text-primary/55"
                >Confidence</Table.Head
              ><Table.Head
                scope="col"
                class="hidden bg-primary/[0.035] text-[10px] font-semibold uppercase tracking-[0.1em] text-primary/55 lg:table-cell"
                >Location</Table.Head
              ><Table.Head
                scope="col"
                class="hidden bg-primary/[0.035] text-[10px] font-semibold uppercase tracking-[0.1em] text-primary/55 lg:table-cell"
                >Person ID</Table.Head
              ><Table.Head
                scope="col"
                class="bg-primary/[0.035] text-[10px] font-semibold uppercase tracking-[0.1em] text-primary/55"
                >Status</Table.Head
              ></Table.Row
            ></Table.Header
          >
          <Table.Body
            >{#each events as event (event.id)}<Table.Row
                class="hover:bg-transparent"
                ><Table.Cell
                  class="text-xs font-semibold tabular-nums text-primary"
                  >{event.time}</Table.Cell
                ><Table.Cell
                  class={cn(
                    "text-xs font-medium",
                    event.status === "Requires Review" && "text-destructive",
                  )}
                  ><span class="inline-flex items-center gap-2">
                    {#if event.status === "Requires Review"}<span
                        class="size-2 rounded-full bg-destructive"
                        aria-hidden="true"
                      ></span>{/if}
                    {event.classification}
                  </span></Table.Cell
                ><Table.Cell
                  class="text-xs font-semibold tabular-nums text-foreground"
                  ><span class="inline-flex items-center gap-2">
                    <span
                      class="h-1.5 w-16 overflow-hidden rounded-full bg-muted"
                    >
                      <span
                        class={cn(
                          "block h-full rounded-full",
                          event.confidence >= 85
                            ? "bg-destructive"
                            : "bg-warning",
                        )}
                        style:width={`${event.confidence}%`}
                      ></span>
                    </span>
                    {event.confidence}%
                  </span></Table.Cell
                ><Table.Cell
                  class="hidden whitespace-normal text-xs text-muted-foreground lg:table-cell"
                  >{event.location}</Table.Cell
                ><Table.Cell
                  class="hidden text-xs font-semibold text-primary lg:table-cell"
                  >{event.personId}</Table.Cell
                ><Table.Cell
                  ><Badge
                    variant="outline"
                    class={cn(
                      "h-6 px-2 text-[11px] font-semibold",
                      event.status === "Resolved"
                        ? "border-success/20 bg-success/10 text-success"
                        : "border-destructive/20 bg-destructive/10 text-destructive",
                    )}>{event.status}</Badge
                  ></Table.Cell
                ></Table.Row
              >{/each}</Table.Body
          >
        </Table.Root></Card.Content
      >
    </Card.Root>

    <Card.Root>
      <Card.Header
        ><Card.Title>Device Status</Card.Title>
        <Card.Action
          ><Button variant="link" size="sm"
            >View Devices <ArrowRight data-icon="inline-end" /></Button
          ></Card.Action
        ></Card.Header
      >
      <Card.Content class="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >{#each devices as device, index (device)}<div
            class="rounded-lg bg-device-surface p-3"
          >
            <div class="flex items-center justify-between">
              <strong class="text-sm">{device}</strong><span
                class="size-2.5 rounded-full bg-success"
                title="Online"
              ></span>
            </div>
            <p class="mt-1 text-xs font-medium text-success">Online</p>
            <p class="mt-2 truncate text-xs text-muted-foreground">
              {zones[index]}
            </p>
            <div class="mt-3 grid gap-1.5 text-xs text-muted-foreground">
              <span class="inline-flex items-center gap-2"
                ><Mic class="size-3.5" />Microphone
                <b class="ml-auto text-success">OK</b></span
              ><span class="inline-flex items-center gap-2"
                ><Camera class="size-3.5" />Camera
                <b class="ml-auto text-success">OK</b></span
              ><span class="inline-flex items-center gap-2"
                ><Monitor class="size-3.5" />AI
                <b class="ml-auto text-success">OK</b></span
              >
            </div>
          </div>{/each}</Card.Content
      >
    </Card.Root>
  </section>
</div>
