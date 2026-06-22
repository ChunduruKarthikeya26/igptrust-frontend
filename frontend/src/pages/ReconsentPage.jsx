// frontend/src/pages/ReconsentPage.jsx
// Public page — no auth required. Opened via email link: /reconsent/:token
// Data principal reviews and accepts or declines re-consent request.

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function ReconsentPage() {
  const { token } = useParams()
  const [request, setRequest]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState(null)
  const [done, setDone]         = useState(null)  // 'accepted' | 'declined'

  useEffect(() => {
    axios.get(`${API}/reconsent/verify/${token}`)
      .then(res => setRequest(res.data))
      .catch(err => setError(err.response?.data?.detail || 'This link is invalid or has expired.'))
      .finally(() => setLoading(false))
  }, [token])

  const respond = async (accepted) => {
    setSubmitting(true)
    try {
      await axios.post(`${API}/reconsent/respond/${token}`, { accepted })
      setDone(accepted ? 'accepted' : 'declined')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <Shell>
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Shell>
  )

  if (error) return (
    <Shell>
      <StatusCard icon="⚠️" title="Link unavailable" message={error} color="amber" />
    </Shell>
  )

  if (request?.status !== 'pending') {
    const map = {
      accepted: { icon: '✓', title: 'Consent already accepted', color: 'green' },
      declined: { icon: '✕', title: 'Consent already declined', color: 'gray' },
    }
    const info = map[request?.status] ?? { icon: '⏱', title: 'This request has expired', color: 'gray' }
    return (
      <Shell>
        <StatusCard {...info} message="No further action is needed." />
      </Shell>
    )
  }

  if (done) return (
    <Shell>
      <StatusCard
        icon={done === 'accepted' ? '✓' : '✕'}
        title={done === 'accepted' ? 'Consent renewed' : 'Consent declined'}
        color={done === 'accepted' ? 'green' : 'gray'}
        message={
          done === 'accepted'
            ? 'Thank you. Your consent has been recorded and confirmed.'
            : 'Your decision has been noted. Data processing for this purpose will cease.'
        }
      />
    </Shell>
  )

  const expiresAt  = new Date(request.expires_at)
  const hoursLeft  = Math.max(0, Math.round((expiresAt - Date.now()) / 3_600_000))

  return (
    <Shell>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden w-full max-w-lg mx-auto">

        {/* Header */}
        <div className="bg-indigo-600 px-6 py-5">
          <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">
            Consent Management Platform
          </p>
          <h1 className="text-white text-xl font-semibold leading-snug">
            Your consent needs attention
          </h1>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">

          {/* Reason */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
              Reason for this request
            </p>
            <p className="text-sm text-amber-900 leading-relaxed">
              {request.reason}
            </p>
          </div>

          {/* Expiry */}
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <span>⏱</span>
            This link expires in <strong className="text-gray-600">{hoursLeft}h</strong>
            &nbsp;({expiresAt.toLocaleDateString()})
          </p>

          {/* Info */}
          <p className="text-sm text-gray-600 leading-relaxed">
            Selecting <strong>Re-consent</strong> confirms your agreement to continued
            processing. Selecting <strong>Decline</strong> will halt all processing
            for this purpose immediately.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => respond(true)}
            disabled={submitting}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                       text-white text-sm font-medium py-3 rounded-xl transition-colors"
          >
            {submitting ? 'Processing…' : '✓  Re-consent'}
          </button>
          <button
            onClick={() => respond(false)}
            disabled={submitting}
            className="flex-1 bg-white hover:bg-gray-50 disabled:opacity-50
                       text-gray-700 text-sm font-medium py-3 rounded-xl
                       border border-gray-200 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4 max-w-sm">
        This request was sent in compliance with the Digital Personal Data
        Protection Act (DPDP). You will receive a confirmation after responding.
      </p>
    </Shell>
  )
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {children}
    </div>
  )
}

function StatusCard({ icon, title, message, color }) {
  const colors = {
    green:  'bg-green-50  border-green-200  text-green-700',
    amber:  'bg-amber-50  border-amber-200  text-amber-700',
    gray:   'bg-gray-50   border-gray-200   text-gray-600',
  }
  return (
    <div className={`border rounded-2xl p-8 text-center max-w-sm mx-auto ${colors[color] ?? colors.gray}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <p className="text-sm leading-relaxed opacity-80">{message}</p>
    </div>
  )
}