import { useEffect, useState } from 'react'

import { getAuditLogs } from '../api/audit'

import { ScrollText, Download, Hash, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'

import { downloadExport } from '../api/export'

import toast from 'react-hot-toast'

// Shadcn UI Imports
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table'
import { Button } from '../components/ui/button'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'



const actionColors = {

  REGISTER: 'bg-blue-50 text-blue-700 border-blue-100',

  LOGIN_SUCCESS: 'bg-green-50 text-green-700 border-green-200/60',

  LOGIN_FAILED: 'bg-red-50 text-red-750 border-red-200/60',

  WEBSITE_CREATED: 'bg-purple-50 text-purple-750 border-purple-150',

  WEBSITE_UPDATED: 'bg-amber-50 text-amber-700 border-amber-150',

  WEBSITE_DELETED: 'bg-red-50 text-red-700 border-red-150',

  CONSENT_GIVEN: 'bg-green-50 text-green-705 border-green-150',

  CONSENT_UPDATED: 'bg-blue-50 text-blue-705 border-blue-150',

  CONSENT_WITHDRAWN: 'bg-orange-50 text-orange-705 border-orange-150',

  CONSENT_RENEWED: 'bg-teal-50 text-teal-705 border-teal-150',

  CONSENT_VALIDATED: 'bg-indigo-50 text-indigo-705 border-indigo-150',

  CONSENT_EXPORTED: 'bg-sky-50 text-sky-705 border-sky-150',

  COOKIE_CATEGORY_CREATED: 'bg-amber-50 text-amber-705 border-amber-150',

  COOKIE_CATEGORY_DELETED: 'bg-red-50 text-red-705 border-red-150',

  WIDGET_SETTINGS_UPDATED: 'bg-indigo-50 text-indigo-705 border-indigo-150',

  GRIEVANCE_STATUS_UPDATED: 'bg-orange-50 text-orange-705 border-orange-150',

  GRIEVANCE_SUBMITTED: 'bg-yellow-50 text-yellow-750 border-yellow-150',

  GRIEVANCES_AUTO_ESCALATED: 'bg-rose-50 text-rose-705 border-rose-150',

  WEBSITE_SCANNED: 'bg-fuchsia-50 text-fuchsia-705 border-fuchsia-150',

  MFA_ENABLED: 'bg-emerald-50 text-emerald-755 border-emerald-150',

  MFA_LOGIN_SUCCESS: 'bg-emerald-50 text-emerald-755 border-emerald-150',

  MFA_REQUIREMENT_UPDATED: 'bg-amber-50 text-amber-755 border-amber-150',

  TEAM_MEMBER_ROLE_UPDATED: 'bg-indigo-50 text-indigo-705 border-indigo-150',

}



const PAGE_SIZE = 15



export default function AuditLogs() {

  const [logs, setLogs] = useState([])

  const [loading, setLoading] = useState(true)

  const [module, setModule] = useState('')

  const [limit, setLimit] = useState(200)

  const [page, setPage] = useState(1)



  const modules = ['auth', 'website', 'cookie', 'consent', 'grievance', 'scanner', 'retention']



  useEffect(() => {

    setPage(1)

    setLoading(true)

    getAuditLogs(module ? { module, limit } : { limit })

      .then(r => setLogs(r.data))

      .catch(() => {})

      .finally(() => setLoading(false))

  }, [module, limit])



  const handleExport = async (fmt) => {

    try {

      await downloadExport('audit', fmt)

      toast.success(`Exported as ${fmt.toUpperCase()}`)

    } catch {

      toast.error('Export failed')

    }

  }



  const [verifying, setVerifying] = useState(false)

  const [chainResult, setChainResult] = useState(null)



  const handleVerifyChain = async () => {

    setVerifying(true)

    setChainResult(null)

    try {

      const token = localStorage.getItem('token')

      const res = await fetch(`${API}/audit/integrity/verify`, { headers: { Authorization: `Bearer ${token}` } })

      const data = await res.json()

      setChainResult(data)

      if (data.valid) toast.success('Chain intact — all entries verified')

      else toast.error('Chain broken — possible tampering detected!')

    } catch { toast.error('Verification failed') }

    finally { setVerifying(false) }

  }



  const totalPages = Math.ceil(logs.length / PAGE_SIZE)

  const paginated = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)



  if (loading) return (

    <div className="flex items-center justify-center h-64">

      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

    </div>

  )



  return (

    <div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

        <div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Audit Logs</h2>

          <p className="text-xs text-muted-foreground mt-0.5">Tamper-proof record of all actions · SHA-256 hashed</p>

        </div>

        <div className="flex items-center gap-2">

          <Button onClick={() => handleExport('csv')} variant="outline" size="sm"

            className="flex items-center gap-1.5 font-semibold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all rounded-xl h-9 shadow-2xs">

            <Download size={13} /> CSV

          </Button>

          <Button onClick={handleVerifyChain} disabled={verifying} variant="outline" size="sm"

              className="flex items-center gap-1.5 font-semibold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all rounded-xl h-9 shadow-2xs">

            <ShieldCheck size={13} className={verifying ? "animate-pulse text-blue-500" : "text-slate-400"} /> {verifying ? 'Verifying...' : 'Verify Chain'}

          </Button>

          <Button onClick={() => handleExport('pdf')} size="sm"

            className="flex items-center gap-1.5 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all rounded-xl h-9 shadow-2xs">

            <Download size={13} /> PDF

          </Button>

        </div>

      </div>



      <div className="flex flex-wrap items-center gap-4 mb-5">

        <div className="flex items-center gap-2">

          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Module:</label>

          <select className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-3xs cursor-pointer"

            value={module} onChange={e => setModule(e.target.value)}>

            <option value="">All Modules</option>

            {modules.map(m => (

              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>

            ))}

          </select>

        </div>

        <div className="flex items-center gap-2">

          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Show:</label>

          <select className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-3xs cursor-pointer"

            value={limit} onChange={e => setLimit(Number(e.target.value))}>

            <option value={100}>Last 100</option>

            <option value={200}>Last 200</option>

            <option value={500}>Last 550</option>

            <option value={1000}>Last 1000</option>

          </select>

        </div>

        <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 ml-auto shadow-3xs">

          {logs.length} record{logs.length !== 1 ? 's' : ''}

        </span>

      </div>



      {chainResult && (
        <div className={`mb-4 rounded-xl border p-4 ${chainResult.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start gap-3">
            <ShieldCheck className={`w-5 h-5 mt-0.5 flex-shrink-0 ${chainResult.valid ? 'text-green-600' : 'text-red-500'}`} />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${chainResult.valid ? 'text-green-700' : 'text-red-700'}`}>
                {chainResult.valid ? 'Integrity Verified' : 'Integrity Check Failed'}
              </p>
              <p className={`text-xs mt-0.5 ${chainResult.valid ? 'text-green-600' : 'text-red-600'}`}>
                {chainResult.message}
              </p>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span>Total: <strong>{chainResult.total}</strong></span>
                <span className="text-green-600">Verified: <strong>{chainResult.verified}</strong></span>
                {chainResult.legacy > 0 && (
                  <span className="text-yellow-600">Legacy: <strong>{chainResult.legacy}</strong>
                    <span className="ml-1 text-gray-400">(older entries — hash schema predates current verifier)</span>
                  </span>
                )}
                {chainResult.broken_at && (
                  <span className="text-red-600">Broken at: <strong className="font-mono">{chainResult.broken_at.slice(0,8)}...</strong></span>
                )}
              </div>
            </div>
            <button onClick={() => setChainResult(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xs border border-slate-100/85 overflow-hidden">

        {logs.length === 0 ? (

          <div className="p-16 text-center">

            <ScrollText size={36} className="text-slate-200 mx-auto mb-3" />

            <p className="text-slate-400 text-sm font-medium">No audit logs yet.</p>

          </div>

        ) : (

          <>

            <div className="overflow-x-auto">

              <Table>

                <TableHeader>

                  <TableRow className="border-b border-slate-100 hover:bg-transparent bg-slate-50/20">

                    <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</TableHead>

                    <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Module</TableHead>

                    <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</TableHead>

                    <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">By</TableHead>

                    <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">IP</TableHead>

                    <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">

                      <Hash size={11} className="mt-0.5" /> Hash

                    </TableHead>

                    <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Time</TableHead>

                  </TableRow>

                </TableHeader>

                <TableBody className="divide-y divide-slate-100 bg-white">

                  {paginated.map(log => (

                    <TableRow key={log.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100">

                      <TableCell className="px-5 py-3.5">

                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${actionColors[log.action] || 'bg-gray-50 text-gray-700 border-gray-150'}`}>

                          {log.action}

                        </span>

                      </TableCell>

                      <TableCell className="px-5 py-3.5 text-slate-500 font-semibold capitalize">{log.module || '—'}</TableCell>

                      <TableCell className="px-5 py-3.5 text-slate-705 font-medium max-w-sm truncate" title={log.description}>{log.description || '—'}</TableCell>

                      <TableCell className="px-5 py-3.5 text-slate-500 font-semibold capitalize">

                        {log.performed_by_type === 'system' ? (

                          <span className="inline-flex items-center gap-1.5 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 text-[11px] font-bold">

                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />

                            System

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 text-[11px] font-bold">

                            <span className="w-1.5 h-1.5 rounded-full bg-blue-505" />

                            User

                          </span>

                        )}

                      </TableCell>

                      <TableCell className="px-5 py-3.5 font-mono text-xs text-slate-400 font-semibold">{log.ip_address || '—'}</TableCell>

                      <TableCell className="px-5 py-3.5">

                        {log.audit_hash ? (

                          <span

                            title={log.audit_hash}

                            onClick={() => {

                              navigator.clipboard.writeText(log.audit_hash)

                              toast.success('Hash copied!')

                            }}

                            className="font-mono text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2.5 py-0.5 rounded-md cursor-pointer hover:bg-emerald-100 hover:border-emerald-300 transition-colors font-semibold"

                          >

                            {log.audit_hash.slice(0, 8)}

                          </span>

                        ) : (

                          <span className="text-xs text-slate-350">—</span>

                        )}

                      </TableCell>

                      <TableCell className="px-5 py-3.5 text-slate-500 text-xs font-semibold">

                        {new Date(log.created_at).toLocaleString('en-IN', {

                          day: '2-digit', month: 'short', year: 'numeric',

                          hour: '2-digit', minute: '2-digit',

                        })}

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </div>



            {totalPages > 1 && (

              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/10">

                <p className="text-xs text-slate-400 font-semibold">

                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, logs.length)} of {logs.length}

                </p>

                <div className="flex items-center gap-1">

                  <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}

                    variant="outline" size="sm" className="p-0 w-8 h-8 rounded-lg border-slate-200 hover:bg-slate-50 disabled:opacity-30">

                    <ChevronLeft size={15} className="text-slate-600" />

                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (

                    <Button key={p} onClick={() => setPage(p)}

                      variant={p === page ? 'default' : 'outline'} size="sm"

                      className={`w-8 h-8 p-0 rounded-lg text-xs font-semibold transition-all ${p === page ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-xs' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'}`}>

                      {p}

                    </Button>

                  ))}

                  <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}

                    variant="outline" size="sm" className="p-0 w-8 h-8 rounded-lg border-slate-200 hover:bg-slate-50 disabled:opacity-30">

                    <ChevronRight size={15} className="text-slate-600" />

                  </Button>

                </div>

              </div>

            )}

          </>

        )}

      </div>

    </div>

  )

}







