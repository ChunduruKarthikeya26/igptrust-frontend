

import { useState, useEffect, useCallback, useRef } from 'react'
import { useWebsite } from '../context/WebsiteContext'
import toast from 'react-hot-toast'
import { Download, Search, Globe, ChevronLeft, ChevronRight, Inbox, Clock, AlertTriangle, AlertCircle, Star, ShieldAlert, BarChart3 } from 'lucide-react'
import { downloadExport } from '../api/export'
import ReactDOM from 'react-dom'
import { getGrievances, getGrievanceStats, updateGrievanceStatus,
         uploadEvidence, getEvidence, getGrievanceEvents } from '../api/grievances'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// ── Config ────────────────────────────────────────────────────────────────────



const STATUS_CONFIG = {

  submitted:   { label: 'Submitted',   dot: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' },

  in_progress: { label: 'In Progress', dot: '#f59e0b', bg: '#fffbeb', text: '#b45309' },

  escalated:   { label: 'Escalated',   dot: '#ef4444', bg: '#fef2f2', text: '#b91c1c' },

  resolved:    { label: 'Resolved',    dot: '#22c55e', bg: '#f0fdf4', text: '#15803d' },

  closed:      { label: 'Closed',      dot: '#9ca3af', bg: '#f9fafb', text: '#6b7280' },

}



const PRIORITY_CONFIG = {

  critical: { label: 'Critical', color: '#7c3aed' },

  high:     { label: 'High',     color: '#ef4444' },

  normal:   { label: 'Normal',   color: '#3b82f6' },

  medium:   { label: 'Medium',   color: '#f59e0b' },

  low:      { label: 'Low',      color: '#22c55e' },

}



const CATEGORY_MAP = {

  consent_violation:  'Consent Violation',

  consent_issue:      'Consent Issue',

  consent_withdrawal: 'Consent Withdrawal',

  data_breach:        'Data Breach',

  processing_error:   'Processing Error',

  access_request:     'Access Request',

  data_access:        'Data Access',

  erasure_request:    'Erasure Request',

  correction_request: 'Correction Request',

  data_correction:    'Data Correction',

  other:              'Other',

}



const ALL_CATEGORIES = [

  { value: '', label: 'All Categories' },

  ...Object.entries(CATEGORY_MAP).map(([v, l]) => ({ value: v, label: l })),

]



function formatCategory(cat) {

  if (!cat) return '—'

  return CATEGORY_MAP[cat] || cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

}



function getInitials(name = '') {

  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

}



function avatarColor(name = '') {

  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#0ea5e9', '#84cc16']

  let hash = 0

  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)

  return colors[Math.abs(hash) % colors.length]

}



function formatDate(iso) {

  if (!iso) return '—'

  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', timeZone: 'Asia/Kolkata' })

}



// ── Sub-components ────────────────────────────────────────────────────────────



function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.submitted
  return (
    <Badge
      variant="outline"
      style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: 'transparent' }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
    >
      <span style={{ backgroundColor: cfg.dot, width: 6, height: 6, borderRadius: '50%', flexShrink: 0 }} />
      {cfg.label}
    </Badge>
  )
}

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority?.toLowerCase()] || PRIORITY_CONFIG.medium
  return (
    <Badge
      variant="outline"
      style={{ color: cfg.color, borderColor: cfg.color + '33' }}
      className="text-xs font-semibold px-2 py-0.5 bg-transparent"
    >
      {cfg.label}
    </Badge>
  )
}

