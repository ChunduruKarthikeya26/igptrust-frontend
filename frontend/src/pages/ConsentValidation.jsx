import { useState, useEffect, useCallback } from 'react'
import { getWebsites } from '../api/websites'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Globe, CheckCircle, XCircle, ShieldCheck, Search, Clock, RefreshCw, Inbox } from 'lucide-react'

// Shadcn UI Imports
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

const FAILURE_CONFIG = {
  not_found:        { label: 'Not Found',       className: 'bg-gray-50 text-gray-700 border-gray-200' },
  withdrawn:        { label: 'Withdrawn',        className: 'bg-yellow-50/50 text-yellow-750 border-yellow-200/60' },
  expired:          { label: 'Expired',          className: 'bg-orange-50/50 text-orange-750 border-orange-200/60' },
  purpose_mismatch: { label: 'Purpose Mismatch', className: 'bg-red-50/50 text-red-750 border-red-200/60' },
}

const STATUS_CONFIG = {
  active:    { label: 'Active',    className: 'bg-green-50/50 text-green-700 border-green-200/60' },
  withdrawn: { label: 'Withdrawn', className: 'bg-yellow-50/50 text-yellow-750 border-yellow-200/60' },
  expired:   { label: 'Expired',   className: 'bg-orange-50/50 text-orange-750 border-orange-200/60' },
  not_found: { label: 'Not Found', className: 'bg-gray-50 text-gray-500 border-gray-200' },
}

const DEFAULT_CFG = { label: 'Unknown', className: 'bg-gray-50 text-gray-500 border-gray-200' }

function SkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      {[...Array(7)].map((_, i) => (
        <TableCell key={i} className="px-3 py-3.5">
          <div className="h-3.5 bg-slate-100 rounded-lg w-full" />
        </TableCell>
      ))}
    </TableRow>
  )
}

