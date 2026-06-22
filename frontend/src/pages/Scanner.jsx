import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { scanAnyUrl, getWebsites, checkShadowCookies } from '../api/websites'
import { Globe, Shield, Search, Check, Cookie, Info, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select'

// ── Scanner limitation note ───────────────────────────────────────────────────
function ScannerLimitationNote({ cookiesFound }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/20 overflow-hidden transition-all duration-300 shadow-sm">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-3.5 p-5 text-left hover:bg-indigo-50/40 transition-colors focus:outline-none"
      >
        <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="text-indigo-650 w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-extrabold text-indigo-950 m-0">About scanner accuracy</p>
          <p className="text-xs text-indigo-850 mt-1 leading-relaxed font-medium">
            {cookiesFound} cookies detected. Some advertising cookies may not appear in automated scans — this is normal and affects all scanner tools.
          </p>
        </div>
        <span className="text-indigo-400 shrink-0 mt-1.5 bg-white border border-indigo-100 p-1 rounded-lg">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-6 pt-2 border-t border-indigo-50/80 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid gap-4 mt-2">
            <div className="flex gap-3">
              <span className="text-indigo-600 shrink-0 font-extrabold text-sm mt-0.5 bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center font-sans">1</span>
              <div>
                <p className="text-xs font-bold text-indigo-950 m-0 uppercase tracking-wider">Ad-network cookies require real user signals</p>
                <p className="text-xs text-slate-650 mt-1 leading-relaxed font-medium">
                  Cookies set by Google Ad Exchange, DoubleClick, and similar ad networks
                  (e.g. <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-800 border border-slate-200">__gads</code>,{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-800 border border-slate-200">_eoi</code>,{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-800 border border-slate-200">IDE</code>)
                  are only created when a real ad auction takes place. Ad servers actively reject
                  automated browsers to prevent click fraud, so these cookies cannot be captured
                  by any automated scanner.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-600 shrink-0 font-extrabold text-sm mt-0.5 bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center font-sans">2</span>
              <div>
                <p className="text-xs font-bold text-indigo-950 m-0 uppercase tracking-wider">Some cookies are session- or user-specific</p>
                <p className="text-xs text-slate-650 mt-1 leading-relaxed font-medium">
                  Certain analytics identifiers (e.g.{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-800 border border-slate-200">_ga_XXXXXXX</code>)
                  are tied to a returning visitor's existing browser profile and history.
                  A scanner visiting the site for the first time will receive fewer of these
                  than a user with an established session.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-600 shrink-0 font-extrabold text-sm mt-0.5 bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center font-sans">3</span>
              <div>
                <p className="text-xs font-bold text-indigo-950 m-0 uppercase tracking-wider">What this means for compliance</p>
                <p className="text-xs text-slate-655 mt-1 leading-relaxed font-medium">
                  The cookies detected here represent what a <strong>new visitor</strong> will
                  encounter on their first page load — the legally relevant baseline for
                  GDPR / DPDPA consent. You can supplement the list manually in your website's
                  Cookie Manager if you know ad cookies are present on your site.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shadow Cookie Detection Panel ────────────────────────────────────────────
function ShadowCookiePanel({ websitesList, shadowCookies, shadowLoading, selectedWebsiteId, setSelectedWebsiteId, onCheck, shadowChecked }) {
  return (
    <div className="mt-8 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200 shadow-lg shadow-amber-50/40 overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-amber-50/50 via-amber-50/20 to-white border-b border-amber-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
          <AlertTriangle className="text-amber-600 w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="m-0 text-base font-extrabold text-amber-950">Shadow Cookie Audit</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
              Security
            </span>
          </div>
          <p className="m-0 mt-0.5 text-xs font-semibold text-slate-500 leading-relaxed">
            Audit and identify unlisted cookies active on your live pages that violate compliance policies.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 flex flex-col sm:flex-row gap-4 sm:items-end border-b border-slate-50">
        <div className="flex-1 text-left">
          <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">Select registered website</label>
          <Select
            value={selectedWebsiteId}
            onValueChange={setSelectedWebsiteId}
          >
            <SelectTrigger className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 h-11 text-xs text-left focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-200 flex items-center justify-between font-bold text-slate-850 hover:border-slate-350 shadow-sm">
              <SelectValue placeholder="Choose a Website" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-150 rounded-xl shadow-lg p-1">
              {websitesList.map(w => (
                <SelectItem key={w.id} value={w.id} className="rounded-lg text-xs font-semibold py-2">
                  {w.domain || w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={onCheck}
          disabled={shadowLoading || !selectedWebsiteId}
          className="flex items-center justify-center gap-2 px-6 py-2.5 h-11 rounded-xl border border-transparent font-extrabold text-xs transition-all duration-305 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 hover:shadow-lg cursor-pointer"
        >
          {shadowLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Auditing website...</>
          ) : (
            <><Shield className="w-4 h-4" /> Check for Shadow Cookies</>
          )}
        </button>
      </div>

      {/* Results — undeclared found */}
      {!shadowLoading && shadowChecked && shadowCookies.length > 0 && (
        <div className="p-6 pt-5 animate-in slide-in-from-bottom-2 text-left">
          <div className="bg-red-50/60 border border-red-100 rounded-2xl p-5 mb-5 flex items-start gap-4 shadow-inner">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="text-red-650 w-4 h-4" />
            </div>
            <div>
              <p className="m-0 text-sm font-extrabold text-red-955">⚠ {shadowCookies.length} Undeclared Cookie{shadowCookies.length > 1 ? 's' : ''} Active</p>
              <p className="m-0 mt-1.5 text-xs font-semibold text-red-800 leading-relaxed">
                These active cookies are setting tracking tokens on visitor devices but are not declared in your Cookie Consent Manager. Add them instantly to maintain legal compliance.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {shadowCookies.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Cookie className="text-amber-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="m-0 text-sm font-extrabold text-slate-800 font-mono">{c.name}</p>
                    <p className="m-0 mt-1 text-xs font-semibold text-slate-500">
                      {c.provider || 'Unknown provider'} · <span className="text-indigo-650">{c.category || 'Uncategorized'}</span> · {c.expiry || '—'}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold px-3 py-1 rounded-full bg-red-50 text-red-750 border border-red-100 uppercase tracking-wider shadow-sm">
                  Undeclared
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results — all clean */}
      {!shadowLoading && shadowChecked && shadowCookies.length === 0 && selectedWebsiteId && (
        <div className="p-6 pt-5 animate-in slide-in-from-bottom-2 text-left">
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center shrink-0">
              <Check className="text-emerald-750 w-5 h-5" />
            </div>
            <div>
              <p className="m-0 text-sm font-extrabold text-emerald-950">Website Compliant & Verified</p>
              <p className="m-0 mt-0.5 text-xs font-semibold text-emerald-800">
                All active cookies detected on your website domain match declared records. Excellent!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Idle state */}
      {!selectedWebsiteId && !shadowLoading && (
        <div className="p-10 text-center">
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-slate-350" />
          </div>
          <p className="text-sm font-extrabold text-slate-800">Select Website to Audit</p>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            Select a registered domain above to audit its compliance and identify hidden tracker risks.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Scan type definitions ─────────────────────────────────────────────────────
const SCAN_TYPES = [
  {
    id: "full_site",
    label: "Full Site Scan",
    icon: <Globe className="w-6 h-6" />,
    badge: "Comprehensive",
    description: "Crawls all pages of the website recursively to detect every cookie set across the entire domain.",
    options: [
      { id: "max_pages", label: "Max Pages to Crawl", type: "select", values: ["50", "100", "250", "500", "Unlimited"], default: "100" },
      { id: "depth", label: "Crawl Depth", type: "select", values: ["2", "3", "4", "5", "Unlimited"], default: "3" },
      { id: "include_subdomains", label: "Include Subdomains", type: "toggle", default: false },
      { id: "follow_redirects", label: "Follow Redirects", type: "toggle", default: true },
      { id: "respect_robots", label: "Respect robots.txt", type: "toggle", default: true },
      { id: "js_render", label: "JavaScript Rendering", type: "toggle", default: true },
    ],
    urlPlaceholder: "e.g. https://www.example.com",
    urlLabel: "Root Domain URL",
    colorClass: "blue",
  },
]

const categoryColor = {
  Analytics:  { bg: "bg-blue-50/70 border-blue-150/70", text: "text-blue-750" },
  Necessary:  { bg: "bg-emerald-50/70 border-emerald-150/70", text: "text-emerald-750" },
  Marketing:  { bg: "bg-rose-50/70 border-rose-150/70", text: "text-rose-750" },
  Functional: { bg: "bg-purple-50/70 border-purple-150/70", text: "text-purple-750" },
  Unknown:    { bg: "bg-slate-50/70 border-slate-150/70", text: "text-slate-700" },
}

export default function Scanner() {
  const [selectedType, setSelectedType] = useState("full_site")
  const [url, setUrl] = useState("")
  const [optionValues, setOptionValues] = useState({})
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState(null)
  const [progress, setProgress] = useState(0)

  // Shadow cookie state
  const [shadowCookies, setShadowCookies] = useState([])
  const [shadowLoading, setShadowLoading] = useState(false)
  const [selectedWebsiteId, setSelectedWebsiteId] = useState('')
  const [websitesList, setWebsitesList] = useState([])
  const [shadowChecked, setShadowChecked] = useState(false)

  const scanType = SCAN_TYPES.find((s) => s.id === selectedType) || SCAN_TYPES[0]

  const getOption = (id, def) => (optionValues[selectedType]?.[id] ?? def)
  const setOption = (id, val) =>
    setOptionValues((prev) => ({
      ...prev,
      [selectedType]: { ...prev[selectedType], [id]: val },
    }))

  useEffect(() => {
    getWebsites()
      .then(res => {
        const sites = res.data || []
        setWebsitesList(sites)
      })
      .catch(() => {})
  }, [])

  const handleScan = async () => {
    if (!url.trim()) return
    setScanning(true)
    setResults(null)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) { clearInterval(interval); return p; }
        return p + Math.random() * 10;
      })
    }, 300)

    try {
      const rawOpts = optionValues[selectedType] || {}
      const serializedOpts = {}
      Object.entries(rawOpts).forEach(([k, v]) => {
        if (typeof v === 'string' && v.toLowerCase() === 'unlimited') {
          serializedOpts[k] = 'unlimited'
        } else if (typeof v === 'string' && !isNaN(v) && v !== '') {
          serializedOpts[k] = parseInt(v, 10)
        } else {
          serializedOpts[k] = v
        }
      })
      const res = await scanAnyUrl({
        url: url.trim(),
        scan_type: selectedType,
        options: serializedOpts,
      })
      clearInterval(interval)
      setProgress(100)

      const seen = new Set()
      const unique = (res.data.cookies || []).filter(c => {
        const key = `${c.name}|${c.domain || ''}|${c.path || '/'}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      const mapped = unique.map((c) => ({
        name: c.name,
        category: c.category
          ? c.category.charAt(0).toUpperCase() + c.category.slice(1).toLowerCase()
          : 'Unknown',
        provider: c.provider || 'Unknown',
        duration: c.expiry || '—',
        type: c.cookie_type || '—',
        consent: c.category?.toLowerCase() === 'necessary' ? 'Exempt' : 'Required',
        is_session: c.session === true,
        is_third_party: c.is_third_party === true,
        is_hidden: c.is_hidden === true,
        domain: c.domain || '',
      }))

      setTimeout(() => {
        setScanning(false)
        setResults(mapped)
        if (mapped.length === 0) {
          toast('No cookies found on this URL.', { icon: 'ℹ️' })
        } else {
          toast.success(`Found ${mapped.length} cookie${mapped.length !== 1 ? 's' : ''}!`)
        }
      }, 400)

    } catch (err) {
      clearInterval(interval)
      setScanning(false)
      setProgress(0)
      toast.error(err?.response?.data?.detail || 'Scan failed. Please check the URL and try again.')
    }
  }

  const handleShadowCheck = async () => {
    if (!selectedWebsiteId) return
    setShadowLoading(true)
    setShadowChecked(false)
    setShadowCookies([])
    try {
      const res = await checkShadowCookies(selectedWebsiteId)
      setShadowCookies(res.data.shadow_cookies || [])
      setShadowChecked(true)
      toast.success('Shadow cookie detection complete!')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to detect shadow cookies.')
    } finally {
      setShadowLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
          Cookie Scanner
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xl font-medium">
          Configure, scan, and audit cookies dynamically across your website to ensure complete legal compliance.
        </p>
      </div>

      {/* Main Panel */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-100/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-gradient-to-b from-slate-50/70 to-white border-b border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner transition-transform duration-300 hover:rotate-3">
              {scanType.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{scanType.label}</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-505 mt-0.5 leading-relaxed">{scanType.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="text-left">
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{scanType.urlLabel}</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400">
                  <Globe className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={scanType.urlPlaceholder}
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-550/10 focus:border-indigo-650 transition-all duration-300 shadow-inner placeholder:text-slate-400 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Scan Options</h3>
              <div className="grid gap-3">
                {scanType.options.map((opt) => {
                  const isChecked = getOption(opt.id, opt.default)
                  return (
                    <div key={opt.id} className="flex items-center justify-between p-4 bg-slate-50/30 rounded-2xl border border-slate-100 hover:bg-slate-50/80 hover:border-slate-200/80 transition-all duration-300 shadow-sm group">
                      <div className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{opt.label}</div>
                      {opt.type === "toggle" ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={isChecked} onChange={(e) => setOption(opt.id, e.target.checked)} />
                          <div className="w-11 h-6 bg-slate-200/85 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-indigo-600 shadow-sm"></div>
                        </label>
                      ) : (
                        <Select
                          value={getOption(opt.id, opt.default)}
                          onValueChange={(val) => setOption(opt.id, val)}
                        >
                          <SelectTrigger className="w-32 bg-white border border-slate-200 rounded-xl px-4 py-2.5 h-10 text-xs text-left focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 flex items-center justify-between font-bold text-slate-755 hover:border-slate-350 shadow-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-slate-150 rounded-xl shadow-lg p-1">
                            {opt.values.map((v) => (
                              <SelectItem key={v} value={v} className="rounded-lg text-xs font-semibold py-2">
                                {v}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              {scanning ? (
                <div className="animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 mb-4 text-indigo-600 font-extrabold text-sm">
                    <Loader2 className="w-5 h-5 animate-spin" /> Scanning website in progress…
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-indigo-550 via-indigo-600 to-violet-600 rounded-full transition-all duration-300 ease-out" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <div className="text-xs font-bold text-slate-500 mt-2 text-right">{Math.round(Math.min(progress, 100))}% complete</div>
                </div>
              ) : (
                <button
                  className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/60 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-800 transition-all duration-300 active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none cursor-pointer animate-in fade-in"
                  onClick={handleScan}
                  disabled={!url.trim()}
                >
                  <Search className="w-4 h-4" /> Start {scanType.label}
                </button>
              )}
            </div>
          </div>

          {/* Right: Info card */}
          <div className="text-left">
            <div className="bg-gradient-to-br from-indigo-50/30 to-indigo-100/10 border border-indigo-150/40 rounded-2xl p-6 shadow-sm">
              <div className="font-bold text-xs uppercase tracking-wider text-indigo-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-550" /> What this scan detects
              </div>
              <div className="grid gap-3.5">
                {[
                  "First-party cookies",
                  "Third-party cookies",
                  "Session & persistent cookies",
                  "Cookie categories",
                  "Cookie duration & expiry",
                  "All pages across domain",
                  "Sitemap coverage",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-650" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Results */}
      {results && (
        <div className="bg-white border border-slate-200/60 shadow-xl shadow-slate-100/40 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-400">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/20 text-left">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-indigo-550" /> Scan Results
                </h2>
                <span className="px-2.5 py-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full uppercase tracking-wider">Completed</span>
              </div>
              <p className="text-sm text-slate-500 mt-1 font-semibold">Found {results.length} cookies · {scanType.label}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Necessary", "Analytics", "Marketing", "Functional"].map((cat) => {
                const count = results.filter((r) => r.category === cat).length
                if (!count) return null
                return (
                  <span key={cat} className={`px-3 py-1.5 text-xs font-bold rounded-xl border ${categoryColor[cat]?.bg} ${categoryColor[cat]?.text}`}>
                    {count} {cat}
                  </span>
                )
              })}
            </div>
          </div>

          {/* 6-metric summary bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-slate-100 divide-y divide-x divide-slate-100 lg:divide-y-0">
            {[
              { label: "Total",       value: results.length,                              color: "text-indigo-650", bg: "bg-indigo-50/10" },
              { label: "First-Party", value: results.filter(r => !r.is_third_party).length, color: "text-emerald-650", bg: "bg-emerald-50/10" },
              { label: "Third-Party", value: results.filter(r => r.is_third_party).length,  color: "text-rose-650", bg: "bg-rose-50/10" },
              { label: "Hidden",      value: results.filter(r => r.is_hidden).length,      color: "text-violet-650", bg: "bg-violet-50/10" },
              { label: "Session",     value: results.filter(r => r.is_session).length,     color: "text-amber-655", bg: "bg-amber-50/10" },
              { label: "Persistent",  value: results.filter(r => !r.is_session).length,    color: "text-slate-800", bg: "bg-slate-50/10" },
            ].map((m, i) => (
              <div 
                key={i} 
                className={`p-5 text-center ${m.bg} hover:bg-white hover:shadow-inner transition-all duration-300 flex flex-col items-center justify-center group`}
              >
                <div className={`text-2xl font-black ${m.color} group-hover:scale-110 transition-transform duration-300`}>{m.value}</div>
                <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>

          {results.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold">No cookies detected on this URL.</div>
          ) : (
            <>
              <div className="overflow-x-auto text-left">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/70 text-left text-[11px] font-bold text-slate-505 uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4 font-extrabold">Cookie Name</th>
                      <th className="px-6 py-4 font-extrabold">Category</th>
                      <th className="px-6 py-4 font-extrabold">Provider</th>
                      <th className="px-6 py-4 font-extrabold">Duration</th>
                      <th className="px-6 py-4 font-extrabold">Party</th>
                      <th className="px-6 py-4 font-extrabold">Hidden</th>
                      <th className="px-6 py-4 font-extrabold">Consent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white/50">
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors duration-250 group">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 text-xs tracking-tight">{r.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${categoryColor[r.category]?.bg || 'bg-slate-55 border-slate-200'} ${categoryColor[r.category]?.text || 'text-slate-700'}`}>
                            {r.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-650 text-xs font-semibold">{r.provider}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">{r.duration}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${r.is_third_party ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                            {r.is_third_party ? '3rd Party' : '1st Party'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${r.is_hidden ? 'bg-violet-50 border-violet-100 text-violet-750' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            {r.is_hidden ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${r.consent === 'Exempt' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-750'}`}>
                            {r.consent}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-slate-50/10 border-t border-slate-100 text-left">
                <ScannerLimitationNote cookiesFound={results.length} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Shadow Cookie Detection — always visible below results */}
      <ShadowCookiePanel
        websitesList={websitesList}
        shadowCookies={shadowChecked ? shadowCookies : []}
        shadowLoading={shadowLoading}
        selectedWebsiteId={selectedWebsiteId}
        setSelectedWebsiteId={(id) => { setSelectedWebsiteId(id); setShadowChecked(false); setShadowCookies([]) }}
        onCheck={handleShadowCheck}
        shadowChecked={shadowChecked}
      />
    </div>
  )
}