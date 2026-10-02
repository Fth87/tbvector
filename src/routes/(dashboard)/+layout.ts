import { redirect } from "@sveltejs/kit";
import { resolve } from "$app/paths";
import type { Device } from "$lib/api";

export const ssr = false;
export const prerender = true;

// UX only: real protection is the backend's require_admin on every data endpoint.
export async function load({ fetch }) {
  const me = await fetch("/api/auth/me");
  if (!me.ok) redirect(307, resolve("/login"));
  const devices = await fetch("/api/devices");
  return {
    admin: (await me.json()) as { username: string },
    devices: devices.ok ? ((await devices.json()) as Device[]) : [],
  };
}
