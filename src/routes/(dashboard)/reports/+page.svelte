<script lang="ts">
  import { resolve } from "$app/paths";
  import CalendarDays from "@lucide/svelte/icons/calendar-days";
  import Download from "@lucide/svelte/icons/download";
  import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Popover } from "bits-ui";
  import * as Select from "$lib/components/ui/select";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
  } from "$lib/components/ui/chart";
  import { LineChart } from "layerchart";

  type TrendPoint = { label: string; acoustic: number; tbLike: number };

  const trend: TrendPoint[] = [
    { label: "Sep 1", acoustic: 820, tbLike: 82 },
    { label: "Sep 2", acoustic: 930, tbLike: 91 },
    { label: "Sep 3", acoustic: 750, tbLike: 62 },
    { label: "Sep 4", acoustic: 1080, tbLike: 104 },
    { label: "Sep 5", acoustic: 950, tbLike: 88 },
    { label: "Sep 6", acoustic: 860, tbLike: 76 },
    { label: "Sep 7", acoustic: 1640, tbLike: 142 },
    { label: "Sep 8", acoustic: 1390, tbLike: 126 },
    { label: "Sep 9", acoustic: 1080, tbLike: 101 },
    { label: "Sep 10", acoustic: 1210, tbLike: 108 },
    { label: "Sep 11", acoustic: 940, tbLike: 83 },
    { label: "Sep 12", acoustic: 1390, tbLike: 119 },
    { label: "Sep 13", acoustic: 1480, tbLike: 121 },
  ];

  const chartConfig = {
    acoustic: { label: "Acoustic Events", color: "hsl(var(--primary))" },
    tbLike: { label: "TB-like Cough Signals", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const metrics = [
    {
      label: "Total Acoustic Events",
      value: "12,482",
      change: "+12% vs previous period",
    },
    {
      label: "TB-like Cough Signals",
      value: "1,024",
      change: "+8% vs previous period",
    },
    {
      label: "Signals Flagged for Follow-up",
      value: "286",
      change: "+16% vs previous period",
    },
    {
      label: "Active Screening Follow-ups",
      value: "42",
      change: "+5% vs previous period",
    },
  ];

  const classification = [
    {
      label: "Acoustic Events",
      value: "12,482",
      percent: 100,
      color: "bg-primary",
    },
    {
      label: "TB-like Cough Signals",
      value: "1,024",
      percent: 41,
      color: "bg-chart-2",
    },
    {
      label: "Non-TB Cough Signals",
      value: "2,318",
      percent: 24,
      color: "bg-info",
    },
  ];

  const locations = [
    ["General Hospital – Outpatient", 248],
    ["City Medical Center – Wing A", 186],
    ["East District Hospital – Outpatient", 142],
    ["West Regional Hospital – Ward B", 98],
    ["North Community Clinic – Main Area", 76],
  ] as const;

  const followUp = [
    ["Detected", 1024],
    ["Reviewed", 286],
    ["Referred", 193],
    ["Screening", 142],
    ["Clinical Assess.", 64],
    ["Outcome", 48],
    ["Closed", 42],
  ] as const;

  const insights = [
    [
      "Higher Activity in Central Zone",
      "The Central zone recorded the highest number of acoustic events, accounting for 18.5% of all events.",
    ],
    [
      "Notable Increase on Sep 7",
      "Acoustic events increased by 34% compared to the previous day, with a corresponding rise in TB-like cough signals.",
    ],
    [
      "Follow-up Progress",
      "40 screening cases are active. 77% of flagged signals are already in the review or follow-up process.",
    ],
  ] as const;

  const facilityItems = [
    "All Facilities",
    "City General Hospital",
    "Regional Medical Center",
  ];
  const zoneItems = ["All Zones", "Zone 1", "Zone 2", "Zone 3", "Zone 4"];
  const deviceItems = ["All Devices", "TBV-01", "TBV-02", "TBV-03", "TBV-04"];
  let selectedFacility = $state("All Facilities");
  let selectedZone = $state("All Zones");
  let selectedDevice = $state("All Devices");
  let trendPeriod = $state("daily");
  let startDate = $state("2026-09-01");
  let endDate = $state("2026-09-13");
  let datePickerOpen = $state(false);
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const dateRangeLabel = $derived(
    `${dateFormatter.format(new Date(`${startDate}T00:00:00`))} – ${dateFormatter.format(new Date(`${endDate}T00:00:00`))}`,
  );
</script>

<svelte:head>
  <title>Reports · TB Vector</title>
  <meta
    name="description"
    content="Analytics and reports for acoustic detection events"
  />
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col gap-4">
  <header class="flex flex-wrap items-start justify-between gap-4">
    <div class="flex items-start gap-3">
      <Sidebar.Trigger aria-label="Toggle sidebar" />
      <div>
        <h1 class="text-heading-3 font-bold tracking-tight">Reports</h1>
        <p class="text-sm text-muted-foreground">
          Analytics and screening follow-up overview
        </p>
      </div>
    </div>
    <p class="text-xs text-muted-foreground">
      Last updated: Sep 13, 2026 14:32 (UTC-7)
    </p>
  </header>

  <section
    class="flex flex-wrap items-end justify-between gap-3"
    aria-label="Report filters"
  >
    <div class="flex flex-wrap items-end gap-2">
      <Popover.Root bind:open={datePickerOpen}>
        <Popover.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              variant="outline"
              size="sm"
              class="h-8 w-56 !bg-card text-xs font-normal hover:!bg-card"
            >
              <CalendarDays data-icon="inline-start" />{dateRangeLabel}
            </Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-auto space-y-3 bg-card p-4" align="start">
          <p class="text-xs font-semibold text-foreground">Select date range</p>
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="grid gap-1 text-xs text-muted-foreground"
              ><span>Start date</span><Input
                type="date"
                bind:value={startDate}
                class="h-8 bg-card text-xs"
              /></label
            >
            <label class="grid gap-1 text-xs text-muted-foreground"
              ><span>End date</span><Input
                type="date"
                bind:value={endDate}
                class="h-8 bg-card text-xs"
              /></label
            >
          </div>
          <Button
            size="sm"
            class="w-full"
            onclick={() => (datePickerOpen = false)}>Apply date range</Button
          >
        </Popover.Content>
      </Popover.Root>
      {#each [["Facility", facilityItems, selectedFacility], ["Zone", zoneItems, selectedZone], ["Device", deviceItems, selectedDevice]] as filter (filter[0])}
        {@const label = filter[0] as string}
        {@const items = filter[1] as string[]}
        {@const selected = filter[2] as string}
        <Select.Root
          type="single"
          items={items.map((item) => ({ value: item, label: item }))}
          value={selected}
          onValueChange={(value) => {
            if (label === "Facility") selectedFacility = value;
            else if (label === "Zone") selectedZone = value;
            else selectedDevice = value;
          }}
        >
          <Select.Trigger
            class="h-8 w-32 bg-card text-xs"
            size="sm"
            aria-label={`Filter by ${label}`}>{selected}</Select.Trigger
          >
          <Select.Content
            >{#each items as item (item)}<Select.Item value={item} label={item}
                >{item}</Select.Item
              >{/each}</Select.Content
          >
        </Select.Root>
      {/each}
      <Button size="sm" class="h-8">Apply</Button>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" class="h-8 !bg-card hover:!bg-card"
        ><Download data-icon="inline-start" />Export PDF</Button
      >
      <Button variant="outline" size="sm" class="h-8 !bg-card hover:!bg-card"
        ><Download data-icon="inline-start" />Export CSV</Button
      >
    </div>
  </section>

  <section
    class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    aria-label="Report summary"
  >
    {#each metrics as metric (metric.label)}
      <Card.Root class="border-0 shadow-xs">
        <Card.Content class="flex flex-col gap-1 p-4">
          <p class="text-xs text-muted-foreground">{metric.label}</p>
          <p class="text-heading-2 font-bold tabular-nums">{metric.value}</p>
          <p class="text-xs font-semibold text-success">
            <ArrowUpRight
              class="mr-1 inline size-3"
              aria-hidden="true"
            />{metric.change}
          </p>
        </Card.Content>
      </Card.Root>
    {/each}
  </section>

  <section class="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
    <Card.Root class="min-w-0 border-0 shadow-xs">
      <Card.Header
        class="!flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start"
      >
        <div>
          <Card.Title class="!text-base !font-semibold leading-tight"
            >Acoustic &amp; Screening Signal Trend</Card.Title
          ><Card.Description class="!text-xs leading-5"
            >Trends of acoustic events and TB-like cough signals over the
            selected period.</Card.Description
          >
        </div>
        <div class="flex h-8 shrink-0 items-center rounded-lg bg-muted p-1">
          <Button
            variant={trendPeriod === "hourly" ? "default" : "ghost"}
            size="sm"
            class="h-6 px-3 text-xs leading-none"
            onclick={() => (trendPeriod = "hourly")}>Hourly</Button
          ><Button
            variant={trendPeriod === "daily" ? "default" : "ghost"}
            size="sm"
            class="h-6 px-3 text-xs leading-none"
            onclick={() => (trendPeriod = "daily")}>Daily</Button
          ><Button
            variant={trendPeriod === "weekly" ? "default" : "ghost"}
            size="sm"
            class="h-6 px-3 text-xs leading-none"
            onclick={() => (trendPeriod = "weekly")}>Weekly</Button
          >
        </div>
      </Card.Header>
      <Card.Content class="pt-0">
        <ChartContainer
          config={chartConfig}
          class="!aspect-auto h-[300px] w-full min-w-0 max-w-full overflow-hidden"
        >
          <LineChart
            data={trend}
            x="label"
            yDomain={[0, 1800]}
            axis
            padding={{ top: 8, right: 12, bottom: 54, left: 48 }}
            legend={{
              placement: "bottom",
              variant: "swatches",
              classes: {
                root: "w-full",
                items: "flex-wrap justify-center gap-x-6 gap-y-2",
                swatch:
                  "relative !h-0.5 !w-6 rounded-full after:absolute after:-right-1 after:top-1/2 after:size-2 after:-translate-y-1/2 after:rounded-full after:bg-inherit",
                label: "text-xs text-primary",
              },
            }}
            props={{
              xAxis: {
                tickSpacing: 64,
                tickOcclusion: { padding: 8, priority: "start-end" },
              },
              yAxis: { tickSpacing: 50 },
            }}
            series={[
              {
                key: "acoustic",
                value: "acoustic",
                label: "Acoustic Events",
                color: "var(--color-acoustic)",
              },
              {
                key: "tbLike",
                value: "tbLike",
                label: "TB-like Cough Signals",
                color: "var(--color-tbLike)",
              },
            ]}
          >
            {#snippet tooltip()}
              <ChartTooltip />
            {/snippet}
          </LineChart>
        </ChartContainer>
      </Card.Content>
    </Card.Root>

    <Card.Root class="border-0 shadow-xs">
      <Card.Header
        ><Card.Title class="text-base">Signal Classification</Card.Title
        ><Card.Description
          >Distribution of detected acoustic signals.</Card.Description
        ></Card.Header
      >
      <Card.Content class="flex flex-col gap-5">
        {#each classification as item (item.label)}<div
            class="flex flex-col gap-2"
          >
            <div class="flex justify-between text-xs">
              <span class="text-muted-foreground">{item.label}</span><strong
                class="tabular-nums">{item.value}</strong
              >
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-muted">
              <div
                class={`h-full rounded-full ${item.color}`}
                style={`width: ${item.percent}%`}
              ></div>
            </div>
          </div>{/each}
        <div class="rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
          <p class="text-heading-2 font-bold text-primary">8.2%</p>
          <p class="mt-1 text-sm text-muted-foreground">
            of acoustic events classified as TB-like cough signals.
          </p>
          <p class="mt-2 text-xs text-muted-foreground">
            AI-based classification from acoustic analysis, not a clinical
            diagnosis.
          </p>
        </div>
      </Card.Content>
    </Card.Root>
  </section>

  <section class="grid gap-4 xl:grid-cols-3">
    <Card.Root class="border-0 shadow-xs xl:row-span-2"
      ><Card.Header
        ><Card.Title class="text-base"
          >Top Locations by TB-like Cough Signals</Card.Title
        ><Card.Description
          >Facilities and zones with the highest number of TB-like signals.</Card.Description
        ></Card.Header
      ><Card.Content class="flex flex-col gap-4"
        >{#each locations as location, index (location[0])}<div
            class="flex flex-col gap-1.5"
          >
            <div class="flex items-center gap-2 text-xs">
              <span class="w-3 text-muted-foreground">{index + 1}</span><span
                class="min-w-0 flex-1 truncate text-muted-foreground"
                >{location[0]}</span
              ><strong class="tabular-nums">{location[1]}</strong>
            </div>
            <div class="ml-5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-primary"
                style={`width: ${(location[1] / 248) * 100}%`}
              ></div>
            </div>
          </div>{/each}</Card.Content
      ></Card.Root
    >
    <Card.Root class="border-0 shadow-xs xl:row-span-2"
      ><Card.Header
        ><Card.Title class="text-base">Screening Follow-up</Card.Title
        ><Card.Description
          >Progression of detected signals through the follow-up process.</Card.Description
        ></Card.Header
      ><Card.Content class="flex flex-col gap-3"
        >{#each followUp as item (item[0])}<div class="flex flex-col gap-1.5">
            <div class="flex justify-between text-xs">
              <span class="text-muted-foreground">{item[0]}</span><strong
                class="tabular-nums">{item[1].toLocaleString()}</strong
              >
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-chart-2"
                style={`width: ${(item[1] / 1024) * 100}%`}
              ></div>
            </div>
          </div>{/each}</Card.Content
      ></Card.Root
    >
    <Card.Root class="border-0 shadow-xs"
      ><Card.Header
        ><Card.Title class="text-base">Key Insights</Card.Title></Card.Header
      ><Card.Content class="flex flex-col gap-3"
        >{#each insights as insight, index (insight[0])}<div
            class="flex gap-3 rounded-lg bg-muted/50 p-3"
          >
            <span
              class="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary"
              >{index + 1}</span
            >
            <div>
              <p class="text-xs font-semibold">{insight[0]}</p>
              <p class="mt-1 text-xs leading-relaxed text-muted-foreground">
                {insight[1]}
              </p>
            </div>
          </div>{/each}</Card.Content
      ></Card.Root
    >
    <Card.Root class="border-0 shadow-xs"
      ><Card.Header
        ><Card.Title class="text-base">Follow-up Status</Card.Title
        ></Card.Header
      ><Card.Content
        ><div class="flex h-3 overflow-hidden rounded-full bg-muted">
          <span class="w-[42%] bg-warning"></span><span
            class="w-[26%] bg-primary"
          ></span><span class="w-[14%] bg-muted-foreground/60"></span><span
            class="w-[8%] bg-muted-foreground/30"
          ></span>
        </div>
        <div class="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>● Pending 42%</span><span class="text-primary"
            >● In Progress 26%</span
          ><span>● Completed 14%</span><span>● Closed 8%</span>
        </div>
        <p class="mt-4 text-xs text-muted-foreground">
          Total Signals: <strong class="text-foreground">286</strong> ·
          <span class="text-success">+18% vs previous period</span>
        </p></Card.Content
      ></Card.Root
    >
  </section>
</div>
