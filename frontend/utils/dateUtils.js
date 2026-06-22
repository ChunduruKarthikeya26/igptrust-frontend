// Shared date formatting utility — always displays in IST (Asia/Kolkata)

const IST = 'Asia/Kolkata'

/**
 * Format a date+time string: "05 May 2026, 03:30 pm"
 */
export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: IST }) +
    ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: IST })
}

/**
 * Format date only: "05 May 2026"
 */
export function formatDateOnly(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: IST })
}

/**
 * Format short date: "05 May"
 */
export function formatDateShort(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', timeZone: IST })
}