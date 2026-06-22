import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getWebsite, getWidgetSettings, updateWidgetSettings, updateWebsite, scanWebsite } from '../api/websites'
import { getConsentStats } from '../api/consents'
import toast from 'react-hot-toast'
import { Copy, Check, FileText, Cookie, ArrowLeft, Search, Webhook, Info, ChevronDown, ChevronUp, AlertCircle, ExternalLink } from 'lucide-react'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select'

const WIDGET_CDN_URL = import.meta.env.VITE_WIDGET_CDN_URL || 'https://cdn.yourdomain.com/widget.js'

// ── Scanner limitation note — shown after every scan ─────────────────────────
function ScannerLimitationNote({ cookiesFound }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-blue-100/50 transition-colors"
      >
        <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-blue-700">
            About scanner accuracy
          </p>
          <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
            {cookiesFound} cookies detected. Some advertising cookies may not appear in automated scans — this is normal and affects all scanner tools.
          </p>
        </div>
        <span className="text-blue-400 shrink-0 mt-0.5">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-blue-100">
          <div className="grid grid-cols-1 gap-3 mt-2">

            <div className="flex gap-2.5">
              <span className="text-blue-400 shrink-0 mt-0.5">①</span>
              <div>
                <p className="text-xs font-semibold text-blue-800">Ad-network cookies require real user signals</p>
                <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
                  Cookies set by Google Ad Exchange, DoubleClick, and similar ad networks
                  (e.g. <code className="bg-blue-100 px-1 rounded">__gads</code>, <code className="bg-blue-100 px-1 rounded">_eoi</code>, <code className="bg-blue-100 px-1 rounded">IDE</code>)
                  are only created when a real ad auction takes place. Ad servers actively reject
                  automated browsers to prevent click fraud, so these cookies cannot be captured
                  by any scanner — including enterprise tools like OneTrust and Cookiebot.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <span className="text-blue-400 shrink-0 mt-0.5">②</span>
              <div>
                <p className="text-xs font-semibold text-blue-800">Some cookies are session- or user-specific</p>
                <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
                  Certain analytics identifiers (e.g. <code className="bg-blue-100 px-1 rounded">_ga_XXXXXXX</code>) are
                  tied to a returning visitor's existing browser profile and history.
                  A scanner visiting the site for the first time — like a real new visitor — will
                  receive fewer of these than a user with an established session.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <span className="text-blue-400 shrink-0 mt-0.5">③</span>
              <div>
                <p className="text-xs font-semibold text-blue-800">What this means for compliance</p>
                <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
                  The cookies detected here represent what a <strong>new visitor</strong> will
                  encounter on their first page load — which is the legally relevant baseline for
                  GDPR / DPDPA consent. You can supplement the list manually in Cookie Manager
                  if you know additional ad cookies are present on your site.
                </p>
              </div>
            </div>

            <div className="mt-1 px-3 py-2 bg-white rounded-lg border border-blue-100 flex items-center justify-between">
              <p className="text-xs text-blue-700">
                Want to add cookies that weren't auto-detected?
              </p>
              <Link
                to={`cookies`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap ml-3"
              >
                Open Cookie Manager →
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default function WebsiteDetail() {
  const { id } = useParams()
  const [website, setWebsite] = useState(null)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [savingWebhook, setSavingWebhook] = useState(false)
  const [settings, setSettings] = useState(null)
  const [stats, setStats] = useState(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanElapsed, setScanElapsed] = useState(0)

  useEffect(() => {
    getWebsite(id).then(r => { setWebsite(r.data); setWebhookUrl(r.data.webhook_url || '') }).catch(() => setWebsite({}))
    getWidgetSettings(id).then(r => setSettings(r.data)).catch(() => setSettings({}))
    getConsentStats(id).then(r => setStats(r.data)).catch(() => setStats({}))
  }, [id])

  const embedCode = `<script src="${WIDGET_CDN_URL}" data-key="${website?.widget_key}"></script>`

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveWebhook = async (e) => {
    e.preventDefault()
    setSavingWebhook(true)
    try {
      await updateWebsite(id, { webhook_url: webhookUrl })
      toast.success('Webhook URL saved!')
    } catch {
      toast.error('Failed to save webhook URL')
    } finally {
      setSavingWebhook(false)
    }
  }

  const saveSettings = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateWidgetSettings(id, settings)
      toast.success('Widget settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleScan = async () => {
    setScanning(true)
    setScanResult(null)
    setScanElapsed(0)

    const timer = setInterval(() => setScanElapsed(s => s + 1), 1000)

    try {
      const res = await scanWebsite(id)
      setScanResult(res.data)
      const found = res.data.cookies_found
      const saved = res.data.new_cookies_saved
      if (saved > 0) {
        toast.success(`Found ${found} cookies — ${saved} new saved!`)
      } else {
        toast.success(`Found ${found} cookies (all already catalogued)`)
      }
    } catch {
      toast.error('Scan failed — website may be unreachable')
    } finally {
      clearInterval(timer)
      setScanning(false)
    }
  }

  if (website === null) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const elapsedLabel = scanElapsed < 60
    ? `${scanElapsed}s`
    : `${Math.floor(scanElapsed / 60)}m ${scanElapsed % 60}s`

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/websites" className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all duration-200 active:scale-95 shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {website.name || website.domain?.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '') || 'Website Detail'}
          </h2>
          {website.domain && (
            <a 
              href={website.domain.startsWith('http') ? website.domain : `https://${website.domain}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-500 hover:text-indigo-600 hover:underline flex items-center gap-1 mt-1 inline-flex transition-colors"
            >
              {website.domain}
              <ExternalLink size={13} className="opacity-60" />
            </a>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <Link to={`/websites/${id}/consents`}
          className="group flex items-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 group-hover:bg-green-100 transition-colors">
            <FileText size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.total ?? '—'}</p>
            <p className="text-sm font-medium text-gray-500">Total Consents</p>
          </div>
        </Link>

        <Link to={`/websites/${id}/cookies`}
          className="group flex items-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-100 transition-colors">
            <Cookie size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">Manage</p>
            <p className="text-sm font-medium text-gray-500">Cookie Categories</p>
          </div>
        </Link>

        <button onClick={handleScan} disabled={scanning}
          className="group flex items-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all duration-300 disabled:opacity-50 text-left w-full">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100 group-hover:bg-purple-100 transition-colors">
            {scanning
              ? <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              : <Search size={22} className="text-purple-600" />
            }
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{scanning ? 'Scanning...' : 'Scan Cookies'}</p>
            <p className="text-sm font-medium text-gray-500">{scanning ? `${elapsedLabel} elapsed` : 'Auto detect cookies'}</p>
          </div>
        </button>
      </div>

      {/* Scanning progress banner */}
      {scanning && (
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin shrink-0" />
            <div>
              <p className="font-semibold text-purple-900 text-lg">Scanning {website.domain}…</p>
              <p className="text-sm text-purple-600 mt-1">
                Opening site with a real browser and detecting cookies. Usually takes 30–90 seconds.
              </p>
            </div>
          </div>
          <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((scanElapsed / 90) * 100, 95)}%` }}
            />
          </div>
          <p className="text-sm font-medium text-purple-500 mt-3 text-right">{elapsedLabel} elapsed</p>
        </div>
      )}

      {/* Scan Results */}
      {scanResult && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 animate-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Scan Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-5">
              <p className="text-3xl font-bold text-purple-700">{scanResult.cookies_found}</p>
              <p className="text-sm font-medium text-purple-500 mt-1">Cookies Found</p>
            </div>
            <div className="bg-green-50/50 border border-green-100 rounded-xl p-5">
              <p className="text-3xl font-bold text-green-700">{scanResult.new_cookies_saved}</p>
              <p className="text-sm font-medium text-green-500 mt-1">New Cookies Saved</p>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
              <p className="text-3xl font-bold text-blue-700">{scanResult.categories?.length}</p>
              <p className="text-sm font-medium text-blue-500 mt-1">Categories</p>
            </div>
          </div>

          {/* "0 new saved" explanation */}
          {scanResult.new_cookies_saved === 0 && scanResult.cookies_found > 0 && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 flex items-start gap-3">
              <Info size={18} className="text-gray-400 shrink-0 mt-0.5" />
              <p>
                All {scanResult.cookies_found} cookies were already catalogued from a previous scan.
                Visit <Link to={`/websites/${id}/cookies`} className="text-blue-600 font-semibold hover:underline">Cookie Manager</Link> to review them.
              </p>
            </div>
          )}

          {scanResult.cookies?.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-gray-100 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-semibold text-left border-b border-gray-100 uppercase tracking-wider text-xs">
                    <th className="px-5 py-4">Cookie Name</th>
                    <th className="px-5 py-4">Provider</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {scanResult.cookies.slice(0, 15).map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-mono font-semibold text-gray-800">{c.name}</td>
                      <td className="px-5 py-3 text-gray-500">{c.provider}</td>
                      <td className="px-5 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          c.category === 'analytics' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          c.category === 'marketing' ? 'bg-red-50 text-red-700 border border-red-200' :
                          c.category === 'necessary' ? 'bg-green-50 text-green-700 border border-green-200' :
                          'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                          {c.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{c.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {scanResult.cookies.length > 15 && (
                <div className="bg-gray-50 px-5 py-3 text-sm text-gray-500 border-t border-gray-100 flex items-center justify-between">
                  <span>Showing 15 of {scanResult.cookies.length} cookies</span>
                  <Link to={`/websites/${id}/cookies`} className="text-blue-600 font-semibold hover:underline">View all in Cookie Manager &rarr;</Link>
                </div>
              )}
            </div>
          )}

          {/* ── Professional scanner limitation note ── */}
          <ScannerLimitationNote cookiesFound={scanResult.cookies_found} />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">All detected cookies saved to Cookie Manager automatically.</p>
            <Link to={`/websites/${id}/cookies`}
              className="bg-purple-600 text-white font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-purple-700 shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]">
              Open Cookie Manager
            </Link>
          </div>
        </div>
      )}

      {/* Embed Code */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Embed Script</h3>
        <p className="text-sm text-gray-500 mb-4">
          Copy and paste this into the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs">&lt;head&gt;</code> of your website.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
          <code className="text-gray-800 text-sm font-mono break-all leading-relaxed">{embedCode}</code>
          <button onClick={copyEmbed}
            className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors active:scale-95 shadow-sm">
            {copied ? <><Check size={16} className="text-green-600"/> Copied</> : <><Copy size={16} /> Copy</>}
          </button>
        </div>
        {!import.meta.env.VITE_WIDGET_CDN_URL && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p>Set <code className="bg-white px-1.5 py-0.5 rounded font-mono text-xs shadow-sm">VITE_WIDGET_CDN_URL</code> in your <code>.env</code> file to use the correct widget URL.</p>
          </div>
        )}
      </div>

      {/* DF Webhook */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Webhook size={20} className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Data Fiduciary Webhook</h3>
        </div>
        <p className="text-sm text-gray-500 mb-5 ml-13 pl-1">
          When a user withdraws consent, a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800">POST</code> request
          will be sent to this URL with the withdrawal details. Leave blank to disable.
        </p>
        <form onSubmit={saveWebhook} className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            placeholder="https://your-system.com/webhooks/consent-withdrawal"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
          />
          <button type="submit" disabled={savingWebhook}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-sm hover:shadow hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 active:scale-[0.98] shrink-0">
            {savingWebhook ? 'Saving...' : 'Save URL'}
          </button>
        </form>
        <div className="mt-5 bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Payload sent on withdrawal:</p>
          <pre className="text-xs font-mono text-gray-600 bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto">
{`{
  "event": "consent.withdrawn",
  "widget_key": "...",
  "visitor_id": "...",
  "reason": "...",
  "withdrawn_at": "...",
  "website_domain": "..."
}`}
          </pre>
        </div>
      </div>

      {/* Banner Settings */}
      {settings && Object.keys(settings).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Banner Settings</h3>
          <form onSubmit={saveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Title', key: 'title' },
              { label: 'Accept Button Text', key: 'accept_btn_text' },
              { label: 'Reject Button Text', key: 'reject_btn_text' },
              { label: 'Customize Button Text', key: 'customize_btn_text' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                <input type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  value={settings[key] || ''}
                  onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                />
              </div>
            ))}

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none leading-relaxed"
                value={settings.description || ''}
                onChange={e => setSettings({ ...settings, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
              <Select
                value={settings.position || 'bottom'}
                onValueChange={(val) => setSettings({ ...settings, position: val })}
              >
                <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 h-11 text-sm text-left focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 flex items-center justify-between">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-150 rounded-xl shadow-md p-1">
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {['background_color', 'button_color', 'text_color'].map(key => (
                <div key={key} className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider text-center sm:text-left">
                    {key.replace('_color', '').replace('_', ' ')}
                  </label>
                  <div className="relative">
                    <input type="color"
                      className="absolute opacity-0 w-full h-full cursor-pointer inset-0"
                      value={settings[key] || '#000000'}
                      onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                    />
                    <div className="w-full h-11 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 px-3 bg-white pointer-events-none">
                      <div className="w-5 h-5 rounded-md border border-gray-200 shadow-sm shrink-0" style={{ backgroundColor: settings[key] || '#000000' }} />
                      <span className="text-xs font-mono text-gray-600 uppercase flex-1">{settings[key] || '#000000'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sm:col-span-2 flex justify-end mt-4 pt-6 border-t border-gray-100">
              <button type="submit" disabled={saving}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-sm hover:shadow hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 active:scale-[0.98]">
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}