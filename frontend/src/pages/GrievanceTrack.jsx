import { useState } from 'react'
import axios from '../api/axios'

const STATUS_CONFIG = {
  submitted:   { label: 'Submitted',   color: 'bg-blue-50 text-blue-700 border-blue-200',   step: 0 },
  in_progress: { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200', step: 1 },
  escalated:   { label: 'Escalated',   color: 'bg-red-50 text-red-700 border-red-200',       step: 1 },
  resolved:    { label: 'Resolved',    color: 'bg-green-50 text-green-700 border-green-200', step: 2 },
  closed:      { label: 'Closed',      color: 'bg-gray-100 text-gray-600 border-gray-200',   step: 2 },
}

const TIMELINE_STEPS = [
  { key: 'submitted',   label: 'Submitted',   icon: '📋' },
  { key: 'in_progress', label: 'In Progress', icon: '⚙️' },
  { key: 'resolved',    label: 'Resolved',    icon: '✅' },
]

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.submitted
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function Timeline({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.submitted
  const currentStep = cfg.step
  const isEscalated = status === 'escalated'

  return (
    <div className="flex items-center justify-between relative">
      {/* connecting line */}
      <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-100 z-0" />
      <div
        className="absolute left-0 top-4 h-0.5 bg-blue-500 z-0 transition-all duration-700"
        style={{ width: currentStep === 0 ? '0%' : currentStep === 1 ? '50%' : '100%' }}
      />

      {TIMELINE_STEPS.map((s, i) => {
        const done    = i < currentStep
        const active  = i === currentStep
        const pending = i > currentStep
        return (
          <div key={s.key} className="flex flex-col items-center z-10 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300
              ${done    ? 'bg-blue-600 border-blue-600 text-white'
              : active  ? (isEscalated && i === 1 ? 'bg-red-50 border-red-400 text-red-500' : 'bg-blue-50 border-blue-400 text-blue-500')
              : 'bg-white border-gray-200 text-gray-300'}`}>
              {done ? '✓' : s.icon}
            </div>
            <span className={`text-xs mt-2 font-medium text-center
              ${done ? 'text-blue-600' : active ? (isEscalated && i === 1 ? 'text-red-500' : 'text-blue-500') : 'text-gray-300'}`}>
              {active && isEscalated && i === 1 ? 'Escalated' : s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-sm text-gray-800 text-right max-w-xs ${mono ? 'font-mono' : 'font-medium'}`}>
        {value || '—'}
      </span>
    </div>
  )
}

export default function GrievanceTrack() {
  // Pre-fill from URL ?ref=GRV-XXXX
  const urlRef = new URLSearchParams(window.location.search).get('ref') || ''
  const [refInput, setRefInput] = useState(urlRef)
  const [loading, setLoading]   = useState(false)
  const [grievance, setGrievance] = useState(null)
  const [error, setError]       = useState('')

  // Auto-fetch if ref in URL
  const [fetched, setFetched]   = useState(false)
  if (urlRef && !fetched && !loading) {
    setFetched(true)
    handleSearch(urlRef)
  }

  async function handleSearch(ref) {
    const r = (ref || refInput).trim().toUpperCase()
    if (!r) { setError('Please enter a reference number'); return }
    setLoading(true)
    setError('')
    setGrievance(null)
    try {
      const res = await axios.get(`/grievances/track/${r}`)
      setGrievance(res.data)
    } catch (e) {
      if (e.response?.status === 404)
        setError('No grievance found with that reference number. Please check and try again.')
      else
        setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
    : null

  const isOverdue = grievance?.due_by
    && new Date(grievance.due_by) < new Date()
    && !['resolved', 'closed'].includes(grievance?.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-5">

        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Track Your Grievance</h1>
          <p className="text-sm text-gray-400 mt-1">Enter your reference number to check the status</p>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Reference Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={refInput}
              onChange={e => { setRefInput(e.target.value.toUpperCase()); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. e.g. GRV-2026-000161"
              className="flex-1 px-3.5 py-2.5 text-sm font-mono border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:font-sans placeholder:text-gray-300"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-5 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : 'Search'}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Result card */}
        {grievance && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Top bar */}
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Reference</p>
                <p className="text-lg font-mono font-bold text-gray-900">{grievance.reference_number}</p>
              </div>
              <StatusBadge status={grievance.status} />
            </div>

            {/* Timeline */}
            <div className="px-6 py-5 border-b border-gray-50">
              <Timeline status={grievance.status} />
            </div>

            {/* Overdue warning */}
            {isOverdue && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700">
                <span className="shrink-0 text-base">⚠️</span>
                <span>This grievance is overdue. The 30-day DPDP resolution SLA has passed. We sincerely apologize for the delay.</span>
              </div>
            )}

            {/* Details */}
            <div className="px-6 py-4">
              <InfoRow
                label="Category"
                value={grievance.category?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              />
              <InfoRow
                label="Submitted"
                value={formatDate(grievance.created_at)}
              />
              <InfoRow
                label="Resolution Deadline"
                value={formatDate(grievance.due_by)}
              />
              {grievance.resolved_at && (
                <InfoRow label="Resolved On" value={formatDate(grievance.resolved_at)} />
              )}
              {grievance.resolution_summary && (
                <div className="py-3 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Resolution Summary</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{grievance.resolution_summary}</p>
                </div>
              )}
            </div>

            {/* Feedback prompt */}
            {['resolved', 'closed'].includes(grievance.status) && !grievance.feedback_rating && (
              <div className="mx-6 mb-5 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-800 mb-1">How was your experience?</p>
                <p className="text-xs text-amber-600 mb-3">Your feedback helps us improve grievance resolution.</p>
                <FeedbackWidget grievanceId={grievance.id} websiteId={grievance.website_id} />
              </div>
            )}
            {grievance.feedback_rating && (
              <div className="mx-6 mb-5 bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700">
                <span>{'★'.repeat(grievance.feedback_rating)}{'☆'.repeat(5 - grievance.feedback_rating)}</span>
                <span className="font-medium">Thank you for your feedback!</span>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 pb-5">
              <a
                href="/grievance/submit"
                className="block text-center text-xs text-blue-600 hover:underline mt-1"
              >
                Submit a new grievance →
              </a>
            </div>
          </div>
        )}

        {/* Help text when nothing searched yet */}
        {!grievance && !error && !loading && (
          <p className="text-center text-xs text-gray-400">
            Reference numbers look like <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">GRV-2026-000161</span>
            <br />and were emailed to you when you submitted your grievance.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Inline feedback widget ────────────────────────────────────────────────────

function FeedbackWidget({ grievanceId, websiteId }) {
  const [rating, setRating]   = useState(0)
  const [hover, setHover]     = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving]   = useState(false)
  const [done, setDone]       = useState(false)

  const submit = async () => {
    if (!rating) return
    setSaving(true)
    try {
      await axios.post(`/grievances/${grievanceId}/feedback`, { rating, comment })
      setDone(true)
    } catch {
      // silently fail — non-critical
    } finally {
      setSaving(false)
    }
  }

  if (done) return (
    <p className="text-xs text-green-700 font-medium">✓ Feedback submitted. Thank you!</p>
  )

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl transition-transform hover:scale-110"
          >
            <span className={(hover || rating) >= n ? 'text-amber-400' : 'text-gray-200'}>★</span>
          </button>
        ))}
      </div>
      {rating > 0 && (
        <>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Any additional comments? (optional)"
            rows={2}
            className="w-full px-3 py-2 text-xs border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
          <button
            onClick={submit}
            disabled={saving}
            className="px-4 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </>
      )}
    </div>
  )
}
