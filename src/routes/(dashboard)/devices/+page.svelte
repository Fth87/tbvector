<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import Camera from "@lucide/svelte/icons/camera";
  import Cpu from "@lucide/svelte/icons/cpu";
  import Mic from "@lucide/svelte/icons/mic";
  import Monitor from "@lucide/svelte/icons/monitor";
  import Thermometer from "@lucide/svelte/icons/thermometer";
  import Upload from "@lucide/svelte/icons/upload";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import { cn } from "$lib/utils.js";
  import { getDevices } from "$lib/api";
  import { formatTimestamp } from "$features/events/format";

  let { data } = $props();

  let polled = $state<Awaited<ReturnType<typeof getDevices>> | null>(null);
  const devices = $derived(polled ?? data.devices);

  /** Heartbeat fields are whatever the device sends, so read them defensively. */
  const number = (value: unknown) => (typeof value === "number" ? value : null);
  const text = (value: unknown) =>
    typeof value === "string"
      ? value
      : typeof value === "boolean"
        ? value
          ? "ok"
          : "fault"
        : null;

  function facts(status: Record<string, unknown>) {
    const queued =
      number(status.queued) ??
      number((status.uploads as Record<string, unknown>)?.queued);
    return [
      {
        icon: Thermometer,
        label: "Temperature",
        value: number(status.temp_c) ? `${number(status.temp_c)} °C` : null,
      },
      {
        icon: Upload,
        label: "Queued events",
        value: queued === null ? null : String(queued),
      },
      { icon: Camera, label: "Camera", value: text(status.camera) },
      { icon: Mic, label: "Microphone", value: text(status.mic) },
      { icon: Cpu, label: "Version", value: text(status.version) },
    ].filter((fact) => fact.value !== null);
  }

  onMount(() => {
    const timer = window.setInterval(async () => {
      polled = await getDevices().catch(() => polled);
    }, 15000);
    return () => window.clearInterval(timer);
  });
</script>

<svelte:head>
  <title>Devices · TB Vector</title>
  <meta name="description" content="Status of the TB Vector devices" />
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-5">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div class="flex min-w-0 items-center gap-3">
      <Sidebar.Trigger aria-label="Toggle sidebar" />
      <div class="min-w-0">
        <h1 class="text-heading-3 font-bold tracking-tight">Devices</h1>
        <p class="text-sm text-muted-foreground">
          Reported by each device over its control channel
        </p>
      </div>
    </div>
    <Button href={resolve("/monitoring")} variant="outline" size="sm"
      >Live monitoring</Button
    >
  </header>

  {#each devices as device (device.device_id)}
    <Card.Root>
      <Card.Header class="flex-row items-start justify-between gap-3 pb-3">
        <div class="flex min-w-0 items-center gap-3">
          <span
            class={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg",
              device.connected
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Monitor class="size-4" aria-hidden="true" />
          </span>
          <div class="min-w-0">
            <Card.Title class="text-base">{device.device_id}</Card.Title>
            <Card.Description>
              Last heartbeat {formatTimestamp(device.last_seen)}
            </Card.Description>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          {#if device.streaming}
            <Badge
              variant="outline"
              class="border-warning/25 bg-warning/5 text-warning"
            >
              Streaming · {device.viewers} viewer{device.viewers === 1
                ? ""
                : "s"}
            </Badge>
          {/if}
          <Badge
            variant="outline"
            class={device.connected
              ? "border-success/20 bg-success/5 text-success"
              : "border-border bg-muted text-muted-foreground"}
          >
            {device.connected ? "Online" : "Offline"}
          </Badge>
        </div>
      </Card.Header>
      <Card.Content>
        {#if facts(device.status).length}
          <dl class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {#each facts(device.status) as fact (fact.label)}
              {@const Icon = fact.icon}
              <div
                class="flex items-center gap-2.5 rounded-xl bg-primary/[0.035] px-3 py-2.5"
              >
                <Icon class="size-4 shrink-0 text-primary" aria-hidden="true" />
                <div class="min-w-0">
                  <dt class="text-[11px] text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd class="truncate text-xs font-semibold">{fact.value}</dd>
                </div>
              </div>
            {/each}
          </dl>
        {:else}
          <p class="text-sm text-muted-foreground">
            This device has not reported any status details yet.
          </p>
        {/if}
      </Card.Content>
    </Card.Root>
  {:else}
    <Card.Root>
      <Card.Content
        class="px-4 py-10 text-center text-sm text-muted-foreground"
      >
        No device has connected to the server yet. A device appears here once it
        opens its control channel and sends a heartbeat.
      </Card.Content>
    </Card.Root>
  {/each}
</div>
