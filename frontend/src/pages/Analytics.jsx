import { useState, useEffect, useCallback } from 'react'
import { getWebsites } from '../api/websites'
import { getConsentStats, getConsentAnalytics } from '../api/consents'
import { downloadExport } from '../api/export'
import toast from 'react-hot-toast'
import EnhancedTrendsTab from '../components/EnhancedTrendsTab'
import { Download, Globe, BarChart3, TrendingUp, Loader, PieChart as PieChartIcon, Calendar, RotateCcw } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

// Shadcn UI Imports
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Input } from '../components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group'
import { Badge } from '../components/ui/badge'

const TABS = ['overview', 'trends', 'sources', 'methods']
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

const SOURCE_LABELS = {
  'website_banner': '🌐 Website Banner',
  'mobile_app': '📱 Mobile App',
  'api': '⚙️ API',
  'form': '📋 Form',
  'offline': '📄 Offline',
}

// Get date n days ago
const getDateNDaysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

// Get today's date
const getTodayDate = () => new Date().toISOString().split('T')[0]

// Calculate growth indicator
const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export default function Analytics() {
  const [websites, setWebsites] = useState([])
  const [selectedSite, setSelectedSite] = useState('all')
  const [useCustomDates, setUseCustomDates] = useState(false)
  const [startDate, setStartDate] = useState(getDateNDaysAgo(30))
  const [endDate, setEndDate] = useState(getTodayDate())
  const [presetDays, setPresetDays] = useState(30)
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [distributionMode, setDistributionMode] = useState('count') // count | percentage

  const handlePresetChange = (days) => {
    setUseCustomDates(false)
    setPresetDays(days)
    setStartDate(getDateNDaysAgo(days))
    setEndDate(getTodayDate())
  }

  const handleCustomDateChange = () => {
    setUseCustomDates(true)
  }

  const resetToDefault = () => {
    setUseCustomDates(false)
    setPresetDays(30)
    setStartDate(getDateNDaysAgo(30))
    setEndDate(getTodayDate())
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const sitesRes = await getWebsites()
      const sites = sitesRes.data || sitesRes || []
      setWebsites(sites)

      const siteId = selectedSite === 'all' ? null : selectedSite

      // Prepare query params based on date mode
      const queryParams = {
        siteId,
        ...(useCustomDates && {
          startDate,
          endDate,
        }),
        ...(!useCustomDates && {
          days: presetDays,
        }),
      }

      const [statsRes, analyticsRes] = await Promise.all([
        getConsentStats(siteId, startDate, endDate),
        getConsentAnalytics(siteId, presetDays, useCustomDates ? startDate : null, useCustomDates ? endDate : null),
      ])

      setStats(statsRes.data || statsRes)
      setAnalytics(analyticsRes.data || analyticsRes)
    } catch (err) {
      toast.error('Failed to load analytics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedSite, presetDays, useCustomDates, startDate, endDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleExport = async (format) => {
    setExporting(true)
    try {
      await downloadExport('analytics', format, {
        startDate: useCustomDates ? startDate : getDateNDaysAgo(presetDays),
        endDate,
        siteId: selectedSite === 'all' ? null : selectedSite,
      })
      toast.success(`Analytics exported as ${format.toUpperCase()}`)
    } catch (err) {
      toast.error(`Export failed: ${err.message}`)
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  // Calculate rates
  const calculateRates = (stats) => {
    if (!stats || stats.total === 0) {
      return { acceptance: 0, rejection: 0, customization: 0 }
    }
    return {
      acceptance: Math.round((stats.accepted_all / stats.total) * 100),
      rejection: Math.round((stats.rejected_all / stats.total) * 100),
      customization: Math.round((stats.customized / stats.total) * 100),
    }
  }

  const rates = stats ? calculateRates(stats) : { acceptance: 0, rejection: 0, customization: 0 }

  // Prepare chart data
  const statusChartData = stats ? [
    { name: 'Accepted', value: distributionMode === 'count' ? stats.accepted_all : rates.acceptance, fill: '#10B981' },
    { name: 'Rejected', value: distributionMode === 'count' ? stats.rejected_all : rates.rejection, fill: '#EF4444' },
    { name: 'Customized', value: distributionMode === 'count' ? stats.customized : rates.customization, fill: '#3B82F6' },
  ] : []

  const methodsChartData = analytics?.methods?.map(m => ({
    method: m.method || 'Unknown',
    count: m.count,
  })) || []

  const sourcesChartData = analytics?.sources?.map(s => ({
    source: SOURCE_LABELS[s.source] || s.source || 'Unknown',
    count: s.count,
  })) || []

  const trendChartData = analytics?.trend?.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    accepted: day.accepted,
    rejected: day.rejected,
    customized: day.customized,
  })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl text-xs space-y-1.5 animate-in fade-in duration-200">
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">{label}</p>
          {payload.map((item, idx) => {
            const isVal = item.name === 'value'
            const displayLabel = isVal ? 'Consents' : (item.name === 'count' ? 'Count' : item.name)
            const displayValue = isVal && distributionMode === 'percentage'
              ? `${item.value}%`
              : item.value.toLocaleString()
            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-[3px] shrink-0 inline-block" style={{ backgroundColor: item.color || item.payload.fill || '#3b82f6' }} />
                <span className="font-semibold text-slate-600 capitalize">{displayLabel}:</span>
                <span className="font-mono font-bold text-slate-900">{displayValue}</span>
              </div>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Consent trends and compliance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="flex items-center gap-1.5 h-9 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 shadow-3xs cursor-pointer disabled:opacity-50"
          >
            {exporting ? (
              <Loader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="flex items-center gap-1.5 h-9 rounded-full border border-slate-200 bg-blue-600 text-xs font-semibold text-white hover:bg-slate-50 hover:text-slate-800 shadow-3xs cursor-pointer disabled:opacity-50"
          >
            {exporting ? (
              <Loader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Site Filter */}
          <Select
            value={selectedSite ? String(selectedSite) : "all"}
            onValueChange={val => setSelectedSite(val)}
          >
            <SelectTrigger className="h-10 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-3xs hover:border-slate-350 hover:bg-white text-xs font-semibold text-slate-700 w-full sm:w-[220px] transition-colors focus:ring-0 focus-visible:ring-0 focus:ring-offset-0">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="All Sites" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {websites.map((site) => (
                <SelectItem key={site.id} value={String(site.id)}>{site.domain}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Preset Date Filter */}
          {!useCustomDates && (
            <Select
              value={String(presetDays)}
              onValueChange={val => handlePresetChange(parseInt(val))}
            >
              <SelectTrigger className="h-10 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-3xs hover:border-slate-350 hover:bg-white text-xs font-semibold text-slate-700 w-full sm:w-[160px] transition-colors focus:ring-0 focus-visible:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Preset Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Custom Date Toggle */}
          <Button
            variant={useCustomDates ? "secondary" : "outline"}
            onClick={() => setUseCustomDates(!useCustomDates)}
            className={`flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold shadow-3xs cursor-pointer ${
              useCustomDates
                ? 'bg-indigo-50 border-indigo-250 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-805'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            {useCustomDates ? 'Custom Dates (Active)' : 'Custom Dates'}
          </Button>

          {/* Reset Button */}
          {(useCustomDates || presetDays !== 30) && (
            <Button
              variant="outline"
              onClick={resetToDefault}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-3xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Reset
            </Button>
          )}
        </div>

        {/* Custom Date Inputs */}
        {useCustomDates && (
          <div className="flex flex-wrap gap-6 bg-slate-50/60 border border-slate-100 p-4 rounded-xl shadow-3xs items-center">
            <div className="flex items-center gap-2.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">From</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 shadow-3xs cursor-pointer w-[150px] h-9 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">To</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={getTodayDate()}
                className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 shadow-3xs cursor-pointer w-[150px] h-9 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-slate-500 font-semibold animate-pulse">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card border border-border/50 border-l-4 border-l-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Consents</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{stats.total.toLocaleString()}</p>
              </Card>
              <Card className="bg-card border border-border/50 border-l-4 border-l-emerald-500 rounded-xl p-4 transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Accepted</p>
                <p className="text-2xl font-bold tracking-tight text-emerald-600">{stats.accepted_all.toLocaleString()}</p>
              </Card>
              <Card className="bg-card border border-border/50 border-l-4 border-l-rose-500 rounded-xl p-4 transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Rejected</p>
                <p className="text-2xl font-bold tracking-tight text-rose-600">{stats.rejected_all.toLocaleString()}</p>
              </Card>
              <Card className="bg-card border border-border/50 border-l-4 border-l-amber-500 rounded-xl p-4 transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Customized</p>
                <p className="text-2xl font-bold tracking-tight text-amber-600">{stats.customized.toLocaleString()}</p>
              </Card>
            </div>
          )}

          {/* Tabs container */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-xl border border-slate-100 shadow-3xs overflow-hidden">
            <div className="border-b border-slate-100 px-4 bg-slate-50/25">
              <TabsList variant="line" className="-mb-px">
                <TabsTrigger value="overview" className="px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="trends" className="px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="sources" className="px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap">
                  <PieChartIcon className="w-4 h-4 mr-2" />
                  Sources
                </TabsTrigger>
                <TabsTrigger value="methods" className="px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Methods
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="p-5 border border-slate-100 shadow-3xs bg-slate-50/20">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Acceptance Rate</h3>
                      <p className="text-4xl font-extrabold text-emerald-600">
                        {rates.acceptance}%
                      </p>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {stats.accepted_all.toLocaleString()} of {stats.total.toLocaleString()} consents accepted
                      </p>
                    </Card>
                    <Card className="p-5 border border-slate-100 shadow-3xs bg-slate-50/20">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rejection Rate</h3>
                      <p className="text-4xl font-extrabold text-rose-600">
                        {rates.rejection}%
                      </p>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {stats.rejected_all.toLocaleString()} of {stats.total.toLocaleString()} consents rejected
                      </p>
                    </Card>
                  </div>

                  {/* Status Distribution Chart */}
                  {statusChartData.length > 0 && (
                    <div className="mt-8 border-t border-slate-100 pt-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-slate-700">Status Distribution</h3>
                        <ToggleGroup
                          type="single"
                          value={distributionMode}
                          onValueChange={(val) => val && setDistributionMode(val)}
                          className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 h-9"
                        >
                          <ToggleGroupItem
                            value="count"
                            className="px-3 py-1 text-xs font-semibold rounded-lg transition-all data-[state=on]:bg-white data-[state=on]:text-slate-800 data-[state=on]:shadow-3xs text-slate-500 hover:text-slate-800 h-7"
                          >
                            Count
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="percentage"
                            className="px-3 py-1 text-xs font-semibold rounded-lg transition-all data-[state=on]:bg-white data-[state=on]:text-slate-800 data-[state=on]:shadow-3xs text-slate-500 hover:text-slate-800 h-7"
                          >
                            Percentage
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={statusChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} unit={distributionMode === 'percentage' ? '%' : ''} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                              {statusChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Trends Tab */}
              {activeTab === 'trends' && (
                <EnhancedTrendsTab
                  trendChartData={trendChartData}
                  stats={stats}
                  CustomTooltip={CustomTooltip}
                />
              )}

              {/* Sources Tab */}
              {activeTab === 'sources' && sourcesChartData.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-700">Consent Sources</h3>
                  
                  {/* Bar Chart */}
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sourcesChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="source" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
                        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Table breakdown list */}
                  <div className="space-y-2 mt-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Breakdown</h4>
                    <div className="grid gap-2">
                      {sourcesChartData.map((source, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-55/40 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-3xs">
                          <span className="text-xs font-semibold text-slate-700">{source.source}</span>
                          <Badge variant="outline" className="text-xs font-bold text-slate-800 bg-white border border-slate-150 px-2.5 py-0.5 rounded-lg shadow-3xs h-6">{source.count.toLocaleString()}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Methods Tab */}
              {activeTab === 'methods' && methodsChartData.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-700">Consent Methods</h3>
                  
                  {/* Bar Chart */}
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={methodsChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="method" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
                        <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Table breakdown list */}
                  <div className="space-y-2 mt-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Breakdown</h4>
                    <div className="grid gap-2">
                      {methodsChartData.map((method, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-55/40 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-3xs">
                          <span className="text-xs font-semibold text-slate-700 capitalize">{method.method || 'Unknown'}</span>
                          <Badge variant="outline" className="text-xs font-bold text-slate-800 bg-white border border-slate-150 px-2.5 py-0.5 rounded-lg shadow-3xs h-6">{method.count.toLocaleString()}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* No Data Fallbacks */}
              {activeTab === 'trends' && trendChartData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400 font-semibold">No trend data available for the selected parameters</p>
                </div>
              )}
              {activeTab === 'sources' && sourcesChartData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <PieChartIcon className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400 font-semibold">No source data available for the selected parameters</p>
                </div>
              )}
              {activeTab === 'methods' && methodsChartData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400 font-semibold">No method data available for the selected parameters</p>
                </div>
              )}
            </div>
          </Tabs>
        </>
      )}
    </div>
  )
}
