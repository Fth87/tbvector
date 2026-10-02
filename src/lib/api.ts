/** Shapes served by tbvector-server. Admin cookie goes along automatically (same origin). */

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

export type Device = {
  device_id: string;
  last_seen: string;
  connected: boolean;
  streaming: boolean;
  viewers: number;
  status: Record<string, unknown>;
};

export type Stats = {
  total: number;
  today: number;
  devices: number;
  first_utc: string | null;
  last_utc: string | null;
  by: {
    result: Record<string, number>;
    sector: Record<string, number>;
    band: Record<string, number>;
    device: Record<string, number>;
  };
  per_day: { day: string; count: number }[];
};

type Fetch = typeof globalThis.fetch;

async function get<T>(path: string, fetcher: Fetch): Promise<T> {
  const res = await fetcher(path);
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  return (await res.json()) as T;
}

export const getEvents = (fetcher: Fetch = fetch) =>
  get<CoughEvent[]>("/api/events", fetcher);
export const getDevices = (fetcher: Fetch = fetch) =>
  get<Device[]>("/api/devices", fetcher);
export const getStats = (fetcher: Fetch = fetch) =>
  get<Stats>("/api/stats", fetcher);

export const mediaUrl = (eventId: string, kind: "image" | "audio") =>
  `/api/events/${encodeURIComponent(eventId)}/${kind}`;

/** Camera frames arrive as JPEG binary over a WebSocket that the server relays from the device. */
export type LiveStatus = "connecting" | "live" | "offline" | "error";

export function liveStream(
  deviceId: string,
  onFrame: (url: string) => void,
  onStatus: (status: LiveStatus) => void,
) {
  const socket = new WebSocket(
    `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/api/live/${encodeURIComponent(deviceId)}`,
  );
  socket.binaryType = "blob";
  onStatus("connecting");

  let current = "";
  socket.onmessage = (event) => {
    if (!(event.data instanceof Blob)) return;
    onStatus("live");
    const next = URL.createObjectURL(event.data);
    // Revoke the previous frame only after the new one is handed over, or the image blinks.
    const previous = current;
    current = next;
    onFrame(next);
    if (previous) URL.revokeObjectURL(previous);
  };
  // The server closes with 1011 when the device is not connected, and 1008 when not logged in.
  socket.onclose = (event) =>
    onStatus(
      event.code === 1011 ? "offline" : event.wasClean ? "offline" : "error",
    );
  socket.onerror = () => onStatus("error");

  return () => {
    socket.close();
    if (current) URL.revokeObjectURL(current);
  };
}
