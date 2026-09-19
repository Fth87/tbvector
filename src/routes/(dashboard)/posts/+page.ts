import { error } from "@sveltejs/kit";

export type CoughEvent = {
  event_id: string;
  device_id: string;
  utc: string | null;
  result: string | null;
  zone_label: string | null;
  zone_sector: string | null;
  zone_band: string | null;
  p_cough_final: number | null;
  has_image: boolean;
  received_at: string;
};

export async function load({ fetch }) {
  const res = await fetch("/api/events");
  if (!res.ok) error(res.status, "Could not load cough events.");
  return { events: (await res.json()) as CoughEvent[] };
}
