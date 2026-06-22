import { useState, useEffect, useCallback } from 'react'
import { getExpiringConsents, triggerReconsent, getAllReconsents } from '../api/consents'
import { sendRenewalReminders } from '../api/notifications'
import { useWebsite } from '../context/WebsiteContext'
import WebsiteSelector from '../components/WebsiteSelector'
import toast from 'react-hot-toast'
import { Send, RefreshCw, Clock, AlertTriangle, Inbox, CheckCircle2, Calendar, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// ── helpers ───────────────────────────────────────────────────────────────────

function daysLeft(expiresAt) {
  return Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
}

function DaysLeftBadge({ expiresAt }) {
  const days = daysLeft(expiresAt)
  if (days <= 7)  return <Badge variant="outline" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border-none">{days}d left</Badge>
  if (days <= 14) return <Badge variant="outline" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border-none">{days}d left</Badge>
  return <Badge variant="outline" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border-none">{days}d left</Badge>
}

// ── Reconsent status badge ────────────────────────────────────────────────────

function ReconsentBadge({ status }) {
  if (!status) return <span className="text-xs text-slate-300 italic">—</span>
  const cfg = {
    pending:  { cls: 'bg-amber-50 text-amber-700 border-none',  label: 'Sent' },
    accepted: { cls: 'bg-green-50 text-green-700 border-none',  label: '✓ Accepted' },
    declined: { cls: 'bg-red-50 text-red-600 border-none',      label: '✗ Declined' },
    expired:  { cls: 'bg-slate-100 text-slate-400 border-none', label: 'Expired' },
  }[status] || { cls: 'bg-slate-100 text-slate-500 border-none', label: status }
  return (
    <Badge variant="outline" className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {cfg.label}
    </Badge>
  )
}

// ── Trigger Reconsent Modal ───────────────────────────────────────────────────

function ReconsentModal({ consent, currentBusinessId, onClose, onSent }) {
  const [reason, setReason] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!reason.trim() || reason.trim().length < 10) {
      toast.error('Please enter a reason (min 10 characters)')
      return
    }
    setSending(true)
    try {
      await triggerReconsent(consent.consent_log_id, currentBusinessId, reason.trim())
      toast.success('Reconsent request sent to visitor')
      onSent()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to send reconsent')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-slate-800">
            Send Reconsent Request
          </DialogTitle>
          <DialogDescription asChild>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1 mt-2">
              <p><span className="font-semibold">Visitor:</span> {consent.visitor_id}</p>
              <p><span className="font-semibold">Expires:</span> {new Date(consent.expires_at).toLocaleDateString('en-IN')}</p>
              <p><span className="font-semibold">Status:</span> {consent.consent_status}</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label htmlFor="reconsent-reason" className="block text-xs font-semibold text-slate-600 mb-1.5">
            Reason for reconsent <span className="text-red-500">*</span>
            <span className="text-slate-400 font-normal ml-1">(min 10 characters)</span>
          </Label>
          <textarea
            id="reconsent-reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Our privacy policy has been updated with new data processing purposes. We need your renewed consent."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
          <p className="text-[10px] text-slate-400 mt-1">{reason.length} / 1000 characters</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-xs text-blue-700">
          A secure one-time email link will be sent to the visitor's registered email address.
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-xs px-4 h-9 rounded-xl font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending || reason.trim().length < 10}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 h-9 rounded-xl font-medium transition-colors"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={12} />
            )}
            {sending ? 'Sending…' : 'Send Request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EmptyState({ withinDays }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 border shadow-xs">
        <Inbox className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">No Consents Expiring</h3>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
        All clear! There are no consents expiring within {withinDays} days.
      </p>
    </div>
  )
}

