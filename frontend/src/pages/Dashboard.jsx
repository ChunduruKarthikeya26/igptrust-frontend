import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartRadarDots } from "@/components/ui/radar-chart"
import { ChartBarLabelCustom } from "@/components/ui/bar-chart-custom"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { getWebsites } from "@/api/websites"
import { getConsentStats } from "@/api/consents"
import { Globe, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const PAGE_SIZE = 5

export default function Page() {
  const { business } = useAuth()
  const [websites, setWebsites] = useState([])
  const [allStats, setAllStats] = useState([])
  const [totalStats, setTotalStats] = useState({
    total: 0,
    accepted_all: 0,
    rejected_all: 0,
    customized: 0,
    withdrawn: 0
  })
  const [page, setPage] = useState(1)

  useEffect(() => {
    getWebsites()
      .then(async res => {
        const sites = res.data || []
        setWebsites(sites)

        const statsPromises = sites.map(site =>
          getConsentStats(site.id)
            .then(r => ({ domain: site.domain, ...r.data }))
            .catch(() => ({ domain: site.domain, total: 0, accepted_all: 0, rejected_all: 0, customized: 0, withdrawn: 0 }))
        )
        const stats = await Promise.all(statsPromises)
        setAllStats(stats)

        const totals = stats.reduce((acc, s) => ({
          total:        acc.total        + s.total,
          accepted_all: acc.accepted_all + s.accepted_all,
          rejected_all: acc.rejected_all + s.rejected_all,
          customized:   acc.customized   + s.customized,
          withdrawn:    acc.withdrawn    + s.withdrawn,
        }), { total: 0, accepted_all: 0, rejected_all: 0, customized: 0, withdrawn: 0 })
        setTotalStats(totals)
      })
      .catch(() => {})
  }, [])

  // Pagination
  const totalPages  = Math.ceil(websites.length / PAGE_SIZE)
  const paginated   = websites.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const from        = websites.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to          = Math.min(page * PAGE_SIZE, websites.length)

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i)
    else if (pages[pages.length - 1] !== '…') pages.push('…')
  }

  return (
    <SidebarProvider>
      
      
        
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-4 md:py-6">
              
              {/* Welcome banner */}
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Welcome back{business?.name ? `, ${business.name}` : ","} 
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Here's your consent management overview
                </p>
              </div>

              <SectionCards
                websitesCount={websites.length}
                activeWebsitesCount={websites.filter(w => w.is_active).length}
                totalConsents={totalStats.total}
                plan={business?.plan?.toUpperCase() ?? "FREE"}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-6">
                <ChartRadarDots data={totalStats} />
                <ChartBarLabelCustom websitesStats={allStats} />
              </div>

              {/* Consent Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-4 lg:px-6">
                {/* Total Consents */}
                <div className="bg-card border border-border/50 border-l-4 border-l-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-sm">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {totalStats.total.toLocaleString()}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">
                    Total Consents
                  </div>
                </div>

                {/* Accepted All */}
                <div className="bg-card border border-border/50 border-l-4 border-l-emerald-500 rounded-xl p-4 transition-all duration-200 hover:shadow-sm">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {totalStats.accepted_all.toLocaleString()}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">
                    Accepted All
                  </div>
                </div>

                {/* Rejected All */}
                <div className="bg-card border border-border/50 border-l-4 border-l-rose-500 rounded-xl p-4 transition-all duration-200 hover:shadow-sm">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {totalStats.rejected_all.toLocaleString()}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">
                    Rejected All
                  </div>
                </div>

                {/* Customized */}
                <div className="bg-card border border-border/50 border-l-4 border-l-amber-500 rounded-xl p-4 transition-all duration-200 hover:shadow-sm">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {totalStats.customized.toLocaleString()}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">
                    Customized
                  </div>
                </div>

                {/* Withdrawn */}
                <div className="bg-card border border-border/50 border-l-4 border-l-slate-400 rounded-xl p-4 transition-all duration-200 hover:shadow-sm">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {totalStats.withdrawn.toLocaleString()}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">
                    Withdrawn
                  </div>
                </div>
              </div>

              {/* Recent Websites Table */}
              <div className="px-4 lg:px-6">
                <div className="bg-card border border-border/50 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                    <h3 className="font-semibold text-foreground text-base">Recent Websites</h3>
                    <Link to="/websites" className="text-sm text-primary flex items-center gap-1 hover:underline">
                      View all <ArrowRight className="size-4" />
                    </Link>
                  </div>

                  {websites.length === 0 ? (
                    <div className="p-12 text-center">
                      <Globe className="text-muted-foreground/30 mx-auto mb-3 size-8" />
                      <p className="text-muted-foreground text-sm">No websites yet.</p>
                      <Link to="/websites"
                        className="inline-block mt-3 bg-primary text-primary-foreground text-sm
                                   px-4 py-2 rounded-lg hover:opacity-90 transition-colors">
                        Add your first website
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border/50 bg-muted/5 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                              <th className="px-6 py-3.5 text-left font-medium text-muted-foreground text-xs tracking-wider">Domain</th>
                              <th className="px-6 py-3.5 text-left font-medium text-muted-foreground text-xs tracking-wider">Widget Key</th>
                              <th className="px-6 py-3.5 text-left font-medium text-muted-foreground text-xs tracking-wider">Total Consents</th>
                              <th className="px-6 py-3.5 text-left font-medium text-muted-foreground text-xs tracking-wider">Status</th>
                              <th className="px-6 py-3.5 text-left font-medium text-muted-foreground text-xs tracking-wider">Created</th>
                              <th className="px-6 py-3.5"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40">
                            {paginated.map((site) => (
                              <tr key={site.id} className="hover:bg-muted/10 transition-colors border-b border-border/40 last:border-0">
                                <td className="px-6 py-4 font-medium text-foreground">{site.domain}</td>
                                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                  {site.widget_key.slice(0, 18)}...
                                </td>
                                <td className="px-6 py-4 text-foreground/85 font-semibold">
                                  {allStats.find(s => s.domain === site.domain)?.total ?? 0}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                                    ${site.is_active 
                                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20' 
                                      : 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20'}`}>
                                    {site.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                  {new Date(site.created_at).toLocaleDateString('en-IN', {
                                    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'
                                  })}
                                </td>
                                <td className="px-6 py-4">
                                  <Link to={`/websites/${site.id}`}
                                    className="text-primary hover:underline text-xs font-medium">
                                    View →
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-muted/5 border-t border-border/40 rounded-b-xl">
                          <p className="text-xs text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{from}–{to}</span> of{' '}
                            <span className="font-medium text-foreground">{websites.length}</span> websites
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setPage(p => p - 1)}
                              disabled={page === 1}
                              className="p-1.5 rounded-md hover:bg-muted border border-border/50 disabled:opacity-30 disabled:cursor-default text-muted-foreground transition-all duration-150"
                            >
                              <ChevronLeft className="size-4" />
                            </button>
                            {pages.map((p, i) =>
                              p === '…'
                                ? <span key={`e${i}`} className="px-1 text-xs text-muted-foreground">…</span>
                                : (
                                  <button key={p} onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-md text-xs font-medium border transition-colors
                                      ${p === page ? 'bg-primary text-primary-foreground border-primary' : 'text-muted-foreground bg-background hover:bg-muted border-border/50'}`}>
                                    {p}
                                  </button>
                                )
                            )}
                            <button
                              onClick={() => setPage(p => p + 1)}
                              disabled={page === totalPages}
                              className="p-1.5 rounded-md hover:bg-muted border border-border/50 disabled:opacity-30 disabled:cursor-default text-muted-foreground transition-all duration-150"
                            >
                              <ChevronRight className="size-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      
    </SidebarProvider>
  )
}
