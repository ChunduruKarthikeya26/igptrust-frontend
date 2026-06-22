import { useState, useEffect, useCallback } from 'react'
import {
  FileText, Trash2, PenLine, Clock, CheckCircle2, XCircle,
  AlertTriangle, RefreshCw, Filter, ChevronDown, Send,
  ChevronLeft, ChevronRight, Inbox, Search, Globe, BarChart3
} from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'



// ─── Metadata ─────────────────────────────────────────────────────────────────



const TYPE_META = {

  access:     { label: 'Access',     Icon: FileText, cls: 'bg-blue-50 text-blue-700'   },

  erasure:    { label: 'Erasure',    Icon: Trash2,   cls: 'bg-red-50 text-red-600'     },

  correction: { label: 'Correction', Icon: PenLine,  cls: 'bg-amber-50 text-amber-700' },

}



const STATUS_META = {

  submitted:  { label: 'Submitted',  Icon: Clock,        cls: 'bg-blue-50 text-blue-700 border-blue-100'    },

  processing: { label: 'Processing', Icon: Clock,        cls: 'bg-amber-50 text-amber-700 border-amber-100' },

  fulfilled:  { label: 'Fulfilled',  Icon: CheckCircle2, cls: 'bg-green-50 text-green-700 border-green-100' },

  rejected:   { label: 'Rejected',   Icon: XCircle,      cls: 'bg-red-50 text-red-700 border-red-100'       },

}



const SLA_META = {

  on_track: { label: 'On track',  cls: 'text-green-600 bg-green-50' },

  due_soon: { label: 'Due soon',  cls: 'text-amber-700 bg-amber-50' },

  overdue:  { label: 'Overdue',   cls: 'text-red-700 bg-red-50 font-bold' },

  closed:   { label: '',          cls: '' },

}



// ─── SLA Countdown ────────────────────────────────────────────────────────────



function SLABadge({ req }) {
  if (req.sla_status === 'closed') return null
  const meta = SLA_META[req.sla_status] || SLA_META.on_track
  const days = Math.max(0, Math.ceil(req.sla_hours_remaining / 24))
  return (
    <Badge variant="outline" className={`text-xs px-2 py-0.5 rounded-full border-none ${meta.cls}`}>
      {days}d left · {meta.label}
    </Badge>
  )
}



// ─── Fulfil Modal ─────────────────────────────────────────────────────────────



