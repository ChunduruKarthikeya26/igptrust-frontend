import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import {
  LayoutDashboard, Globe, FileText,
  Shield, ScrollText, ShieldCheck,
  ScanSearch, RefreshCw, AlertTriangle, Bell, Database, BarChart2, Users, Layers, Scale, CheckCircle, Upload,
  PanelRightOpen,
  PanelRightClose,

} from 'lucide-react'

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['admin', 'dpo', 'operator', 'auditor'] },
  { to: '/websites',  label: 'Websites',  icon: 'Globe',           roles: ['admin', 'operator'] },
  { to: '/scanner',   label: 'Scanner',   icon: 'ScanSearch',      roles: ['admin'] },
]

const complianceLinks = [
  { to: '/consents',        label: 'Consent Logs',    icon: 'FileText',      roles: ['admin', 'dpo', 'operator'] },
  { to: '/dialog-versions', label: 'Dialog Versions', icon: 'Layers',        roles: ['admin', 'dpo'] },
  { to: '/grievances',      label: 'Grievances',      icon: 'AlertTriangle', roles: ['admin', 'dpo'] },
  { to: '/rights',          label: 'Data Rights',     icon: 'Scale',         roles: ['admin', 'dpo'] },
  { to: '/renewal',         label: 'Renewal',         icon: 'RefreshCw',     roles: ['admin', 'dpo', 'operator'] },
  { to: '/notifications',   label: 'Notifications',   icon: 'Bell',          roles: ['admin', 'dpo'] },
  { to: '/approvals',       label: 'Approvals',       icon: 'CheckCircle',   roles: ['admin', 'dpo'] },
  { to: '/consent-validation', label: 'Validation Logs', icon: 'ShieldCheck',   roles: ['admin', 'dpo'] },
]

const reportsLinks = [
  { to: '/audit',     label: 'Audit Logs',     icon: 'ScrollText', roles: ['admin', 'dpo', 'auditor'] },
  { to: '/analytics', label: 'Analytics',      icon: 'BarChart2',  roles: ['admin', 'dpo', 'operator'] },
  { to: '/retention', label: 'Data Retention', icon: 'Database',   roles: ['admin'] },
]

const adminLinks = [
  { to: '/team', label: 'Team', icon: 'Users', roles: ['admin'] },
]

