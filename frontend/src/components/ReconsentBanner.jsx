// src/components/ReconsentBanner.jsx
// Shown inside the portal consent list when a pending re-consent
// request exists for that consent. Principal can act without leaving portal.

import { useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function ReconsentBanner({ token, reason, expiresAt, onResolved }) {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]             = useState(null)  // 'accepted' | 'declined'

  if (!token || !reason) return null

  const hoursLeft   = Math.max(0, Math.round((new Date(expiresAt) - Date.now()) / 3_600_000))
  const expiringSoon = hoursLeft < 12

  const respond = async (accepted) => {
    setSubmitting(true)
    try {
      const res = await fetch(`${API}/reconsent/respond/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted }),
      })
      if (!res.ok) throw new Error()
      setDone(accepted ? 'accepted' : 'declined')
      onResolved?.()
    } catch {
      alert('Failed to submit response. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className={`mt-2 rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5 ${
        done === 'accepted'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-gray-50 text-gray-600 border border-gray-200'
      }`}>
        <span>{done === 'accepted' ? '✓' : '✕'}</span>
        {done === 'accepted' ? 'Consent renewed.' : 'Consent declined. Processing will cease.'}
      </div>
    )
  }

  return (
    <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 overflow-hidden">
      {/* Top strip */}
      <div className="flex items-center gap-1.5 bg-amber-100 border-b border-amber-200 px-3 py-1.5">
        <span className="text-amber-600 text-xs">⚠</span>
        <span className="text-xs font-semibold text-amber-800">Re-consent required</span>
        {expiringSoon && (
          <span className="ml-auto text-xs text-red-600 font-medium">Expires in {hoursLeft}h</span>
        )}
      </div>

      {/* Content */}
      <div className="px-3 py-2 space-y-2">
        <p className="text-xs text-amber-900 leading-relaxed">{reason}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => respond(true)}
            disabled={submitting}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs
                       font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? '…' : '✓ Re-consent'}
          </button>
          <button
            onClick={() => respond(false)}
            disabled={submitting}
            className="px-3 py-1 bg-white border border-amber-300 hover:bg-amber-50
                       text-amber-800 text-xs font-semibold rounded-lg transition-colors
                       disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}