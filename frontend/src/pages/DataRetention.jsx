import React from 'react'
import { useState, useEffect } from 'react'
import { getWebsites } from '../api/websites'
import { getRetentionConfig, saveRetentionConfig } from '../api/retention'
import toast from 'react-hot-toast'
import { Shield, Save, Clock, Database, FileText, Users, AlertTriangle, Globe, RefreshCw } from 'lucide-react'

// Shadcn UI Imports
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

const PRESET_OPTIONS = [
  { label: '90 days', value: 90 },
  { label: '180 days', value: 180 },
  { label: '1 year', value: 365 },
  { label: '2 years', value: 730 },
  { label: '3 years', value: 1095 },
]

const FIELD_CONFIG = [
  {
    key: 'consent_days',
    label: 'Consent Records',
    description: 'How long to keep visitor consent logs',
    icon: <Database size={18} />,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'audit_days',
    label: 'Audit Logs',
    description: 'How long to keep the system audit trail',
    icon: <FileText size={18} />,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    key: 'grievance_days',
    label: 'Grievance Records',
    description: 'How long to keep complaint records',
    icon: <AlertTriangle size={18} />,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    key: 'visitor_days',
    label: 'Visitor Data',
    description: 'How long to keep visitor profiles',
    icon: <Users size={18} />,
    color: 'bg-green-50 text-green-600',
  },
]

export default function DataRetention() {
  const [websites, setWebsites] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [config, setConfig] = useState({
    consent_days: 365,
    audit_days: 730,
    grievance_days: 1095,
    visitor_days: 180,
    auto_delete: true,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showAutoDeleteWarning, setShowAutoDeleteWarning] = useState(false)

  useEffect(() => {
    getWebsites().then(res => {
      const sites = res.data || []
      setWebsites(sites)
      if (sites.length > 0) setSelectedId(sites[0].id)
    })
  }, [])

  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    getRetentionConfig(selectedId)
      .then(res => setConfig({
        consent_days:   res.data.consent_days,
        audit_days:     res.data.audit_days,
        grievance_days: res.data.grievance_days,
        visitor_days:   res.data.visitor_days,
        auto_delete:    res.data.auto_delete,
      }))
      .catch(() => toast.error('Failed to load config'))
      .finally(() => setLoading(false))
  }, [selectedId])

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveRetentionConfig(selectedId, config)
      toast.success('Retention policy saved!')
    } catch {
      toast.error('Failed to save policy')
    } finally {
      setSaving(false)
    }
  }

  const handleAutoDeleteToggle = () => {
    const newValue = !config.auto_delete
    setConfig(c => ({ ...c, auto_delete: newValue }))
    if (newValue) {
      setShowAutoDeleteWarning(true)
    } else {
      setShowAutoDeleteWarning(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Data Retention</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure how long data is kept before auto-deletion — DPDP Act §8(7)
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !selectedId}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-600 hover:text-white rounded-full text-sm font-semibold disabled:opacity-50 transition-all shadow-sm h-10 cursor-pointer shrink-0"
        >
          {saving ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {saving ? 'Saving...' : 'Save Policy'}
        </Button>
      </div>

      {/* Website selector */}
      <div className="flex items-center gap-2">
        {websites.length > 0 && (
          <Select
            value={selectedId ? String(selectedId) : ""}
            onValueChange={val => setSelectedId(val)}
          >
            <SelectTrigger className="h-10 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-3xs hover:border-slate-350 hover:bg-white text-sm font-semibold text-slate-700 w-full sm:w-[260px] transition-colors focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 data-[placeholder]:text-slate-400">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="Select website" />
              </span>
            </SelectTrigger>
            <SelectContent>
              {websites.map(site => (
                <SelectItem key={site.id} value={String(site.id)}>{site.domain}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Warning banner when auto-delete is enabled */}
      {showAutoDeleteWarning && config.auto_delete && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">
            <span className="font-semibold">Warning:</span> Auto-deletion will permanently remove records
            older than the configured periods. This action cannot be undone. Make sure your retention
            periods comply with your legal obligations before saving.
          </p>
          <button
            onClick={() => setShowAutoDeleteWarning(false)}
            className="ml-auto text-red-400 hover:text-red-600 text-xs shrink-0 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" style={{borderWidth:'3px'}} />
        </div>
      ) : (
        <div className="space-y-6">

          {/* Retention period cards — 2x2 grid */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-blue-50/60 border border-blue-105/40 rounded-xl flex items-center justify-center">
                <Clock size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Retention Periods</h3>
                <p className="text-xs text-gray-500">Set how long each data type is kept before deletion</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELD_CONFIG.map(({ key, label, description, icon, color }) => (
                <Card key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border border-current/10 ${color}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-805">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                      </div>
                    </div>
                  </div>
                  <Select
                    value={String(config[key])}
                    onValueChange={val => setConfig(c => ({ ...c, [key]: Number(val) }))}
                  >
                    <SelectTrigger className="w-full h-10 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 font-semibold text-slate-700 transition-colors focus:ring-0 focus-visible:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Card>
              ))}
            </div>
          </div>

          {/* Auto-deletion + DPDP info — 2 column row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Auto-deletion toggle */}
            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-red-50/60 border border-red-105/30 rounded-xl flex items-center justify-center">
                    <Shield size={18} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Auto-Deletion</h3>
                    <p className="text-xs text-gray-500">Automatically delete expired data every night</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50/60 rounded-xl border border-gray-100/50">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Enable automatic deletion</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Runs daily at midnight
                    </p>
                  </div>
                  <button
                    onClick={handleAutoDeleteToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                      config.auto_delete ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      config.auto_delete ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </Card>

            {/* DPDP compliance note */}
            <Card className="bg-amber-50/40 rounded-2xl border border-amber-100/70 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-amber-100/60 border border-amber-150/40 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">DPDP Compliance Note</h3>
                  <p className="text-xs text-gray-500">DPDP Act §8(7) requirements</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  Data must not be retained longer than necessary for its stated purpose
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  Grievance records should be kept for at least 1 year per DPDP guidelines
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  Audit logs must be retained for compliance verification purposes
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  Auto-deletion is recommended to avoid unnecessary data accumulation
                </li>
              </ul>
            </Card>
          </div>

        </div>
      )}
    </div>
  )
}