function FulfilModal({ req, onClose, onDone }) {
  const [action, setAction] = useState('fulfill')
  const [note, setNote] = useState('')
  const [correctionField, setCorrectionField] = useState(req.correction_field || '')
  const [correctionOldValue, setCorrectionOldValue] = useState(req.correction_old_value || '')
  const [correctionNewValue, setCorrectionNewValue] = useState(req.correction_new_value || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const payload = { action, note }
      if (req.request_type === 'correction' && action === 'fulfill') {
        payload.correction_field = correctionField
        payload.correction_old_value = correctionOldValue
        payload.correction_new_value = correctionNewValue
      }
      await api.post(`/rights/${req.id}/fulfil`, payload)
      toast.success(`Request ${action === 'fulfill' ? 'fulfilled' : 'rejected'}`)
      onDone()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Action failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-slate-800">
            Respond to {req.reference_id}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1 mt-2">
              <p><span className="font-semibold">Type:</span> {TYPE_META[req.request_type]?.label}</p>
              <p><span className="font-semibold">Visitor:</span> {req.visitor_id}</p>
              {req.description && <p><span className="font-semibold">Details:</span> {req.description}</p>}
              {req.request_type === 'correction' && (
                <p><span className="font-semibold">Field requested:</span> {req.correction_field} → {req.correction_new_value}</p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Fulfill / Reject toggle */}
        <div className="grid grid-cols-2 gap-2">
          {['fulfill', 'reject'].map(a => (
            <Button
              key={a}
              onClick={() => setAction(a)}
              variant={action === a ? 'default' : 'outline'}
              className={`text-sm py-2 rounded-xl font-medium transition-colors capitalize h-auto
                ${action === a
                  ? a === 'fulfill' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'
                  : 'text-slate-500 border-slate-200 hover:bg-slate-50'}`}
            >
              {a === 'fulfill' ? '✓ Fulfill' : '✗ Reject'}
            </Button>
          ))}
        </div>

        {/* Correction fields (only show when fulfilling a correction) */}
        {req.request_type === 'correction' && action === 'fulfill' && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-600">Confirm the correction (logged to audit trail)</p>
            <Input
              type="text"
              placeholder="Field name"
              value={correctionField}
              onChange={e => setCorrectionField(e.target.value)}
              className="w-full text-sm"
            />
            <Input
              type="text"
              placeholder="Original value"
              value={correctionOldValue}
              onChange={e => setCorrectionOldValue(e.target.value)}
              className="w-full text-sm"
            />
            <Input
              type="text"
              placeholder="Corrected value"
              value={correctionNewValue}
              onChange={e => setCorrectionNewValue(e.target.value)}
              className="w-full text-sm"
            />
          </div>
        )}

        {/* Note */}
        <div className="space-y-1.5">
          <Label htmlFor="fulfill-note" className="block text-xs font-semibold text-slate-600">
            Note to data principal {action === 'reject' ? '(required — explain rejection)' : '(optional)'}
          </Label>
          <textarea
            id="fulfill-note"
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder={action === 'fulfill'
              ? 'e.g. Your data export has been sent to your registered email.'
              : 'e.g. Request cannot be fulfilled — data is required for ongoing legal obligation.'}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>

        {req.request_type === 'erasure' && action === 'fulfill' && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-xs text-amber-700">
            Anonymisation will run automatically within 1 hour. Audit logs and consent artifacts are preserved.
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={submitting || (action === 'reject' && !note)}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-sm py-2.5 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors font-medium h-auto"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Send size={13} /> Confirm</>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}



const TH = ['REFERENCE', 'DATA SUBJECT', 'TYPE', 'SUBMITTED', 'DUE BY', 'STATUS', '']
const TH_CLS = "px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 tracking-widest uppercase whitespace-nowrap"

function Pagination({ total, page, pageSize, onPage }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  const from = (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, total)

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i)
    else if (pages[pages.length - 1] !== '…') pages.push('…')
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-white rounded-b-lg">
      <p className="text-xs text-slate-400">
        Showing <span className="font-medium text-slate-600">{from}–{to}</span> of{' '}
        <span className="font-medium text-slate-600">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="text-slate-500"
        >
          <ChevronLeft size={13} />
        </Button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'ghost'}
              size="icon-xs"
              onClick={() => onPage(p)}
              className="w-7 h-7 text-xs font-medium"
            >
              {p}
            </Button>
          )
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="text-slate-500"
        >
          <ChevronRight size={13} />
        </Button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 border shadow-xs">
        <Inbox className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">No Requests Found</h3>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
        All clear! There are no data rights requests matching your current filters.
      </p>
    </div>
  )
}

// ─── Request Row ──────────────────────────────────────────────────────────────

