import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { updateMe } from '../api/auth'
import toast from 'react-hot-toast'
import { User, Shield, CreditCard, CheckCircle, Zap, ChevronRight } from 'lucide-react'
import api from '../api/axios'
import GrievanceRoutingSettings from './GrievanceRoutingSettings'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

const VALID_TABS = ['profile', 'security', 'plan', 'routing']

// ─── Individual section components ───────────────────────────────────────────

function ProfileSection({ business, login, onGoTo }) {
  const [form, setForm] = useState({
    name:       business?.name       || '',
    phone:      business?.phone      || '',
    gst_number: business?.gst_number || '',
    pan_number: business?.pan_number || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await updateMe(form)
      login(localStorage.getItem('token'), res.data)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      {/* Business Profile form */}
      <Card className="lg:col-span-2 border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-in fade-in duration-300">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <User className="text-indigo-650 w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Business Profile</CardTitle>
              <CardDescription className="text-xs text-slate-500 font-medium">Update your business details and credentials</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-5">
            {[
              { label: 'Business Name', key: 'name',       placeholder: 'Your business name' },
              { label: 'Phone',         key: 'phone',      placeholder: '+91 98765 43210'    },
              { label: 'GST Number',    key: 'gst_number', placeholder: '22AAAAA0000A1Z5'    },
              { label: 'PAN Number',    key: 'pan_number', placeholder: 'AAAAA0000A'         },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">{label}</Label>
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-500 transition-all duration-200 h-10 px-3.5 rounded-xl font-medium text-slate-800 text-sm shadow-sm"
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</Label>
              <Input
                type="text"
                value={business?.email || ''}
                disabled
                className="w-full bg-slate-105 border-slate-250 cursor-not-allowed h-10 px-3.5 rounded-xl font-medium text-slate-400 text-sm shadow-sm"
              />
              <p className="text-xs text-slate-400 font-medium pl-1">Email cannot be modified</p>
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200/50 hover:shadow-lg transition-all duration-300 active:scale-[0.99] disabled:opacity-40 cursor-pointer text-xs uppercase tracking-wider"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Side Content: Status and Tabs */}
      <div className="flex flex-col gap-6">
        {/* Account Status Card */}
        <Card className="border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-in fade-in duration-300">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle className="text-emerald-600 w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Account Status</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Verify your credentials status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {[
              {
                label: 'Status',
                value: 'Active',
                badge: <Badge variant="outline" className="bg-emerald-50 text-emerald-705 border-emerald-250 uppercase tracking-wider font-extrabold text-[9px] px-2.5 py-0.5 rounded-full shadow-sm">Active</Badge>
              },
              {
                label: 'Email Verified',
                value: business?.email_verified ? 'Verified' : 'Not Verified',
                badge: business?.email_verified ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-705 border-emerald-250 uppercase tracking-wider font-extrabold text-[9px] px-2.5 py-0.5 rounded-full shadow-sm">Verified</Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-250 uppercase tracking-wider font-extrabold text-[9px] px-2.5 py-0.5 rounded-full shadow-sm">Pending</Badge>
                )
              },
              {
                label: 'Member Since',
                value: business?.created_at ? new Date(business.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : '-',
                badge: <span className="text-xs font-bold text-slate-800">{business?.created_at ? new Date(business.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : '-'}</span>
              },
              {
                label: 'Role',
                value: (business?.role || 'admin').toUpperCase(),
                badge: <Badge variant="outline" className="bg-indigo-50 text-indigo-705 border-indigo-250 uppercase tracking-wider font-extrabold text-[9px] px-2.5 py-0.5 rounded-full shadow-sm">{(business?.role || 'admin').toUpperCase()}</Badge>
              },
            ].map(({ label, badge }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                <span className="text-xs font-semibold text-slate-500">{label}</span>
                {badge}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Nav Cards */}
        {[
          { label: 'Security & MFA', sub: 'Two-factor authentication', tab: 'security', icon: <Shield className="w-4 h-4" />, color: 'text-rose-600', bg: 'bg-rose-50 border border-rose-100' },
          { label: 'Plan & Billing', sub: `${(business?.plan || 'free').toUpperCase()} Plan`, tab: 'plan', icon: <CreditCard className="w-4 h-4" />, color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
        ].map(item => (
          <button
            key={item.tab}
            onClick={() => onGoTo(item.tab)}
            className="bg-white hover:bg-slate-50/50 rounded-2xl border border-slate-200/60 p-4.5 flex items-center gap-4 w-full text-left transition-all duration-300 hover:border-slate-355 shadow-md shadow-slate-100/50 group active:scale-[0.98] cursor-pointer"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
              <span className={item.color}>{item.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.sub}</p>
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  )
}

function SecuritySection() {
  const [mfaSetup, setMfaSetup]     = useState(null)
  const [otpCode, setOtpCode]       = useState('')
  const [mfaLoading, setMfaLoading] = useState(false)
  const { business } = useAuth()
  const [mfaEnabled, setMfaEnabled] = useState(business?.mfa_enabled || false)
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      <div className="lg:col-span-2">
        <Card className="border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-in fade-in duration-300 h-full">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                <Shield className="text-rose-600 w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Two-Factor Authentication (MFA)</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Protect your administrator account with a secondary TOTP security layer</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {mfaEnabled ? (
              <div className="flex items-center gap-3 text-xs font-bold px-4 py-3.5 rounded-2xl border bg-emerald-50/40 text-emerald-800 border-emerald-250 shadow-sm animate-in fade-in">
                <CheckCircle className="text-emerald-600 w-4 h-4 shrink-0" />
                <span>Multi-Factor Authentication (MFA) is active and securing your account.</span>
              </div>
            ) : !mfaSetup ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                  By enabling 2FA, you will be prompted to enter a secondary verification code generated by an authenticator application (such as Google Authenticator, Authy, or Microsoft Authenticator) whenever you sign in.
                </p>
                <Button
                  onClick={async () => {
                    setMfaLoading(true)
                    try {
                      const res = await api.post('/auth/setup-mfa')
                      setMfaSetup(res.data)
                    } catch {
                      toast.error('Failed to setup MFA')
                    } finally {
                      setMfaLoading(false)
                    }
                  }}
                  disabled={mfaLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 h-10 rounded-xl shadow-md shadow-indigo-200/50 hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
                >
                  {mfaLoading ? 'Generating Secret...' : 'Setup Authenticator app'}
                </Button>
              </div>
            ) : (
              <div className="space-y-5 animate-in slide-in-from-bottom-2">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-slate-600 space-y-4">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Step 1: Scan this QR code in your authenticator app
                  </p>
                  <div className="flex justify-center bg-white p-4 rounded-xl border border-slate-150 w-fit mx-auto shadow-sm">
                    <img src={mfaSetup.qr_code} alt="QR Code" className="w-40 h-40" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Step 2: Enter secret manually if scan fails
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px] font-bold tracking-wider select-all">{mfaSetup.secret}</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Step 3: Verification Code
                  </Label>
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    className="w-48 px-3 py-2 text-sm rounded-xl border-slate-200 tracking-widest font-mono text-center font-bold text-slate-800 focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-500 transition-all h-10 shadow-sm"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <Button
                  onClick={async () => {
                    if (otpCode.length !== 6) return toast.error('Enter a 6-digit code')
                    setMfaLoading(true)
                    try {
                      await api.post('/auth/verify-mfa', { code: otpCode })
                      setMfaEnabled(true)
                      setMfaSetup(null)
                      toast.success('MFA enabled successfully!')
                      navigate('/settings?tab=security', { replace: true })
                    } catch {
                      toast.error('Invalid code. Try again.')
                    } finally {
                      setMfaLoading(false)
                    }
                  }}
                  disabled={mfaLoading || otpCode.length !== 6}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 h-11 rounded-xl shadow-md shadow-indigo-200/50 hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-40 cursor-pointer text-xs uppercase tracking-wider"
                >
                  {mfaLoading ? 'Verifying...' : 'Verify & Enable MFA'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right side: Security recommendations */}
      <div>
        <Card className="border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden p-6 flex flex-col gap-4">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-500" /> Security Guide
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Use a dedicated app",
                desc: "Authenticator apps generate secure verification codes offline directly on your mobile device."
              },
              {
                title: "Store secret tokens safely",
                desc: "If you switch devices or lose access, you will need your backup secret code to restore access."
              },
              {
                title: "Do not share codes",
                desc: "MFA tokens are highly sensitive and should never be shared under any circumstances."
              }
            ].map((tip, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">{tip.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function PlanSection({ business }) {
  const currentPlan = (business?.plan || 'free').toLowerCase()

  const plans = [
    {
      key: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for personal sites and testing.',
      features: ['1 website', '1,000 consents/month', 'Basic banner', 'Email support'],
      buttonText: 'Current Plan',
    },
    {
      key: 'starter',
      name: 'Starter',
      price: '$19',
      description: 'Great for growing websites and startups.',
      features: ['5 websites', '10,000 consents/month', 'Custom branding', 'Audit logs'],
      buttonText: 'Upgrade',
    },
    {
      key: 'pro',
      name: 'Pro',
      price: '$49',
      description: 'Advanced compliance for professional sites.',
      features: ['Unlimited websites', '100,000 consents/month', 'DigiLocker verification', 'Priority support'],
      buttonText: 'Upgrade',
      popular: true,
    },
    {
      key: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'SLA guarantees and custom integrations.',
      features: ['Unlimited everything', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
      buttonText: 'Contact Sales',
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in duration-400 text-left">
      {plans.map((p) => {
        const isActive = p.key === currentPlan;
        return (
          <Card 
            key={p.key} 
            className={`flex flex-col relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              isActive 
                ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500 bg-gradient-to-b from-white to-indigo-50/10' 
                : p.popular 
                  ? 'border-indigo-400 shadow-md ring-1 ring-indigo-400 bg-gradient-to-b from-white to-indigo-50/5' 
                  : 'border-slate-200 shadow-sm bg-white'
            }`}
          >
            {isActive && (
              <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-650 text-white uppercase tracking-wider shadow border-transparent">
                Active
              </span>
            )}
            {p.popular && !isActive && (
              <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-600 text-white uppercase tracking-wider shadow border-transparent">
                Popular
              </span>
            )}

            <CardHeader className="pb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{p.name}</div>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-black tracking-tight text-slate-900">{p.price}</span>
                {p.price !== 'Custom' && <span className="text-xs font-bold text-slate-550 ml-1">/mo</span>}
              </div>
              <p className="text-xs mt-2 leading-relaxed text-slate-500">{p.description}</p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col pt-4 border-t border-slate-100/50">
              <div className="space-y-3.5 mb-6 flex-1">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-xs font-semibold">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isActive 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : p.popular && !isActive 
                          ? 'bg-indigo-55 text-indigo-600' 
                          : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      <CheckCircle className="w-3 h-3" />
                    </div>
                    <span className="text-slate-600">{f}</span>
                  </div>
                ))}
              </div>

              <Button
                disabled={isActive}
                variant={p.popular && !isActive ? 'default' : 'outline'}
                className={`w-full py-2 h-9 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-305 ${
                  isActive 
                    ? 'bg-indigo-50 border border-indigo-100 text-indigo-400 cursor-not-allowed shadow-none' 
                    : p.popular 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow hover:shadow-md' 
                      : 'border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 bg-transparent'
                }`}
              >
                {p.buttonText}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function RoutingSection() {
  return (
    <Card className="border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-in fade-in duration-300">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-5 text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Zap className="text-indigo-600 w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Grievance Routing</CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">Configure grievance auto-assignment and callback rules</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <GrievanceRoutingSettings />
      </CardContent>
    </Card>
  )
}

// ─── Main Settings component ──────────────────────────────────────────────────
export default function Settings() {
  const { business, login } = useAuth()
  const navigate   = useNavigate()
  const { search } = useLocation()

  const queryTab   = new URLSearchParams(search).get('tab')
  const activeTab  = VALID_TABS.includes(queryTab) ? queryTab : 'profile'

  const meta = {
    profile:  { title: 'Profile',           sub: 'Your business information and account details' },
    security: { title: 'Security & MFA',    sub: 'Two-factor authentication settings'            },
    plan:     { title: 'Plan & Billing',    sub: 'Your subscription and feature access'          },
    routing:  { title: 'Grievance Routing', sub: 'Configure routing and assignment rules'        },
  }[activeTab]

  const goTo = (tab) => navigate(`/settings?tab=${tab}`, { replace: true })

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500 text-left">
      {/* Page header — title changes per section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
          {meta.title}
        </h1>
        <p className="text-sm text-slate-500 mt-2 font-medium">{meta.sub}</p>
      </div>

      {/* Render only the active section — no tab bar */}
      {activeTab === 'profile'  && <ProfileSection  business={business} login={login} onGoTo={goTo} />}
      {activeTab === 'security' && <SecuritySection />}
      {activeTab === 'plan'     && <PlanSection     business={business} />}
      {activeTab === 'routing'  && <RoutingSection  />}
    </div>
  )
}