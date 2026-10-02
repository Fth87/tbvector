<script lang="ts">
  import { onMount } from "svelte";
  import Video from "@lucide/svelte/icons/video";
  import VideoOff from "@lucide/svelte/icons/video-off";
  import Wifi from "@lucide/svelte/icons/wifi";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import {
    getDevices,
    liveStream,
    type Device,
    type LiveStatus,
  } from "$lib/api";

  let { data } = $props();

  // Polled copy wins once it arrives; before that the server load's list is used.
  let polled = $state<Device[] | null>(null);
  const devices = $derived(polled ?? data.devices);
  let watching = $state<string | null>(null);
  let frame = $state("");
  let status = $state<LiveStatus>("connecting");
  let stop: (() => void) | null = null;

  const online = $derived(devices.filter((device) => device.connected).length);
  const statusText: Record<LiveStatus, string> = {
    connecting: "Connecting…",
    live: "Live",
    offline: "Stream ended",
    error: "Connection lost",
  };

  // The camera only runs while this page is open: the server starts the device stream for the
  // first viewer and stops it shortly after the last one leaves.
  function watch(deviceId: string) {
    stop?.();
    frame = "";
    watching = deviceId;
    stop = liveStream(
      deviceId,
      (url) => (frame = url),
      (next) => (status = next),
    );
  }

  function close() {
    stop?.();
    stop = null;
    watching = null;
    frame = "";
  }

  onMount(() => {
    const timer = window.setInterval(async () => {
      polled = await getDevices().catch(() => polled);
    }, 15000);
    return () => {
      window.clearInterval(timer);
      stop?.();
    };
  });
</script>

<svelte:head>
  <title>Live Monitoring · TB Vector</title>
  <meta
    name="description"
    content="Live camera view of the TB Vector devices"
  />
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-5">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div class="flex min-w-0 items-center gap-3">
      <Sidebar.Trigger aria-label="Toggle sidebar" />
      <div class="min-w-0">
        <h2 class="text-heading-3 font-bold tracking-tight">Live Monitoring</h2>
        <p class="text-sm text-muted-foreground">
          The camera streams only while this page is open
        </p>
      </div>
    </div>
    <Badge
      variant="secondary"
      class="gap-2 rounded-lg bg-card px-4 py-2 text-xs font-semibold shadow-xs {online
        ? 'text-success'
        : 'text-muted-foreground'}"
    >
      <Wifi class="size-3.5" aria-hidden="true" />
      {online} of {devices.length} online
    </Badge>
  </header>

  {#if watching}
    <Card.Root class="overflow-hidden border-0 p-0 shadow-xs">
      <div class="relative aspect-video overflow-hidden bg-foreground">
        {#if frame}
          <img
            src={frame}
            alt="Live camera view of {watching}"
            class="size-full object-contain"
          />
        {:else}
          <div class="absolute inset-0 grid place-items-center" role="status">
            <span
              class="size-7 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-secondary"
              aria-hidden="true"
            ></span>
          </div>
        {/if}
        <div class="absolute inset-x-3 top-3 flex items-center justify-between">
          <Badge
            variant="destructive"
            class="gap-1.5 border-0 bg-foreground/75 px-2 text-[10px] font-semibold uppercase tracking-wide text-destructive-foreground"
          >
            <span
              class="size-1.5 rounded-full bg-destructive"
              aria-hidden="true"
            ></span>
            {statusText[status]}
          </Badge>
          <span class="font-mono text-[10px] text-secondary">{watching}</span>
        </div>
      </div>
      <Card.Content class="flex items-center justify-between gap-3 px-4 py-3">
        <p class="text-xs text-muted-foreground">
          Faces are visible here and every view is logged.
        </p>
        <Button variant="outline" size="sm" onclick={close}>Stop viewing</Button
        >
      </Card.Content>
    </Card.Root>
  {/if}

  <section class="grid gap-3 sm:grid-cols-2" aria-label="Devices">
    {#each devices as device (device.device_id)}
      <Card.Root class="border-0 shadow-xs">
        <Card.Content class="flex items-center gap-3 px-4 py-4">
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg {device.connected
              ? 'bg-secondary/20 text-primary'
              : 'bg-muted text-muted-foreground'}"
          >
            {#if device.connected}
              <Video class="size-4" aria-hidden="true" />
            {:else}
              <VideoOff class="size-4" aria-hidden="true" />
            {/if}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold">{device.device_id}</p>
            <p class="truncate text-xs text-muted-foreground">
              {device.connected
                ? "Connected"
                : `Last seen ${device.last_seen ?? "never"}`}
            </p>
          </div>
          <Button
            size="sm"
            disabled={!device.connected || watching === device.device_id}
            onclick={() => watch(device.device_id)}
          >
            {watching === device.device_id ? "Watching" : "Watch"}
          </Button>
        </Card.Content>
      </Card.Root>
    {:else}
      <Card.Root class="border-0 shadow-xs sm:col-span-2">
        <Card.Content
          class="px-4 py-8 text-center text-sm text-muted-foreground"
        >
          No device has connected to the server yet.
        </Card.Content>
      </Card.Root>
    {/each}
  </section>
</div>
