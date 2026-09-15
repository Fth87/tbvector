<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants";

  export const inputGroupAddonVariants = tv({
    base: "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-4",
    variants: {
      align: {
        "inline-start": "order-first ps-3",
        "inline-end": "order-last pe-3",
      },
    },
    defaultVariants: { align: "inline-start" },
  });

  export type InputGroupAddonAlign = VariantProps<
    typeof inputGroupAddonVariants
  >["align"];
</script>

<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    children,
    align = "inline-start",
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    align?: InputGroupAddonAlign;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="input-group-addon"
  data-align={align}
  class={cn(inputGroupAddonVariants({ align }), className)}
  onclick={(event) => {
    event.currentTarget.parentElement?.querySelector("input")?.focus();
  }}
  {...restProps}
>
  {@render children?.()}
</div>
