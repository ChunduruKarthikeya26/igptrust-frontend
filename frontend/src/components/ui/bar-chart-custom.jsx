"use client"

import { Activity } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartConfig = {
  accepted_all: {
    label: "Accepted All",
    color: "oklch(0.627 0.265 137.0)",
  },
  rejected_all: {
    label: "Rejected All",
    color: "oklch(0.645 0.246 16.4)",
  },
  customized: {
    label: "Customized",
    color: "oklch(0.769 0.188 70.0)",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "oklch(0.6 0.05 250)",
  },
}

export function ChartBarLabelCustom({ websitesStats = [] }) {
  // Map real data from props
  const chartData = websitesStats.map(stat => ({
    domain: stat.domain,
    accepted_all: stat.accepted_all || 0,
    rejected_all: stat.rejected_all || 0,
    customized: stat.customized || 0,
    withdrawn: stat.withdrawn || 0,
    total: stat.total || 0,
  })).sort((a, b) => b.total - a.total) // Sort by highest total consents

  const totalConsents = chartData.reduce((acc, curr) => acc + curr.total, 0)

  return (
    <Card className="flex flex-col justify-between bg-card border border-border/50 shadow-xs hover:shadow-sm transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Consent by Website</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          Consent response distribution per domain
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 flex-1 flex items-center justify-center min-h-[250px]">
        {chartData.length === 0 ? (
          <div className="text-muted-foreground text-sm py-12">No website data available</div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} className="stroke-muted/30" />
              <XAxis
                dataKey="domain"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '...' : value}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="w-[180px]"
                    formatter={(value, name, item, index) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[var(--color-bg)]"
                          style={{
                            "--color-bg": `var(--color-${name})`,
                          }}
                        />
                        {chartConfig[name]?.label || name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums">
                          {value}
                          <span className="font-normal text-muted-foreground text-[10px] ml-0.5">
                            logs
                          </span>
                        </div>
                        {index === 3 && (
                          <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-semibold text-foreground">
                            Total
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-bold text-foreground tabular-nums">
                              {item.payload.total}
                              <span className="font-normal text-muted-foreground text-[10px] ml-0.5">
                                logs
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  />
                }
              />
              <Bar dataKey="accepted_all" fill="var(--color-accepted_all)" radius={4} />
              <Bar dataKey="rejected_all" fill="var(--color-rejected_all)" radius={4} />
              <Bar dataKey="customized" fill="var(--color-customized)" radius={4} />
              <Bar dataKey="withdrawn" fill="var(--color-withdrawn)" radius={4} />
              <ChartLegend content={<ChartLegendContent />} className="text-[11px] font-medium mt-2" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-xs border-t bg-muted/10 px-6 py-4 rounded-b-xl mt-4">
        <div className="flex items-center gap-2 font-medium text-foreground">
          Trending up based on active logs <Activity className="h-4 w-4 text-primary" />
        </div>
        <div className="text-muted-foreground">
          Tracking a total of {totalConsents.toLocaleString()} responses across {chartData.length} domains
        </div>
      </CardFooter>
    </Card>
  )
}