const TH_CLS = "px-5 py-2.5 text-left text-[10px] font-semibold text-slate-400 tracking-widest uppercase whitespace-nowrap"

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RenewalPage() {
  const { selectedId, websites, currentBusiness } = useWebsite()

  const [consents, setConsents]       = useState([])
  const [reconsents, setReconsents]   = useState([])
  const [loading, setLoading]         = useState(false)
  const [sending, setSending]         = useState(false)
  const [withinDays, setWithinDays]   = useState(30)
  const [lastResult, setLastResult]   = useState(null)
  const [modalConsent, setModalConsent] = useState(null)

  const reconsentMap = Object.fromEntries(
    reconsents.map(r => [r.consent_log_id, r.status])
  )

  const fetchData = useCallback(async () => {
    if (!selectedId && (!websites || websites.length === 0)) return
    setLoading(true)
    try {
      const siteIds = selectedId
        ? [selectedId]
        : (websites || []).map(w => w.id).filter(Boolean)

      if (siteIds.length === 0) { setConsents([]); return }

      const [consentResults, reconsentRes] = await Promise.all([
        Promise.all(siteIds.map(id => getExpiringConsents(id, withinDays))),
        getAllReconsents(),
      ])

      const expiring = consentResults.flatMap(r => Array.isArray(r.data) ? r.data : [])
      setConsents(expiring)
      setReconsents(Array.isArray(reconsentRes.data) ? reconsentRes.data : [])
    } catch {
      toast.error('Failed to load renewal data')
    } finally {
      setLoading(false)
    }
  }, [selectedId, withinDays, websites])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSendReminders = async () => {
    if (!selectedId) return
    setSending(true)
    try {
      const res = await sendRenewalReminders(selectedId, withinDays)
      setLastResult(res.data)
      toast.success(`Sent ${res.data.sent} reminders`)
    } catch {
      toast.error('Failed to send reminders')
    } finally {
      setSending(false)
    }
  }

  const critical = consents.filter(c => daysLeft(c.expires_at) <= 7)

  const isButtonDisabled = sending || !selectedId || consents.length === 0
  const buttonDisabledReason = !selectedId
    ? 'Please select a website first.'
    : consents.length === 0
    ? 'No expiring consents found within the selected window.'
    : null

  const thList = selectedId
    ? ['Visitor ID', 'Status', 'Expires', 'Time Left', 'Categories', 'Reconsent Status', '']
    : ['Visitor ID', 'Website', 'Status', 'Expires', 'Time Left', 'Categories', 'Reconsent Status', '']

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Consent Renewal</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Manage expiring consents and send reconsent requests · DPDP SLA</p>
          </div>
          <div className="flex items-start gap-3">
            <Button
              onClick={fetchData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 font-semibold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 rounded-full h-9"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>

            <div className="flex flex-col items-center gap-1 shrink-0">
              <Button
                onClick={handleSendReminders}
                disabled={isButtonDisabled}
                size="sm"
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-150 rounded-full h-9 font-semibold"
              >
                <Send size={13} />
                {sending ? 'Sending...' : 'Send Bulk Reminders'}
              </Button>
              {buttonDisabledReason && (
                <span className="text-[10px] text-muted-foreground mt-0.5 text-center max-w-[200px] leading-tight">{buttonDisabledReason}</span>
              )}
            </div>
          </div>
        </div>

        <WebsiteSelector />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: `Expiring within ${withinDays}d`,
              value: consents.length,
              colorClass: 'text-slate-900',
              borderLeft: 'border-l-4 border-l-slate-400',
              icon: <Clock className="w-4 h-4 text-slate-400" />
            },
            {
              label: 'Critical (≤7 days)',
              value: critical.length,
              colorClass: critical.length > 0 ? 'text-red-600 font-extrabold animate-pulse' : 'text-slate-900',
              borderLeft: 'border-l-4 border-l-red-500',
              icon: <AlertTriangle className="w-4 h-4 text-red-500" />
            },
            {
              label: 'Reconsent sent',
              value: reconsents.filter(r => r.status === 'pending').length,
              colorClass: 'text-amber-500',
              borderLeft: 'border-l-4 border-l-amber-500',
              icon: <Send className="w-4 h-4 text-amber-500" />
            },
            {
              label: 'Reconsent accepted',
              value: reconsents.filter(r => r.status === 'accepted').length,
              colorClass: 'text-green-600',
              borderLeft: 'border-l-4 border-l-green-500',
              icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
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

        {/* Window filter */}
        <div className="flex items-center gap-3 bg-slate-50/60 border border-slate-100/80 rounded-xl p-3 w-fit">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 ml-1">
            <Calendar size={13} className="text-slate-400" />
            Show consents expiring within
          </span>
          <Select value={String(withinDays)} onValueChange={v => setWithinDays(Number(v))}>
            <SelectTrigger className="w-[125px] bg-white border-slate-200 hover:border-slate-300 font-semibold text-slate-700 h-8 rounded-lg">
              <SelectValue placeholder="30 days" />
            </SelectTrigger>
            <SelectContent>
              {[7, 14, 30, 60, 90].map(d => (
                <SelectItem key={d} value={String(d)}>{d} days</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table List */}
        <Card className="shadow-xs border border-border/50 bg-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : consents.length === 0 ? (
            <EmptyState withinDays={withinDays} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  {thList.map(h => (
                    <TableHead key={h} className={TH_CLS}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {consents.map(c => {
                  const rStatus = reconsentMap[c.consent_log_id]
                  const alreadySent = rStatus === 'pending' || rStatus === 'accepted'
                  return (
                    <TableRow key={c.consent_log_id} className="hover:bg-muted/50 transition-colors border-b border-slate-100">
                      {/* Visitor ID */}
                      <TableCell className="px-5 py-3.5 font-mono text-xs text-slate-700 max-w-[200px] truncate">
                        <span
                          onClick={() => {
                            navigator.clipboard.writeText(c.visitor_id)
                            toast.success('Visitor ID copied!')
                          }}
                          className="cursor-pointer hover:text-indigo-600 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-colors"
                          title={c.visitor_id}
                        >
                          {c.visitor_id}
                        </span>
                      </TableCell>

                      {/* Website (only if no site selected) */}
                      {!selectedId && (
                        <TableCell className="px-5 py-3.5 text-xs text-slate-500">
                          {websites?.find(w => w.id === c.website_id)?.domain || c.website_id}
                        </TableCell>
                      )}

                      {/* Status */}
                      <TableCell className="px-5 py-3.5">
                        <Badge variant="outline" className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border-none capitalize">
                          {c.consent_status}
                        </Badge>
                      </TableCell>

                      {/* Expires */}
                      <TableCell className="px-5 py-3.5 text-xs text-slate-600">
                        {new Date(c.expires_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}
                      </TableCell>

                      {/* Time Left */}
                      <TableCell className="px-5 py-3.5">
                        <DaysLeftBadge expiresAt={c.expires_at} />
                      </TableCell>

                      {/* Categories */}
                      <TableCell className="px-5 py-3.5 text-xs text-slate-500 max-w-[200px] truncate" title={c.accepted_categories ? Object.keys(c.accepted_categories).join(', ') : 'All'}>
                        {c.accepted_categories ? Object.keys(c.accepted_categories).join(', ') : 'All'}
                      </TableCell>

                      {/* Reconsent Status */}
                      <TableCell className="px-5 py-3.5">
                        <ReconsentBadge status={rStatus} />
                      </TableCell>

                      {/* Send Reconsent Action */}
                      <TableCell className="px-5 py-3.5 text-right whitespace-nowrap">
                        {!alreadySent && (
                          <Button
                            onClick={() => setModalConsent(c)}
                            size="sm"
                            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors h-7"
                          >
                            Send Reconsent
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Footer Note */}
        <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-50/50 border border-slate-100 rounded-xl p-3.5">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-slate-400" />
          <p className="leading-relaxed">
            Bulk reminders go to all expiring visitors. Individual reconsent sends a secure one-time link. Visitors who already accepted are skipped.
          </p>
        </div>

      </div>

      {modalConsent && (
        <ReconsentModal
          consent={modalConsent}
          currentBusinessId={currentBusiness?.id}
          onClose={() => setModalConsent(null)}
          onSent={fetchData}
        />
      )}
    </div>
  )
}