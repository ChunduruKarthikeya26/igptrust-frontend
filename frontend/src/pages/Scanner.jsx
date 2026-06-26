import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { scanAnyUrl, getWebsites } from '../api/websites'
import { Globe, Shield, Search, Check, Cookie, Info, AlertTriangle, ChevronDown, ChevronUp, Loader2, RefreshCw, Square } from 'lucide-react'

// ── Scanner limitation note ───────────────────────────────────────────────────
function ScannerLimitationNote({ cookiesFound }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-blue-100/50 transition-colors focus:outline-none"
      >
        <Info className="text-blue-500 mt-0.5 shrink-0 w-5 h-5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-blue-900 m-0">About scanner accuracy</p>
          <p className="text-sm text-blue-700 mt-1 leading-relaxed">
            {cookiesFound} cookies detected. Some advertising cookies may not appear in automated scans — this is normal and affects all scanner tools.
          </p>
        </div>
        <span className="text-blue-400 shrink-0 mt-0.5">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-5 pt-2 border-t border-blue-100 animate-in fade-in slide-in-from-top-2">
          <div className="grid gap-4 mt-2">
            <div className="flex gap-3">
              <span className="text-blue-400 shrink-0 font-bold mt-0.5">①</span>
              <div>
                <p className="text-sm font-bold text-blue-900 m-0">Ad-network cookies require real user signals</p>
                <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                  Cookies set by Google Ad Exchange, DoubleClick, and similar ad networks
                  (e.g. <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">__gads</code>,{' '}
                  <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">_eoi</code>,{' '}
                  <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">IDE</code>)
                  are only created when a real ad auction takes place. Ad servers actively reject
                  automated browsers to prevent click fraud, so these cookies cannot be captured
                  by any automated scanner.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 shrink-0 font-bold mt-0.5">②</span>
              <div>
                <p className="text-sm font-bold text-blue-900 m-0">Some cookies are session- or user-specific</p>
                <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                  Certain analytics identifiers (e.g.{' '}
                  <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">_ga_XXXXXXX</code>)
                  are tied to a returning visitor's existing browser profile and history.
                  A scanner visiting the site for the first time will receive fewer of these
                  than a user with an established session.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 shrink-0 font-bold mt-0.5">③</span>
              <div>
                <p className="text-sm font-bold text-blue-900 m-0">What this means for compliance</p>
                <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                  The cookies detected here represent what a <strong>new visitor</strong> will
                  encounter on their first page load — the legally relevant baseline for
                  GDPR / DPDPA consent. You can supplement the list manually in your website's
                  Cookie Manager if you know additional ad cookies are present on your site.
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
function ShadowCookiePanel({ websitesList, shadowCookies, shadowLoading, selectedWebsiteId, setSelectedWebsiteId, onCheck }) {
  return (
    <div className="mt-8 bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden animate-in fade-in">
      {/* Header */}
      <div className="px-6 py-4 bg-amber-50/50 border-b border-amber-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
          <AlertTriangle className="text-amber-600 w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="m-0 text-base font-bold text-amber-900">Shadow Cookie Detection</p>
          <p className="m-0 mt-0.5 text-sm text-amber-700">Detect cookies found on your site that are NOT declared in your cookie manager</p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 flex flex-col sm:flex-row gap-4 sm:items-end border-b border-gray-50">
        <div className="flex-1">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Select registered website</label>
          <select
            value={selectedWebsiteId}
            onChange={e => setSelectedWebsiteId(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-gray-800 transition-all duration-200 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"
          >
            <option value="">Choose a Website</option>
            {websitesList.map(w => (
              <option key={w.id} value={w.id}>{w.domain || w.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onCheck}
          disabled={shadowLoading || !selectedWebsiteId}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-transparent font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm hover:shadow"
        >
          {shadowLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : <><Shield className="w-4 h-4" /> Check for Shadow Cookies</>}
        </button>
      </div>

      {/* Results — undeclared found */}
      {!shadowLoading && shadowCookies.length > 0 && (
        <div className="p-6 pt-5 animate-in slide-in-from-bottom-2">
          <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3">
            <AlertTriangle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="m-0 text-sm font-bold text-red-900">⚠ {shadowCookies.length} undeclared cookie{shadowCookies.length > 1 ? 's' : ''} found</p>
              <p className="m-0 mt-1 text-sm text-red-700">These cookies are being set on your site but are not listed in your cookie manager. Add them to stay compliant.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {shadowCookies.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-orange-50/50 border border-orange-200 rounded-xl transition-all hover:bg-orange-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Cookie className="text-orange-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="m-0 text-sm font-bold text-orange-900">{c.name}</p>
                    <p className="m-0 mt-0.5 text-xs font-medium text-orange-700">
                      {c.provider || 'Unknown provider'} · {c.category || 'Uncategorized'} · {c.expiry || '—'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">
                  Undeclared
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results — all clean */}
      {!shadowLoading && shadowCookies.length === 0 && selectedWebsiteId && onCheck && (
        <div className="p-6 pt-5 animate-in slide-in-from-bottom-2">
          <div className="bg-green-50/80 border border-green-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <Check className="text-green-600 w-5 h-5" />
            </div>
            <p className="m-0 text-sm font-bold text-green-800">
              No shadow cookies detected — all cookies are properly declared in your cookie manager.
            </p>
          </div>
        </div>
      )}

      {/* Idle state */}
      {!selectedWebsiteId && !shadowLoading && (
        <div className="p-8 text-center">
          <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto leading-relaxed">
            Select a website above and click the button to scan for undeclared cookies affecting your compliance.
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
  Analytics:  { bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  Necessary:  { bg: "bg-green-50 border-green-200", text: "text-green-700" },
  Marketing:  { bg: "bg-red-50 border-red-200", text: "text-red-700" },
  Functional: { bg: "bg-purple-50 border-purple-200", text: "text-purple-700" },
}

export default function Scanner() {
  const [selectedType, setSelectedType] = useState("full_site")
  const [url, setUrl] = useState("")
  const [optionValues, setOptionValues] = useState(() => {
    const defaults = {}
    SCAN_TYPES.forEach(st => {
      defaults[st.id] = {}
      st.options.forEach(opt => {
        defaults[st.id][opt.id] = opt.default
      })
    })
    return defaults
  })
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState(null)
  const [progress, setProgress] = useState(0)
  const [scanStartTime, setScanStartTime] = useState(null)
  const [scanTime, setScanTime] = useState(null)
  const [lastScan, setLastScan] = useState(null)
  const [scanAbortController, setScanAbortController] = useState(null)
  const [settingsChanged, setSettingsChanged] = useState(false)

  // Shadow cookie state
  const [shadowCookies, setShadowCookies] = useState([])
  const [shadowLoading, setShadowLoading] = useState(false)
  const [selectedWebsiteId, setSelectedWebsiteId] = useState('')
  const [websitesList, setWebsitesList] = useState([])
  const [shadowChecked, setShadowChecked] = useState(false)

  const scanType = SCAN_TYPES.find((s) => s.id === selectedType) || SCAN_TYPES[0]

  const getOption = (id, def) => (optionValues[selectedType]?.[id] ?? def)
  const setOption = (id, val) => {
    setOptionValues((prev) => ({
      ...prev,
      [selectedType]: { ...prev[selectedType], [id]: val },
    }))
    setSettingsChanged(true)
  }

  useEffect(() => {
    getWebsites()
      .then(res => {
        const sites = res.data || []
        setWebsitesList(sites)
      })
      .catch(() => {})
  }, [])

  const handleStopScan = () => {
    if (scanAbortController) {
      scanAbortController.abort()
    }
    setScanning(false)
    toast('Scan stopped', { icon: '🛑' })
  }

  const handleStopAndRescan = () => {
    setScanning(false)
    setProgress(0)
    setSettingsChanged(false)
    setTimeout(() => handleScan(), 100)
  }

  const handleScan = async () => {
    if (!url.trim()) return
    const scanStart = Date.now()
    const abortController = new AbortController()
    setScanAbortController(abortController)
    setScanning(true)
    setResults(null)
    setProgress(0)
    setScanTime(null)
    setSettingsChanged(false)
    setScanning(true)

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
      }, { signal: abortController.signal })
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
        const elapsed = ((Date.now() - scanStart) / 1000).toFixed(1)
        setScanTime(elapsed)
        setScanning(false)
        setResults(mapped)
        const scanMeta = { url: url.trim(), type: selectedType, count: mapped.length, ts: Date.now() }
        setLastScan(scanMeta)
        if (mapped.length === 0) {
          toast('No cookies found on this URL.', { icon: 'ℹ️' })
        } else {
          toast.success(`Found ${mapped.length} cookies in ${elapsed}s!`)
        }
      }, 400)

    } catch (err) {
      clearInterval(interval)
      setScanning(false)
      setProgress(0)
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        toast.error(err?.response?.data?.detail || 'Scan failed. Please check the URL and try again.')
      }
    }
  }

  const handleRescan = () => {
    if (lastScan) {
      setUrl(lastScan.url)
      handleScan()
    }
  }

  const handleClear = () => {
    if (window.confirm('Clear all scan results?')) {
      setResults(null)
      setScanTime(null)
      setLastScan(null)
      setUrl('')
      setProgress(0)
      toast.success('Results cleared')
    }
  }

  const handleShadowCheck = async () => {
    if (!selectedWebsiteId) return toast.error('Select a registered website first')
    setShadowLoading(true)
    setShadowCookies([])
    setShadowChecked(false)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/scanner/shadow/${selectedWebsiteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Shadow check failed')
      setShadowCookies(data.shadow_cookies || [])
      setShadowChecked(true)
      if (data.shadow_count === 0) {
        toast.success('No shadow cookies — all clean!')
      } else {
        toast.error(`${data.shadow_count} undeclared cookie(s) detected!`)
      }
    } catch (err) {
      toast.error(err.message || 'Shadow check failed')
    } finally {
      setShadowLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cookie Scanner</h1>
        <p className="text-sm text-gray-500 mt-1">Configure options to run a full scan and detect cookies across your entire website.</p>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-blue-50/50 border-b border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            {scanType.icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{scanType.label}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{scanType.description}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Left Column: Main Form */}
          <div>
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">{scanType.urlLabel}</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={scanType.urlPlaceholder}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Scan Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scanType.options.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-semibold text-gray-700">{opt.label}</div>
                    {opt.type === "toggle" ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={getOption(opt.id, opt.default)} onChange={(e) => setOption(opt.id, e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <select
                        value={getOption(opt.id, opt.default)}
                        onChange={(e) => setOption(opt.id, e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-gray-700 appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
                      >
                        {opt.values.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              {scanning ? (
                <div className="animate-in fade-in">
                  {settingsChanged && (
                    <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl animate-in fade-in">
                      <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold">
                        <AlertTriangle className="w-4 h-4" /> Settings changed — rescan to apply new options
                      </div>
                      <button
                        onClick={handleStopAndRescan}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Re-scan
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-blue-600 font-bold text-sm">
                      <Loader2 className="w-5 h-5 animate-spin" /> Scanning in progress…
                    </div>
                    <button
                      onClick={handleStopScan}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors border border-red-200"
                    >
                      <Square className="w-4 h-4 fill-current" /> Stop Scan
                    </button>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <div className="text-xs font-semibold text-gray-500 mt-2 text-right">{Math.round(Math.min(progress, 100))}% complete</div>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-sm hover:shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleScan}
                    disabled={!url.trim()}
                  >
                    <Search className="w-4 h-4" /> Start {scanType.label}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information Sidebar */}
          <div>
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-4">What's included in this scan?</h3>
              <div className="grid gap-3">
                {[
                  "First-party cookies",
                  "Third-party cookies",
                  "Session & persistent cookies",
                  "Cookie categories",
                  "Cookie duration & expiry",
                  "All pages across domain",
                  "Sitemap coverage",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm font-medium text-blue-800">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Scan Info Bar */}
      {lastScan && scanTime && (
        <div className="bg-green-50/80 border border-green-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="text-sm text-green-800">
            <strong>Last scan:</strong> {lastScan.url} — <strong>{lastScan.count} cookies</strong> — ⏱ {scanTime}s
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleRescan}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-full transition-all active:scale-95"
            >
               Rescan
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-full transition-all active:scale-95"
            >
               Clear
            </button>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {results && (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-gray-500" /> Scan Results
                </h2>
                <span className="px-2.5 py-1 text-[11px] font-bold bg-green-100 text-green-700 border border-green-200 rounded-full uppercase tracking-wider">Completed</span>
              </div>
              <p className="text-sm text-gray-500 mt-1 font-medium">Found {results.length} cookies · {scanType.label}{scanTime !== null && scanTime !== undefined && <span className="ml-2 text-green-600 font-bold"> · ⏱ {scanTime}s</span>}</p>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", borderBottom: "1.5px solid #e2e8f0" }}>
            {[
              { label: "Total",       value: results.length,                              color: "#2563eb", bg: "#eff6ff" },
              { label: "First-Party", value: results.filter(r => !r.is_third_party).length, color: "#15803d", bg: "#f0fdf4" },
              { label: "Third-Party", value: results.filter(r => r.is_third_party).length,  color: "#b91c1c", bg: "#fef2f2" },
              { label: "Hidden",      value: results.filter(r => r.is_hidden).length,      color: "#7e22ce", bg: "#faf5ff" },
              { label: "Session",     value: results.filter(r => r.is_session).length,     color: "#92400e", bg: "#fffbeb" },
              { label: "Persistent",  value: results.filter(r => !r.is_session).length,    color: "#0f172a", bg: "#f8fafc" },
            ].map((m, i) => (
              <div key={i} style={{ padding: "14px 8px", textAlign: "center", background: m.bg, borderRight: i < 5 ? "1px solid #e2e8f0" : "none" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {results.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">No cookies detected on this URL.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6 py-4">Cookie Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Provider</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Party</th>
                      <th className="px-6 py-4">Hidden</th>
                      <th className="px-6 py-4">Consent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 font-mono font-bold text-gray-800">{r.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${categoryColor[r.category]?.bg || 'bg-gray-50 border-gray-200'} ${categoryColor[r.category]?.text || 'text-gray-700'}`}>
                            {r.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{r.provider}</td>
                        <td className="px-6 py-4 text-gray-500">{r.duration}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${r.is_third_party ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                            {r.is_third_party ? '3rd' : '1st'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${r.is_hidden ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                            {r.is_hidden ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${r.consent === 'Exempt' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                            {r.consent}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50/50 border-t border-gray-100">
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
      />
    </div>
  )
}