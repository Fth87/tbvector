<script lang="ts">
  import Activity from "@lucide/svelte/icons/activity";
  import Camera from "@lucide/svelte/icons/camera";
  import Clock3 from "@lucide/svelte/icons/clock-3";
  import Maximize2 from "@lucide/svelte/icons/maximize-2";
  import MapPin from "@lucide/svelte/icons/map-pin";
  import Settings2 from "@lucide/svelte/icons/settings-2";
  import Video from "@lucide/svelte/icons/video";
  import Wifi from "@lucide/svelte/icons/wifi";
  import { PUBLIC_R2_VIDEO_BASE_URL } from "$env/static/public";
  import { Badge } from "$lib/components/ui/badge";
  import * as Card from "$lib/components/ui/card";
  import * as Sidebar from "$lib/components/ui/sidebar";

  type CameraFeed = {
    id: string;
    location: string;
    zone: string;
    poster: string;
    videoKey: string;
    personId?: string;
  };

  const r2BaseUrl = PUBLIC_R2_VIDEO_BASE_URL.replace(/\/+$/, "");
  const formatLiveTime = (date: Date) =>
    [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");

  let liveTime = $state("00:00:00");
  let loadedVideos = $state<Record<string, boolean>>({});

  function markVideoReady(id: string) {
    loadedVideos[id] = true;
  }

  $effect(() => {
    const updateTime = () => {
      liveTime = formatLiveTime(new Date());
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(timer);
  });

  const feeds: CameraFeed[] = [
    {
      id: "TBV-01",
      location: "Waiting Area A",
      zone: "Zone 1",
      poster: "/overview/live%20camera%20feed.jpeg",
      videoKey: "cctv/cctv1.mp4",
      personId: "P-024",
    },
    {
      id: "TBV-02",
      location: "Reception",
      zone: "Zone 2",
      poster: "/overview/Live%20Camera%20Feed2.png",
      videoKey: "cctv/cctv2.mp4",
      personId: "P-017",
    },
    {
      id: "TBV-03",
      location: "Waiting Area B",
      zone: "Zone 3",
      poster: "/overview/Live%20Camera%20Feed3.png",
      videoKey: "cctv/cctv3.mp4",
    },
    {
      id: "TBV-04",
      location: "Corridor",
      zone: "Zone 4",
      poster: "/overview/Live%20Camera%20Feed4.png",
      videoKey: "cctv/cctv4.mp4",
    },
  ];

  const videoUrl = (key: string) => (r2BaseUrl ? `${r2BaseUrl}/${key}` : "");
</script>

<svelte:head>
  <title>Live Monitoring · TB Vector</title>
  <meta
    name="description"
    content="Monitor live camera feeds across all TB Vector zones"
  />
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-5">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div class="flex min-w-0 items-center gap-3">
      <Sidebar.Trigger aria-label="Toggle sidebar" />
      <div class="min-w-0">
        <h2 class="text-heading-3 font-bold tracking-tight">Live Monitoring</h2>
        <p class="text-sm text-muted-foreground">
          Real-time camera feeds across all monitored zones
        </p>
      </div>
    </div>
    <Badge
      variant="secondary"
      class="gap-2 rounded-lg bg-card px-4 py-2 text-xs font-semibold text-success shadow-xs"
    >
      <Wifi class="size-3.5" aria-hidden="true" />
      4 Cameras Online
    </Badge>
  </header>

  <section class="grid gap-4 md:grid-cols-2" aria-label="Live camera feeds">
    {#each feeds as feed (feed.id)}
      <Card.Root class="overflow-hidden border-0 p-0 shadow-xs">
        <div class="relative aspect-video overflow-hidden bg-foreground">
          {#if r2BaseUrl}
            <video
              class={loadedVideos[feed.id]
                ? "size-full object-cover"
                : "size-full object-cover opacity-0"}
              src={videoUrl(feed.videoKey)}
              autoplay
              muted
              playsinline
              loop
              preload="metadata"
              oncanplay={() => markVideoReady(feed.id)}
              aria-label={`Live video feed from ${feed.id}, ${feed.location}`}
            ></video>
            {#if !loadedVideos[feed.id]}
              <div
                class="absolute inset-0 grid place-items-center bg-foreground"
                role="status"
                aria-label={`Loading ${feed.id} video`}
              >
                <span
                  class="size-7 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-brand-cyan"
                  aria-hidden="true"
                ></span>
              </div>
            {/if}
          {:else}
            <img
              src={feed.poster}
              alt={`Preview of ${feed.id} camera feed at ${feed.location}`}
              class="size-full object-cover"
            />
          {/if}

          <div
            class="absolute inset-x-3 top-3 flex items-center justify-between"
          >
            <Badge
              variant="destructive"
              class="gap-1.5 border-0 bg-foreground/75 px-2 text-[10px] font-semibold uppercase tracking-wide text-destructive-foreground"
            >
              <span
                class="size-1.5 rounded-full bg-destructive"
                aria-hidden="true"
              ></span>
              REC
            </Badge>
            <span class="font-mono text-[10px] tabular-nums text-brand-cyan"
              >{liveTime}</span
            >
          </div>
        </div>

        <Card.Content class="flex items-center justify-between gap-3 px-3 pb-2">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-foreground">{feed.id}</p>
            <p class="truncate text-xs text-muted-foreground">
              {feed.location} · {feed.zone}
            </p>
          </div>
          <span
            class="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              class="size-2 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            ></span>
            Idle
          </span>
        </Card.Content>
      </Card.Root>
    {/each}
  </section>

  <section
    class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    aria-label="Camera summary"
  >
    {#each feeds as feed (feed.id)}
      <Card.Root
        class="border-0 bg-card p-0 shadow-xs transition-colors hover:bg-card/80"
      >
        <Card.Content class="flex items-center gap-3 px-3 py-3">
          <span
            class={feed.personId
              ? "grid size-9 shrink-0 place-items-center rounded-lg bg-secondary/20 text-primary"
              : "grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"}
          >
            <Video class="size-4" aria-hidden="true" />
          </span>
          <div class="min-w-0">
            <p class="text-xs font-semibold text-foreground">{feed.id}</p>
            <p class="truncate text-[11px] text-muted-foreground">
              {feed.location}
            </p>
            {#if feed.personId}
              <p class="text-[11px] font-semibold text-warning">
                {feed.personId}
              </p>
            {/if}
          </div>
        </Card.Content>
      </Card.Root>
    {/each}
  </section>
</div>
