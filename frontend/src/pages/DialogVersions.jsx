import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import {
  Plus, ChevronDown, ChevronRight, CheckCircle2, Clock,
  XCircle, AlertCircle, Send, ShieldCheck, FileText,
  RotateCcw, Eye, Layers, Globe
} from 'lucide-react'

// Shadcn UI Imports
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Checkbox } from '../components/ui/checkbox'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'

// ── Status badge configuration ──────────────────────────────────────────────────

const STATUS = {
  draft:        { label: 'Draft',        color: 'bg-gray-50 text-gray-700 border-gray-200', dot: 'bg-gray-400' },
  under_review: { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  published:    { label: 'Published',    color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  superseded:   { label: 'Superseded',   color: 'bg-slate-50 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.draft
  return (
    <Badge variant="outline" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
      {s.label}
    </Badge>
  )
}

// ── Modal wrapper using Shadcn Dialog ──────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-lg w-[calc(100%-2rem)] rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight text-gray-900">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

// ── Field wrapper using Shadcn Label ───────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className="grid gap-2 mb-4">
      <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</Label>
      {children}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DialogVersions() {
  const { business } = useAuth()

  // ── Website selection (fetched from API — business object has no website_id) ─
  const [websites, setWebsites]               = useState([])
  const [selectedWebsite, setSelectedWebsite] = useState(null)
  const [websitesLoading, setWebsitesLoading] = useState(true)

  const [dialogs, setDialogs]   = useState([])
  const [expanded, setExpanded] = useState({})
  const [versions, setVersions] = useState({})  // dialogId → versions[]
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  // Modals
  const [showNewDialog, setShowNewDialog]   = useState(false)
  const [showNewVersion, setShowNewVersion] = useState(null)   // dialogId
  const [showPurpose, setShowPurpose]       = useState(null)   // { dialogId, versionId }
  const [showDetail, setShowDetail]         = useState(null)   // version object

  // Forms
  const [dialogForm, setDialogForm]   = useState({ name: '', dialog_type: 'adult' })
  const [versionForm, setVersionForm] = useState({ version_number: '', notice_text: '', policy_text: '', locale: 'en', change_summary: '' })
  const [purposeForm, setPurposeForm] = useState({ purpose_key: '', display_name: '', description: '', is_required: false, is_default_on: false, display_order: 0 })
  const [saving, setSaving]           = useState(false)

  // ── Fetch websites on mount ───────────────────────────────────────────────
  useEffect(() => {
    api.get('/websites')
      .then(res => {
        const list = res.data || []
        setWebsites(list)
        if (list.length > 0) setSelectedWebsite(list[0].id)
      })
      .catch(() => setError('Failed to load websites'))
      .finally(() => setWebsitesLoading(false))
  }, [])

  // ── Fetch dialogs whenever selected website changes ───────────────────────
  const fetchDialogs = async (websiteId) => {
    if (!websiteId) return
    setLoading(true)
    setError(null)
    setDialogs([])
    setExpanded({})
    setVersions({})
    try {
      const res = await api.get(`/dialogs?website_id=${websiteId}`)
      setDialogs(res.data || [])
    } catch {
      setError('Failed to load dialogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedWebsite) fetchDialogs(selectedWebsite)
  }, [selectedWebsite])

  // ── Fetch versions for a dialog ──────────────────────────────────────────
  const fetchVersions = async (dialogId) => {
    try {
      const res = await api.get(`/dialogs/${dialogId}/versions`)
      setVersions(v => ({ ...v, [dialogId]: res.data || [] }))
    } catch {}
  }

  const toggleExpand = (dialogId) => {
    const next = !expanded[dialogId]
    setExpanded(e => ({ ...e, [dialogId]: next }))
    if (next && !versions[dialogId]) fetchVersions(dialogId)
  }

  // ── Create dialog ────────────────────────────────────────────────────────
  const createDialog = async () => {
    setSaving(true)
    try {
      await api.post('/dialogs', {
        ...dialogForm,
        website_id: selectedWebsite,
        created_by: business?.id,
      })
      setShowNewDialog(false)
      setDialogForm({ name: '', dialog_type: 'adult' })
      toast.success('Consent dialog created successfully!')
      fetchDialogs(selectedWebsite)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to create dialog')
    } finally { setSaving(false) }
  }

  // ── Create version ───────────────────────────────────────────────────────
  const createVersion = async (dialogId) => {
    setSaving(true)
    try {
      await api.post(`/dialogs/${dialogId}/versions`, {
        ...versionForm,
        submitted_by: business?.id,
      })
      setShowNewVersion(null)
      setVersionForm({ version_number: '', notice_text: '', policy_text: '', locale: 'en', change_summary: '' })
      toast.success('Draft version created successfully!')
      fetchVersions(dialogId)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to create version')
    } finally { setSaving(false) }
  }

  // ── Submit for review ────────────────────────────────────────────────────
  const submitVersion = async (dialogId, versionId) => {
    try {
      await api.patch(`/dialogs/${dialogId}/versions/${versionId}/submit`, { submitted_by: business?.id })
      toast.success('Version submitted for review!')
      fetchVersions(dialogId)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to submit')
    }
  }

  // ── Approve ──────────────────────────────────────────────────────────────
  const approveVersion = async (dialogId, versionId) => {
    if (!window.confirm('Publish this version? Any currently published version will be superseded and affected users flagged for re-consent.')) return
    try {
      await api.patch(`/dialogs/${dialogId}/versions/${versionId}/approve`, { approved_by: business?.id })
      toast.success('Version approved and published!')
      fetchVersions(dialogId)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to approve')
    }
  }

  // ── Reject ───────────────────────────────────────────────────────────────
  const rejectVersion = async (dialogId, versionId) => {
    const note = window.prompt('Rejection reason (optional):')
    if (note === null) return
    try {
      await api.patch(`/dialogs/${dialogId}/versions/${versionId}/reject`, { reviewed_by: business?.id, rejection_note: note })
      toast.success('Version rejected and sent back to draft.')
      fetchVersions(dialogId)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to reject')
    }
  }

  // ── Add purpose ──────────────────────────────────────────────────────────
  const addPurpose = async (dialogId, versionId) => {
    setSaving(true)
    try {
      await api.post(`/dialogs/${dialogId}/versions/${versionId}/purposes`, purposeForm)
      setShowPurpose(null)
      setPurposeForm({ purpose_key: '', display_name: '', description: '', is_required: false, is_default_on: false, display_order: 0 })
      toast.success('Purpose added to version!')
      fetchVersions(dialogId)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to add purpose')
    } finally { setSaving(false) }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (websitesLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
      <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mr-3" />
      <span className="font-medium animate-pulse">Loading websites...</span>
    </div>
  )

  if (websites.length === 0) return (
    <div className="p-8 text-sm text-gray-500">No websites found. Add a website first before managing consent dialogs.</div>
  )

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Layers className="size-6 text-blue-600" />
            Consent Dialog Versions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage versioned consent notices · DPDP Act Section 6–7
          </p>
        </div>
        <Button
          onClick={() => setShowNewDialog(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5
                     rounded-full text-sm font-semibold shadow-sm hover:shadow-md hover:from-blue-700 hover:to-indigo-700 
                     transition-all duration-300 active:scale-[0.98]"
        >
          <Plus className="size-4" /> New Dialog
        </Button>
      </div>

      {/* Website selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2.5 text-sm font-medium text-gray-600 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Globe size={16} />
          </div>
          <span>Select Website:</span>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Select
            value={selectedWebsite || ''}
            onValueChange={val => setSelectedWebsite(val)}
          >
            <SelectTrigger className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50
                       focus:bg-white focus:outline-none text-gray-800 font-semibold h-10">
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              {websites.map(w => (
                <SelectItem key={w.id} value={w.id}>{w.domain || w.name || w.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
      )}

      {/* Dialog list */}
      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium animate-pulse">Loading dialogs...</p>
        </div>
      ) : dialogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-24 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100">
            <FileText size={40} className="text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-semibold text-lg mb-2">No consent dialogs yet.</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Create your first dialog to get started.</p>
          <Button
            onClick={() => setShowNewDialog(true)}
            className="bg-blue-600 text-white font-medium text-sm px-6 py-2.5
                       rounded-xl hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
          >
            Create Dialog
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {dialogs.map(dialog => (
            <div key={dialog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200">

              {/* Dialog row */}
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleExpand(dialog.id)}
              >
                <div className="flex items-center gap-3">
                  {expanded[dialog.id]
                    ? <ChevronDown className="size-3.5 text-gray-650 shrink-0" />
                    : <ChevronRight className="size-3.5 text-gray-650 shrink-0" />
                  }
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                      <Layers size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{dialog.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 capitalize font-medium">
                        {dialog.dialog_type} consent · {dialog.is_active ? 'Active' : 'Archived'}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => { e.stopPropagation(); setShowNewVersion(dialog.id) }}
                  className="flex items-center gap-1.5 h-9 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold shadow-xs"
                >
                  <Plus className="size-3.5" /> Add Version
                </Button>
              </div>

              {/* Versions table */}
              {expanded[dialog.id] && (
                <div className="border-t border-gray-100 bg-gray-50/10">
                  {!versions[dialog.id] ? (
                    <p className="text-xs text-gray-500 px-6 py-4 font-semibold animate-pulse">Loading versions…</p>
                  ) : versions[dialog.id].length === 0 ? (
                    <p className="text-xs text-gray-500 px-6 py-4 font-medium">No versions yet — add one above.</p>
                  ) : (
                    <Table>
                      <TableHeader className="bg-gray-50/80">
                        <TableRow className="border-b border-gray-100 hover:bg-transparent">
                          {['Version', 'Status', 'Locale', 'Approved at', 'Change summary', 'Actions'].map(h => (
                            <TableHead key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100">
                        {versions[dialog.id].map((v) => (
                          <TableRow key={v.id} className="hover:bg-gray-50/50 transition-colors group/row">
                            <TableCell className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">v{v.version_number}</TableCell>
                            <TableCell className="px-6 py-4"><StatusBadge status={v.status} /></TableCell>
                            <TableCell className="px-6 py-4 text-xs text-gray-600 uppercase font-semibold">{v.locale}</TableCell>
                            <TableCell className="px-6 py-4 text-xs text-gray-500 font-medium">
                              {v.approved_at ? new Date(v.approved_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-xs text-gray-600 max-w-[200px] truncate font-medium">{v.change_summary || '—'}</TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setShowDetail(v)}
                                  className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 size-8"
                                  title="View details"
                                >
                                  <Eye className="size-4" />
                                </Button>
                                {v.status === 'draft' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowPurpose({ dialogId: dialog.id, versionId: v.id })}
                                    className="p-2 rounded-xl text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 size-8"
                                    title="Add purpose"
                                  >
                                    <Plus className="size-4" />
                                  </Button>
                                )}
                                {v.status === 'draft' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => submitVersion(dialog.id, v.id)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200 size-8"
                                    title="Submit for review"
                                  >
                                    <Send className="size-4" />
                                  </Button>
                                )}
                                {v.status === 'under_review' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => approveVersion(dialog.id, v.id)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200 size-8"
                                    title="Approve & publish"
                                  >
                                    <ShieldCheck className="size-4" />
                                  </Button>
                                )}
                                {v.status === 'under_review' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => rejectVersion(dialog.id, v.id)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 size-8"
                                    title="Reject"
                                  >
                                    <XCircle className="size-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>

      {/* ── Modal: New Dialog ── */}
      {showNewDialog && (
        <Modal title="Create Consent Dialog" onClose={() => setShowNewDialog(false)}>
          <div className="space-y-5">
            <Field label="Dialog Name">
              <Input
                placeholder="e.g. Loan Application Consent"
                value={dialogForm.name}
                onChange={e => setDialogForm(f => ({ ...f, name: e.target.value }))}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200 h-10 font-semibold"
              />
            </Field>

            <Field label="Dialog Type">
              <Select
                value={dialogForm.dialog_type}
                onValueChange={val => setDialogForm(f => ({ ...f, dialog_type: val }))}
              >
                <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none text-gray-800 font-semibold h-10">
                  <SelectValue placeholder="Select dialog type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="child">Child / Minor (triggers guardian flow)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowNewDialog(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </Button>
              <Button
                onClick={createDialog}
                disabled={saving || !dialogForm.name}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Create Dialog'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal: New Version ── */}
      {showNewVersion && (
        <Modal title="Create Draft Version" onClose={() => setShowNewVersion(null)}>
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            <Field label="Version Number">
              <Input
                placeholder="e.g. 1.0"
                value={versionForm.version_number}
                onChange={e => setVersionForm(f => ({ ...f, version_number: e.target.value }))}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200 h-10 font-semibold"
              />
            </Field>

            <Field label="Primary Locale">
              <Select
                value={versionForm.locale}
                onValueChange={val => setVersionForm(f => ({ ...f, locale: val }))}
              >
                <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none text-gray-800 font-semibold h-10">
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Notice Text (shown to user)">
              <textarea
                rows={4}
                placeholder="Full consent notice text…"
                value={versionForm.notice_text}
                onChange={e => setVersionForm(f => ({ ...f, notice_text: e.target.value }))}
                className="w-full min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </Field>

            <Field label="Policy Text (full privacy policy)">
              <textarea
                rows={3}
                placeholder="Full legal privacy policy…"
                value={versionForm.policy_text}
                onChange={e => setVersionForm(f => ({ ...f, policy_text: e.target.value }))}
                className="w-full min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </Field>

            <Field label="Change Summary">
              <Input
                placeholder="e.g. Added marketing purpose, updated retention period"
                value={versionForm.change_summary}
                onChange={e => setVersionForm(f => ({ ...f, change_summary: e.target.value }))}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200 h-10 font-semibold"
              />
            </Field>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <Button
                variant="outline"
                onClick={() => setShowNewVersion(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => createVersion(showNewVersion)}
                disabled={saving || !versionForm.version_number || !versionForm.notice_text}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Create Draft'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal: Add Purpose ── */}
      {showPurpose && (
        <Modal title="Add Purpose to Version" onClose={() => setShowPurpose(null)}>
          <div className="space-y-5">
            <Field label="Purpose Key (machine-readable)">
              <Input
                placeholder="e.g. marketing, analytics, regulatory"
                value={purposeForm.purpose_key}
                onChange={e => setPurposeForm(f => ({ ...f, purpose_key: e.target.value }))}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200 h-10 font-semibold"
              />
            </Field>

            <Field label="Display Name (shown to user)">
              <Input
                placeholder="e.g. Marketing Emails"
                value={purposeForm.display_name}
                onChange={e => setPurposeForm(f => ({ ...f, display_name: e.target.value }))}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200 h-10 font-semibold"
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={2}
                placeholder="What this purpose means for the user…"
                value={purposeForm.description}
                onChange={e => setPurposeForm(f => ({ ...f, description: e.target.value }))}
                className="w-full min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </Field>

            <div className="flex gap-6 py-2 justify-start items-center">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_required"
                  checked={purposeForm.is_required}
                  onCheckedChange={checked => setPurposeForm(f => ({ ...f, is_required: !!checked }))}
                />
                <Label htmlFor="is_required" className="text-sm font-semibold text-gray-600 cursor-pointer">
                  Required
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_default_on"
                  checked={purposeForm.is_default_on}
                  onCheckedChange={checked => setPurposeForm(f => ({ ...f, is_default_on: !!checked }))}
                />
                <Label htmlFor="is_default_on" className="text-sm font-semibold text-gray-600 cursor-pointer">
                  Default on
                </Label>
              </div>
            </div>

            <Field label="Display Order">
              <Input
                type="number"
                value={purposeForm.display_order}
                onChange={e => setPurposeForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200 h-10 font-semibold"
              />
            </Field>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowPurpose(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => addPurpose(showPurpose.dialogId, showPurpose.versionId)}
                disabled={saving || !purposeForm.purpose_key || !purposeForm.display_name}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? 'Adding…' : 'Add Purpose'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal: Version Detail ── */}
      {showDetail && (
        <Modal title={`Version v${showDetail.version_number} — Details`} onClose={() => setShowDetail(null)}>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
              <span className="text-gray-500 font-semibold">Status</span>
              <StatusBadge status={showDetail.status} />
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
              <span className="text-gray-500 font-semibold">Locale</span>
              <span className="text-gray-950 uppercase font-mono text-xs font-bold">{showDetail.locale}</span>
            </div>

            {showDetail.approved_at && (
              <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Published at</span>
                <span className="text-gray-950 text-xs font-semibold">{new Date(showDetail.approved_at).toLocaleString('en-IN')}</span>
              </div>
            )}

            {showDetail.superseded_at && (
              <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Superseded at</span>
                <span className="text-gray-950 text-xs font-semibold">{new Date(showDetail.superseded_at).toLocaleString('en-IN')}</span>
              </div>
            )}

            {showDetail.change_summary && (
              <div className="space-y-2">
                <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Change summary</p>
                <p className="text-gray-800 text-xs bg-gray-50/50 rounded-xl p-3.5 border border-gray-100 leading-relaxed font-medium">{showDetail.change_summary}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Notice text</p>
              <p className="text-gray-800 text-xs bg-gray-50/50 rounded-xl p-3.5 border border-gray-100 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed font-medium">{showDetail.notice_text}</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowDetail(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-[0.98]"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </>
  )
}