function Avatar({ name }) {
  return (
    <ShadcnAvatar className="w-8 h-8 flex-shrink-0">
      <AvatarFallback
        style={{ backgroundColor: avatarColor(name), color: '#fff', fontSize: 11, fontWeight: 700 }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </ShadcnAvatar>
  )
}



// ── Feedback View Button with Hover Tooltip ───────────────────────────────────



function FeedbackViewButton({ rating, description }) {
  const hasData = rating || description

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            className="px-3 py-1 font-medium transition-colors"
          >
            View
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-white text-gray-800 border border-gray-200 rounded-xl shadow-xl p-4 w-64 max-w-xs flex flex-col gap-2"
        >
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            User Feedback
          </p>
          {hasData ? (
            <>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`w-4 h-4 flex-shrink-0 ${star <= Math.round(rating || 0) ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                {rating ? (
                  <span className="text-xs text-gray-500 ml-1 font-medium">{rating}/5</span>
                ) : (
                  <span className="text-xs text-gray-300 ml-1">No rating</span>
                )}
              </div>
              {description ? (
                <p className="text-xs text-gray-600 leading-relaxed break-words">{description}</p>
              ) : (
                <p className="text-xs text-gray-300 italic">No description provided</p>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-300 italic">No feedback submitted yet</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}



// ── Pagination ────────────────────────────────────────────────────────────────



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
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        Showing <span className="font-medium text-gray-600">{from}–{to}</span> of{' '}
        <span className="font-medium text-gray-600">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="text-gray-500"
        >
          <ChevronLeft size={13} />
        </Button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-1 text-xs text-gray-400">…</span>
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
          className="text-gray-500"
        >
          <ChevronRight size={13} />
        </Button>
      </div>
    </div>
  )
}



// ── Update Modal ──────────────────────────────────────────────────────────────



function UpdateModal({ grievance, onClose, onUpdated }) {
  const [activeTab, setActiveTab]   = useState('update')
  const [status, setStatus]         = useState(grievance.status)
  const [note, setNote]             = useState('')
  const [resolution, setResolution] = useState(grievance.resolution_summary || '')
  const [assignedTo, setAssignedTo] = useState(grievance.assigned_to || '')
  const [saving, setSaving]         = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [evidenceList, setEvidenceList] = useState(grievance.evidence || [])
  const [events, setEvents]         = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)

  // Load timeline when tab is opened
  useEffect(() => {
    if (activeTab !== 'timeline') return
    setEventsLoading(true)
    getGrievanceEvents(grievance.id)
      .then(r => setEvents(r.data || []))
      .catch(() => toast.error('Failed to load timeline'))
      .finally(() => setEventsLoading(false))
  }, [activeTab, grievance.id])

  const handleEvidenceUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach(f => fd.append('files', f))
      const res = await uploadEvidence(grievance.website_id, grievance.id, fd)
      setEvidenceList(res.data.evidence || [])
      toast.success(files.length + ' file(s) uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateGrievanceStatus(grievance.website_id, grievance.id, {
        status,
        note,
        resolution_summary: resolution || undefined,
        assigned_to: assignedTo || undefined,
      })
      toast.success('Status updated')
      onUpdated()
      onClose()
    } catch {
      toast.error('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const STATUS_OPTIONS = [
    { value: 'in_progress', label: 'In Progress', dot: '#f59e0b' },
    { value: 'escalated',   label: 'Escalated',   dot: '#ef4444' },
    { value: 'resolved',    label: 'Resolved',    dot: '#22c55e' },
    { value: 'closed',      label: 'Closed',      dot: '#9ca3af' },
  ]

  // ── Event type config ────────────────────────────────────────────────────
  const EVENT_CONFIG = {
    CREATED:        { label: 'Grievance Submitted',  color: '#3b82f6', bg: '#eff6ff', icon: '📋' },
    STATUS_CHANGED: { label: 'Status Changed',       color: '#8b5cf6', bg: '#f5f3ff', icon: '🔄' },
    ASSIGNED:       { label: 'Assigned',             color: '#f59e0b', bg: '#fffbeb', icon: '👤' },
    NOTE_ADDED:     { label: 'Note Added',           color: '#6b7280', bg: '#f9fafb', icon: '📝' },
    ESCALATED:      { label: 'Escalated',            color: '#ef4444', bg: '#fef2f2', icon: '⚠️' },
    RESOLVED:       { label: 'Resolved',             color: '#22c55e', bg: '#f0fdf4', icon: '✅' },
    CLOSED:         { label: 'Closed',               color: '#9ca3af', bg: '#f9fafb', icon: '🔒' },
  }

  const currentStatusCfg = STATUS_CONFIG[grievance.status] || STATUS_CONFIG.submitted

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div>
            <DialogTitle className="text-sm font-semibold text-gray-900">Grievance Details</DialogTitle>
            <DialogDescription asChild>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-400 font-mono">{grievance.reference_number}</p>
                <span
                  style={{ backgroundColor: currentStatusCfg.bg, color: currentStatusCfg.text }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                >
                  <span style={{ backgroundColor: currentStatusCfg.dot, width: 5, height: 5, borderRadius: '50%' }} />
                  {currentStatusCfg.label}
                </span>
              </div>
            </DialogDescription>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 border-b border-gray-100 flex-shrink-0">
            <TabsList variant="line" className="-mb-px">
              <TabsTrigger value="update" className="px-4 py-3 text-xs font-semibold">Update</TabsTrigger>
              <TabsTrigger value="timeline" className="px-4 py-3 text-xs font-semibold">Timeline</TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">
            {/* ── UPDATE TAB ── */}
            <TabsContent value="update" className="p-6 space-y-4 outline-none">
              {/* Complainant info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={grievance.complainant_name || 'Unknown'} />
                  <div>
                    <p className="text-sm font-medium text-gray-800 leading-tight">{grievance.complainant_name || '—'}</p>
                    <p className="text-xs text-gray-400 leading-tight mt-0.5">{grievance.complainant_email || '—'}</p>
                  </div>
                </div>
                <PriorityBadge priority={grievance.priority || 'medium'} />
              </div>

              {/* Assigned To — editable */}
              <div className="space-y-1.5">
                <Label htmlFor="assign-to" className="text-xs font-medium text-gray-600">
                  Assign To <span className="text-gray-400 font-normal">(team member email)</span>
                </Label>
                <Input
                  id="assign-to"
                  type="email"
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  placeholder="e.g. dpo@yourcompany.com"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-300"
                />
              </div>

              {/* New Status */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-600">New Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map(opt => {
                    const isSelected = status === opt.value
                    return (
                      <Button
                        key={opt.value}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => setStatus(opt.value)}
                        className={`flex items-center justify-start gap-2 px-3 py-2.5 h-auto rounded-lg text-sm font-medium transition-all text-left w-full
                          ${isSelected ? 'bg-gray-950 text-white' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                          ${isSelected ? 'border-white' : 'border-gray-300'}`}>
                          {isSelected && <span style={{ backgroundColor: '#fff' }} className="w-2 h-2 rounded-full" />}
                        </span>
                        <span className={isSelected ? 'text-white' : 'text-gray-500'}>{opt.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Internal Note */}
              <div className="space-y-1.5">
                <Label htmlFor="internal-note" className="text-xs font-medium text-gray-600">
                  Internal Note <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <textarea
                  id="internal-note"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note about this status change..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              {/* Resolution Summary */}
              {['resolved', 'closed'].includes(status) && (
                <div className="space-y-1.5">
                  <Label htmlFor="resolution-summary" className="text-xs font-medium text-gray-600">Resolution Summary</Label>
                  <textarea
                    id="resolution-summary"
                    value={resolution}
                    onChange={e => setResolution(e.target.value)}
                    rows={3}
                    placeholder="Describe how this grievance was resolved..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>
              )}

              {/* Evidence Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Evidence Files</Label>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploading ? 'Uploading...' : 'Click to upload (PDF, JPG, PNG, DOC — max 5MB each)'}
                  <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx"
                    className="hidden" onChange={handleEvidenceUpload} disabled={uploading} />
                </label>
                {evidenceList.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {evidenceList.map((url, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-blue-600">
                        <a href={url} target="_blank" rel="noreferrer"
                          className="hover:underline truncate max-w-xs">{url.split('/').pop()}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>

            {/* ── TIMELINE TAB ── */}
            <TabsContent value="timeline" className="p-6 outline-none">
              {eventsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm text-gray-400">No events recorded yet</p>
                </div>
              ) : (
                <ol className="relative border-l border-gray-200 space-y-0">
                  {events.map((ev, idx) => {
                    const cfg = EVENT_CONFIG[ev.event_type] || {
                      label: ev.event_type, color: '#6b7280', bg: '#f9fafb', icon: '•'
                    }
                    const isLast = idx === events.length - 1
                    return (
                      <li key={ev.id} className={`ml-4 ${isLast ? 'pb-0' : 'pb-6'}`}>
                        {/* Dot */}
                        <span
                          style={{ backgroundColor: cfg.bg, border: `2px solid ${cfg.color}` }}
                          className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full text-xs"
                        >
                          {cfg.icon}
                        </span>

                        {/* Content */}
                        <div className="ml-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span style={{ color: cfg.color }}
                              className="text-xs font-semibold">{cfg.label}</span>
                            {ev.from_status && ev.to_status && (
                              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                                  {STATUS_CONFIG[ev.from_status]?.label || ev.from_status}
                                </span>
                                <span>→</span>
                                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                                  {STATUS_CONFIG[ev.to_status]?.label || ev.to_status}
                                </span>
                              </span>
                            )}
                          </div>

                          {ev.note && (
                            <p className="mt-1 text-xs text-gray-600 leading-relaxed">{ev.note}</p>
                          )}

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-400">
                              {ev.performed_by}
                              {ev.performed_by_type && (
                                <span className="ml-1 text-gray-300">· {ev.performed_by_type}</span>
                              )}
                            </span>
                            <span className="text-[10px] text-gray-300">
                              {ev.created_at
                                ? new Date(ev.created_at).toLocaleString('en-IN', {
                                    day: '2-digit', month: 'short', year: '2-digit',
                                    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
                                  })
                                : '—'}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
            </TabsContent>
          </div>

          {/* Footer — only show on update tab */}
          {activeTab === 'update' && (
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-4 py-2 text-sm hover:bg-gray-50 text-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}



// ── Table headers ─────────────────────────────────────────────────────────────



const TH = ['REFERENCE', 'COMPLAINANT', 'CATEGORY', 'PRIORITY', 'ASSIGNED TO', 'STATUS', 'FEEDBACK', 'DUE BY', '']

const TD = "px-3 py-3"

const TH_CLS = "px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap"



// ── Row renderer ──────────────────────────────────────────────────────────────



function GrievanceRows({ grievances, onSelect }) {
  return grievances.map(g => {
    const isOverdue = g.due_by && new Date(g.due_by) < new Date() && !['resolved', 'closed'].includes(g.status)
    const canUpdate = !['resolved', 'closed'].includes(g.status)

    return (
      <TableRow key={g.id} className="hover:bg-muted/50 transition-colors">
        {/* Reference */}
        <TableCell className="font-mono text-xs text-gray-500 tracking-tight whitespace-nowrap px-3 py-3">
          <span
            onClick={() => {
              navigator.clipboard.writeText(g.reference_number)
              toast.success('Reference copied!')
            }}
            className="cursor-pointer hover:text-indigo-600 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-colors"
            title={g.reference_number}
          >
            {g.reference_number}
          </span>
        </TableCell>

        {/* Complainant */}
        <TableCell className="px-3 py-3">
          <div className="flex items-center gap-2">
            <Avatar name={g.complainant_name || 'Unknown'} />
            <div>
              <p className="text-xs font-medium text-gray-800 leading-tight">{g.complainant_name || '—'}</p>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{g.complainant_email || '—'}</p>
            </div>
          </div>
        </TableCell>

        {/* Category */}
        <TableCell className="px-3 py-3">
          <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md font-medium whitespace-nowrap max-w-[140px] truncate">
            {formatCategory(g.category)}
          </span>
        </TableCell>

        {/* Priority */}
        <TableCell className="px-3 py-3">
          <PriorityBadge priority={g.priority || 'medium'} />
        </TableCell>

        {/* Assigned To */}
        <TableCell className="px-3 py-3">
          {g.assigned_to ? (
            <div className="flex items-center gap-1.5">
              <ShadcnAvatar className="w-5 h-5 flex-shrink-0">
                <AvatarFallback
                  style={{
                    backgroundColor: avatarColor(g.assigned_to_name || g.assigned_to),
                    color: '#fff',
                    fontSize: 8,
                    fontWeight: 700
                  }}
                >
                  {getInitials(g.assigned_to_name || g.assigned_to)}
                </AvatarFallback>
              </ShadcnAvatar>
              <div className="min-w-0">
                {g.assigned_to_name && (
                  <p className="text-xs font-medium text-gray-700 leading-tight truncate max-w-[100px]">{g.assigned_to_name}</p>
                )}
                <p className="text-[10px] text-gray-400 leading-tight truncate max-w-[120px]">{g.assigned_to}</p>
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-gray-300 italic">Unassigned</span>
          )}
        </TableCell>

        {/* Status */}
        <TableCell className="px-3 py-3">
          <StatusBadge status={g.status} />
        </TableCell>

        {/* Feedback */}
        <TableCell className="px-3 py-3">
          <FeedbackViewButton rating={g.feedback_rating} description={g.feedback_comment} />
        </TableCell>

        {/* Due By */}
        <TableCell className="whitespace-nowrap px-3 py-3">
          <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
            {isOverdue && '⚠ '}{formatDate(g.due_by)}
          </span>
        </TableCell>

        {/* Action */}
        <TableCell className="text-right px-3 py-3">
          {canUpdate && (
            <Button
              onClick={() => onSelect(g)}
              size="sm"
              className="px-3 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              Update
            </Button>
          )}
        </TableCell>
      </TableRow>
    )
  })
}



// ── Per-website group card ────────────────────────────────────────────────────



function WebsiteGroup({ domain, grievances, onSelect }) {

  const [page, setPage] = useState(1)

  const PAGE_SIZE = 10



  const escalated = grievances.filter(g => g.status === 'escalated').length

  const resolved  = grievances.filter(g => g.status === 'resolved').length

  const overdue   = grievances.filter(g =>

    g.due_by && new Date(g.due_by) < new Date() && !['resolved', 'closed'].includes(g.status)

  ).length



  const visible = grievances.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)



  return (

    <Card className="border border-gray-100 shadow-sm overflow-hidden mb-5">

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">

        <div className="flex items-center gap-2">

          <Globe size={13} className="text-gray-400" />

          <span className="text-sm font-semibold text-gray-700">{domain}</span>

        </div>

        <div className="flex items-center gap-4 text-xs">

          <span className="text-gray-400">{grievances.length} total</span>

          <span className="text-green-500 font-medium">{resolved} resolved</span>

          {escalated > 0 && <span className="text-red-500 font-medium">{escalated} escalated</span>}

          {overdue   > 0 && <span className="text-orange-500 font-medium">⚠ {overdue} overdue</span>}

        </div>

      </div>



      <Table>

        <colgroup>

          <col style={{ width: '120px' }} />

          <col style={{ width: '180px' }} />

          <col style={{ width: '150px' }} />

          <col style={{ width: '80px' }}  />

          <col style={{ width: '150px' }} />

          <col style={{ width: '110px' }} />

          <col style={{ width: '80px' }}  />

          <col style={{ width: '90px' }}  />

          <col style={{ width: '80px' }}  />

        </colgroup>

        <TableHeader>

          <TableRow className="border-b border-gray-100 hover:bg-transparent">

            {TH.map(h => (

              <TableHead key={h} className={`${TH_CLS} h-auto`}>{h}</TableHead>

            ))}

          </TableRow>

        </TableHeader>

        <TableBody>

          <GrievanceRows grievances={visible} onSelect={onSelect} />

        </TableBody>

      </Table>



      <Pagination total={grievances.length} page={page} pageSize={PAGE_SIZE} onPage={setPage} />
    </Card>
  )
}



// ── Main Page ─────────────────────────────────────────────────────────────────



function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 border shadow-xs">
        <Inbox className="w-6 h-6 text-muted-foreground/60" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">No Grievances Found</h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
        All clear! There are no grievances matching your current filters.
      </p>
    </div>
  )
}



export default function Grievances() {

  const { selectedId, websites } = useWebsite()



  const [grievances, setGrievances]         = useState([])

  const [stats, setStats]                   = useState(null)

  const [loading, setLoading]               = useState(false)

  const [selected, setSelected]             = useState(null)

  const [websiteFilter, setWebsiteFilter]   = useState('')

  const [statusFilter, setStatusFilter]     = useState('')

  const [categoryFilter, setCategoryFilter] = useState('')

  const [search, setSearch]                 = useState('')

  const [page, setPage]                     = useState(1)

  const PAGE_SIZE                           = 10



  useEffect(() => { setPage(1) }, [statusFilter, categoryFilter, search, websiteFilter])



  const isAllWebsites = !websiteFilter

  const handleExport = async (fmt) => {

  try {

    await downloadExport('grievances', fmt)

    toast.success(`Exported as ${fmt.toUpperCase()}`)

  } catch {

    toast.error('Export failed')

  }

}





  const fetchData = useCallback(async () => {

    setLoading(true)

    try {

      const params = {}

      if (statusFilter)   params.status   = statusFilter

      if (categoryFilter) params.category = categoryFilter

      const wid = websiteFilter || 'all'

      const [gRes, sRes] = await Promise.all([

        getGrievances(wid, params),

        getGrievanceStats(wid),

      ])

      setGrievances(Array.isArray(gRes.data) ? gRes.data : [])

      setStats(sRes.data)

    } catch {

      toast.error('Failed to load grievances')

    } finally {

      setLoading(false)

    }

  }, [websiteFilter, statusFilter, categoryFilter])



  useEffect(() => {

    fetchData()

    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)

  }, [fetchData])



  const filtered = grievances.filter(g => {

    if (!search) return true

    const q = search.toLowerCase()

    return (

      (g.reference_number || '').toLowerCase().includes(q) ||

      (g.complainant_name  || '').toLowerCase().includes(q) ||

      (g.complainant_email || '').toLowerCase().includes(q)

    )

  })



  const grouped = (() => {

    const map = {}

    filtered.forEach(g => {

      const wid = String(g.website_id || 'unknown')

      if (!map[wid]) map[wid] = []

      map[wid].push(g)

    })

    return Object.entries(map).map(([wid, items]) => {

      const ws = (websites || []).find(w => String(w.id) === wid)

      return { wid, domain: ws?.domain || ws?.url || ws?.name || wid, grievances: items }

    })

  })()



  return (
    <div className="bg-slate-50/30 animate-in fade-in duration-500">
      <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Grievances</h1>
            <p className="text-xs text-muted-foreground mt-0.5">DPDP complaint management · 30-day SLA</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5 font-semibold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 rounded-full"
            >
              <Download size={13} /> CSV
            </Button>
            <Button
              size="sm"
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-1.5 font-semibold bg-slate-900 text-white hover:bg-blue-800 transition-all duration-150 rounded-full bg-blue-600"
            >
              <Download size={13} /> PDF
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                label: 'Total',
                value: stats.total ?? 0,
                colorClass: 'text-slate-900',
                borderLeft: 'border-l-4 border-l-slate-400',
                icon: <Inbox className="w-4 h-4 text-slate-400" />
              },
              {
                label: 'Open',
                value: (stats.submitted ?? 0) + (stats.in_progress ?? 0),
                colorClass: 'text-blue-600',
                borderLeft: 'border-l-4 border-l-blue-500',
                icon: <Clock className="w-4 h-4 text-blue-500" />
              },
              {
                label: 'Escalated',
                value: stats.escalated ?? 0,
                colorClass: 'text-rose-600',
                borderLeft: 'border-l-4 border-l-rose-500',
                icon: <ShieldAlert className="w-4 h-4 text-rose-500" />
              },
              {
                label: 'Overdue',
                value: stats.overdue ?? 0,
                colorClass: (stats.overdue ?? 0) > 0 ? 'text-red-600 font-extrabold animate-pulse' : 'text-slate-900',
                borderLeft: 'border-l-4 border-l-red-600',
                icon: <AlertTriangle className="w-4 h-4 text-red-500" />
              },
              {
                label: 'Satisfaction',
                value: stats.avg_satisfaction ? `${stats.avg_satisfaction}/5` : '—',
                colorClass: 'text-amber-500',
                borderLeft: 'border-l-4 border-l-amber-500',
                icon: <Star className="w-4 h-4 text-amber-500" />
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
        )}

        {/* Filter bar */}
        <Card className={`shadow-xs border border-border/50 bg-card p-3 ${isAllWebsites ? 'mb-5' : ''}`}>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <Select value={websiteFilter || 'all-websites'} onValueChange={v => setWebsiteFilter(v === 'all-websites' ? '' : v)}>
              <SelectTrigger className="w-full md:w-[220px] bg-slate-50/50 border-border hover:border-slate-300">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <Globe size={14} className="text-muted-foreground flex-shrink-0" />
                  <SelectValue placeholder="All Websites" />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-websites">All Websites</SelectItem>
                {(websites || []).map(w => (
                  <SelectItem key={w.id} value={String(w.id)}>{w.domain || w.url || w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter || 'all-statuses'} onValueChange={v => setStatusFilter(v === 'all-statuses' ? '' : v)}>
              <SelectTrigger className="w-full md:w-[170px] bg-slate-50/50 border-border hover:border-slate-300">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <BarChart3 size={14} className="text-muted-foreground flex-shrink-0" />
                  <SelectValue placeholder="All Statuses" />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter || 'all-categories'} onValueChange={v => setCategoryFilter(v === 'all-categories' ? '' : v)}>
              <SelectTrigger className="w-full md:w-[190px] bg-slate-50/50 border-border hover:border-slate-300">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <Inbox size={14} className="text-muted-foreground flex-shrink-0" />
                  <SelectValue placeholder="All Categories" />
                </span>
              </SelectTrigger>
              <SelectContent>
                {ALL_CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value || 'all-categories'}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 px-3 py-1.5 h-8 rounded-lg border border-border bg-slate-50/50 flex-1 hover:border-slate-300 transition-colors focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400">
              <Search size={14} className="text-muted-foreground flex-shrink-0" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, reference..."
                className="text-sm text-slate-700 placeholder-slate-400 bg-transparent border-none outline-none w-full focus:ring-0" />
            </div>
          </div>

          {/* Row count indicator below filter bar for single-website view */}
          {!isAllWebsites && !loading && filtered.length > 0 && (
            <div className="px-3 py-2 mt-2.5 border-t border-slate-100 bg-slate-50/30 rounded-b-lg">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> grievance{filtered.length !== 1 ? 's' : ''}
                {(statusFilter || categoryFilter || search) && ' matching current filters'}
              </p>
            </div>
          )}

          {/* Single website flat table */}
          {!isAllWebsites && (
            loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? <EmptyState /> : (
              <>
                <Table>
                  <colgroup>
                    <col style={{ width: '120px' }} />
                    <col style={{ width: '180px' }} />
                    <col style={{ width: '150px' }} />
                    <col style={{ width: '80px' }} />
                    <col style={{ width: '150px' }} />
                    <col style={{ width: '110px' }} />
                    <col style={{ width: '80px' }} />
                    <col style={{ width: '90px' }} />
                    <col style={{ width: '80px' }} />
                  </colgroup>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 hover:bg-transparent">
                      {TH.map(h => (
                        <TableHead key={h} className={`${TH_CLS} h-auto`}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <GrievanceRows
                      grievances={filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
                      onSelect={setSelected}
                    />
                  </TableBody>
                </Table>
                <Pagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPage={setPage} />
              </>
            )
          )}
        </Card>

        {/* All Websites: one card per website */}
        {isAllWebsites && (
          loading ? (
            <Card className="shadow-xs flex items-center justify-center py-20">
              <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </Card>
          ) : grouped.length === 0 ? (
            <Card className="shadow-xs">
              <EmptyState />
            </Card>
          ) : (
            grouped.map(({ wid, domain, grievances: wg }) => (
              <WebsiteGroup key={wid} domain={domain} grievances={wg} onSelect={setSelected} />
            ))
          )
        )}
      </div>

      {selected && (
        <UpdateModal grievance={selected} onClose={() => setSelected(null)} onUpdated={fetchData} />
      )}
    </div>
  )
}