const ICONS = {
  LayoutDashboard, Globe, FileText, ScrollText, ShieldCheck,
  ScanSearch, RefreshCw, AlertTriangle, Bell, Database, BarChart2, Users, Layers, Scale, CheckCircle, Upload,
}

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { pathname } = useLocation()
  const { business } = useAuth()
  const rawRole = business?.role || 'admin'
  const role = rawRole === 'super_admin' ? 'admin' : rawRole
  const plan = (business?.plan || 'free').toLowerCase()
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar_collapsed') === 'true' } catch { return false }
  })

  const toggleCollapsed = () => {
    setCollapsed(c => {
      const next = !c
      try { localStorage.setItem('sidebar_collapsed', String(next)) } catch {}
      return next
    })
  }

  const filter = (links) => links.filter(l => l.roles.includes(role))

  const NavLink = ({ to, label, icon }) => {
    const Icon = ICONS[icon]
    const active = pathname === to || pathname.startsWith(to + '/')
    return (
      <div className="relative group" style={{isolation: 'isolate'}}>
        <Link
          to={to}
          className={`flex items-center gap-3 rounded-lg text-sm transition-all duration-150
            ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'}
            ${active
              ? 'bg-[#eeeeff] text-[#533afd] font-medium'
              : 'text-[#64748d] hover:bg-gray-50 hover:text-[#061b31] font-normal'
            }`}
        >
          <Icon
            size={16}
            className={`shrink-0 ${active ? 'text-[#533afd]' : 'text-[#94a3b8] group-hover:text-[#533afd]'}
              transition-colors duration-150`}
          />
          {!collapsed && <span className="truncate">{label}</span>}
        </Link>
        {/* Tooltip when collapsed */}
        {collapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5
                          bg-[#061b31] text-white text-xs rounded-lg whitespace-nowrap
                          opacity-0 group-hover:opacity-100 pointer-events-none select-none
                          transition-opacity duration-150 z-[999] shadow-lg"
               style={{pointerEvents: 'none'}}>
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4
                            border-transparent border-r-[#061b31]" />
          </div>
        )}
      </div>
    )
  }

  const Section = ({ label, links }) => {
    const filtered = filter(links)
    if (!filtered.length) return null
    return (
      <div className="mb-1">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-widest px-3 mb-1 mt-4">
            {label}
          </p>
        )}
        {collapsed && <div className="mt-4 mb-1 mx-2 border-t border-[#e5edf5]" />}
        <div className="space-y-0.5">
          {filtered.map(link => <NavLink key={link.to} {...link} />)}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 transition-opacity md:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`bg-white border-r border-[#e5edf5] flex flex-col shrink-0
                    transition-transform duration-300 ease-in-out md:translate-x-0
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                    fixed inset-y-0 left-0 z-[1000] md:relative md:z-auto`}
      style={{
        width: collapsed ? '64px' : '240px',
        boxShadow: '1px 0 0 #e5edf5'
      }}
    >
      {/* Logo + Toggle header */}
      <div className="border-b border-[#e5edf5] flex items-center h-[56px] px-3">
        {collapsed ? (
          // Collapsed: just hamburger centered
          <button
          onClick={toggleCollapsed}
          className="w-8 h-8 flex items-center justify-center
                    rounded-lg hover:bg-[#eeeeff] transition-colors duration-150 mx-auto"
        >
          <PanelRightOpen size={20} className="text-[#533afd]" />
        </button>
        ) : (
          // Expanded: logo left, hamburger right
          <>
            <Link to="/dashboard" className="flex items-center gap-2 flex-1 overflow-hidden hover:opacity-90 transition-opacity">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#111111" />
                <circle cx="16" cy="16" r="8" stroke="#44BCF3" strokeWidth="3" strokeLinecap="round" strokeDasharray="20 10" />
                <circle cx="16" cy="16" r="2" fill="#44BCF3" />
              </svg>
              <span className="text-sm font-extrabold text-[#061b31] whitespace-nowrap">
                i<span className="text-[#44BCF3]">CMP</span>
              </span>
            </Link>
            <button
          onClick={toggleCollapsed}
          className="w-8 h-8 flex items-center justify-center
                    rounded-lg hover:bg-[#eeeeff] transition-colors duration-150 shrink-0"
        >
          <PanelRightClose size={20} className="text-[#533afd]" />
        </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-2 overflow-y-auto overflow-x-hidden
                       ${collapsed ? 'px-1' : 'px-3'}`}>
        <Section label="General"    links={mainLinks}       />
        <Section label="Compliance" links={complianceLinks} />
        <Section label="Reports"    links={reportsLinks}    />
        {filter(adminLinks).length > 0 && (
          <>
            <div className="border-t border-[#e5edf5] my-3 mx-1" />
            <Section label="Administration" links={adminLinks} />
          </>
        )}
      </nav>

      {/* Footer - plan badge */}
      {!collapsed && (
        <div className="px-3 pb-4 border-t border-[#e5edf5] pt-3">
          <div
            className="border border-[#e5edf5] rounded-lg px-3 py-2"
            style={{ background: 'linear-gradient(135deg, #f8f8ff 0%, #f0eeff 100%)' }}
          >
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest">Current Plan</p>
            <p className="text-sm font-medium text-[#533afd] capitalize">{plan}</p>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="pb-4 pt-3 border-t border-[#e5edf5] flex justify-center">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f8f8ff 0%, #f0eeff 100%)', border: '1px solid #e5edf5' }}
            title={plan}
          >
            <span className="text-[9px] font-bold text-[#533afd] uppercase">{plan[0]}</span>
          </div>
        </div>
      )}
    </div>
    </>
  )
}