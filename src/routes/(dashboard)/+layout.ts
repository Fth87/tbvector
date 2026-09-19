import { redirect } from "@sveltejs/kit";
import { resolve } from "$app/paths";

export const ssr = false;
export const prerender = true;

// UX only: real protection is the backend's require_admin on every data endpoint.
export async function load({ fetch }) {
  const res = await fetch("/api/auth/me");
  if (!res.ok) redirect(307, resolve("/login"));
  return { admin: (await res.json()) as { username: string } };
}
