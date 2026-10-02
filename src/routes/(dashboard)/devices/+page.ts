import { error } from "@sveltejs/kit";
import type { Device } from "$lib/api";

export async function load({ fetch }) {
  const res = await fetch("/api/devices");
  if (!res.ok) error(res.status, "Could not load devices.");
  return { devices: (await res.json()) as Device[] };
}
