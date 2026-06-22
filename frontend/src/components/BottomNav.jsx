import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ── Same link definitions as Sidebar ────────────────────────────────────────
const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'dpo', 'operator', 'auditor'] },
  { to: '/websites',  label: 'Websites',  roles: ['admin', 'operator'] },
  { to: '/scanner',   label: 'Scanner',   roles: ['admin'] },
]

const complianceLinks = [
  { to: '/consents',      label: 'Consent Logs',  roles: ['admin', 'dpo', 'operator'] },
  { to: '/grievances',    label: 'Grievances',    roles: ['admin', 'dpo'] },
  { to: '/renewal',       label: 'Renewal',       roles: ['admin', 'dpo', 'operator'] },
  { to: '/notifications', label: 'Notifications', roles: ['admin', 'dpo'] },
]

const reportsLinks = [
  { to: '/audit',     label: 'Audit Logs',     roles: ['admin', 'dpo', 'auditor'] },
  { to: '/analytics', label: 'Analytics',      roles: ['admin', 'dpo', 'operator'] },
  { to: '/retention', label: 'Data Retention', roles: ['admin'] },
]

const adminLinks = [
  { to: '/team', label: 'Team', roles: ['admin'] },
]

const ALL_SECTIONS = [
  { label: 'General',        links: mainLinks },
  { label: 'Compliance',     links: complianceLinks },
  { label: 'Reports',        links: reportsLinks },
  { label: 'Administration', links: adminLinks },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const { business } = useAuth()
  const rawRole = business?.role || 'admin'
  const role = rawRole === 'super_admin' ? 'admin' : rawRole

  // Build a flat ordered list of links visible to this role
  const visibleLinks = ALL_SECTIONS
    .flatMap(s => s.links)
    .filter(l => l.roles.includes(role))

  // Find the index of the current page
  const currentIndex = visibleLinks.findIndex(
    l => pathname === l.to || pathname.startsWith(l.to + '/')
  )

  if (currentIndex === -1) return null

  const prev = currentIndex > 0 ? visibleLinks[currentIndex - 1] : null
  const next = currentIndex < visibleLinks.length - 1 ? visibleLinks[currentIndex + 1] : null

  if (!prev && !next) return null

  return (
    <div className="mt-10 border-t border-[#e5edf5] pt-6 pb-8 px-1">
      <div className="flex gap-4">

        {/* Prev */}
        <div className="flex-1">
          {prev && (
            <Link
              to={prev.to}
              className="group flex items-center gap-3 border border-[#e5edf5] rounded-xl px-5 py-4 hover:border-[#533afd]/30 hover:bg-[#f8f8ff] transition-all duration-150 h-full"
            >
              <ChevronLeft
                size={18}
                className="text-[#94a3b8] group-hover:text-[#533afd] transition-colors shrink-0"
              />
              <div>
                <p className="text-[11px] text-[#94a3b8] mb-0.5">Previous</p>
                <p className="text-sm font-medium text-[#061b31] group-hover:text-[#533afd] transition-colors">
                  {prev.label}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Next */}
        <div className="flex-1">
          {next && (
            <Link
              to={next.to}
              className="group flex items-center justify-end gap-3 border border-[#e5edf5] rounded-xl px-5 py-4 hover:border-[#533afd]/30 hover:bg-[#f8f8ff] transition-all duration-150 h-full text-right"
            >
              <div>
                <p className="text-[11px] text-[#94a3b8] mb-0.5">Next</p>
                <p className="text-sm font-medium text-[#061b31] group-hover:text-[#533afd] transition-colors">
                  {next.label}
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-[#94a3b8] group-hover:text-[#533afd] transition-colors shrink-0"
              />
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}