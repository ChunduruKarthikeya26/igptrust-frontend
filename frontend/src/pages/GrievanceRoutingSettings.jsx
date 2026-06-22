import { useState, useEffect } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { Plus, Trash2, ToggleLeft, ToggleRight, Zap } from 'lucide-react'

const CATEGORIES = [
  { value: 'erasure_request',    label: 'Data Erasure Request'    },
  { value: 'data_access',        label: 'Data Access Request'     },
  { value: 'correction_request', label: 'Data Correction Request' },
  { value: 'consent_issue',      label: 'Consent Issue'           },
  { value: 'data_portability',   label: 'Data Portability'        },
  { value: 'other',              label: 'Other'                   },
  { value: 'all',                label: 'All Categories (catchall)' },
]

const PRIORITIES = [
  { value: '',         label: 'Keep as submitted' },
  { value: 'low',      label: 'Low'               },
  { value: 'normal',   label: 'Normal'            },
  { value: 'high',     label: 'High'              },
  { value: 'critical', label: 'Critical'          },
]

const CATEGORY_COLORS = {
  erasure_request:    { bg: 'rgba(234,34,97,0.08)',   text: '#ea2261' },
  data_access:        { bg: 'rgba(83,58,253,0.08)',    text: '#533afd' },
  correction_request: { bg: 'rgba(83,58,253,0.08)',    text: '#533afd' },
  consent_issue:      { bg: 'rgba(220,38,38,0.08)',    text: '#dc2626' },
  data_portability:   { bg: 'rgba(21,190,83,0.10)',    text: '#108c3d' },
  other:              { bg: 'rgba(100,116,141,0.10)',  text: '#64748d' },
  all:                { bg: 'rgba(83,58,253,0.06)',    text: '#533afd' },
}

