<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import * as Card from "$lib/components/ui/card";
  import * as Field from "$lib/components/ui/field";

  let username = $state("admin");
  let password = $state("");
  let error = $state("");
  let submitting = $state(false);

  const messages: Record<number, string> = {
    401: "Wrong username or password.",
    503: "Admin login is not configured on the server yet.",
  };

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    submitting = true;
    error = "";
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) return goto(resolve("/dashboard"));
      error = messages[res.status] ?? "Login failed. Please try again.";
    } catch {
      error = "Cannot reach the server. Check your connection.";
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head><title>Login · TB Vector</title></svelte:head>

<main
  class="grid min-h-svh place-items-center bg-gradient-to-br from-[#F1F8F9] to-secondary p-4"
>
  <Card.Root class="w-full max-w-sm">
    <Card.Header>
      <Card.Title class="text-heading-4">TB Vector Admin</Card.Title>
      <Card.Description>Sign in to view cough events.</Card.Description>
    </Card.Header>
    <Card.Content>
      <form class="flex flex-col gap-4" onsubmit={submit}>
        <Field.FieldGroup>
          <Field.Field>
            <Field.Label for="login-username">Username</Field.Label>
            <Input
              id="login-username"
              autocomplete="username"
              required
              bind:value={username}
            />
          </Field.Field>
          <Field.Field>
            <Field.Label for="login-password">Password</Field.Label>
            <Input
              id="login-password"
              type="password"
              autocomplete="current-password"
              required
              bind:value={password}
            />
          </Field.Field>
        </Field.FieldGroup>
        {#if error}
          <p class="text-sm text-destructive" role="alert">{error}</p>
        {/if}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Card.Content>
  </Card.Root>
</main>
