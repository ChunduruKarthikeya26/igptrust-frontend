"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Globe, Activity, Database, CreditCard } from "lucide-react"

export function SectionCards({
  websitesCount = 0,
  activeWebsitesCount = 0,
  totalConsents = 0,
  plan = "FREE"
}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {/* Total Websites */}
      <Card className="bg-card border border-border/50 shadow-xs hover:shadow-sm transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardDescription className="text-xs font-semibold tracking-tight text-muted-foreground uppercase">Total Websites</CardDescription>
          <CardAction>
            <Globe className="h-4 w-4 text-muted-foreground/70" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-0.5 pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            {websitesCount}
          </CardTitle>
          <div className="text-xs text-muted-foreground/80 mt-0.5">
            Configured in account
          </div>
        </CardContent>
      </Card>

      {/* Active Websites */}
      <Card className="bg-card border border-border/50 shadow-xs hover:shadow-sm transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardDescription className="text-xs font-semibold tracking-tight text-muted-foreground uppercase">Active Websites</CardDescription>
          <CardAction>
            <Activity className="h-4 w-4 text-muted-foreground/70" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-0.5 pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            {activeWebsitesCount}
          </CardTitle>
          <div className="text-xs text-muted-foreground/80 mt-0.5">
            Tracking consent active
          </div>
        </CardContent>
      </Card>

      {/* Total Consents */}
      <Card className="bg-card border border-border/50 shadow-xs hover:shadow-sm transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardDescription className="text-xs font-semibold tracking-tight text-muted-foreground uppercase">Total Consents</CardDescription>
          <CardAction>
            <Database className="h-4 w-4 text-muted-foreground/70" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-0.5 pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            {totalConsents.toLocaleString()}
          </CardTitle>
          <div className="text-xs text-muted-foreground/80 mt-0.5">
            Recorded consent choices
          </div>
        </CardContent>
      </Card>

      {/* Current Plan */}
      <Card className="bg-card border border-border/50 shadow-xs hover:shadow-sm transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardDescription className="text-xs font-semibold tracking-tight text-muted-foreground uppercase">Current Plan</CardDescription>
          <CardAction>
            <CreditCard className="h-4 w-4 text-muted-foreground/70" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-0.5 pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            {plan}
          </CardTitle>
          <div className="text-xs text-muted-foreground/80 mt-0.5">
            Subscription tier level
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
