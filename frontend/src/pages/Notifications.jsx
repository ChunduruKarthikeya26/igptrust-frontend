import { useEffect, useState } from 'react'
import { Bell, ShieldAlert, Cookie, CalendarCheck, RefreshCw, CheckCircle, XCircle, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {}
}

const EVENT_META = {
  DPO_OVERDUE_ALERT:   { label: 'Overdue Grievance Alert', color: '#dc2626', bg: '#fef2f2', icon: ShieldAlert },
  SHADOW_COOKIE_ALERT: { label: 'Shadow Cookie Alert',     color: '#d97706', bg: '#fffbeb', icon: Cookie },
  WEEKLY_SUMMARY:      { label: 'Weekly Summary',          color: '#2563eb', bg: '#eff6ff', icon: CalendarCheck },
  NEW_GRIEVANCE_DPO:   { label: 'New Grievance (DPO)',     color: '#7c3aed', bg: '#f5f3ff', icon: Bell },
  RENEWAL_REMINDER:    { label: 'Renewal Reminder',        color: '#059669', bg: '#f0fdf4', icon: Bell },
}

function AlertCard({ alert }) {
  const meta = EVENT_META[alert.event_type] || {
    label: alert.event_type, color: '#6b7280', bg: '#f9fafb', icon: Bell
  }
  const Icon = meta.icon
  const sent = alert.sent_at ? new Date(alert.sent_at) : null

  return (
    <Card className="bg-card border border-slate-100 shadow-xs hover:shadow-sm transition-all duration-200">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-2xs border border-slate-100/50"
             style={{ background: meta.bg }}>
          <Icon size={16} style={{ color: meta.color }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 truncate">{alert.subject}</p>
            {alert.status === 'sent' ? (
              <CheckCircle size={15} className="text-green-500 shrink-0" />
            ) : (
              <XCircle size={15} className="text-red-400 shrink-0" />
            )}
          </div>
          
          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] font-medium border-none px-2 py-0.5 rounded-full"
                   style={{ background: meta.bg, color: meta.color }}>
              {meta.label}
            </Badge>
            {alert.website_domain && (
              <span className="text-[11px] text-muted-foreground font-mono">{alert.website_domain}</span>
            )}
          </div>
          
          {alert.error_message && (
            <p className="text-xs text-red-500 mt-1 bg-red-50/50 rounded p-1.5 border border-red-100/30">{alert.error_message}</p>
          )}
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs font-medium text-slate-650">
            {sent ? sent.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {sent ? sent.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function TriggerCard({ icon: Icon, title, description, buttonLabel, buttonColor, onClick, loading }) {
  const isRed = buttonColor === '#dc2626'
  const borderLeft = isRed ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-500'
  const iconBg = isRed ? 'bg-red-50/70 text-red-600' : 'bg-blue-50/70 text-blue-600'
  const btnClass = isRed
    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-sm border-none rounded-xl font-semibold'
    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-none rounded-xl font-semibold'

  return (
    <Card className={`bg-card border border-y-slate-100 border-r-slate-100 ${borderLeft} shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}>
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
          </div>
        </div>
        <Button
          onClick={onClick}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 text-xs h-9 ${btnClass}`}
        >
          {loading ? (
            <RefreshCw size={12} className="animate-spin" />
          ) : (
            <Send size={12} />
          )}
          {loading ? 'Sending…' : buttonLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function Notifications() {
  const [history, setHistory]         = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [overdueLoading, setOverdueLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [filterType, setFilterType]   = useState('')

  const fetchHistory = async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch(`${API}/dpo-alerts/history?limit=100`, { headers: getHeaders() })
      const data = await res.json()
      setHistory(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load notification history')
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const triggerOverdueCheck = async () => {
    setOverdueLoading(true)
    try {
      const res  = await fetch(`${API}/dpo-alerts/check-overdue`, {
        method: 'POST', headers: getHeaders()
      })
      const data = await res.json()
      if (data.sent) {
        toast.success(`Overdue alert sent — ${data.overdue_count} grievance(s) reported`)
      } else if (data.overdue_count === 0) {
        toast.success('No overdue grievances — all on track!')
      } else {
        toast.error(data.error || 'Failed to send alert')
      }
      fetchHistory()
    } catch {
      toast.error('Failed to trigger overdue check')
    } finally {
      setOverdueLoading(false)
    }
  }

  const triggerWeeklySummary = async () => {
    setSummaryLoading(true)
    try {
      const res  = await fetch(`${API}/dpo-alerts/weekly-summary`, {
        method: 'POST', headers: getHeaders()
      })
      const data = await res.json()
      if (data.sent) {
        toast.success('Weekly summary sent to DPO!')
      } else {
        toast.error(data.error || 'Failed to send summary')
      }
      fetchHistory()
    } catch {
      toast.error('Failed to send weekly summary')
    } finally {
      setSummaryLoading(false)
    }
  }

  const filtered = filterType
    ? history.filter(h => h.event_type === filterType)
    : history

  const sentCount   = history.filter(h => h.status === 'sent').length
  const failedCount = history.filter(h => h.status === 'failed').length
  const overdueCount = history.filter(h => h.event_type === 'DPO_OVERDUE_ALERT').length
  const shadowCount  = history.filter(h => h.event_type === 'SHADOW_COOKIE_ALERT').length

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
            <p className="text-xs text-muted-foreground mt-0.5">DPO alert centre — email notifications & history</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchHistory}
              disabled={historyLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 font-semibold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 rounded-full h-9"
            >
              <RefreshCw size={13} className={historyLoading ? 'animate-spin' : ''} />
              {historyLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Sent',
              value: sentCount,
              colorClass: 'text-blue-600',
              borderLeft: 'border-l-4 border-l-blue-500',
              icon: <Send className="w-4 h-4 text-blue-500" />
            },
            {
              label: 'Failed',
              value: failedCount,
              colorClass: failedCount > 0 ? 'text-red-650 font-extrabold animate-pulse' : 'text-slate-900',
              borderLeft: 'border-l-4 border-l-red-500',
              icon: <XCircle className="w-4 h-4 text-red-500" />
            },
            {
              label: 'Overdue Alerts',
              value: overdueCount,
              colorClass: overdueCount > 0 ? 'text-rose-650 font-semibold' : 'text-slate-900',
              borderLeft: 'border-l-4 border-l-rose-500',
              icon: <ShieldAlert className="w-4 h-4 text-rose-500" />
            },
            {
              label: 'Shadow Alerts',
              value: shadowCount,
              colorClass: shadowCount > 0 ? 'text-amber-500 font-semibold' : 'text-slate-900',
              borderLeft: 'border-l-4 border-l-amber-500',
              icon: <Cookie className="w-4 h-4 text-amber-500" />
            },
          ].map(({ label, value, colorClass, borderLeft, icon }) => (
            <Card key={label} className={`shadow-xs bg-card border border-border/50 ${borderLeft} transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-2xl font-bold tracking-tight ${colorClass}`}>{value}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 shadow-2xs">
                  {icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left — trigger cards */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Manual Triggers</p>

            <TriggerCard
              icon={ShieldAlert}
              title="Check Overdue Grievances"
              description="Scan for grievances past their 30-day DPDP deadline and email the DPO immediately."
              buttonLabel="Send Overdue Alert"
              buttonColor="#dc2626"
              onClick={triggerOverdueCheck}
              loading={overdueLoading}
            />

            <TriggerCard
              icon={CalendarCheck}
              title="Weekly Compliance Summary"
              description="Send a full compliance snapshot — consent rates, grievance stats, compliance score — to the DPO."
              buttonLabel="Send Weekly Summary"
              buttonColor="#2563eb"
              onClick={triggerWeeklySummary}
              loading={summaryLoading}
            />

            {/* Auto triggers info */}
            <Card className="bg-slate-50/40 border border-slate-100 p-4 rounded-xl">
              <CardContent className="p-0 space-y-3">
                <p className="text-xs font-bold text-slate-550 uppercase tracking-wider ml-1">Auto Triggers</p>
                <div className="space-y-2.5">
                  {[
                    { icon: Bell,        color: '#7c3aed', label: 'New grievance submitted',   note: 'Fires automatically' },
                    { icon: Cookie,      color: '#d97706', label: 'Shadow cookie detected',    note: 'Fires after scan' },
                  ].map(({ icon: Icon, color, label, note }) => (
                    <div key={label} className="flex items-center gap-2.5 bg-white border border-slate-100 p-2.5 rounded-lg hover:shadow-xs transition-shadow duration-200">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                           style={{ background: color + '15' }}>
                        <Icon size={13} style={{ color }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{note}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-none font-semibold text-[10px] ml-auto flex items-center gap-1.5 h-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right — history */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between ml-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Alert History
              </p>
              
              <Select value={filterType || 'all-types'} onValueChange={v => setFilterType(v === 'all-types' ? '' : v)}>
                <SelectTrigger className="w-[180px] bg-white border-slate-200 hover:border-slate-300 font-semibold text-slate-700 h-8 rounded-lg text-xs">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All types</SelectItem>
                  {Object.entries(EVENT_META).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {historyLoading ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-slate-100">
                <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <Card className="border border-dashed border-slate-200 p-12 text-center bg-white rounded-xl">
                <CardContent className="p-0 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 border shadow-xs">
                    <Bell size={20} className="text-slate-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">No Alerts Yet</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Trigger an alert above or wait for auto-triggers to fire.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {filtered.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}