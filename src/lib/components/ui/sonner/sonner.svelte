<script lang="ts">
  import {
    Toaster as Sonner,
    type ToasterProps as SonnerProps,
  } from "svelte-sonner";
  import Loader2Icon from "@lucide/svelte/icons/loader-2";
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
  import OctagonXIcon from "@lucide/svelte/icons/octagon-x";
  import InfoIcon from "@lucide/svelte/icons/info";
  import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";

  let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
  theme="light"
  class="toaster group"
  style="--normal-bg: #ffffff; --normal-text: var(--color-foreground); --normal-border: var(--color-border); --success-bg: #eaf7f0; --success-border: #b9e3c9; --success-text: #1f6b45; --info-bg: #edf5fb; --info-border: #bfd9ee; --info-text: #255f89; --warning-bg: #fff7e6; --warning-border: #f1d49a; --warning-text: #8a5a0a; --error-bg: #fff0ef; --error-border: #efc1bd; --error-text: #a33228;"
  {...restProps}
>
  {#snippet loadingIcon()}
    <Loader2Icon class="size-4 animate-spin" />
  {/snippet}
  {#snippet successIcon()}
    <CircleCheckIcon class="size-4" />
  {/snippet}
  {#snippet errorIcon()}
    <OctagonXIcon class="size-4" />
  {/snippet}
  {#snippet infoIcon()}
    <InfoIcon class="size-4" />
  {/snippet}
  {#snippet warningIcon()}
    <TriangleAlertIcon class="size-4" />
  {/snippet}
</Sonner>
