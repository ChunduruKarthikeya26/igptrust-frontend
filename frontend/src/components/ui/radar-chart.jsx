"use client"

import { ShieldCheck } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  Accepted: {
    label: "Accepted All",
    color: "oklch(0.627 0.265 137.0)",
  },
  Rejected: {
    label: "Rejected All",
    color: "oklch(0.645 0.246 16.4)",
  },
  Customized: {
    label: "Customized",
    color: "oklch(0.769 0.188 70.0)",
  },
  Withdrawn: {
    label: "Withdrawn",
    color: "oklch(0.6 0.05 250)",
  },
}

export function ChartRadarDots({ data }) {
  const chartData = [
    { type: "Accepted", count: data?.accepted_all || 0 },
    { type: "Rejected", count: data?.rejected_all || 0 },
    { type: "Customized", count: data?.customized || 0 },
    { type: "Withdrawn", count: data?.withdrawn || 0 },
  ]

  const total = chartData.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <Card className="flex flex-col justify-between bg-card border border-border/50 shadow-xs hover:shadow-sm transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Consent Overview</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          Distribution of consent responses across all domains
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 flex-1 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-h-[220px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="type" />} />
            <PolarAngleAxis 
              dataKey="type" 
              tick={(props) => {
                const { x, y, payload, textAnchor } = props;
                const colors = {
                  "Accepted": "oklch(0.627 0.265 137.0)",
                  "Rejected": "oklch(0.645 0.246 16.4)",
                  "Customized": "oklch(0.769 0.188 70.0)",
                  "Withdrawn": "oklch(0.6 0.05 250)"
                };
                const fill = colors[payload.value] || "var(--muted-foreground)";
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    fill={fill}
                    fontSize={11}
                    fontWeight={600}
                  >
                    {payload.value}
                  </text>
                );
              }}
            />
            <PolarGrid className="stroke-muted/40" />
            <Radar
              dataKey="count"
              fill="var(--color-Accepted)"
              fillOpacity={0.1}
              stroke="oklch(0.627 0.265 137.0)"
              strokeWidth={1.5}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const colors = {
                  "Accepted": "oklch(0.627 0.265 137.0)",
                  "Rejected": "oklch(0.645 0.246 16.4)",
                  "Customized": "oklch(0.769 0.188 70.0)",
                  "Withdrawn": "oklch(0.6 0.05 250)"
                };
                const fillColor = colors[payload.type] || "var(--color-count)";
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={fillColor}
                    stroke="var(--background)"
                    strokeWidth={1.5}
                  />
                );
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1.5 text-xs border-t bg-muted/10 px-6 py-4 rounded-b-xl mt-4">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Active consent tracking
        </div>
        <div className="text-muted-foreground">
          Showing response summary for {total.toLocaleString()} total consent logs
        </div>
      </CardFooter>
    </Card>
  )
}