function ConfigBadge({ config }) {
  if (!config) return <span className="text-slate-350 font-semibold">—</span>
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.className}`}>
      {config.label}
    </span>
  )
}

export default function ConsentValidation() {
  const [logs, setLogs]                 = useState([])
  const [websites, setWebsites]         = useState([])
  const [selectedSite, setSelectedSite] = useState('')
  const [loading, setLoading]           = useState(false)
  const [initialLoad, setInitialLoad]   = useState(true)
  const [testVisitorId, setTestVisitorId] = useState('')
  const [testPurposeId, setTestPurposeId] = useState('')
  const [testLoading, setTestLoading]   = useState(false)
  const [testResult, setTestResult]     = useState(null)

  useEffect(() => {
    getWebsites()
      .then(res => setWebsites(res.data || []))
      .catch(() => toast.error('Failed to load websites'))
      .finally(() => setInitialLoad(false))
  }, [])

  const fetchLogs = useCallback(async () => {
    if (!selectedSite) return
    setLoading(true)
    try {
      const res = await api.get(`/websites/${selectedSite}/consents/validations`)
      setLogs(res.data || [])
    } catch {
      toast.error('Failed to load validation logs')
    } finally {
      setLoading(false)
    }
  }, [selectedSite])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const selectedSiteObj = websites.find(w => w.id === selectedSite)

  const handleTestValidation = async () => {
    if (!selectedSiteObj?.widget_key) return toast.error('Select a website first')
    if (!testVisitorId.trim())        return toast.error('Enter a visitor ID')
    setTestLoading(true)
    setTestResult(null)
    try {
      let res
      if (!testPurposeId.trim()) {
        res = await api.get(`/consents/visitor/${testVisitorId.trim()}`)
        setTestResult({ all_purposes: true, ...res.data })
      } else {
        res = await api.post('/consents/validate', {
          widget_key:   selectedSiteObj.widget_key,
          visitor_id:   testVisitorId.trim(),
          purpose_id:   testPurposeId.trim(),
          requested_by: 'admin_ui',
        })
        setTestResult(res.data)
      }
      fetchLogs()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Validation request failed')
    } finally {
      setTestLoading(false)
    }
  }

  const validCount   = logs.filter(l => l.is_valid).length
  const invalidCount = logs.filter(l => !l.is_valid).length
  
  const fmt = dt => dt ? new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) : '—'

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* Title block & Website selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Consent Validation</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verify visitor consent logs and run real-time checks for compliance audit.
            </p>
          </div>
        </div>
        
        {/* Dropdown selector */}
        {initialLoad ? (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-3xs w-full sm:w-[220px]">
            <Globe className="w-4 h-4 text-slate-400" />
            <div className="h-4 w-32 bg-slate-100 rounded-md animate-pulse" />
          </div>
        ) : (
          <Select
            value={selectedSite ? String(selectedSite) : "none"}
            onValueChange={val => {
              setSelectedSite(val === "none" ? "" : val)
              setTestResult(null)
            }}
          >
            <SelectTrigger className="h-9 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-3xs hover:border-slate-350 hover:bg-white text-xs font-semibold text-slate-700 w-full sm:w-[220px] transition-colors focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 data-[placeholder]:text-slate-400">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="Select a website" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a website</SelectItem>
              {websites.map(site => (
                <SelectItem key={site.id} value={String(site.id)}>
                  {site.domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Live Check Tool */}
      {selectedSite && (
        <Card className="shadow-sm border border-gray-100 bg-card overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-550" />
              <CardTitle className="text-sm font-semibold text-gray-700">Live Consent Check</CardTitle>
              <span className="text-xs text-slate-400 font-medium">· Test any visitor + purpose in real time</span>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="Visitor ID (e.g. user@email.com)"
                value={testVisitorId}
                onChange={e => setTestVisitorId(e.target.value)}
                className="flex-1 min-w-[200px] border border-slate-200 rounded-xl px-4 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 bg-white font-medium text-slate-705 shadow-3xs"
              />
              <input
                type="text"
                placeholder="Purpose ID (e.g. analytics)"
                value={testPurposeId}
                onChange={e => setTestPurposeId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTestValidation()}
                className="flex-1 min-w-[160px] border border-slate-200 rounded-xl px-4 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 bg-white font-medium text-slate-705 shadow-3xs"
              />
              <Button
                onClick={handleTestValidation}
                disabled={testLoading}
                className="px-5 py-2 bg-gradient-to-r from-indigo-650 to-blue-600 text-white text-xs font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all active:scale-[0.98] h-9 shadow-xs disabled:opacity-50"
              >
                {testLoading ? 'Checking...' : 'Check Consent'}
              </Button>
            </div>

            {testResult && testResult.all_purposes ? (
              <div className="rounded-xl border bg-blue-50/20 border-blue-105/50 p-4 shadow-3xs">
                <p className="text-sm font-semibold text-blue-805 mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  All consents for visitor: <strong className="font-mono text-xs bg-blue-100/50 px-1.5 py-0.5 rounded border border-blue-200/30 text-blue-900">{testResult.visitor_id}</strong> ({testResult.total} records)
                </p>
                {testResult.total === 0 ? (
                  <p className="text-xs text-slate-500 italic font-medium">No consent records found for this visitor.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow className="border-b border-blue-100/60 hover:bg-transparent">
                          <TableHead className="pb-2 pr-4 text-slate-550 font-bold uppercase tracking-wider text-[10px]">Purpose</TableHead>
                          <TableHead className="pb-2 pr-4 text-slate-550 font-bold uppercase tracking-wider text-[10px]">Website</TableHead>
                          <TableHead className="pb-2 pr-4 text-slate-550 font-bold uppercase tracking-wider text-[10px]">Status</TableHead>
                          <TableHead className="pb-2 pr-4 text-slate-550 font-bold uppercase tracking-wider text-[10px]">Consented At</TableHead>
                          <TableHead className="pb-2 text-slate-550 font-bold uppercase tracking-wider text-[10px]">Expires At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-blue-50/40">
                        {testResult.consents.flatMap((c, i) =>
                          c.accepted_categories && typeof c.accepted_categories === 'object'
                            ? Object.entries(c.accepted_categories).map(([purpose, accepted], j) => (
                                <TableRow key={`${i}-${j}`} className="border-b border-blue-100/25 hover:bg-blue-50/10">
                                  <TableCell className="py-2 pr-4 font-semibold text-slate-705 capitalize">{purpose}</TableCell>
                                  <TableCell className="py-2 pr-4 text-slate-600 font-medium">{c.website}</TableCell>
                                  <TableCell className="py-2 pr-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${accepted ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                      {accepted ? 'Accepted' : 'Rejected'}
                                    </span>
                                  </TableCell>
                                  <TableCell className="py-2 pr-4 text-slate-500 font-medium">{fmt(c.consented_at)}</TableCell>
                                  <TableCell className="py-2 text-slate-500 font-medium">{fmt(c.expires_at)}</TableCell>
                                </TableRow>
                              ))
                            : (
                              <TableRow key={i} className="border-b border-blue-100/25 hover:bg-blue-50/10">
                                <TableCell className="py-2 pr-4 font-semibold text-slate-705">—</TableCell>
                                <TableCell className="py-2 pr-4 text-slate-600 font-medium">{c.website}</TableCell>
                                <TableCell className="py-2 pr-4">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-755 border border-yellow-200">
                                    {c.consent_status || '—'}
                                  </span>
                                </TableCell>
                                <TableCell className="py-2 pr-4 text-slate-500 font-medium">{fmt(c.consented_at)}</TableCell>
                                <TableCell className="py-2 text-slate-500 font-medium">{fmt(c.expires_at)}</TableCell>
                              </TableRow>
                            )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : testResult && (
              <div className={`rounded-xl border p-4 flex flex-wrap gap-4 items-start shadow-3xs
                              ${testResult.is_valid ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {testResult.is_valid
                    ? <CheckCircle className="w-5 h-5 text-green-600" />
                    : <XCircle className="w-5 h-5 text-red-500" />}
                  <span className={`text-sm font-bold ${testResult.is_valid ? 'text-green-700' : 'text-red-705'}`}>
                    {testResult.is_valid ? 'Consent Valid' : 'Consent Invalid'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-605 font-medium">
                  <span><strong>Visitor:</strong> <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px] border border-slate-200/40 text-slate-805">{testResult.visitor_id}</code></span>
                  <span><strong>Purpose:</strong> <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px] border border-slate-200/40 text-slate-805">{testResult.purpose_id}</code></span>
                  {testResult.consent_status && (
                    <span><strong>Status:</strong> 
                      <span className={`ml-1 px-1.5 py-0.2 rounded-full border text-[10px] font-bold ${
                        testResult.consent_status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>{testResult.consent_status}</span>
                    </span>
                  )}
                  {testResult.failure_reason  && (
                    <span><strong>Reason:</strong> 
                      <span className="ml-1 px-1.5 py-0.2 rounded-full border border-red-205 bg-red-50 text-red-750 text-[10px] font-bold capitalize">{testResult.failure_reason.replace('_', ' ')}</span>
                    </span>
                  )}
                  {testResult.consented_at    && <span><strong>Consented:</strong> <span className="text-slate-800 font-semibold">{fmt(testResult.consented_at)}</span></span>}
                  {testResult.expires_at      && <span><strong>Expires:</strong> <span className="text-slate-800 font-semibold">{fmt(testResult.expires_at)}</span></span>}
                </div>
                <p className="w-full text-xs text-slate-500 italic mt-1 font-medium">{testResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats row */}
      {selectedSite && !loading && logs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Checks', value: logs.length, color: 'text-slate-900', border: 'border-l-4 border-l-slate-400' },
            { label: 'Valid Checks', value: validCount, color: 'text-green-600', border: 'border-l-4 border-l-green-500' },
            { label: 'Failed Checks', value: invalidCount, color: 'text-red-500', border: 'border-l-4 border-l-red-500' },
          ].map(stat => (
            <Card key={stat.label} className={`shadow-2xs bg-card border border-border/50 ${stat.border} transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5`}>
              <CardContent className="p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Log History Table */}
      <Card className="border border-gray-150 shadow-sm overflow-hidden mb-5">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/70 border-b border-gray-150">
          <span className="text-sm font-semibold text-gray-700">Validation Log History</span>
          {selectedSite && (
            <Button 
              variant="outline"
              size="sm" 
              onClick={fetchLogs} 
              className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-slate-200 text-indigo-650 hover:text-indigo-805 hover:bg-slate-50 font-semibold shadow-3xs"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <colgroup>
              <col style={{ width: '150px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '110px' }} />
              <col style={{ width: '110px' }} />
              <col style={{ width: '155px' }} />
              <col style={{ width: '145px' }} />
              <col style={{ width: '145px' }} />
            </colgroup>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent bg-white">
                <TableHead className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap">Visitor ID</TableHead>
                <TableHead className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap">Purpose</TableHead>
                <TableHead className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap">Result</TableHead>
                <TableHead className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap">Status</TableHead>
                <TableHead className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap">Failure Reason</TableHead>
                <TableHead className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap">Expires At</TableHead>
                <TableHead className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap">Checked At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 bg-white">
              {loading && [...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
              
              {!loading && !selectedSite && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="p-0">
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 border border-slate-100 shadow-3xs">
                        <Globe className="w-5 h-5 text-slate-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-805 mb-1">Select a Website</h3>
                      <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                        Select a website from the dropdown above to view its compliance validation logs.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              
              {!loading && selectedSite && logs.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="p-0">
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 border border-slate-100 shadow-3xs">
                        <Inbox className="w-5 h-5 text-slate-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-805 mb-1">No Validation Logs</h3>
                      <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                        All clear! There are no validation check logs recorded for this website yet.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              
              {!loading && logs.map(log => (
                <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors border-b border-gray-100">
                  <TableCell className="px-3 py-3 text-slate-600 font-mono text-xs max-w-[160px] truncate" title={log.visitor_id}>
                    {log.visitor_id}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-slate-600 font-semibold">{log.purpose_id || '—'}</TableCell>
                  <TableCell className="px-3 py-3">
                    {log.is_valid ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle className="w-3.5 h-3.5 text-green-650" />
                        Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                        Failed
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    <ConfigBadge config={log.consent_status ? (STATUS_CONFIG[log.consent_status] ?? DEFAULT_CFG) : null} />
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    <ConfigBadge config={log.failure_reason ? (FAILURE_CONFIG[log.failure_reason] ?? DEFAULT_CFG) : null} />
                  </TableCell>
                  <TableCell className="px-3 py-3 text-slate-500 text-xs font-semibold">
                    {log.expires_at ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {fmt(log.expires_at)}
                      </span>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-slate-500 text-xs font-semibold">{fmt(log.validated_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}