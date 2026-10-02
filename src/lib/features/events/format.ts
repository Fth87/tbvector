/** Shared labels for cough events, straight from server-handoff.md section 2. */

import type { CoughEvent } from "$lib/api";

export const RESULTS: Record<string, { label: string; tone: string }> = {
  matched: {
    label: "Matched",
    tone: "border-success/20 bg-success/5 text-success",
  },
  ambiguous: {
    label: "Ambiguous",
    tone: "border-warning/25 bg-warning/5 text-warning",
  },
  unmatched: { label: "Unmatched", tone: "border-info/20 bg-info/5 text-info" },
  outside_view: {
    label: "Outside view",
    tone: "border-border bg-muted text-muted-foreground",
  },
  no_direction: {
    label: "No direction",
    tone: "border-border bg-muted text-muted-foreground",
  },
};

export const SECTORS = [
  "front",
  "front-right",
  "right",
  "back-right",
  "back",
  "back-left",
  "left",
  "front-left",
] as const;

export const resultOf = (event: Pick<CoughEvent, "result">) =>
  RESULTS[event.result ?? ""] ?? {
    label: event.result ?? "Unknown",
    tone: "border-border bg-muted text-muted-foreground",
  };

/** `utc` is the cough time; `received_at` is only a fallback for events that never had one. */
export const timeOf = (event: Pick<CoughEvent, "utc" | "received_at">) =>
  event.utc ?? event.received_at;

const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});

export const formatTimestamp = (value: string) =>
  dateTime.format(new Date(value));

export const formatDay = (day: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(`${day}T00:00:00Z`),
  );
