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
      <CardContent className="pb-0 flex-1 flex items-center justify-center min-h-[200px]">
        {chartData.length === 0 ? (
          <div className="text-muted-foreground text-sm py-12">No website data available</div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 0,
                right: 32,
                top: 10,
                bottom: 10,
              }}
              barSize={20}
            >
              <CartesianGrid horizontal={false} className="stroke-muted/30" />
              <YAxis
                dataKey="domain"
                type="category"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                width={90}
              />
              <XAxis dataKey="total" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="w-[180px]"
                    formatter={(value, name, item, index) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{
                            backgroundColor: `var(--color-${name})`,
                          }}
                        />
                        <span className="text-muted-foreground">
                          {chartConfig[name]?.label || name}
                        </span>
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
              <Bar dataKey="accepted_all" stackId="a" fill="var(--color-accepted_all)" radius={[4, 0, 0, 4]} />
              <Bar dataKey="rejected_all" stackId="a" fill="var(--color-rejected_all)" />
              <Bar dataKey="customized" stackId="a" fill="var(--color-customized)" />
              <Bar dataKey="withdrawn" stackId="a" fill="var(--color-withdrawn)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="total" fill="transparent" minPointSize={0} tooltipType="none">
                <LabelList
                  dataKey="total"
                  position="right"
                  offset={10}
                  className="fill-foreground font-semibold text-[11px]"
                />
              </Bar>
              <ChartLegend content={<ChartLegendContent />} className="text-[11px] font-medium" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-1.5 text-xs border-t bg-muted/10 px-6 py-4 rounded-b-xl mt-4">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Activity className="h-4 w-4 text-primary" />
          Real-time logs active
        </div>
        <div className="text-muted-foreground">
          Tracking a total of {totalConsents.toLocaleString()} responses across {chartData.length} domains
        </div>
      </CardFooter>
    </Card>
  )
}
