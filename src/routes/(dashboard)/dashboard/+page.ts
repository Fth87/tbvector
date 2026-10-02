import { error } from "@sveltejs/kit";
import type { CoughEvent, Device, Stats } from "$lib/api";

export async function load({ fetch }) {
  const [stats, events, devices] = await Promise.all([
    fetch("/api/stats"),
    fetch("/api/events"),
    fetch("/api/devices"),
  ]);
  if (!stats.ok || !events.ok || !devices.ok)
    error(500, "Could not load dashboard data.");
  return {
    stats: (await stats.json()) as Stats,
    events: (await events.json()) as CoughEvent[],
    devices: (await devices.json()) as Device[],
  };
}
