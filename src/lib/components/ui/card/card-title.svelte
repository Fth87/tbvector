<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  data-slot="card-title"
  class={cn(
    "font-display text-heading-4 leading-tight font-bold tracking-[-0.02em] group-data-[size=sm]/card:text-base",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
