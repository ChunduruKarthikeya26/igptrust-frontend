import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, RefreshCw, Eye, Globe } from 'lucide-react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

// Shadcn UI Imports
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table'

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_META = {
  under_review: { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  published:    { label: 'Published',    color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  draft:        { label: 'Draft',        color: 'bg-gray-50 text-gray-700 border-gray-200', dot: 'bg-gray-400' },
  rejected:     { label: 'Rejected',     color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
}

function StatusBadge({ status }) {
  const s = STATUS_META[status] || STATUS_META.draft
  return (
    <Badge variant="outline" className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </Badge>
  )
}

// ── Dialog type badge ─────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  return type === 'child'
    ? <Badge variant="outline" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border-purple-200">👶 Child</Badge>
    : <Badge variant="outline" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">👤 Adult</Badge>
}
function VersionRow({ item, onApprove, onReject, approving, rejecting }) {
  const [expanded, setExpanded] = useState(false)
  const [rejectNote, setRejectNote] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const submittedAt = item.version.submitted_at
    ? new Date(item.version.submitted_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—'

  return (
    <>
      <TableRow 
        className="hover:bg-slate-50/30 transition-colors border-b border-slate-100/80 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="w-10 px-5 py-3">
          <div className="flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </TableCell>
        <TableCell className="px-5 py-3 font-semibold text-slate-900">
          <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
            <span className="font-bold text-slate-800 text-sm tracking-tight">{item.dialog.name}</span>
            <TypeBadge type={item.dialog.dialog_type} />
          </div>
        </TableCell>
        <TableCell className="px-5 py-3">
          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-150/80 text-[11px] font-semibold">
            <Globe size={12} className="text-slate-400 shrink-0" />
            <span>{item.website?.domain || '—'}</span>
          </span>
        </TableCell>
        <TableCell className="px-5 py-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-150/60 hover:bg-blue-50 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-3xs">
            v{item.version.version_number}
          </Badge>
        </TableCell>
        <TableCell className="px-5 py-3 text-xs text-slate-550 font-medium">
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-800 font-semibold">{submittedAt}</span>
            {item.version.submitted_by && (
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <span>by</span>
                <code className="bg-slate-100/60 px-1 py-0.2 rounded text-[10px] font-mono border border-slate-200/40">{item.version.submitted_by.slice(0, 8)}</code>
              </span>
            )}
          </div>
        </TableCell>
        <TableCell className="px-5 py-3">
          <StatusBadge status={item.version.status} />
        </TableCell>
        <TableCell className="px-5 py-3 text-right" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 justify-end">
            {item.version.status === 'under_review' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(!showRejectForm)
                    setExpanded(true)
                  }}
                  disabled={approving || rejecting}
                  className="flex items-center gap-1 px-3 h-8 rounded-lg border border-red-200 bg-red-50/50 text-red-700 text-xs font-semibold hover:bg-red-100 hover:text-red-800 transition-all duration-200 shadow-3xs disabled:opacity-50"
                >
                  <XCircle size={13} className="shrink-0" />
                  Reject
                </Button>
                <Button
                  onClick={() => onApprove(item.dialog.id, item.version.id)}
                  disabled={approving || rejecting}
                  className="flex items-center gap-1 px-3 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {approving ? (
                    <RefreshCw size={11} className="animate-spin shrink-0" />
                  ) : (
                    <CheckCircle size={13} className="shrink-0" />
                  )}
                  Approve
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="hover:bg-transparent bg-slate-50/10">
          <TableCell colSpan={7} className="p-0 border-b border-slate-100">
            <div className="border-t border-slate-100 bg-slate-50/20 px-6 py-5 space-y-5">
              {/* Notice text preview */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notice Text Preview</p>
                <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed font-medium shadow-3xs whitespace-pre-wrap">
                  {item.version.notice_text || <span className="text-slate-400 italic">No notice text provided.</span>}
                </div>
              </div>

              {/* Change summary */}
              {item.version.change_summary && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Change Summary</p>
                  <p className="text-sm text-gray-700 bg-white border border-slate-100 rounded-xl p-4 font-medium shadow-3xs">
                    {item.version.change_summary}
                  </p>
                </div>
              )}

              {/* Purposes */}
              {item.purposes && item.purposes.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                    Consent Purposes ({item.purposes.length})
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {item.purposes.map(p => (
                      <div
                        key={p.id}
                        className={`rounded-xl border p-4 transition-all duration-200 ${
                          p.is_required
                            ? 'bg-blue-50/30 border-blue-100 hover:bg-blue-50/50'
                            : 'bg-gray-50/30 border-gray-100 hover:bg-gray-50/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                              <span className="text-sm shrink-0">{p.is_required ? '🔒' : '◎'}</span>
                              <span className="truncate">{p.display_name}</span>
                            </p>
                            <span className="text-[10px] text-gray-400 font-mono font-medium block mt-0.5">({p.purpose_key})</span>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <div className="flex items-center gap-1">
                              {p.is_required && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] font-semibold px-2 py-0.5 rounded-full border-none">
                                  Required
                                </Badge>
                              )}
                              {p.is_default_on && (
                                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 text-[10px] font-semibold px-2 py-0.5 rounded-full border-none">
                                  Default ON
                                </Badge>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">Order: {p.display_order}</span>
                          </div>
                        </div>
                        {p.description && (
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed font-medium">{p.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reject form */}
              {showRejectForm && item.version.status === 'under_review' && (
                <div className="bg-red-50/10 border border-red-100/50 rounded-xl p-4 mt-2">
                  <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-2">Rejection Note (optional)</p>
                  <textarea
                    value={rejectNote}
                    onChange={e => setRejectNote(e.target.value)}
                    placeholder="Explain why this version is being rejected so the manager can fix it..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-red-350 focus:ring-2 focus:ring-red-500/10 transition-all duration-200 resize-none bg-white font-medium"
                    rows={3}
                  />
                  <div className="flex gap-3 mt-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => { setShowRejectForm(false); setRejectNote('') }}
                      className="px-4 h-8 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-2xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => onReject(item.dialog.id, item.version.id, rejectNote)}
                      disabled={rejecting}
                      className="flex items-center gap-1.5 px-4 h-8 rounded-xl border border-red-200 bg-red-50/50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-all duration-200 shadow-2xs disabled:opacity-50"
                    >
                      {rejecting ? <RefreshCw size={12} className="animate-spin shrink-0" /> : <XCircle size={12} className="shrink-0" />}
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PendingApprovals() {
  const { business } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState(null)
  const [rejectingId, setRejectingId] = useState(null)
  const [filter, setFilter] = useState('under_review') // under_review | all

  const fetchPending = async () => {
    setLoading(true)
    try {
      const websitesRes = await axios.get('/websites')
      const websites = websitesRes.data || []

      const results = []

      for (const website of websites) {
        const dialogsRes = await axios.get(`/dialogs?website_id=${website.id}`)
        const dialogs = dialogsRes.data || []

        for (const dialog of dialogs) {
          const versionsRes = await axios.get(`/dialogs/${dialog.id}/versions`)
          const versions = versionsRes.data || []

          for (const version of versions) {
            if (filter === 'all' || version.status === 'under_review') {
              let purposes = []
              try {
                const purposesRes = await axios.get(`/dialogs/${dialog.id}/versions/${version.id}/purposes`)
                purposes = purposesRes.data || []
              } catch {}

              results.push({ dialog, version, website, purposes })
            }
          }
        }
      }

      results.sort((a, b) => {
        if (a.version.status === 'under_review' && b.version.status !== 'under_review') return -1
        if (a.version.status !== 'under_review' && b.version.status === 'under_review') return 1
        return new Date(b.version.submitted_at || b.version.created_at) - new Date(a.version.submitted_at || a.version.created_at)
      })

      setItems(results)
    } catch (err) {
      toast.error('Failed to load pending approvals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPending() }, [filter])

  const handleApprove = async (dialogId, versionId) => {
    setApprovingId(versionId)
    try {
      await axios.patch(`/dialogs/${dialogId}/versions/${versionId}/approve`, {
        approved_by: business?.id || 'admin',
      })
      toast.success('✅ Version approved and published!')
      fetchPending()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to approve')
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = async (dialogId, versionId, note) => {
    setRejectingId(versionId)
    try {
      await axios.patch(`/dialogs/${dialogId}/versions/${versionId}/reject`, {
        reviewed_by: business?.id || 'admin',
        rejection_note: note || null,
      })
      toast.success('Version rejected and sent back to draft.')
      fetchPending()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to reject')
    } finally {
      setRejectingId(null)
    }
  }

  const pendingCount = items.filter(i => i.version.status === 'under_review').length

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Approval Inbox</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review and approve consent dialog versions before they go live · Compliance Review
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPending}
            disabled={loading}
            className="flex items-center gap-1.5 font-semibold border-slate-200 text-white bg-blue-600 hover:bg-blue-700 hover:text-slate-800 transition-all duration-150 rounded-full h-9 shadow-2xs"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Pending Review',
              value: pendingCount,
              colorClass: 'text-amber-600',
              borderLeft: 'border-l-4 border-l-amber-500',
              icon: <Clock className="w-4 h-4 text-amber-500" />
            },
            {
              label: 'Total Versions',
              value: items.length,
              colorClass: 'text-[#533afd]',
              borderLeft: 'border-l-4 border-l-purple-500',
              icon: <Eye className="w-4 h-4 text-purple-550" />
            },
            {
              label: 'Dialogs',
              value: [...new Set(items.map(i => i.dialog.id))].length,
              colorClass: 'text-blue-600',
              borderLeft: 'border-l-4 border-l-blue-500',
              icon: <Globe className="w-4 h-4 text-blue-500" />
            },
          ].map(({ label, value, colorClass, borderLeft, icon }) => (
            <Card key={label} className={`shadow-2xs bg-card border border-border/50 ${borderLeft} transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-2xl font-bold tracking-tight ${colorClass}`}>{value}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 shadow-3xs">
                  {icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter tabs */}
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <div className="border-b border-gray-100 flex-shrink-0 mb-5">
            <TabsList variant="line" className="-mb-px">
              <TabsTrigger value="under_review" className="px-4 py-3 text-sm font-semibold">
                ⏳ Pending Review
                {pendingCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-none">
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="px-4 py-3 text-sm font-semibold">
                📋 All Versions
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-medium animate-pulse">Loading dialog versions...</p>
          </div>
        ) : items.length === 0 ? (
          <Card className="border border-dashed border-gray-200 p-12 text-center bg-white rounded-2xl shadow-sm">
            <CardContent className="p-0 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-green-50/50 flex items-center justify-center mb-4 border border-green-100 shadow-2xs">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-1">
                {filter === 'under_review' ? 'No pending approvals' : 'No versions found'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed font-medium">
                {filter === 'under_review'
                  ? 'All dialog versions have been reviewed. Good job!'
                  : 'Create a dialog and submit a version for review to see it here.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-xl shadow-xs border border-slate-100/80 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 hover:bg-transparent bg-slate-50/20">
                  <TableHead className="w-10 px-5"></TableHead>
                  <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Dialog</TableHead>
                  <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Website</TableHead>
                  <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Version</TableHead>
                  <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted</TableHead>
                  <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <VersionRow
                    key={item.version.id}
                    item={item}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    approving={approvingId === item.version.id}
                    rejecting={rejectingId === item.version.id}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}