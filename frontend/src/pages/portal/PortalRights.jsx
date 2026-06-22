import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield, LogOut, ChevronLeft, FileText, Trash2, PenLine,
  CheckCircle2, Clock, XCircle, AlertTriangle, Send, Plus, X
} from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_META = {
  submitted:  { label: 'Submitted',  icon: Clock,        cls: 'bg-blue-50 text-blue-700 border-blue-100'   },
  processing: { label: 'Processing', icon: Clock,        cls: 'bg-amber-50 text-amber-700 border-amber-100' },
  fulfilled:  { label: 'Fulfilled',  icon: CheckCircle2, cls: 'bg-green-50 text-green-700 border-green-100' },
  rejected:   { label: 'Rejected',   icon: XCircle,      cls: 'bg-red-50 text-red-700 border-red-100'       },
}

const TYPE_META = {
  access:     { label: 'Data Access',    icon: FileText, color: 'text-blue-600',   bg: 'bg-blue-50'   },
  erasure:    { label: 'Data Erasure',   icon: Trash2,   color: 'text-red-600',    bg: 'bg-red-50'    },
  correction: { label: 'Data Correction', icon: PenLine,  color: 'text-amber-700', bg: 'bg-amber-50' },
}

const SLA_META = {
  on_track:  { label: 'On track',  cls: 'text-green-600'  },
  due_soon:  { label: 'Due soon',  cls: 'text-amber-600'  },
  overdue:   { label: 'Overdue',   cls: 'text-red-600 font-semibold' },
  closed:    { label: '',          cls: ''                },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.submitted
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${meta.cls}`}>
      <Icon size={11} />
      {meta.label}
    </span>
  )
}

// ─── Request Card ──────────────────────────────────────────────────────────────

function RequestCard({ req }) {
  const type = TYPE_META[req.request_type] || TYPE_META.access
  const TypeIcon = type.icon
  const sla = SLA_META[req.sla_status] || SLA_META.on_track

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg ${type.bg}`}>
            <TypeIcon size={14} className={type.color} />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-800">{type.label}</p>
            <p className="text-xs text-gray-400 font-mono">{req.reference_id}</p>
          </div>
        </div>
        <StatusBadge status={req.status} />
      </div>

      {req.description && (
        <p className="text-xs text-gray-500 leading-relaxed">{req.description}</p>
      )}

      {req.request_type === 'correction' && req.correction_field && (
        <div className="bg-gray-50 rounded-lg p-2 text-xs space-y-1">
          <p className="text-gray-500">Field: <span className="font-medium text-gray-700">{req.correction_field}</span></p>
          {req.correction_new_value && (
            <p className="text-gray-500">Requested value: <span className="font-medium text-gray-700">{req.correction_new_value}</span></p>
          )}
        </div>
      )}

      {req.fulfilment_note && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-2 text-xs text-green-700">
          <span className="font-medium">DPO note: </span>{req.fulfilment_note}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Submitted {new Date(req.submitted_at).toLocaleDateString('en-IN')}</span>
        {req.sla_status !== 'closed' && req.due_at && (
          <span className={sla.cls}>
            {Math.max(0, Math.ceil(req.sla_hours_remaining / 24))}d remaining · {sla.label}
          </span>
        )}
        {req.fulfilled_at && (
          <span className="text-green-600">
            Closed {new Date(req.fulfilled_at).toLocaleDateString('en-IN')}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── New Request Form ─────────────────────────────────────────────────────────

function NewRequestModal({ websites, visitorId, onClose, onSubmitted }) {
  const [type, setType] = useState('access')
  const [websiteId, setWebsiteId] = useState(websites[0]?.id || '')
  const [description, setDescription] = useState('')
  const [correctionField, setCorrectionField] = useState('')
  const [correctionNewValue, setCorrectionNewValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!websiteId) { toast.error('Please select a website'); return }

    setSubmitting(true)
    try {
      const payload = { visitor_id: visitorId, website_id: websiteId, description }
      if (type === 'correction') {
        if (!correctionField || !correctionNewValue) {
          toast.error('Please fill in the field name and new value')
          setSubmitting(false)
          return
        }
        payload.correction_field = correctionField
        payload.correction_new_value = correctionNewValue
      }

      const res = await api.post(`/rights/${type}`, payload)
      toast.success(`Request submitted — ${res.data.reference_id}`)
      onSubmitted()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Submit a Rights Request</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>

        {/* Type selector */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(TYPE_META).map(([key, meta]) => {
            const Icon = meta.icon
            return (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-colors
                  ${type === key ? `${meta.bg} border-current ${meta.color}` : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
              >
                <Icon size={16} />
                {meta.label}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed">
          {type === 'access' && 'Request a summary of what personal data we hold on you. We will export and share it with you within 30 days.'}
          {type === 'erasure' && 'Request deletion of your personal data. Regulatory records (audit logs, consent artifacts) are retained as required by law.'}
          {type === 'correction' && 'Request correction of inaccurate personal data we hold. Both the original and corrected values will be logged.'}
        </div>

        {/* Website */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Website</label>
          <select
            value={websiteId}
            onChange={e => setWebsiteId(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {websites.map(w => (
              <option key={w.id} value={w.id}>{w.domain || w.name}</option>
            ))}
          </select>
        </div>

        {/* Correction-specific fields */}
        {type === 'correction' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Field to correct</label>
              <input
                type="text"
                value={correctionField}
                onChange={e => setCorrectionField(e.target.value)}
                placeholder="e.g. email, phone, address"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Correct value</label>
              <input
                type="text"
                value={correctionNewValue}
                onChange={e => setCorrectionNewValue(e.target.value)}
                placeholder="What it should be"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Additional details (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="Any context that helps us process your request faster…"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-amber-800 text-white text-sm py-2.5 rounded-xl hover:bg-amber-900 disabled:opacity-50 transition-colors font-medium"
        >
          {submitting
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <><Send size={13} /> Submit Request</>
          }
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PortalRights() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [requests, setRequests] = useState([])
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    const stored = sessionStorage.getItem('portal_email')
    if (!stored) { navigate('/portal'); return }
    setEmail(stored)
    fetchData(stored)
  }, [navigate])

  const fetchData = async (visitorId) => {
    setLoading(true)
    try {
      const [rightsRes, websitesRes] = await Promise.all([
        api.get('/rights/status', { params: { visitor_id: visitorId } }),
        api.get('/portal/websites'),
      ])
      setRequests(rightsRes.data)
      setWebsites(websitesRes.data)
    } catch {
      toast.error('Failed to load rights requests')
    } finally {
      setLoading(false)
    }
  }

  const filtered = filterType === 'all' ? requests : requests.filter(r => r.request_type === filterType)

  const counts = {
    submitted: requests.filter(r => r.status === 'submitted').length,
    processing: requests.filter(r => r.status === 'processing').length,
    fulfilled: requests.filter(r => r.status === 'fulfilled').length,
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-6 h-6 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/portal/dashboard" className="text-gray-400 hover:text-gray-600">
            <ChevronLeft size={18} />
          </Link>
          <Shield className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-800">My Data Rights</span>
          <span className="hidden sm:inline text-xs text-gray-400">{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-sm bg-amber-800 text-white px-3 py-1.5 rounded-lg hover:bg-amber-900 transition-colors"
          >
            <Plus size={14} /> New Request
          </button>
          <button
            onClick={() => { sessionStorage.removeItem('portal_email'); navigate('/portal') }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Info banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-700 leading-relaxed">
          <p className="font-semibold mb-1">Your rights under DPDP Act 2023</p>
          <p><strong>Access (S.11):</strong> Request a copy of your personal data. &nbsp;
            <strong>Erasure (S.12):</strong> Request deletion of your data. &nbsp;
            <strong>Correction (S.13):</strong> Request correction of inaccurate data.</p>
          <p className="mt-1 text-indigo-500">All requests are responded to within 30 days.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Submitted', count: counts.submitted, cls: 'border-blue-100 bg-blue-50 text-blue-700' },
            { label: 'Processing', count: counts.processing, cls: 'border-amber-100 bg-amber-50 text-amber-700' },
            { label: 'Fulfilled', count: counts.fulfilled, cls: 'border-green-100 bg-green-50 text-green-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-3 text-center ${s.cls}`}>
              <p className="text-xl font-bold">{s.count}</p>
              <p className="text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'access', 'erasure', 'correction'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors capitalize
                ${filterType === f ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              {f === 'all' ? `All (${requests.length})` : TYPE_META[f]?.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <AlertTriangle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400 mb-3">
              {requests.length === 0 ? 'No rights requests yet.' : 'No requests match this filter.'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
            >
              Submit your first request →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(req => <RequestCard key={req.id} req={req} />)}
          </div>
        )}
      </main>

      {showModal && (
        <NewRequestModal
          websites={websites}
          visitorId={email}
          onClose={() => setShowModal(false)}
          onSubmitted={() => fetchData(email)}
        />
      )}
    </div>
  )
}