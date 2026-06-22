import { useState, useEffect, useCallback, Fragment } from 'react'
import { getConsents, getConsentStats } from '../api/consents'
import { downloadExport } from '../api/export'
import { getWebsites } from '../api/websites'
import toast from 'react-hot-toast'
import { Download, Globe, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Card, CardHeader, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'

const STATUS_CONFIG = {
  accepted_all: { label: 'Accepted All', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20' },
  rejected_all: { label: 'Rejected All', className: 'bg-rose-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20' },
  customized: { label: 'Customized', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20' },
  withdrawn: { label: 'Withdrawn', className: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20' },
  pending: { label: 'Pending', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20' },
  granted: { label: 'Granted', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20' },
  denied: { label: 'Denied', className: 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20' },
}

const DEFAULT_STATUS = { label: 'Unknown', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' }
const PAGE_SIZE = 10
const FILTER_STATUSES = ['accepted_all', 'rejected_all', 'customized', 'withdrawn', 'pending']

export default function ConsentLogs() {
  const [allConsents, setAllConsents] = useState([])
  const [stats, setStats] = useState(null)
  const [websites, setWebsites] = useState([])
  const [selectedSite, setSelectedSite] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [page, setPage] = useState(1)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const sitesRes = await getWebsites()
      const sites = sitesRes.data || sitesRes || []
      setWebsites(sites)

      if (sites.length === 0) {
        setAllConsents([])
        setStats(null)
        setLoading(false)
        return
      }

      const siteId = selectedSite === 'all' ? null : selectedSite

      const [consentsRes, statsRes] = await Promise.all([
        getConsents(siteId, {}),
        getConsentStats(siteId),
      ])

      setAllConsents(consentsRes.data || consentsRes || [])
      setStats(statsRes.data || statsRes)
      setPage(1)
    } catch (err) {
      toast.error('Failed to load consent logs')
    } finally {
      setLoading(false)
    }
  }, [selectedSite])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => { setPage(1) }, [statusFilter])

  const consents = statusFilter === 'all'
    ? allConsents
    : allConsents.filter(log => log.consent_status === statusFilter)

  const handleExport = async (format) => {
    try {
      await downloadExport('consents', format)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Export failed')
    }
  }

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const totalPages = Math.ceil(consents.length / PAGE_SIZE)
  const paginated = consents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Consent Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Audit and export cookie consent actions logged by visitors across your websites.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            onClick={() => handleExport('csv')}
            variant="outline"
            className="rounded-xl shadow-2xs font-semibold hover:bg-gray-50 active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" /> CSV
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            variant="outline"
            className="rounded-xl shadow-2xs font-semibold hover:bg-gray-50 active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" /> PDF
          </Button>
        </div>
      </div>

      {/* Premium Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500 shadow-2xs hover:shadow-xs transition-all duration-200">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Consents</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFeatureSettings: '"tnum"' }}>
                {(stats.total ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-xs transition-all duration-200">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Accepted All</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFeatureSettings: '"tnum"' }}>
                {(stats.accepted_all ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-rose-500 shadow-2xs hover:shadow-xs transition-all duration-200">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rejected All</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFeatureSettings: '"tnum"' }}>
                {(stats.rejected_all ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-2xs hover:shadow-xs transition-all duration-200">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customized</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFeatureSettings: '"tnum"' }}>
                {(stats.customized ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-slate-400 shadow-2xs hover:shadow-xs transition-all duration-200">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Withdrawn</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFeatureSettings: '"tnum"' }}>
                {(stats.withdrawn ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters (DropdownMenu) */}
      <div className="flex flex-wrap gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none font-semibold text-gray-700 transition-all duration-200 cursor-pointer rounded-xl min-w-[170px] shadow-2xs"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                {selectedSite === 'all'
                  ? "All Sites"
                  : (websites.find(w => w.id === selectedSite)?.domain || selectedSite)}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[170px]">
            <DropdownMenuItem
              onClick={() => setSelectedSite("all")}
              className="cursor-pointer"
            >
              All Sites
            </DropdownMenuItem>
            {websites.map((site) => (
              <DropdownMenuItem
                key={site.id}
                onClick={() => setSelectedSite(site.id)}
                className="cursor-pointer"
              >
                {site.domain}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none font-semibold text-gray-700 transition-all duration-200 cursor-pointer rounded-xl min-w-[170px] shadow-2xs"
            >
              <span>
                {statusFilter === 'all'
                  ? "All Statuses"
                  : (STATUS_CONFIG[statusFilter]?.label || statusFilter)}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[170px]">
            <DropdownMenuItem
              onClick={() => setStatusFilter("all")}
              className="cursor-pointer"
            >
              All Statuses
            </DropdownMenuItem>
            {FILTER_STATUSES.map((key) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setStatusFilter(key)}
                className="cursor-pointer"
              >
                {STATUS_CONFIG[key]?.label || key}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-gray-500">User</TableHead>
                <TableHead className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-gray-500">Site</TableHead>
                <TableHead className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-gray-500">Source</TableHead>
                <TableHead className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-gray-500">Status</TableHead>
                <TableHead className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-gray-500">Consent By</TableHead>
                <TableHead className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-gray-500">Withdrawn</TableHead>
                <TableHead className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-gray-500">Date & Time</TableHead>
                <TableHead className="px-6 py-4" />
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {paginated.map((log) => {
                const statusCfg = STATUS_CONFIG[log.consent_status] ?? DEFAULT_STATUS
                return (
                  <Fragment key={log.id}>
                    <TableRow className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="px-6 py-4 font-mono font-bold text-gray-800 text-xs">
                        <span
                          className="cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(log.visitor_id)
                            toast.success('Visitor ID copied!')
                          }}
                        >
                          #{log.visitor_id ? log.visitor_id.slice(0, 6) : '—'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 font-medium">
                        {websites.find(w => w.id === log.website_id)?.domain || log.website_id}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-500 text-xs">
                        {log.source_id ? (
                          <Badge variant="outline" className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg font-bold border border-purple-100">
                            {log.source_id}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 font-medium">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusCfg.className}`}>
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {log.consent_given_by === 'guardian' ? (
                          <Badge variant="outline" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                            👨‍👧 Guardian
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            👤 Self
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${log.is_withdrawn ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                          {log.is_withdrawn ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 font-medium">
                        {log.consented_at ? (
                          <>
                            <div className="font-semibold text-gray-800" style={{ fontFeatureSettings: '"tnum"' }}>
                              {new Date(log.consented_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5" style={{ fontFeatureSettings: '"tnum"' }}>
                              {new Date(log.consented_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' })}
                            </div>
                          </>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toggleExpand(log.id)}
                          className="rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                          {expandedId === log.id
                            ? <ChevronUp className="w-5 h-5" />
                            : <ChevronDown className="w-5 h-5" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedId === log.id && (
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableCell colSpan={8} className="px-6 py-4 text-xs text-gray-500">
                          <Card className="bg-white p-6 shadow-2xs border border-gray-100 rounded-2xl">
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-0 animate-in fade-in slide-in-from-top-2 duration-250">
                              <div>
                                <span className="font-bold text-gray-800 block mb-1">Visitor ID</span>
                                <span className="font-mono text-xs select-all bg-gray-50/50 px-2 py-1 rounded border border-gray-100">{log.visitor_id}</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-800 block mb-1">Source ID</span>
                                <span className="font-mono text-xs text-purple-600 bg-purple-50/50 px-2 py-1 rounded border border-purple-100">{log.source_id || '—'}</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-800 block mb-1">Method</span>
                                <span className="font-semibold text-gray-700">{log.consent_method || '—'}</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-800 block mb-1">Consent Version</span>
                                <span className="font-semibold text-gray-700">{log.consent_version || '—'}</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-800 block mb-1">IP Address</span>
                                <span className="font-mono font-semibold text-gray-700" style={{ fontFeatureSettings: '"tnum"' }}>{log.ip_address || '—'}</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-800 block mb-1">Expires At</span>
                                <span className="font-semibold text-gray-700" style={{ fontFeatureSettings: '"tnum"' }}>
                                  {log.expires_at ? new Date(log.expires_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                </span>
                              </div>
                              {log.consent_given_by === 'guardian' && (
                                <div className="col-span-1 sm:col-span-2 md:col-span-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-center gap-2">
                                  <span className="font-bold text-amber-800">👨‍👧 Guardian Details:</span>{' '}
                                  <span className="text-amber-900 font-bold">{log.guardian_name}</span>
                                  <span className="text-amber-600 font-semibold">({log.guardian_relationship?.replace(/_/g, ' ')})</span>
                                </div>
                              )}
                              <div className="col-span-1 sm:col-span-2 md:col-span-3 border-t border-gray-100 pt-4">
                                <span className="font-bold text-gray-800 block mb-2">Accepted Categories</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {Object.keys(log.accepted_categories || {}).length > 0 ? (
                                    Object.keys(log.accepted_categories || {}).map(cat => (
                                      <Badge key={cat} variant="outline" className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">{cat}</Badge>
                                    ))
                                  ) : (
                                    <span className="text-gray-400 font-medium">—</span>
                                  )}
                                </div>
                              </div>
                              <div className="col-span-1 sm:col-span-2 md:col-span-3 border-t border-gray-100 pt-4">
                                <span className="font-bold text-gray-800 block mb-2">Rejected Categories</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {Object.keys(log.rejected_categories || {}).length > 0 ? (
                                    Object.keys(log.rejected_categories || {}).map(cat => (
                                      <Badge key={cat} variant="outline" className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold uppercase tracking-wider">{cat}</Badge>
                                    ))
                                  ) : (
                                    <span className="text-gray-400 font-medium">—</span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
              {consents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No consent logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600" style={{ fontFeatureSettings: '"tnum"' }}>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, consents.length)}</span> of{' '}
                <span className="font-semibold text-gray-600" style={{ fontFeatureSettings: '"tnum"' }}>{consents.length}</span> logs
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon-sm"
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold cursor-pointer ${p === page ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'text-gray-600 bg-white hover:bg-gray-50 border-gray-200'}`}
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}