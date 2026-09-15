<script lang="ts">
  import { toast } from "svelte-sonner";
  import CalendarDays from "@lucide/svelte/icons/calendar-days";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Globe2 from "@lucide/svelte/icons/globe-2";
  import Info from "@lucide/svelte/icons/info";
  import Languages from "@lucide/svelte/icons/languages";
  import LockKeyhole from "@lucide/svelte/icons/lock-keyhole";
  import MapPin from "@lucide/svelte/icons/map-pin";
  import Network from "@lucide/svelte/icons/network";
  import Settings2 from "@lucide/svelte/icons/settings-2";
  import ShieldCheck from "@lucide/svelte/icons/shield-check";
  import UsersRound from "@lucide/svelte/icons/users-round";
  import Wrench from "@lucide/svelte/icons/wrench";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Field from "$lib/components/ui/field";
  import { Input } from "$lib/components/ui/input";
  import * as Select from "$lib/components/ui/select";
  import * as Sidebar from "$lib/components/ui/sidebar";

  type SettingSection = {
    label: string;
    description: string;
    icon: typeof Settings2;
  };

  const sections: SettingSection[] = [
    {
      label: "General",
      description: "System and regional settings",
      icon: Settings2,
    },
    {
      label: "Facility & Deployment",
      description: "Location and installation setup",
      icon: MapPin,
    },
    {
      label: "Detection & AI",
      description: "Acoustic, vision and AI configuration",
      icon: Network,
    },
    {
      label: "Alerts & Workflow",
      description: "Event rules and case workflow",
      icon: CalendarDays,
    },
    {
      label: "Data & Privacy",
      description: "Data management and security",
      icon: ShieldCheck,
    },
    {
      label: "Users & Roles",
      description: "Access control and permissions",
      icon: UsersRound,
    },
    {
      label: "Integrations",
      description: "External systems and data exchange",
      icon: Globe2,
    },
    {
      label: "System Maintenance",
      description: "Updates, backups and diagnostics",
      icon: Wrench,
    },
  ];

  const dateFormats = ["DD MMM YYYY", "MMM DD, YYYY", "YYYY-MM-DD"];
  const languages = ["English", "Bahasa Indonesia"];
  const dashboards = ["Overview", "Live Monitoring", "Event History"];
  const timeZones = [
    "(GMT+7) Jakarta, Indonesia",
    "(GMT+0) London, United Kingdom",
    "(GMT-5) New York, United States",
  ];

  let systemName = $state("TB Vector");
  let organization = $state("Central City Hospital");
  let dateFormat = $state("DD MMM YYYY");
  let language = $state("English");
  let timeZone = $state("(GMT+7) Jakarta, Indonesia");
  let dashboard = $state("Overview");
  let activeSection = $state("General");

  function saveChanges() {
    toast.success("Settings saved successfully.");
  }
</script>

