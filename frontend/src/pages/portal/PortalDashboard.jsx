import { useState, useEffect } from 'react'

import { useNavigate, Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import LanguageSwitcher from '../../components/LanguageSwitcher'

import ReconsentBanner from '../../components/ReconsentBanner'

import {

  Shield, LogOut, AlertTriangle, FileText, CheckCircle,

  XCircle, Globe, Calendar, Plus, ChevronLeft, ChevronRight,

  Settings, X, Check, AlertOctagon, Scale

} from 'lucide-react'

import api from '../../api/axios'

import toast from 'react-hot-toast'

import { updateConsent, withdrawConsent } from '../../api/portal'



const GRIEVANCES_PER_PAGE = 10

const CONSENTS_PER_PAGE = 5



// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPrev, onNext }) {

  if (totalPages <= 1) return null

  return (

    <div className="flex items-center justify-between mt-3 px-1">

      <button

        onClick={onPrev}

        disabled={page === 1}

        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"

      >

        <ChevronLeft size={14} /> Prev

      </button>

      <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>

      <button

        onClick={onNext}

        disabled={page === totalPages}

        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"

      >

        Next <ChevronRight size={14} />

      </button>

    </div>

  )

}



// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ icon, label, value, color = 'gray' }) {

  const colors = {

    green: 'bg-green-50 border-green-100',

    red: 'bg-red-50 border-red-100',

    amber: 'bg-amber-50 border-amber-100',

    blue: 'bg-blue-50 border-blue-100',

  }

  return (

    <div className={`rounded-xl border p-4 flex items-center gap-3 ${colors[color] || 'bg-white border-gray-100'}`}>

      {icon}

      <div>

        <p className="text-xs text-gray-500">{label}</p>

        <p className="text-2xl font-bold text-gray-800">{value}</p>

      </div>

    </div>

  )

}



// ─── Cookie Toggle Row ────────────────────────────────────────────────────────

function CookieToggleRow({ label, description, locked = false, enabled, onChange }) {

  return (

    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-4">

      <div className="flex-1 min-w-0">

        <p className="text-sm font-medium text-gray-700">{label}</p>

        {description && (

          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</p>

        )}

        {locked && (

          <span className="inline-flex items-center gap-1 text-xs text-amber-700 mt-0.5">

            <svg

              width="10"

              height="10"

              viewBox="0 0 24 24"

              fill="none"

              stroke="currentColor"

              strokeWidth="2.5"

              strokeLinecap="round"

              strokeLinejoin="round"

              aria-hidden="true"

            >

              <rect x="3" y="11" width="18" height="11" rx="2" />

              <path d="M7 11V7a5 5 0 0 1 10 0v4" />

            </svg>

            Always active

          </span>

        )}

      </div>



      <div className="flex flex-col items-center gap-1 flex-shrink-0">

        <button

          type="button"

          role="switch"

          aria-checked={enabled}

          aria-label={`${label} cookies`}

          disabled={locked}

          onClick={() => !locked && onChange(!enabled)}

          style={{ width: 48, height: 28 }}

          className={[

            'relative rounded-full transition-colors duration-200 flex-shrink-0',

            'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',

            locked

              ? 'bg-[#c4a882] cursor-not-allowed'

              : enabled

                ? 'bg-amber-800 cursor-pointer'

                : 'bg-gray-300 cursor-pointer',

          ].join(' ')}

        >

          <span

            style={{

              position: 'absolute',

              top: 4,

              left: (enabled || locked) ? 24 : 4,

              width: 20,

              height: 20,

              borderRadius: '50%',

              background: '#fff',

              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',

              transition: 'left 0.2s',

              pointerEvents: 'none',

            }}

          />

        </button>

        <span

          className="text-[10px] select-none"

          style={{

            color: (enabled || locked) ? '#92400e' : undefined,

            fontWeight: (enabled || locked) ? 500 : 400,

          }}

        >

          {(enabled || locked) ? 'On' : 'Off'}

        </span>

      </div>

    </div>

  )

}



// ─── Withdraw Confirmation ────────────────────────────────────────────────────

