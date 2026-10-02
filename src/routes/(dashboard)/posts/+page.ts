import { error } from "@sveltejs/kit";
import type { CoughEvent } from "$lib/api";

export async function load({ fetch }) {
  const res = await fetch("/api/events");
  if (!res.ok) error(res.status, "Could not load cough events.");
  return { events: (await res.json()) as CoughEvent[] };
}