<svelte:head>
  <title>Settings · TB Vector</title>
  <meta name="description" content="Configure TB Vector system settings" />
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col gap-5">
  <header class="flex flex-wrap items-start justify-between gap-4">
    <div class="flex min-w-0 items-start gap-3">
      <Sidebar.Trigger aria-label="Toggle sidebar" />
      <div class="min-w-0">
        <h1 class="text-heading-3 font-bold tracking-tight">Settings</h1>
        <p class="text-sm text-muted-foreground">
          Configure surveillance, detection, alerts, workflow, data, and system
          access.
        </p>
      </div>
    </div>
    <div class="flex items-center gap-2 text-xs text-muted-foreground">
      <Badge
        variant="secondary"
        class="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground"
      >
        System configuration
      </Badge>
      <span class="hidden sm:inline">Last updated: 13 Sep 2026, 14:32</span>
    </div>
  </header>

  <div class="grid items-start gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
    <Card.Root class="p-0">
      <nav aria-label="Settings sections" class="flex flex-col p-1">
        {#each sections as section (section.label)}
          {@const Icon = section.icon}
          <button
            type="button"
            class="flex min-h-16 items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/60"
            class:bg-sidebar-accent={activeSection === section.label}
            class:text-primary={activeSection === section.label}
            onclick={() => (activeSection = section.label)}
          >
            <Icon class="size-4 shrink-0" aria-hidden="true" />
            <span class="min-w-0">
              <span class="block text-sm font-semibold">{section.label}</span>
              <span class="mt-0.5 block text-xs text-muted-foreground"
                >{section.description}</span
              >
            </span>
          </button>
        {/each}
      </nav>
    </Card.Root>

    <div class="flex min-w-0 flex-col gap-4">
      <Card.Root>
        <Card.Header
          class="flex flex-row items-start gap-3 border-b border-border/60"
        >
          <span
            class="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
          >
            <Settings2 aria-hidden="true" />
          </span>
          <div>
            <Card.Title class="text-lg">General</Card.Title>
            <Card.Description>System and regional settings</Card.Description>
          </div>
        </Card.Header>

        <Card.Content class="flex flex-col gap-5 pt-5">
          <Field.FieldGroup class="grid gap-5 md:grid-cols-2">
            <Field.Field>
              <Field.Label for="system-name">System name</Field.Label>
              <Input id="system-name" bind:value={systemName} />
            </Field.Field>
            <Field.Field>
              <Field.Label for="date-format">Date format</Field.Label>
              <Select.Root type="single" bind:value={dateFormat}>
                <Select.Trigger id="date-format" class="w-full bg-muted/30">
                  <Select.Value placeholder="Select date format" />
                </Select.Trigger>
                <Select.Content>
                  {#each dateFormats as option (option)}
                    <Select.Item value={option} label={option}
                      >{option}</Select.Item
                    >
                  {/each}
                </Select.Content>
              </Select.Root>
            </Field.Field>
            <Field.Field>
              <Field.Label for="organization">Organization</Field.Label>
              <Input id="organization" bind:value={organization} />
            </Field.Field>
            <Field.Field>
              <Field.Label for="language">Language</Field.Label>
              <Select.Root type="single" bind:value={language}>
                <Select.Trigger id="language" class="w-full bg-muted/30">
                  <Select.Value placeholder="Select language" />
                </Select.Trigger>
                <Select.Content>
                  {#each languages as option (option)}
                    <Select.Item value={option} label={option}
                      >{option}</Select.Item
                    >
                  {/each}
                </Select.Content>
              </Select.Root>
            </Field.Field>
            <Field.Field>
              <Field.Label for="time-zone">Time zone</Field.Label>
              <Select.Root type="single" bind:value={timeZone}>
                <Select.Trigger id="time-zone" class="w-full bg-muted/30">
                  <Select.Value placeholder="Select time zone" />
                </Select.Trigger>
                <Select.Content>
                  {#each timeZones as option (option)}
                    <Select.Item value={option} label={option}
                      >{option}</Select.Item
                    >
                  {/each}
                </Select.Content>
              </Select.Root>
            </Field.Field>
            <Field.Field>
              <Field.Label for="dashboard-view"
                >Default dashboard view</Field.Label
              >
              <Select.Root type="single" bind:value={dashboard}>
                <Select.Trigger id="dashboard-view" class="w-full bg-muted/30">
                  <Select.Value placeholder="Select dashboard" />
                </Select.Trigger>
                <Select.Content>
                  {#each dashboards as option (option)}
                    <Select.Item value={option} label={option}
                      >{option}</Select.Item
                    >
                  {/each}
                </Select.Content>
              </Select.Root>
            </Field.Field>
          </Field.FieldGroup>

          <div
            class="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary"
          >
            <Info class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              These settings control how your TB Vector system is displayed and
              how regional formatting is applied across the dashboard and
              reports.
            </p>
          </div>

          <div
            class="flex items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-4 text-primary-foreground"
          >
            <div class="min-w-0">
              <p class="font-semibold">TB Vector</p>
              <p class="text-xs text-primary-foreground/75">
                Configurable today. Healthier tomorrows.
              </p>
            </div>
            <span
              class="grid size-9 shrink-0 place-items-center rounded-full border border-primary-foreground/40 text-xl leading-none"
              aria-hidden="true">×</span
            >
          </div>
        </Card.Content>

        <Card.Footer class="justify-end border-t border-border/60 pt-4">
          <Button onclick={saveChanges}>Save Changes</Button>
        </Card.Footer>
      </Card.Root>

      <details class="group rounded-xl bg-card px-5 py-3 shadow-xs">
        <summary
          class="flex cursor-pointer list-none items-center gap-3 text-sm font-semibold [&::-webkit-details-marker]:hidden"
        >
          <LockKeyhole
            class="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          Configuration Audit Log
          <ChevronDown
            class="ml-auto size-4 text-muted-foreground transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <p
          class="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground"
        >
          No configuration changes have been recorded in this session.
        </p>
      </details>
    </div>
  </div>
</div>