function WithdrawConfirmStep({ onConfirm, onCancel, withdrawing, t }) {

  return (

    <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">

      <div className="flex items-start gap-2">

        <AlertOctagon size={16} className="text-red-500 mt-0.5 shrink-0" />

        <p className="text-sm text-red-700 leading-snug">

          {t(

            'portal.withdraw_confirm_msg',

            'This will withdraw all cookie consents for this site. This action cannot be undone. Are you sure?'

          )}

        </p>

      </div>

      <div className="flex gap-2">

        <button

          type="button"

          onClick={onConfirm}

          disabled={withdrawing}

          className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 text-white text-sm py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"

        >

          {withdrawing ? (

            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />

          ) : (

            t('portal.withdraw_confirm_yes', 'Yes, withdraw consent')

          )}

        </button>

        <button

          type="button"

          onClick={onCancel}

          disabled={withdrawing}

          className="flex items-center gap-1 text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"

        >

          {t('portal.withdraw_cancel', 'Cancel')}

        </button>

      </div>

    </div>

  )

}



// ─── Manage Consent Modal ─────────────────────────────────────────────────────

const COOKIE_CATS = [

  { key: 'necessary',   locked: true,  descKey: 'portal.cookie_necessary_desc',   descFallback: 'Required for the site to function. Cannot be disabled.' },

  { key: 'analytics',   locked: false, descKey: 'portal.cookie_analytics_desc',   descFallback: 'Help us understand how visitors interact with the site.' },

  { key: 'marketing',   locked: false, descKey: 'portal.cookie_marketing_desc',   descFallback: 'Used to show relevant ads and track campaign performance.' },

  { key: 'preferences', locked: false, descKey: 'portal.cookie_preferences_desc', descFallback: 'Remember your settings like language and region.' },

]



function ManageConsentModal({ consent, onClose, onSave, onWithdraw, saving, withdrawing }) {

  const { t } = useTranslation()



  const buildInitialPrefs = () => {

    const accepted = consent.accepted_categories

    if (Array.isArray(accepted) && accepted.length > 0) {

      return {

        necessary:   true,

        analytics:   accepted.includes('analytics'),

        marketing:   accepted.includes('marketing'),

        preferences: accepted.includes('preferences'),

      }

    }

    return { necessary: true, analytics: true, marketing: true, preferences: true }

  }



  const [prefs, setPrefs] = useState(buildInitialPrefs)

  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)



  const catLabels = {

    necessary:   t('portal.cookie_necessary', 'Necessary'),

    analytics:   t('portal.cookie_analytics', 'Analytics'),

    marketing:   t('portal.cookie_marketing', 'Marketing'),

    preferences: t('portal.cookie_preferences_cat', 'Preferences'),

  }



  const setAll = (state) =>

    setPrefs({ necessary: true, analytics: state, marketing: state, preferences: state })



  const handleSave = () => {

    const accepted = Object.entries(prefs).filter(([, v]) => v).map(([k]) => k)

    const rejected = Object.entries(prefs).filter(([, v]) => !v).map(([k]) => k)

    const status = rejected.length === 0 ? 'accepted' : 'customized'

    onSave(status, accepted, rejected)

  }



  return (

    <div

      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"

      role="dialog"

      aria-modal="true"

      aria-labelledby="cookie-modal-title"

    >

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">

        <div className="flex items-center justify-between">

          <h3 id="cookie-modal-title" className="text-sm font-semibold text-gray-800">

            {t('portal.manage_preferences', 'Manage Cookie Preferences')}

          </h3>

          <button

            onClick={onClose}

            className="text-gray-400 hover:text-gray-600 transition-colors"

            aria-label={t('common.close', 'Close')}

          >

            <X size={16} />

          </button>

        </div>



        <p className="text-xs text-gray-500 flex items-center gap-1 truncate">

          <Globe size={11} className="shrink-0" />

          {consent.domain || consent.website_id}

        </p>



        <div className="flex gap-2">

          <button

            type="button"

            onClick={() => setAll(true)}

            className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"

          >

            <Check size={11} className="text-green-600" />

            {t('portal.accept_all', 'Accept all')}

          </button>

          <button

            type="button"

            onClick={() => setAll(false)}

            className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"

          >

            <X size={11} className="text-red-500" />

            {t('portal.reject_all', 'Reject all')}

          </button>

        </div>



        <div>

          {COOKIE_CATS.map(cat => (

            <CookieToggleRow

              key={cat.key}

              label={catLabels[cat.key]}

              description={t(cat.descKey, cat.descFallback)}

              locked={cat.locked}

              enabled={prefs[cat.key]}

              onChange={(val) => setPrefs(prev => ({ ...prev, [cat.key]: val }))}

            />

          ))}

        </div>



        {showWithdrawConfirm ? (

          <WithdrawConfirmStep

            onConfirm={onWithdraw}

            onCancel={() => setShowWithdrawConfirm(false)}

            withdrawing={withdrawing}

            t={t}

          />

        ) : (

          <div className="flex gap-2 pt-1">

            <button

              type="button"

              onClick={handleSave}

              disabled={saving}

              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-800 text-white text-sm py-2.5 rounded-xl hover:bg-amber-900 disabled:opacity-50 transition-colors font-medium"

            >

              {saving ? (

                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />

              ) : (

                <>

                  <Check size={13} />

                  {t('portal.save_preferences', 'Save Preferences')}

                </>

              )}

            </button>

            <button

              type="button"

              onClick={() => setShowWithdrawConfirm(true)}

              className="flex items-center gap-1.5 text-sm text-red-600 border border-red-300 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-medium"

            >

              {t('portal.withdraw', 'Withdraw')}

            </button>

          </div>

        )}

      </div>

    </div>

  )

}



// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function PortalDashboard() {

  const { t } = useTranslation()

  const navigate = useNavigate()



  const [email, setEmail] = useState('')

  const [summary, setSummary] = useState(null)

  const [grievances, setGrievances] = useState([])

  const [consents, setConsents] = useState([])

  const [websites, setWebsites] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  const [grievancePage, setGrievancePage] = useState(1)

  const [consentPage, setConsentPage] = useState(1)

  const [managingConsent, setManagingConsent] = useState(null)

  const [savingConsent, setSavingConsent] = useState(false)

  const [withdrawingConsent, setWithdrawingConsent] = useState(false)



  useEffect(() => {

    const stored = sessionStorage.getItem('portal_email')

    if (!stored) { navigate('/portal'); return }

    setEmail(stored)
    const fetchAll = async () => {

      setLoading(true)

      setError(null)

      try {

        const params = { visitor_id: stored }

        const [s, g, c, w] = await Promise.all([

          api.get('/portal/summary',    { params }),

          api.get('/portal/grievances', { params }),

          api.get('/portal/consents',   { params }),

          api.get('/portal/websites'),

        ])

        setSummary(s.data)

        setGrievances(g.data)

        setConsents(c.data)

        setWebsites(w.data)

      } catch {

        setError(t('portal.dashboard.loadError', 'Failed to load dashboard data.'))

      } finally {

        setLoading(false)

      }

    }

    fetchAll()

  }, [navigate, t])



  const handleLogout = () => {

    sessionStorage.removeItem('portal_email')

    navigate('/portal')

  }



  const resolveWidgetKey = (consent) => {

    if (consent.widget_key) return consent.widget_key

    const site = websites.find(w => String(w.id) === String(consent.website_id))

    return site?.widget_key || consent.website_id

  }



  const handleManageConsent = (consent) => setManagingConsent(consent)

  const handleCloseManage = () => setManagingConsent(null)



  const handleWithdraw = async () => {

    if (!managingConsent) return

    setWithdrawingConsent(true)

    try {

      const key = resolveWidgetKey(managingConsent)

      await withdrawConsent(key, email, 'Withdrawn by data principal')

      toast.success(t('portal.toast_withdrawn', 'Consent withdrawn'))

      setConsents(prev =>

        prev.map(c => c.id === managingConsent.id ? { ...c, is_withdrawn: true } : c)

      )

      setManagingConsent(null)

    } catch {

      toast.error(t('portal.toast_withdraw_error', 'Failed to withdraw consent'))

    } finally {

      setWithdrawingConsent(false)

    }

  }



  const handleSavePreferences = async (newStatus, accepted, rejected) => {

    if (!managingConsent) return

    setSavingConsent(true)

    try {

      const key = resolveWidgetKey(managingConsent)

      await updateConsent(key, email, newStatus, accepted, rejected)

      toast.success(t('portal.toast_saved', 'Preferences saved'))

      setConsents(prev =>

        prev.map(c =>

          c.id === managingConsent.id

            ? { ...c, consent_status: newStatus, accepted_categories: accepted }

            : c

        )

      )

      setManagingConsent(null)

    } catch (err) {

      toast.error(t('portal.toast_save_error', 'Failed to save preferences'))

      const detail = err?.response?.data?.detail

      if (Array.isArray(detail)) {

        detail.forEach((d, i) =>

          console.error('422 error [' + i + '] field:', d.loc, '| msg:', d.msg)

        )

      } else {

        console.error('updateConsent error:', err?.response?.data)

      }

    } finally {

      setSavingConsent(false)

    }

  }



  const totalGrievancePages = Math.max(1, Math.ceil(grievances.length / GRIEVANCES_PER_PAGE))

  const pagedGrievances = grievances.slice(

    (grievancePage - 1) * GRIEVANCES_PER_PAGE,

    grievancePage * GRIEVANCES_PER_PAGE

  )

  const totalConsentPages = Math.max(1, Math.ceil(consents.length / CONSENTS_PER_PAGE))

  const pagedConsents = consents.slice(

    (consentPage - 1) * CONSENTS_PER_PAGE,

    consentPage * CONSENTS_PER_PAGE

  )



  const statusBadge = (s) => ({

    resolved:  'bg-green-100 text-green-700',

    escalated: 'bg-red-100 text-red-700',

    closed:    'bg-gray-200 text-gray-600',

    submitted: 'bg-blue-50 text-blue-600',

  }[s] || 'bg-gray-100 text-gray-600')



  const consentBadge = (s, w) => {

    if (w) return 'bg-amber-100 text-amber-700'

    if (s === 'accepted' || s === 'customized') return 'bg-green-100 text-green-700'

    if (s === 'denied'   || s === 'rejected')   return 'bg-red-100 text-red-700'

    return 'bg-gray-100 text-gray-600'

  }



  const consentLabel = (s, w) => {

    if (w) return t('portal.withdrawn_label', 'Withdrawn')

    if (s === 'accepted')              return t('portal.status_accepted',   'Accepted')

    if (s === 'customized')            return t('portal.status_customized', 'Customized')

    if (s === 'denied' || s === 'rejected') return t('portal.status_rejected', 'Rejected')

    return s

  }



  if (loading) return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="w-6 h-6 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />

    </div>

  )



  if (error) return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="text-center space-y-2">

        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />

        <p className="text-sm text-gray-600">{error}</p>

      </div>

    </div>

  )



  return (

    <div className="min-h-screen bg-gray-50">



      {/* Header */}

      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">

        <div className="flex items-center gap-2">

          <Shield className="w-5 h-5 text-indigo-600" />

          <span className="font-semibold text-gray-800">

            {t('portal.dashboard.title', 'Privacy Portal')}

          </span>

          <span className="hidden sm:inline text-xs text-gray-400 ml-2">{email}</span>

        </div>

        <div className="flex items-center gap-3">

          <LanguageSwitcher />

          <Link

            to="/portal/grievance"

            className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"

          >

            <Plus className="w-3.5 h-3.5" />

            <span className="hidden sm:inline">{t('portal.raise_grievance', 'Raise Grievance')}</span>

            <span className="sm:hidden">+</span>

          </Link>

          <Link

            to="/portal/rights"

            className="flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"

          >

            <Scale className="w-3.5 h-3.5" />

            <span className="hidden sm:inline">My Rights</span>

          </Link>

          <button

            onClick={handleLogout}

            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"

          >

            <LogOut className="w-4 h-4" />

            <span className="hidden sm:inline">{t('common.logout', 'Logout')}</span>

          </button>

        </div>

      </header>



      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">



        {summary && (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <SummaryCard

              icon={<CheckCircle className="w-5 h-5 text-green-500" />}

              label={t('portal.dashboard.granted', 'Active')}

              value={summary.granted ?? 0}

              color="green"

            />

            <SummaryCard

              icon={<XCircle className="w-5 h-5 text-red-400" />}

              label={t('portal.dashboard.denied', 'Denied')}

              value={summary.denied ?? 0}

              color="red"

            />

            <SummaryCard

              icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}

              label={t('portal.dashboard.withdrawn', 'Withdrawn')}

              value={summary.withdrawn ?? 0}

              color="amber"

            />

            <SummaryCard

              icon={<FileText className="w-5 h-5 text-blue-500" />}

              label={t('portal.dashboard.grievances', 'Grievances')}

              value={summary.grievances ?? 0}

              color="blue"

            />

          </div>

        )}



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">



          {/* Grievances */}

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">

              <h2 className="text-sm font-semibold text-gray-700">

                {t('portal.dashboard.myGrievances', 'My Grievances')}

                {grievances.length > 0 && (

                  <span className="ml-1.5 text-xs font-normal text-gray-400">

                    ({grievances.length})

                  </span>

                )}

              </h2>

              <Link

                to="/portal/grievance"

                className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"

              >

                <Plus size={12} />

                {t('portal.raise_grievance', 'Raise')}

              </Link>

            </div>

            <div className="flex-1 divide-y divide-gray-50 min-h-[200px]">

              {pagedGrievances.length === 0 ? (

                <div className="p-8 text-center">

                  <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />

                  <p className="text-xs text-gray-400 mb-2">

                    {t('portal.dashboard.noGrievances', 'No grievances submitted yet.')}

                  </p>

                  <Link to="/portal/grievance" className="text-xs text-blue-600 hover:underline">

                    {t('portal.raise_first_grievance', 'Raise your first grievance →')}

                  </Link>

                </div>

              ) : (

                pagedGrievances.map(g => (

                  <div

                    key={g.id}

                    className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"

                  >

                    <div>

                      <p className="text-sm font-medium text-gray-700">{g.reference_number}</p>

                      <p className="text-xs text-gray-400 mt-0.5">

                        {g.category} · {new Date(g.created_at).toLocaleDateString('en-IN')}

                      </p>

                    </div>

                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(g.status)}`}>

                      {g.status}

                    </span>

                  </div>

                ))

              )}

            </div>

            {grievances.length > 0 && (

              <div className="px-4 pb-4 border-t border-gray-50 pt-2">

                <Pagination

                  page={grievancePage}

                  totalPages={totalGrievancePages}

                  onPrev={() => setGrievancePage(p => p - 1)}

                  onNext={() => setGrievancePage(p => p + 1)}

                />

              </div>

            )}

          </section>



          {/* Consents */}

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">

              <h2 className="text-sm font-semibold text-gray-700">

                {t('portal.dashboard.myConsents', 'My Consents')}

                {consents.length > 0 && (

                  <span className="ml-1.5 text-xs font-normal text-gray-400">

                    ({consents.length})

                  </span>

                )}

              </h2>

            </div>

            <div className="flex-1 divide-y divide-gray-50 min-h-[200px]">

              {pagedConsents.length === 0 ? (

                <div className="p-8 text-center">

                  <Globe className="w-8 h-8 text-gray-200 mx-auto mb-2" />

                  <p className="text-xs text-gray-400">

                    {t('portal.dashboard.noConsents', 'No consent records found.')}

                  </p>

                </div>

              ) : (

                pagedConsents.map(c => (

                  <div key={c.id} className="hover:bg-gray-50 transition-colors">

                    <div className="px-4 py-3 flex items-center justify-between">

                      <div className="flex items-center gap-2 min-w-0">

                        <Globe className="w-4 h-4 text-gray-300 shrink-0" />

                        <div className="min-w-0">

                          <p className="text-sm text-gray-700 truncate max-w-[180px]">

                            {c.domain || c.website_id}

                          </p>

                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">

                            <Calendar size={10} />

                            {new Date(c.created_at).toLocaleDateString('en-IN')}

                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-2 shrink-0">

                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${consentBadge(c.consent_status, c.is_withdrawn)}`}>

                          {consentLabel(c.consent_status, c.is_withdrawn)}

                        </span>

                        <button
                          onClick={() => window.open(`http://localhost:8000/portal/consents/${c.id}/receipt?visitor_id=${encodeURIComponent(email)}`, '_blank')}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-400 px-2 py-0.5 rounded-lg transition-colors"
                          title="Download Receipt"
                        >
                          <FileText size={11} />
                          PDF
                        </button>
                        {!c.is_withdrawn && (
                          <button
                            onClick={() => handleManageConsent(c)}
                            className="flex items-center gap-1 text-xs text-amber-800 hover:text-amber-900 border border-amber-300 hover:border-amber-500 px-2 py-0.5 rounded-lg transition-colors"
                          >
                            <Settings size={11} />
                            {t('portal.manage', 'Manage')}
                          </button>
                        )}

                      </div>

                    </div>

                    {c.pending_reconsent && (

                      <ReconsentBanner

                        token={c.pending_reconsent.token}

                        reason={c.pending_reconsent.reason}

                        expiresAt={c.pending_reconsent.expires_at}

                        onResolved={() => {

                          const params = { visitor_id: email }

                          api.get('/portal/consents', { params }).then(r => setConsents(r.data))

                        }}

                      />

                    )}

                  </div>

                ))

              )}

            </div>

            {consents.length > 0 && (

              <div className="px-4 pb-4 border-t border-gray-50 pt-2">

                <Pagination

                  page={consentPage}

                  totalPages={totalConsentPages}

                  onPrev={() => setConsentPage(p => p - 1)}

                  onNext={() => setConsentPage(p => p + 1)}

                />

              </div>

            )}

          </section>



        </div>

      </main>



      {managingConsent && (

        <ManageConsentModal

          consent={managingConsent}

          onClose={handleCloseManage}

          onSave={handleSavePreferences}

          onWithdraw={handleWithdraw}

          saving={savingConsent}

          withdrawing={withdrawingConsent}

        />

      )}



    </div>

  )

}
