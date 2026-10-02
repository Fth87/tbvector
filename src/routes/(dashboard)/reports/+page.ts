import { error } from "@sveltejs/kit";
import type { CoughEvent, Stats } from "$lib/api";

export async function load({ fetch }) {
  const [stats, events] = await Promise.all([
    fetch("/api/stats"),
    fetch("/api/events"),
  ]);
  if (!stats.ok || !events.ok) error(500, "Could not load report data.");
  return {
    stats: (await stats.json()) as Stats,
    events: (await events.json()) as CoughEvent[],
  };
}