function RequestRow({ req, onMarkProcessing, onFulfil }) {
  const [expanded, setExpanded] = useState(false)
  const type = TYPE_META[req.request_type] || TYPE_META.access
  const status = STATUS_META[req.status] || STATUS_META.submitted
  const TypeIcon = type.Icon
  const StatusIcon = status.Icon
  const isOpen = req.status === 'submitted' || req.status === 'processing'
  const isOverdue = req.sla_status === 'overdue'

  return (
    <>
      <TableRow className="hover:bg-muted/50 transition-colors border-b border-slate-100">
        {/* Reference */}
        <TableCell className="font-mono text-xs text-slate-500 tracking-tight whitespace-nowrap px-3 py-3">
          <span
            onClick={() => {
              navigator.clipboard.writeText(req.reference_id)
              toast.success('Reference copied!')
            }}
            className="cursor-pointer hover:text-indigo-600 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-colors"
            title={req.reference_id}
          >
            {req.reference_id}
          </span>
        </TableCell>

        {/* Data Subject */}
        <TableCell className="px-3 py-3 text-xs font-medium text-slate-700 truncate max-w-[200px]" title={req.visitor_id}>
          {req.visitor_id}
        </TableCell>

        {/* Request Type */}
        <TableCell className="px-3 py-3">
          <Badge variant="outline" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border-none ${type.cls}`}>
            <TypeIcon size={12} />
            {type.label}
          </Badge>
        </TableCell>

        {/* Submitted */}
        <TableCell className="px-3 py-3 text-xs text-slate-500">
          {new Date(req.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', timeZone: 'Asia/Kolkata' })}
        </TableCell>

        {/* Due By */}
        <TableCell className="px-3 py-3 text-xs">
          {req.due_at ? (
            <span className={`font-medium ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
              {isOverdue && '⚠ '}{new Date(req.due_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', timeZone: 'Asia/Kolkata' })}
            </span>
          ) : (
            <span className="text-slate-300">—</span>
          )}
        </TableCell>

        {/* Status */}
        <TableCell className="px-3 py-3">
          <Badge
            variant="outline"
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${status.cls}`}
          >
            <StatusIcon size={11} />
            {status.label}
          </Badge>
        </TableCell>

        {/* Action Buttons */}
        <TableCell className="text-right px-3 py-3 whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setExpanded(!expanded)}
              className="text-slate-400 hover:text-slate-600"
            >
              <ChevronDown size={14} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </Button>
            {isOpen && req.status === 'submitted' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkProcessing(req.id)}
                className="text-xs text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg hover:bg-amber-50/50 transition-colors h-7"
              >
                Mark processing
              </Button>
            )}
            {isOpen && (
              <Button
                size="sm"
                onClick={() => onFulfil(req)}
                className="text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors h-7 px-3"
              >
                Respond
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded Details Row */}
      {expanded && (
        <TableRow className="bg-slate-50/40 hover:bg-slate-50/40 border-b border-slate-100">
          <TableCell colSpan={7} className="p-4">
            <div className="text-xs space-y-3.5 max-w-3xl ml-3">
              {req.description && (
                <div className="space-y-1">
                  <p className="font-semibold text-slate-500 uppercase tracking-wider text-[9px]">Description / Details</p>
                  <p className="text-slate-700 leading-relaxed bg-white border border-slate-100 rounded-lg p-2.5">{req.description}</p>
                </div>
              )}

              {req.request_type === 'correction' && req.correction_field && (
                <div className="space-y-1">
                  <p className="font-semibold text-slate-500 uppercase tracking-wider text-[9px]">Correction Requested</p>
                  <div className="grid grid-cols-3 gap-2 bg-white border border-slate-100 rounded-lg p-2.5">
                    <div>
                      <p className="text-[10px] text-slate-400">Field</p>
                      <p className="font-semibold text-slate-700">{req.correction_field}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Old Value</p>
                      <p className="text-slate-700 truncate" title={req.correction_old_value}>{req.correction_old_value || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">New Value</p>
                      <p className="text-slate-700 truncate" title={req.correction_new_value}>{req.correction_new_value || '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {req.fulfilment_note && (
                <div className="space-y-1">
                  <p className="font-semibold text-slate-500 uppercase tracking-wider text-[9px]">Fulfilment / Resolution Note</p>
                  <p className="text-green-700 bg-green-50/60 border border-green-100 rounded-lg p-2.5 leading-relaxed">
                    {req.fulfilment_note}
                  </p>
                </div>
              )}

              {req.request_type === 'erasure' && req.status === 'fulfilled' && (
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Anonymisation Status: <strong className="text-slate-700">{req.anonymisation_done ? '✓ Complete' : '⏳ Pending (scheduler)'}</strong></span>
                </div>
              )}

              {!req.description && !req.correction_field && !req.fulfilment_note && (
                <p className="text-slate-400 italic">No additional details available for this request.</p>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}




// ─── Main Page ────────────────────────────────────────────────────────────────



export default function DataRightsInbox() {

  const [requests, setRequests] = useState([])

  const [loading, setLoading] = useState(true)

  const [filterStatus, setFilterStatus] = useState('all')

  const [filterType, setFilterType] = useState('all')

  const [fulfilingReq, setFulfilingReq] = useState(null)

  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)



  const PAGE_SIZE = 10



  // reset page to 1 when filters or search change

  useEffect(() => { setPage(1) }, [filterStatus, filterType, search])



  const fetchInbox = useCallback(async () => {

    setLoading(true)

    try {

      const params = {}

      if (filterStatus !== 'all') params.status = filterStatus

      if (filterType !== 'all') params.request_type = filterType

      const res = await api.get('/rights/admin/inbox', { params })

      setRequests(res.data)

    } catch {

      toast.error('Failed to load inbox')

    } finally {

      setLoading(false)

    }

  }, [filterStatus, filterType])



  useEffect(() => { fetchInbox() }, [fetchInbox])



  const handleMarkProcessing = async (id) => {

    try {

      await api.patch(`/rights/${id}/processing`)

      toast.success('Marked as processing')

      fetchInbox()

    } catch {

      toast.error('Failed to update status')

    }

  }



  const counts = {

    submitted:  requests.filter(r => r.status === 'submitted').length,

    processing: requests.filter(r => r.status === 'processing').length,

    overdue:    requests.filter(r => r.sla_status === 'overdue').length,

    total:      requests.length,

  }



  const filtered = requests.filter(req => {

    if (!search) return true

    const q = search.toLowerCase()

    return (

      (req.reference_id || '').toLowerCase().includes(q) ||

      (req.visitor_id || '').toLowerCase().includes(q) ||

      (req.description || '').toLowerCase().includes(q)

    )

  })



  return (

    <div className="min-h-screen bg-slate-50/30">

      <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">



        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Rights Inbox</h1>

            <p className="text-xs text-muted-foreground mt-0.5">Manage access, correction and erasure requests · 30-day SLA</p>

          </div>

          <div className="flex items-center gap-2">

            <Button

              onClick={fetchInbox}

              disabled={loading}

              variant="outline"

              size="sm"

              className="flex items-center gap-1.5 font-semibold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 rounded-full"

            >

              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />

              {loading ? 'Refreshing...' : 'Refresh'}

            </Button>

          </div>

        </div>



        {/* Stats */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[

            {

              label: 'Total',

              value: counts.total,

              colorClass: 'text-slate-900',

              borderLeft: 'border-l-4 border-l-slate-400',

              icon: <Inbox className="w-4 h-4 text-slate-400" />

            },

            {

              label: 'Submitted',

              value: counts.submitted,

              colorClass: 'text-blue-600',

              borderLeft: 'border-l-4 border-l-blue-500',

              icon: <Clock className="w-4 h-4 text-blue-500" />

            },

            {

              label: 'Processing',

              value: counts.processing,

              colorClass: 'text-amber-500',

              borderLeft: 'border-l-4 border-l-amber-500',

              icon: <RefreshCw className="w-4 h-4 text-amber-500" />

            },

            {

              label: 'Overdue',

              value: counts.overdue,

              colorClass: counts.overdue > 0 ? 'text-red-600 font-extrabold animate-pulse' : 'text-slate-900',

              borderLeft: 'border-l-4 border-l-red-600',

              icon: <AlertTriangle className="w-4 h-4 text-red-500" />

            },

          ].map(({ label, value, colorClass, borderLeft, icon }) => (

            <Card key={label} className={`shadow-xs bg-card border border-border/50 ${borderLeft} transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5`}>

              <CardContent className="p-4 flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>

                  <p className={`text-2xl font-bold tracking-tight ${colorClass}`}>{value}</p>

                </div>

                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 shadow-2xs">

                  {icon}

                </div>

              </CardContent>

            </Card>

          ))}

        </div>



        {/* Filter bar */}

        <Card className="shadow-xs border border-border/50 bg-card p-3">

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">

            

            <Select value={filterStatus} onValueChange={setFilterStatus}>

              <SelectTrigger className="w-full md:w-[180px] bg-slate-50/50 border-border hover:border-slate-300">

                <span className="flex items-center gap-2 text-slate-700 font-medium">

                  <BarChart3 size={14} className="text-muted-foreground flex-shrink-0" />

                  <SelectValue placeholder="All Statuses" />

                </span>

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">All Statuses</SelectItem>

                <SelectItem value="submitted">Submitted</SelectItem>

                <SelectItem value="processing">Processing</SelectItem>

                <SelectItem value="fulfilled">Fulfilled</SelectItem>

                <SelectItem value="rejected">Rejected</SelectItem>

              </SelectContent>

            </Select>



            <Select value={filterType} onValueChange={setFilterType}>

              <SelectTrigger className="w-full md:w-[180px] bg-slate-50/50 border-border hover:border-slate-300">

                <span className="flex items-center gap-2 text-slate-700 font-medium">

                  <Inbox size={14} className="text-muted-foreground flex-shrink-0" />

                  <SelectValue placeholder="All Types" />

                </span>

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">All Types</SelectItem>

                <SelectItem value="access">Access</SelectItem>

                <SelectItem value="erasure">Erasure</SelectItem>

                <SelectItem value="correction">Correction</SelectItem>

              </SelectContent>

            </Select>



            <div className="flex items-center gap-2 px-3 py-1.5 h-8 rounded-lg border border-border bg-slate-50/50 flex-1 hover:border-slate-300 transition-colors focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400">

              <Search size={14} className="text-muted-foreground flex-shrink-0" />

              <input 

                type="text" 

                value={search} 

                onChange={e => setSearch(e.target.value)}

                placeholder="Search by visitor, reference..."

                className="text-sm text-slate-700 placeholder-slate-400 bg-transparent border-none outline-none w-full focus:ring-0" 

              />

            </div>

          </div>



          {!loading && filtered.length > 0 && (

            <div className="px-3 py-2 mt-2.5 border-t border-slate-100 bg-slate-50/30 rounded-b-lg">

              <p className="text-xs text-muted-foreground">

                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> request{filtered.length !== 1 ? 's' : ''}

                {(filterStatus !== 'all' || filterType !== 'all' || search) && ' matching current filters'}

              </p>

            </div>

          )}

        </Card>



        {/* List Table */}

        <Card className="shadow-xs border border-border/50 bg-card overflow-hidden">

          {loading ? (

            <div className="flex items-center justify-center py-20">

              <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />

            </div>

          ) : filtered.length === 0 ? (

            <EmptyState />

          ) : (

            <>

              <Table>

                <colgroup>

                  <col style={{ width: '130px' }} />

                  <col style={{ width: '250px' }} />

                  <col style={{ width: '120px' }} />

                  <col style={{ width: '110px' }} />

                  <col style={{ width: '110px' }} />

                  <col style={{ width: '110px' }} />

                  <col style={{ width: '150px' }} />

                </colgroup>

                <TableHeader>

                  <TableRow className="border-b border-slate-100 hover:bg-transparent">

                    {TH.map(h => (

                      <TableHead key={h} className={`${TH_CLS} h-auto`}>{h}</TableHead>

                    ))}

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(req => (

                    <RequestRow

                      key={req.id}

                      req={req}

                      onMarkProcessing={handleMarkProcessing}

                      onFulfil={setFulfilingReq}

                    />

                  ))}

                </TableBody>

              </Table>

              <Pagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPage={setPage} />

            </>

          )}

        </Card>



      </div>



      {fulfilingReq && (

        <FulfilModal

          req={fulfilingReq}

          onClose={() => setFulfilingReq(null)}

          onDone={fetchInbox}

        />

      )}

    </div>

  )

}