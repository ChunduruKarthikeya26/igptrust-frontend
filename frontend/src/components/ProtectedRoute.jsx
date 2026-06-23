import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import { AlertTriangle, X } from 'lucide-react'

const rolePageMap = {
  auditor:  ['/dashboard', '/audit', '/settings'],
  operator: ['/dashboard', '/websites', '/consents', '/renewal', '/analytics', '/settings'],
  dpo:      ['/dashboard', '/consents', '/renewal', '/grievances', '/notifications', '/audit', '/analytics', '/settings'],
  admin:    null,
}

function MFABanner({ onDismiss }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-start gap-3 px-4 py-2.5 text-sm"
      style={{ background: '#fffbe6', borderBottom: '1px solid #f0c040' }}>
      <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#b45309' }} />
      <p className="flex-1 text-xs leading-5" style={{ color: '#78350f' }}>
        Multi-factor authentication is not enabled on your account.
        Enabling MFA adds an extra layer of security to protect your account and data.{' '}
        <button
          onClick={() => navigate('/settings?tab=security')}
          className="underline font-semibold hover:opacity-80 transition-opacity"
          style={{ color: '#92400e' }}
        >
          Learn more
        </button>
      </p>
      <button
        onClick={() => navigate('/settings?tab=security')}
        className="flex-shrink-0 px-3 py-1 text-xs font-semibold rounded border transition-all hover:bg-yellow-100 whitespace-nowrap"
        style={{ color: '#78350f', borderColor: '#d97706', background: 'transparent' }}
      >
        Enable MFA
      </button>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 ml-1 hover:opacity-70 transition-opacity"
        style={{ color: '#b45309' }}
        aria-label="Dismiss banner"
      >
        <X size={15} />
      </button>
    </div>
  )
}

export default function ProtectedRoute() {
  const { business, loading } = useAuth()
  const location = useLocation()
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.height = '100%'
    document.documentElement.style.height = '100%'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.style.height = ''
      document.documentElement.style.height = ''
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!business) return <Navigate to="/login" />

  const mfaPending = business.mfa_required && !business.mfa_enabled
  if (mfaPending && location.pathname !== '/settings') {
    return <Navigate to="/settings?mfa=required" replace />
  }

  const allowedPages = rolePageMap[business.role]
  if (allowedPages && !allowedPages.some(p => location.pathname.startsWith(p))) {
    return <Navigate to="/dashboard" replace />
  }

  const showMFABanner = !business.mfa_enabled && !bannerDismissed

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <div className="flex-1 flex flex-col overflow-hidden" style={{ height: '100%', maxHeight: '100%', overflow: 'hidden', minWidth: 0 }}>
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
        {showMFABanner && (
          <MFABanner onDismiss={() => setBannerDismissed(true)} />
        )}
        <main className="flex-1 overflow-auto p-4 md:p-6" style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
          <BottomNav />
        </main>
      </div>
    </div>
  )
}