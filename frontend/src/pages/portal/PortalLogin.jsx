import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Shield, Mail, ArrowRight, Lock } from 'lucide-react'
import LanguageSwitcher from '../../components/LanguageSwitcher'

export default function PortalLogin() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError(t('portal.error_email_required', 'Please enter your email address.'))
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError(t('portal.error_email_invalid', 'Please enter a valid email address.'))
      return
    }
    setLoading(true)
    sessionStorage.setItem('portal_email', email.trim())
    setTimeout(() => {
      navigate('/portal/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
      </div>

      {/* Language switcher top-right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="p-8">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 leading-tight">{t('portal.title', 'My Consent Portal')}</p>
                <p className="text-xs text-gray-400">{t('portal.login_subtitle_short', 'Data Principal Portal')}</p>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('portal.login_title', 'Manage your consents')}
            </h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {t('portal.login_subtitle', "Enter the email address you used when consenting to a service. We'll show you all your active consent records.")}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  {t('portal.email_label', 'Your Email Address')}
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    placeholder={t('portal.email_placeholder', 'you@example.com')}
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all bg-gray-50 focus:bg-white"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                           text-white font-semibold py-3 rounded-xl text-sm transition-all
                           shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-200
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {t('portal.continue', 'View My Consents')}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Footer note */}
            <div className="mt-6 flex items-start gap-2 bg-gray-50 rounded-xl p-3">
              <Lock size={13} className="text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-400 leading-relaxed">
                {t('portal.privacy_note', 'Your data is protected under the DPDP Act, 2023. We only use your email to retrieve your consent records.')}
              </p>
            </div>
          </div>
        </div>

        {/* Back to admin */}
        <p className="text-center mt-4 text-xs text-gray-400">
          {t('portal.are_you_business', 'Are you a business?')}{' '}
          <a href="/login" className="text-blue-500 hover:underline font-medium">
            {t('portal.admin_login', 'Admin Login')} →
          </a>
        </p>
      </div>
    </div>
  )
}
