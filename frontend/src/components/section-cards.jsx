"use client"

import { Card } from "@/components/ui/card"
import { Globe, Activity, Database, CreditCard } from "lucide-react"

export function SectionCards({
  websitesCount = 0,
  activeWebsitesCount = 0,
  totalConsents = 0,
  plan = "FREE"
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {/* Total Websites */}
      <Card className="relative bg-card border border-border/50 border-l-4 border-l-slate-400 rounded-xl p-6 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-center">
        <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-700 dark:bg-slate-800 flex items-center justify-center shrink-0">
          <Globe className="h-4 w-4 text-slate-100" />
        </div>
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Total Websites
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {websitesCount}
        </div>
      </Card>

      {/* Active Websites */}
      <Card className="relative bg-card border border-border/50 border-l-4 border-l-emerald-500 rounded-xl p-6 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-center">
        <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
          <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Active Websites
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {activeWebsitesCount}
        </div>
      </Card>

      {/* Total Consents */}
      <Card className="relative bg-card border border-border/50 border-l-4 border-l-amber-400 rounded-xl p-6 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-center">
        <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
          <Database className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Total Consents
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {totalConsents.toLocaleString()}
        </div>
      </Card>

      {/* Current Plan */}
      <Card className="relative bg-card border border-border/50 border-l-4 border-l-violet-500 rounded-xl p-6 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-center">
        <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
          <CreditCard className="h-4 w-4 text-violet-500 dark:text-violet-400" />
        </div>
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Current Plan
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground capitalize">
          {typeof plan === 'string' ? plan.toLowerCase() : plan}
        </div>
      </Card>
    </div>
  );
}