export default function GrievanceRoutingSettings() {
  const [rules, setRules]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState({
    category:        '',
    assign_to_email: '',
    assign_to_name:  '',
    priority:        '',
  })

  const fetchRules = async () => {
    try {
      const res = await axios.get('/grievance-routing')
      setRules(res.data)
    } catch {
      toast.error('Failed to load routing rules')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRules() }, [])

  const usedCategories = rules.map(r => r.category)
  const availableCategories = CATEGORIES.filter(c => !usedCategories.includes(c.value))

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.category || !form.assign_to_email) {
      toast.error('Category and email are required')
      return
    }
    setSaving(true)
    try {
      await axios.post('/grievance-routing', form)
      toast.success('Routing rule added')
      setShowForm(false)
      setForm({ category: '', assign_to_email: '', assign_to_name: '', priority: '' })
      fetchRules()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add rule')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (rule) => {
    try {
      await axios.patch(`/grievance-routing/${rule.id}`, { is_active: !rule.is_active })
      setRules(rules.map(r => r.id === rule.id ? { ...r, is_active: !r.is_active } : r))
      toast.success(rule.is_active ? 'Rule disabled' : 'Rule enabled')
    } catch {
      toast.error('Failed to update rule')
    }
  }

  const handleDelete = async (rule) => {
    const cat = CATEGORIES.find(c => c.value === rule.category)
    if (!confirm(`Delete routing rule for "${cat?.label || rule.category}"?`)) return
    try {
      await axios.delete(`/grievance-routing/${rule.id}`)
      setRules(rules.filter(r => r.id !== rule.id))
      toast.success('Rule deleted')
    } catch {
      toast.error('Failed to delete rule')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-medium" style={{ color: '#061b31', letterSpacing: '-0.2px' }}>
            Grievance Auto-Routing
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#64748d' }}>
            Automatically assign incoming grievances to team members based on category
          </p>
        </div>
        {availableCategories.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded transition-all"
            style={{ background: '#533afd', borderRadius: '4px' }}
          >
            <Plus size={15} />
            Add Rule
          </button>
        )}
      </div>

      {/* How it works banner */}
      <div className="flex items-start gap-3 p-4 rounded mb-6 border border-[#e5edf5]"
        style={{ background: 'linear-gradient(135deg, #f8f8ff 0%, #f0eeff 100%)' }}>
        <Zap size={16} className="mt-0.5 shrink-0" style={{ color: '#533afd' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: '#061b31' }}>How auto-routing works</p>
          <p className="text-xs mt-1" style={{ color: '#64748d' }}>
            When a visitor submits a grievance, the system checks its category and automatically assigns it
            to the designated team member. They receive an email notification instantly.
            If no rule matches, the grievance stays unassigned for manual review.
          </p>
        </div>
      </div>

      {/* Add rule form */}
      {showForm && (
        <form onSubmit={handleAdd}
          className="border border-[#533afd] rounded p-5 mb-6"
          style={{ background: '#fafafe', borderRadius: '6px', boxShadow: '0px 4px 12px rgba(83,58,253,0.08)' }}>
          <p className="text-sm font-medium mb-4" style={{ color: '#061b31' }}>New Routing Rule</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#273951' }}>
                Grievance Category *
              </label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded border border-[#e5edf5] bg-white"
                style={{ color: '#061b31' }}
                required
              >
                <option value="">Select category...</option>
                {availableCategories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#273951' }}>
                Override Priority
              </label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded border border-[#e5edf5] bg-white"
                style={{ color: '#061b31' }}
              >
                {PRIORITIES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#273951' }}>
                Assign To (Email) *
              </label>
              <input
                type="email"
                value={form.assign_to_email}
                onChange={e => setForm({ ...form, assign_to_email: e.target.value })}
                placeholder="team@yourcompany.com"
                className="w-full px-3 py-2 text-sm rounded border border-[#e5edf5]"
                style={{ color: '#061b31' }}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#273951' }}>
                Assignee Name
              </label>
              <input
                type="text"
                value={form.assign_to_name}
                onChange={e => setForm({ ...form, assign_to_name: e.target.value })}
                placeholder="Data Team"
                className="w-full px-3 py-2 text-sm rounded border border-[#e5edf5]"
                style={{ color: '#061b31' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white rounded transition-all"
              style={{ background: saving ? '#94a3b8' : '#533afd', borderRadius: '4px' }}
            >
              {saving ? 'Saving...' : 'Save Rule'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm rounded border border-[#e5edf5] transition-all hover:bg-gray-50"
              style={{ color: '#64748d', borderRadius: '4px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Rules list */}
      {loading ? (
        <p className="text-sm text-center py-8" style={{ color: '#94a3b8' }}>Loading rules...</p>
      ) : rules.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#e5edf5] rounded"
          style={{ borderRadius: '6px' }}>
          <Zap size={24} className="mx-auto mb-3" style={{ color: '#b9b9f9' }} />
          <p className="text-sm font-medium" style={{ color: '#061b31' }}>No routing rules yet</p>
          <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
            Add a rule to automatically assign grievances to your team
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map(rule => {
            const cat = CATEGORIES.find(c => c.value === rule.category)
            const col = CATEGORY_COLORS[rule.category] || CATEGORY_COLORS.other
            return (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 border border-[#e5edf5] rounded bg-white"
                style={{
                  borderRadius: '6px',
                  opacity: rule.is_active ? 1 : 0.5,
                  boxShadow: '0px 2px 8px rgba(50,50,93,0.04)',
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Category badge */}
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded"
                    style={{ background: col.bg, color: col.text, borderRadius: '4px' }}
                  >
                    {cat?.label || rule.category}
                  </span>

                  {/* Arrow */}
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>→</span>

                  {/* Assignee */}
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#061b31' }}>
                      {rule.assign_to_name || rule.assign_to_email}
                    </p>
                    {rule.assign_to_name && (
                      <p className="text-xs" style={{ color: '#94a3b8' }}>{rule.assign_to_email}</p>
                    )}
                  </div>

                  {/* Priority override */}
                  {rule.priority && (
                    <span
                      className="text-xs px-2 py-0.5 rounded border"
                      style={{ color: '#64748d', borderColor: '#e5edf5', borderRadius: '4px' }}
                    >
                      Priority: {rule.priority}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(rule)}
                    className="p-1.5 rounded hover:bg-gray-50 transition-all"
                    title={rule.is_active ? 'Disable rule' : 'Enable rule'}
                  >
                    {rule.is_active
                      ? <ToggleRight size={20} style={{ color: '#533afd' }} />
                      : <ToggleLeft size={20} style={{ color: '#94a3b8' }} />
                    }
                  </button>
                  <button
                    onClick={() => handleDelete(rule)}
                    className="p-1.5 rounded hover:bg-red-50 transition-all"
                    title="Delete rule"
                  >
                    <Trash2 size={15} style={{ color: '#94a3b8' }} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Coverage summary */}
      {rules.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#e5edf5]">
          <p className="text-xs" style={{ color: '#94a3b8' }}>
            {rules.filter(r => r.is_active).length} of {CATEGORIES.length} categories covered by active rules.
            {availableCategories.length > 0 && (
              <span style={{ color: '#533afd' }}>
                {' '}Uncovered: {availableCategories.map(c => c.label).join(', ')}.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}