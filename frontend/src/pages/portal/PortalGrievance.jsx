import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import {
  Shield, ArrowLeft, AlertTriangle, CheckCircle,
  Globe, ChevronDown, Send
} from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function PortalGrievance() {
  const { t } = useTranslation()
  const [visitorId, setVisitorId] = useState('')
  const [websites, setWebsites] = useState([])
  const [submitted, setSubmitted] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    website_id: '',
    complainant_name: '',
    complainant_email: '',
    category: '',
    description: '',
  })
  const navigate = useNavigate()

  const CATEGORIES = [
    {
      value: 'erasure_request',
      label: t('portal.categories.erasure_request', 'Data Erasure Request'),
      desc: t('portal.cat_desc.erasure_request', 'Request deletion of all your personal data (Section 13)'),
    },
    {
      value: 'access_request',
      label: t('portal.categories.access_request', 'Data Access Request'),
      desc: t('portal.cat_desc.access_request', 'Request a copy of all personal data held about you (Section 11)'),
    },
    {
      value: 'correction_request',
      label: t('portal.categories.correction_request', 'Data Correction Request'),
      desc: t('portal.cat_desc.correction_request', 'Request correction of inaccurate personal data'),
    },
    {
      value: 'consent_issue',
      label: t('portal.categories.consent_issue', 'Consent Issue'),
      desc: t('portal.cat_desc.consent_issue', 'Raise an issue about how your consent was collected or used'),
    },
    {
      value: 'other',
      label: t('portal.categories.other', 'Other'),
      desc: t('portal.cat_desc.other', 'Any other grievance related to your personal data'),
    },
  ]

  useEffect(() => {
    const stored = sessionStorage.getItem('portal_email')
    if (!stored) {
      navigate('/portal')
      return
    }
    setVisitorId(stored)
    setForm(f => ({ ...f, complainant_email: stored }))

    // FIX: Use public portal endpoint — no auth token required
    api.get('/portal/websites').then(res => {
      setWebsites(res.data || [])
    }).catch(() => {
      toast.error(t('common.error', 'Failed to load websites'))
    })
  }, [navigate])

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.website_id) { toast.error(t('portal.error_select_website', 'Please select a website')); return }
    if (!form.complainant_name.trim()) { toast.error(t('portal.error_enter_name', 'Please enter your name')); return }
    if (!form.category) { toast.error(t('portal.error_select_category', 'Please select a category')); return }
    if (!form.description.trim() || form.description.trim().length < 20) {
      toast.error(t('portal.error_description_short', 'Please describe your grievance in at least 20 characters'))
      return
    }

    setLoading(true)
    try {
      const res = await api.post(`/websites/${form.website_id}/grievances`, {
        visitor_id: visitorId,
        complainant_name: form.complainant_name.trim(),
        complainant_email: form.complainant_email.trim(),
        category: form.category,
        description: form.description.trim(),
        priority: 'normal',
      })
      setSubmitted(res.data)
      toast.success(t('portal.grievance_submitted', 'Grievance submitted successfully!'))
    } catch {
      toast.error(t('common.error', 'Something went wrong. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {t('portal.grievance_submitted', 'Grievance Submitted')}
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {t('portal.grievance_submitted_desc', 'Your grievance has been received. A confirmation has been sent to your email.')}
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-400 mb-1">{t('portal.reference_number', 'Reference Number')}</p>
            <p className="text-lg font-bold text-blue-600 font-mono">{submitted.reference_number}</p>
            <p className="text-xs text-gray-400 mt-3 mb-1">{t('portal.status', 'Status')}</p>
            <span className="text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
              {t('portal.status_submitted', 'Submitted')}
            </span>
            <p className="text-xs text-gray-400 mt-3 mb-1">{t('portal.due_by', 'Due By')}</p>
            <p className="text-xs text-gray-600">
              {submitted.due_by
                ? new Date(submitted.due_by).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata'
                  })
                : '—'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/portal/dashboard"
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm
                         hover:bg-blue-700 transition-colors text-center"
            >
              {t('portal.back_to_dashboard', 'Back to My Consents')}
            </Link>
            <button
              onClick={() => setSubmitted(null)}
              className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
            >
              {t('portal.submit_another', 'Submit another grievance')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <p className="text-sm font-bold text-gray-800">
              {t('portal.grievance_title', 'Raise a Grievance')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              to="/portal/dashboard"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={13} />
              {t('portal.back_to_dashboard', 'Back to Dashboard')}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Info banner */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle size={16} className="text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-orange-700 mb-0.5">
              {t('portal.your_rights', 'Your Rights under DPDP Act, 2023')}
            </p>
            <p className="text-xs text-orange-600 leading-relaxed">
              {t('portal.rights_desc', 'You have the right to raise grievances regarding your personal data. All grievances are acknowledged with a reference number and resolved within 30 days.')}
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400" />

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Website selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                {t('portal.website_label', 'Website / Service')} *
              </label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="website_id"
                  value={form.website_id}
                  onChange={handleChange}
                  className="w-full pl-8 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                             appearance-none transition-all"
                >
                  <option value="">
                    {t('portal.select_website', 'Select the website this is about')}
                  </option>
                  {websites.map(w => (
                    <option key={w.id} value={w.id}>{w.domain}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                {t('portal.name_label', 'Your Full Name')} *
              </label>
              <input
                type="text"
                name="complainant_name"
                value={form.complainant_name}
                onChange={handleChange}
                placeholder="e.g. Ananya Krishnan"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Email (pre-filled) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                {t('portal.email_label', 'Email Address')} *
              </label>
              <input
                type="email"
                name="complainant_email"
                value={form.complainant_email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                {t('portal.category_label', 'Grievance Category')} *
              </label>
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.map(cat => (
                  <label
                    key={cat.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all
                      ${form.category === cat.value
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={form.category === cat.value}
                      onChange={handleChange}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <p className={`text-xs font-semibold ${form.category === cat.value ? 'text-blue-700' : 'text-gray-700'}`}>
                        {cat.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{cat.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                {t('portal.description_label', 'Description')} *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder={t('portal.description_placeholder', 'Please describe your grievance in detail...')}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {form.description.length} {t('portal.characters', 'characters')}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                         text-white font-semibold py-3 rounded-xl text-sm transition-all
                         shadow-md shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={14} />
                  {t('portal.submit_grievance', 'Submit Grievance')}
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}