import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWebsites, createWebsite, deleteWebsite, updateWebsite } from '../api/websites'
import { 
  Plus, Trash2, Eye, Cookie, FileText, Globe, AlertCircle, 
  Copy, Check, Code, Grid, List, Search, X, ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Websites() {
  const [websites, setWebsites] = useState([])
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  
  // Modals & Panels State
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeCodeSite, setActiveCodeSite] = useState(null)
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'active', 'inactive'
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('websites_view_mode') || 'grid'
  })

  // Form states
  const [form, setForm] = useState({ domain: '', name: '' })
  const [loading, setLoading] = useState(false)
  
  // Interactive UI Action indicators
  const [copiedKeyId, setCopiedKeyId] = useState(null)
  const [copiedCodeId, setCopiedCodeId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const fetchWebsites = () => {
    setFetching(true)
    setFetchError(null)
    getWebsites()
      .then(res => {
        const sorted = [...(res.data ?? [])].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        setWebsites(sorted)
      })
      .catch(err => {
        const msg =
          err?.response?.data?.detail ||
          err?.message ||
          'Failed to load websites'
        setFetchError(msg)
        console.error('[Websites] fetch error:', err)
      })
      .finally(() => setFetching(false))
  }

  useEffect(() => {
    fetchWebsites()
  }, [])

  useEffect(() => {
    localStorage.setItem('websites_view_mode', viewMode)
  }, [viewMode])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Normalize domain URL if user typed it with protocol
    let domainVal = form.domain.trim()
    if (!domainVal.startsWith('http://') && !domainVal.startsWith('https://')) {
      // Just ensure it's a domain form, API requires domain string
    }

    try {
      await createWebsite({
        domain: domainVal,
        name: form.name.trim() || undefined
      })
      toast.success('Website added successfully!')
      setShowAddModal(false)
      setForm({ domain: '', name: '' })
      fetchWebsites()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add website')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, domain) => {
    if (!confirm(`Delete ${domain}? This cannot be undone.`)) return
    try {
      await deleteWebsite(id)
      toast.success('Website deleted successfully')
      fetchWebsites()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleToggleActive = async (site) => {
    if (togglingId) return
    setTogglingId(site.id)
    const updatedStatus = !site.is_active
    try {
      await updateWebsite(site.id, { is_active: updatedStatus })
      toast.success(`${site.domain} is now ${updatedStatus ? 'Active' : 'Inactive'}`)
      setWebsites(prev => prev.map(w => w.id === site.id ? { ...w, is_active: updatedStatus } : w))
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to toggle status')
    } finally {
      setTogglingId(null)
    }
  }

  const handleCopyKey = (id, key) => {
    navigator.clipboard.writeText(key)
    setCopiedKeyId(id)
    toast.success('Widget Key copied!')
    setTimeout(() => setCopiedKeyId(null), 2000)
  }

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeId(id)
    toast.success('Integration snippet copied!')
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  // Calculate Metrics
  const totalSites = websites.length
  const activeWidgets = websites.filter(s => s.is_active).length
  const integrationHealth = totalSites > 0 ? ((activeWidgets / totalSites) * 100).toFixed(0) : 0

  // Filter list
  const filteredWebsites = websites.filter(site => {
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = site.domain.toLowerCase().includes(query) || (site.name && site.name.toLowerCase().includes(query))
    
    if (statusFilter === 'active') return matchesSearch && site.is_active
    if (statusFilter === 'inactive') return matchesSearch && !site.is_active
    return matchesSearch
  })

  // Format date helper
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    })
  }

  // CDN widget script URL
  const widgetScriptTag = (key) => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    return `<script src="${apiBase}/widget/consent-widget.js" data-key="${key}"></script>`
  }

  return (
    <>
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black">Websites</h2>
          <p className="text-sm sm:text-base font-medium text-slate-500 mt-1 max-w-2xl leading-relaxed">Configure your domains, active widgets, and compliance scanners</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#533afd] text-white px-5 py-2.5
                     rounded-full text-sm font-semibold shadow-sm hover:bg-[#4434d4]
                     transition-all duration-300 active:scale-[0.98]"
        >
          <Plus size={16} /> Add Website
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div 
          className="relative bg-white rounded-xl p-6 border border-[#e5edf5] border-l-4 border-l-slate-400 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-center text-left"
        >
          <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
            <Globe className="h-4 w-4 text-slate-100" />
          </div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 pr-10">
            Total Websites
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#061b31] mb-1" style={{ fontFeatureSettings: '"tnum"' }}>
            {totalSites}
          </div>
          <div className="text-[11px] text-gray-400">
            Configured platforms
          </div>
        </div>

        {/* Card 2 */}
        <div 
          className="relative bg-white rounded-xl p-6 border border-[#e5edf5] border-l-4 border-l-emerald-500 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-center text-left"
        >
          <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 pr-10">
            Active Widgets
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600 mb-1" style={{ fontFeatureSettings: '"tnum"' }}>
            {activeWidgets}
          </div>
          <div className="text-[11px] text-gray-400">
            Live consent managers
          </div>
        </div>

        {/* Card 3 */}
        <div 
          className="relative bg-white rounded-xl p-6 border border-[#e5edf5] border-l-4 border-l-indigo-500 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-center text-left"
        >
          <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Code className="h-4 w-4 text-[#533afd]" />
          </div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 pr-10">
            Integration Health
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#533afd] mb-3" style={{ fontFeatureSettings: '"tnum"' }}>
            {integrationHealth}%
          </div>
          <div className="w-full max-w-[80%] bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#533afd] h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${integrationHealth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Panel (Search, Filter, View Toggles) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e5edf5] shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search websites by name or domain..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm
                         focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#533afd] transition-all duration-200"
            />
          </div>

          {/* Status Quick Filters */}
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200/50">
            {['all', 'active', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-white text-[#533afd] shadow-xs border border-gray-200/30'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="hidden md:flex items-center gap-3 self-auto border-t-0 pt-0 border-gray-100">
          <span className="text-xs text-gray-400 font-medium">Layout:</span>
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200/50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-white text-[#533afd] shadow-xs border border-gray-200/30'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-[#533afd] shadow-xs border border-gray-200/30'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Card View"
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main List Area */}
      {fetching ? (
        <div className="bg-white rounded-xl border border-[#e5edf5] p-24 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium animate-pulse">Retrieving websites from backend...</p>
        </div>
      ) : fetchError ? (
        <div className="bg-white rounded-xl border border-red-100 p-20 text-center animate-in fade-in">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-900 font-semibold text-lg mb-2">Failed to load websites</p>
          <p className="text-red-500 text-sm font-mono mb-6 max-w-md mx-auto bg-red-50/50 p-3 rounded-xl border border-red-100">{fetchError}</p>
          <button
            onClick={fetchWebsites}
            className="bg-white border border-gray-200 text-gray-700 font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      ) : filteredWebsites.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5edf5] p-24 text-center animate-in fade-in">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100/80">
            <Globe size={36} className="text-gray-400" />
          </div>
          <h3 className="text-[#061b31] font-semibold text-lg mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No matching websites found' : 'Get started with cookie consent'}
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try modifying your search keywords or adjust the status filters above.'
              : 'Add your business website to begin collecting DPDPA compliant cookie consent approvals.'}
          </p>
          <button
            onClick={() => {
              if (searchQuery || statusFilter !== 'all') {
                setSearchQuery('')
                setStatusFilter('all')
              } else {
                setShowAddModal(true)
              }
            }}
            className="bg-[#533afd] text-white font-semibold text-sm px-6 py-2.5
                       rounded-lg hover:bg-[#4434d4] transition-all duration-200 active:scale-[0.98]"
          >
            {searchQuery || statusFilter !== 'all' ? 'Clear Filters' : 'Add First Website'}
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Enhanced Table View */
        <div className="bg-white rounded-xl border border-[#e5edf5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50/80 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-[#e5edf5] whitespace-nowrap">
                  <th className="px-6 py-4">Website</th>
                  <th className="px-6 py-4">Domain URL</th>
                  <th className="px-6 py-4">Widget Key</th>
                  <th className="px-6 py-4">Integration Code</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 whitespace-nowrap">
                {filteredWebsites.map(site => (
                  <tr key={site.id} className="hover:bg-gray-50/50 transition-colors group">
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#533afd] border border-blue-100/50">
                          <Globe size={16} />
                        </div>
                        <span className="font-semibold text-[#061b31]">
                          {site.name || site.domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')}
                        </span>
                      </div>
                    </td>

                    {/* Domain */}
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                      <a 
                        href={site.domain.startsWith('http') ? site.domain : `https://${site.domain}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:underline  items-center gap-1 inline-flex hover:text-indigo-600 transition-colors"
                      >
                        {site.domain}
                        <ExternalLink size={12} className="opacity-40" />
                      </a>
                    </td>

                    {/* Widget Key */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2.5 py-1.5 bg-gray-50 rounded-md border border-gray-200 text-gray-500 text-xs font-mono select-all">
                          {site.widget_key?.slice(0, 14)}...
                        </code>
                        <button
                          onClick={() => handleCopyKey(site.id, site.widget_key)}
                          className="p-1 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-100 transition-all"
                          title="Copy Key"
                        >
                          {copiedKeyId === site.id ? <Check size={14} className="text-green-600 animate-in zoom-in" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>

                    {/* Integration Code */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setActiveCodeSite(site)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#533afd] hover:text-[#4434d4] bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 px-2.5 py-1.5 rounded-lg transition-all"
                      >
                        <Code size={13} />
                        Get Code
                      </button>
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleActive(site)}
                          disabled={togglingId === site.id}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            site.is_active ? 'bg-green-600' : 'bg-gray-200'
                          } ${togglingId === site.id ? 'opacity-40 cursor-wait' : ''}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                              site.is_active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-semibold ${site.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                          {site.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                      {formatDate(site.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/websites/${site.id}`}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#533afd] hover:bg-indigo-50 transition-all duration-200"
                          title="View website detail">
                          <Eye size={15} />
                        </Link>
                        <Link to={`/websites/${site.id}/cookies`}
                          className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200"
                          title="Manage cookies">
                          <Cookie size={15} />
                        </Link>
                        <Link to={`/websites/${site.id}/consents`}
                          className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                          title="Consent logs">
                          <FileText size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(site.id, site.domain)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                          title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Premium Grid / Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map(site => (
            <div
              key={site.id}
              className="bg-white rounded-xl border border-[#e5edf5] overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200"
              style={{ 
                boxShadow: '0px 15px 35px rgba(23,23,23,0.06), 0px 3px 6px rgba(50,50,93,0.02)'
              }}
            >
              {/* Card Header */}
              <div className="p-6 pb-4 border-b border-gray-50 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#533afd] group-hover:scale-105 transition-transform duration-200">
                      <Globe size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#533afd] transition-colors line-clamp-1">
                        {site.name || site.domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')}
                      </h4>
                      <a 
                        href={site.domain.startsWith('http') ? site.domain : `https://${site.domain}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-gray-400 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                      >
                        {site.domain}
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                  
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleActive(site)}
                    disabled={togglingId === site.id}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      site.is_active ? 'bg-green-600' : 'bg-gray-200'
                    } ${togglingId === site.id ? 'opacity-40 cursor-wait' : ''}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                        site.is_active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Key Code area */}
                <div className="mt-5 space-y-2.5">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Widget Key</label>
                    <div className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-150 p-2 rounded-lg mt-1 font-mono text-xs text-gray-600">
                      <span className="truncate">{site.widget_key}</span>
                      <button
                        onClick={() => handleCopyKey(site.id, site.widget_key)}
                        className="text-gray-400 hover:text-indigo-600 hover:bg-gray-150 p-1 rounded-md transition-colors"
                        title="Copy Key"
                      >
                        {copiedKeyId === site.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 font-mono">
                    <span>Added: {formatDate(site.created_at)}</span>
                    <button
                      onClick={() => setActiveCodeSite(site)}
                      className="flex items-center gap-1 text-[#533afd] hover:text-[#4434d4] font-semibold transition-colors"
                    >
                      <Code size={13} />
                      Install Widget
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="bg-gray-50/80 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                  site.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${site.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  {site.is_active ? 'Active' : 'Inactive'}
                </span>

                <div className="flex items-center gap-1.5">
                  <Link to={`/websites/${site.id}`}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-[#533afd] hover:border-indigo-200 transition-all duration-150"
                    title="View details">
                    <Eye size={15} />
                  </Link>
                  <Link to={`/websites/${site.id}/cookies`}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-amber-600 hover:border-amber-200 transition-all duration-150"
                    title="Manage cookies">
                    <Cookie size={15} />
                  </Link>
                  <Link to={`/websites/${site.id}/consents`}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-green-600 hover:border-green-200 transition-all duration-150"
                    title="Consent logs">
                    <FileText size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(site.id, site.domain)}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-200 transition-all duration-150"
                    title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* MODAL: Get Integration Code */}
      {activeCodeSite && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-xl max-w-2xl w-full border border-gray-100 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#533afd]">
                  <Code size={16} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Install Consent Widget</h3>
              </div>
              <button 
                onClick={() => setActiveCodeSite(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Integrate cookie consent management onto <strong className="text-gray-900 font-semibold">{activeCodeSite.domain}</strong> in seconds. 
                  Copy the following script tag and paste it as high as possible in the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">&lt;head&gt;</code> element of your website layout.
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 font-mono text-xs text-gray-800 dark:text-slate-100 overflow-x-auto shadow-inner">
                <pre className="pr-12 text-left whitespace-pre-wrap word-break-all leading-relaxed">
                  {widgetScriptTag(activeCodeSite.widget_key)}
                </pre>
                <button
                  onClick={() => handleCopyCode(activeCodeSite.id, widgetScriptTag(activeCodeSite.widget_key))}
                  className="absolute top-3 right-3 p-2 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white rounded-md transition-all border border-gray-200 dark:border-slate-700/50"
                  title="Copy Integration Code"
                >
                  {copiedCodeId === activeCodeSite.id ? <Check size={14} className="text-green-600 animate-in zoom-in" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Steps Info */}
              <div className="space-y-3.5 border-t border-gray-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Implementation Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-semibold text-[#533afd] shrink-0 mt-0.5">1</span>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <strong>Insert in Head:</strong> Make sure the script is loaded before any other trackers or analytics scripts execute.
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-semibold text-[#533afd] shrink-0 mt-0.5">2</span>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <strong>Auto-blocking:</strong> The consent script will intercept cookie creation until user consent criteria is actively met.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => setActiveCodeSite(null)}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Website */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-xl max-w-lg w-full border border-gray-100 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-900 text-lg">Add New Website</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreate}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="domain" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Domain URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="domain"
                    type="text"
                    placeholder="e.g. example.com or app.mydomain.io"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                               focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#533afd] transition-all duration-200"
                    value={form.domain}
                    onChange={e => setForm({ ...form, domain: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-400">Do not include sub-pages (e.g. paste example.com instead of example.com/page).</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Website Name <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Company Portal"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                               focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#533afd] transition-all duration-200"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-400">Descriptive name to identify this domain in dashboards.</p>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-white
                             border border-gray-200 hover:bg-gray-50 hover:text-gray-900 
                             transition-all duration-200 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#533afd] text-white px-5 py-2 rounded-lg text-sm
                             font-semibold hover:bg-[#4434d4] shadow-sm
                             transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? 'Adding...' : 'Add Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  )
}