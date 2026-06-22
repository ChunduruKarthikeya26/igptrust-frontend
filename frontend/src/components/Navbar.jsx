import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, User, Settings, LogOut, Shield, ChevronDown, CreditCard, Key } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import axios from '../api/axios'

const titles = {
  '/dashboard':     'Dashboard',
  '/websites':      'Websites',
  '/scanner':       'Scanner',
  '/consents':      'Consent Logs',
  '/grievances':    'Grievances',
  '/renewal':       'Renewal',
  '/notifications': 'Notifications',
  '/audit':         'Audit Logs',
  '/analytics':     'Analytics',
  '/retention':     'Data Retention',
  '/team':          'Team',
  '/settings':      'Settings',
}

function timeAgo(iso) {
  if (!iso) return ''
  const utcIso = iso.endsWith('Z') ? iso : iso + 'Z'
  const diff = Math.floor((Date.now() - new Date(utcIso)) / 1000)
  if (diff < 5) return 'just now'
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { business, logout } = useAuth()
  const [notifOpen, setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [popup, setPopup]           = useState(null)
  const [hasUnread, setHasUnread]   = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const notifRef    = useRef(null)
  const profileRef  = useRef(null)
  const lastSeenId  = useRef(null)
  const popupTimer  = useRef(null)
  const isInitialRef = useRef(true)

  const title = Object.entries(titles).find(([key]) =>
    pathname === key || pathname.startsWith(key + '/')
  )?.[1] || 'ConsentManager'

  const initials     = business?.name?.charAt(0).toUpperCase() || 'U'
  const businessName = business?.name  || 'My Business'
  const businessEmail = business?.email || ''
  const plan         = (business?.plan || 'free').toLowerCase()
  const role         = (business?.role || 'admin').toUpperCase()

  const triggerPopup = useCallback((notif) => {
    setPopup(notif)
    setPopupVisible(true)
    setHasUnread(true)
    if (popupTimer.current) clearTimeout(popupTimer.current)
    popupTimer.current = setTimeout(() => {
      setPopupVisible(false)
      setTimeout(() => setPopup(null), 300)
    }, 10000)
  }, [])

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get('/websites/all/notifications', { params: { limit: 10 } })
      const data = Array.isArray(res.data) ? res.data : []
      setNotifications(data.slice(0, 10))
      if (isInitialRef.current) {
        isInitialRef.current = false
        if (data.length > 0) lastSeenId.current = data[0].id
        return
      }
      if (data.length > 0 && data[0].id !== lastSeenId.current) {
        lastSeenId.current = data[0].id
        triggerPopup(data[0])
      }
    } catch { /* silent */ }
  }, [triggerPopup])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 10000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const dismissPopup = () => {
    if (popupTimer.current) clearTimeout(popupTimer.current)
    setPopupVisible(false)
    setTimeout(() => setPopup(null), 300)
  }

  const handleLogout = () => {
    setProfileOpen(false)
    logout()
  }

  const goTo = (path) => {
    setProfileOpen(false)
    navigate(path)
  }

  // Profile dropdown menu items — each links to a specific settings tab
  const profileMenuItems = [
    {
      icon: <User size={14} />,
      label: 'My Profile',
      sub: businessEmail,
      onClick: () => goTo('/settings?tab=profile'),
    },
    {
      icon: <Key size={14} />,
      label: 'Security & MFA',
      sub: 'Two-factor authentication',
      onClick: () => goTo('/settings?tab=security'),
    },
    {
      icon: <CreditCard size={14} />,
      label: 'Plan & Billing',
      sub: `${plan} plan`,
      onClick: () => goTo('/settings?tab=plan'),
    },
    {
      icon: <Settings size={14} />,
      label: 'Settings',
      sub: 'Preferences & routing',
      onClick: () => goTo('/settings?tab=routing'),
    },
    {
      icon: <Shield size={14} />,
      label: 'Audit Logs',
      onClick: () => goTo('/audit'),
    },
  ]

  return (
    <>
      {/* Popup toast */}
      {popup && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          width: 300, background: '#fff',
          border: '1px solid #e5edf5', borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.14)',
          overflow: 'hidden',
          opacity: popupVisible ? 1 : 0,
          transform: popupVisible ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>
          <div style={{
            height: 3, background: '#3b82f6',
            animation: popupVisible ? 'shrink 10s linear forwards' : 'none',
          }} />
          <div style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Bell size={12} color="#3b82f6" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {(popup.event_type || '').replace(/_/g, ' ')}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#475569', margin: '0 0 4px', lineHeight: 1.4 }}>
                  {popup.subject || popup.recipient_id || '—'}
                </p>
                {popup.website_domain && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: '#6366f1',
                    background: '#eef2ff', padding: '1px 7px',
                    borderRadius: 20, display: 'inline-block',
                  }}>
                    {popup.website_domain}
                  </span>
                )}
              </div>
              <button onClick={dismissPopup} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#94a3b8', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0,
              }}>×</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}</style>

      <div
        className="h-14 bg-white border-b border-[#e5edf5] flex items-center justify-between px-6 shrink-0"
        style={{ boxShadow: '0px 1px 0px #e5edf5' }}
      >
        <h1 className="text-sm font-medium" style={{ color: '#061b31', letterSpacing: '-0.1px' }}>
          {title}
        </h1>

        <div className="flex items-center gap-2">

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(prev => !prev); setProfileOpen(false); setHasUnread(false) }}
              className="w-8 h-8 rounded flex items-center justify-center transition-all hover:bg-[#f8f8ff] relative"
              style={{ color: '#94a3b8' }}
            >
              <Bell size={16} />
              {hasUnread && (
                <span style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#ef4444', border: '1.5px solid #fff',
                }} />
              )}
            </button>

            {notifOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: 320, background: '#fff',
                border: '1px solid #e5edf5', borderRadius: 12,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)', zIndex: 100,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Notifications</p>
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
                    No notifications yet
                  </div>
                ) : (
                  <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                    {notifications.map((n, i) => (
                      <div key={n.id || i} style={{
                        padding: '10px 16px',
                        borderBottom: '1px solid #f8fafc',
                        display: 'flex', flexDirection: 'column', gap: 2,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {(n.event_type || '').replace(/_/g, ' ')}
                          </span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>
                            {timeAgo(n.sent_at || n.created_at)}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.4 }}>
                          {n.subject || n.recipient_id || '—'}
                        </p>
                        {n.website_domain && (
                          <span style={{
                            fontSize: 10, fontWeight: 600, color: '#6366f1',
                            background: '#eef2ff', padding: '1px 7px',
                            borderRadius: 20, display: 'inline-block', marginTop: 2,
                          }}>
                            {n.website_domain}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <a href="/notifications" style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
                    View all notifications →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Profile button + dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(prev => !prev); setNotifOpen(false) }}
              className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 hover:bg-gray-50 transition-all"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                style={{ background: '#533afd', boxShadow: '0px 2px 6px rgba(83,58,253,0.35)' }}
              >
                {initials}
              </div>
              <ChevronDown
                size={13}
                className="text-gray-400 transition-transform"
                style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: 256, background: '#fff',
                border: '1px solid #e5edf5', borderRadius: 12,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)', zIndex: 100,
                overflow: 'hidden',
              }}>

                {/* Profile header */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: '#533afd', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 15, fontWeight: 700, flexShrink: 0,
                      boxShadow: '0px 2px 6px rgba(83,58,253,0.35)',
                    }}>
                      {initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {businessName}
                      </p>
                      {businessEmail && (
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {businessEmail}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 600,
                          color: plan === 'free' ? '#64748b' : '#7c3aed',
                          background: plan === 'free' ? '#f1f5f9' : '#ede9fe',
                          padding: '1px 7px', borderRadius: 20, textTransform: 'capitalize',
                        }}>
                          {plan}
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 600,
                          color: '#0369a1', background: '#e0f2fe',
                          padding: '1px 7px', borderRadius: 20,
                        }}>
                          {role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: '6px 0' }}>
                  {profileMenuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={item.onClick}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        gap: 10, padding: '9px 16px',
                        background: 'none', border: 'none',
                        cursor: 'pointer', textAlign: 'left',
                        color: '#374151', fontSize: 13,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: '#f1f5f9', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#533afd', flexShrink: 0,
                      }}>
                        {item.icon}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: 13 }}>{item.label}</p>
                        {item.sub && (
                          <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                            {item.sub}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Logout */}
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '6px 0' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: 10, padding: '9px 16px',
                      background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                      color: '#ef4444', fontSize: 13, fontWeight: 500,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: '#fff1f2', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <LogOut size={14} color="#ef4444" />
                    </span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}