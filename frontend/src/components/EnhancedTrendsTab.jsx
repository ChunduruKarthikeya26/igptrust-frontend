import { useState, useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from './ui/button'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Card } from './ui/card'

const EnhancedTrendsTab = ({ trendChartData, stats, CustomTooltip }) => {
  const [viewMode, setViewMode] = useState('daily')
  const [selectedMetric, setSelectedMetric] = useState('accepted')

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const weeklyData = useMemo(() => {
    if (!trendChartData || trendChartData.length === 0) return []
    const weeks = {}
    trendChartData.forEach((day, idx) => {
      const weekNum = Math.floor(idx / 7)
      if (!weeks[weekNum]) {
        weeks[weekNum] = { week: `Week ${weekNum + 1}`, accepted: 0, rejected: 0, customized: 0 }
      }
      weeks[weekNum].accepted += day.accepted || 0
      weeks[weekNum].rejected += day.rejected || 0
      weeks[weekNum].customized += day.customized || 0
    })
    return Object.values(weeks)
  }, [trendChartData])

  const monthlyData = useMemo(() => {
    if (!trendChartData || trendChartData.length === 0) return []
    const months = {}
    trendChartData.forEach((day) => {
      const month = day.date?.split(' ')[0] || 'Unknown'
      if (!months[month]) {
        months[month] = { month, accepted: 0, rejected: 0, customized: 0 }
      }
      months[month].accepted += day.accepted || 0
      months[month].rejected += day.rejected || 0
      months[month].customized += day.customized || 0
    })
    return Object.values(months)
  }, [trendChartData])

  const chartData =
    viewMode === 'weekly' ? weeklyData :
    viewMode === 'monthly' ? monthlyData :
    trendChartData

  const currentPeriod = chartData?.[chartData.length - 1] || null
  const previousPeriod = chartData?.[chartData.length - 2] || null

  const acceptedGrowth = currentPeriod && previousPeriod ? calculateGrowth(currentPeriod.accepted, previousPeriod.accepted) : 0
  const rejectedGrowth = currentPeriod && previousPeriod ? calculateGrowth(currentPeriod.rejected, previousPeriod.rejected) : 0
  const customizedGrowth = currentPeriod && previousPeriod ? calculateGrowth(currentPeriod.customized, previousPeriod.customized) : 0

  const GrowthIndicator = ({ value, label }) => {
    const isPositive = value >= 0
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant={isPositive ? 'default' : 'destructive'}
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isPositive
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-200'
          }`}
        >
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(value)}%
        </Badge>
        <span className="text-xs text-slate-500 font-semibold">{label}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 max-w-xs grid grid-cols-3 h-9">
          <TabsTrigger value="daily" className="capitalize text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-3xs h-7">daily</TabsTrigger>
          <TabsTrigger value="weekly" className="capitalize text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-3xs h-7">weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="capitalize text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-3xs h-7">monthly</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Growth Indicators */}
      {currentPeriod && previousPeriod && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 shadow-3xs">
          <GrowthIndicator value={acceptedGrowth} label={`Accepted vs Previous ${viewMode}`} />
          <GrowthIndicator value={rejectedGrowth} label={`Rejected vs Previous ${viewMode}`} />
          <GrowthIndicator value={customizedGrowth} label={`Customized vs Previous ${viewMode}`} />
        </div>
      )}

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2">
        {['accepted', 'rejected', 'customized'].map((metric) => {
          const isActive = selectedMetric === metric
          let activeClass = ''
          if (metric === 'accepted') {
            activeClass = 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-3xs'
          } else if (metric === 'rejected') {
            activeClass = 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 shadow-3xs'
          } else {
            activeClass = 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-3xs'
          }
          return (
            <Button
              key={metric}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => setSelectedMetric(metric)}
              className={`text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer transition-all ${
                isActive
                  ? activeClass
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {metric === 'accepted' && '✓ Accepted'}
              {metric === 'rejected' && '✗ Rejected'}
              {metric === 'customized' && '⚙ Customized'}
            </Button>
          )
        })}
      </div>

      {/* Area Chart */}
      {chartData && chartData.length > 0 && (
        <Card className="bg-white border border-slate-100 rounded-xl p-5 shadow-3xs">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            {selectedMetric === 'accepted' && 'Accepted Consents Trend'}
            {selectedMetric === 'rejected' && 'Rejected Consents Trend'}
            {selectedMetric === 'customized' && 'Customized Consents Trend'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCustomized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={viewMode === 'weekly' ? 'week' : viewMode === 'monthly' ? 'month' : 'date'} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={CustomTooltip ? <CustomTooltip /> : undefined} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
              {selectedMetric === 'accepted' && <Area type="monotone" dataKey="accepted" stroke="#10B981" fill="url(#colorAccepted)" strokeWidth={2} />}
              {selectedMetric === 'rejected' && <Area type="monotone" dataKey="rejected" stroke="#EF4444" fill="url(#colorRejected)" strokeWidth={2} />}
              {selectedMetric === 'customized' && <Area type="monotone" dataKey="customized" stroke="#3B82F6" fill="url(#colorCustomized)" strokeWidth={2} />}
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* All Metrics Comparison */}
      {chartData && chartData.length > 0 && (
        <Card className="bg-white border border-slate-100 rounded-xl p-5 shadow-3xs">
          <h3 className="text-sm font-bold text-slate-700 mb-4">All Metrics Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={viewMode === 'weekly' ? 'week' : viewMode === 'monthly' ? 'month' : 'date'} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={CustomTooltip ? <CustomTooltip /> : undefined} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
              <Line type="monotone" dataKey="accepted" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="customized" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Stats Cards */}
      {currentPeriod && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card border border-border/50 border-l-4 border-l-emerald-500 rounded-xl p-4 transition-all duration-200 hover:shadow-xs">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Accepted</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600">{currentPeriod.accepted || 0}</p>
            {previousPeriod && <p className="text-xs text-emerald-600/70 font-semibold mt-1">vs {previousPeriod.accepted || 0} previous</p>}
          </Card>
          <Card className="bg-card border border-border/50 border-l-4 border-l-rose-500 rounded-xl p-4 transition-all duration-200 hover:shadow-xs">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rejected</p>
            <p className="text-2xl font-bold tracking-tight text-rose-600">{currentPeriod.rejected || 0}</p>
            {previousPeriod && <p className="text-xs text-rose-600/70 font-semibold mt-1">vs {previousPeriod.rejected || 0} previous</p>}
          </Card>
          <Card className="bg-card border border-border/50 border-l-4 border-l-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-xs">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Customized</p>
            <p className="text-2xl font-bold tracking-tight text-blue-600">{currentPeriod.customized || 0}</p>
            {previousPeriod && <p className="text-xs text-blue-600/70 font-semibold mt-1">vs {previousPeriod.customized || 0} previous</p>}
          </Card>
        </div>
      )}
    </div>
  )
}

export default EnhancedTrendsTab