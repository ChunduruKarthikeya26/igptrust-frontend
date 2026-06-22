import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import {
  Users, UserPlus, Trash2, Shield, RefreshCw,
  ChevronDown, Mail, Key, User, Tag, Plus
} from 'lucide-react'

const ROLE_CONFIG = {
  admin:    { label: 'Admin',    cls: 'bg-blue-50 text-blue-700 border-blue-200',    desc: 'Full access' },
  dpo:      { label: 'DPO',     cls: 'bg-purple-50 text-purple-700 border-purple-200', desc: 'Data Protection Officer' },
  operator: { label: 'Operator', cls: 'bg-green-50 text-green-700 border-green-200',  desc: 'Limited access' },
  auditor:  { label: 'Auditor',  cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', desc: 'Read-only access' },
}

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.operator
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

export default function Team() {
  const { business } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [updatingRole, setUpdatingRole] = useState(null)
  const [activeTab, setActiveTab] = useState('members')

  // FIX (BUG — Team): Added confirmPassword field to prevent typo lockouts
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'operator'
  })
  const [inviting, setInviting] = useState(false)

  // Custom Roles state
  const [customRoles, setCustomRoles] = useState([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [savingRole, setSavingRole] = useState(false)
  const [deletingRole, setDeletingRole] = useState(null)

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/auth/team')
      setMembers(res.data || [])
    } catch {
      toast.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomRoles = async () => {
    setRolesLoading(true)
    try {
      const res = await api.get('/custom-roles/')
      setCustomRoles(res.data || [])
    } catch {
      toast.error('Failed to load custom roles')
    } finally {
      setRolesLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])
  useEffect(() => {
    if (activeTab === 'roles') fetchCustomRoles()
  }, [activeTab])

  const handleInvite = async () => {
    if (!form.name || !form.email || !form.password) {
      return toast.error('Name, email and password are required')
    }
    // FIX (BUG — Team): Validate passwords match before submitting
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    setInviting(true)
    try {
      const { confirmPassword, ...payload } = form
      await api.post('/auth/team/invite', payload)
      toast.success(`${form.email} added as ${form.role}`)
      setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'operator' })
      setShowInvite(false)
      fetchMembers()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to invite member')
    } finally {
      setInviting(false)
    }
  }

  const handleRoleChange = async (memberId, newRole) => {
    setUpdatingRole(memberId)
    try {
      await api.patch(`/auth/team/${memberId}/role`, { role: newRole })
      toast.success('Role updated')
      fetchMembers()
    } catch {
      toast.error('Failed to update role')
    } finally {
      setUpdatingRole(null)
    }
  }

  const handleMfaRequiredToggle = async (memberId, currentValue) => {
    try {
      await api.patch(`/auth/team/${memberId}/mfa-required`, {
        mfa_required: !currentValue
      })
      toast.success(!currentValue ? 'MFA required for this member' : 'MFA requirement removed')
      fetchMembers()
    } catch {
      toast.error('Failed to update MFA requirement')
    }
  }

  const handleDelete = async (memberId, email) => {
    if (!confirm(`Remove ${email} from your team?`)) return
    setDeleting(memberId)
    try {
      await api.delete(`/auth/team/${memberId}`)
      toast.success(`${email} removed`)
      fetchMembers()
    } catch {
      toast.error('Failed to remove member')
    } finally {
      setDeleting(null)
    }
  }

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return toast.error('Role name is required')
    setSavingRole(true)
    try {
      await api.post('/custom-roles/', { name: newRoleName.trim(), permissions: {} })
      toast.success(`Role "${newRoleName}" created`)
      setNewRoleName('')
      setShowRoleForm(false)
      fetchCustomRoles()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create role')
    } finally {
      setSavingRole(false)
    }
  }

  const handleDeleteRole = async (roleId, roleName) => {
    if (!confirm(`Delete role "${roleName}"?`)) return
    setDeletingRole(roleId)
    try {
      await api.delete(`/custom-roles/${roleId}`)
      toast.success(`Role "${roleName}" deleted`)
      fetchCustomRoles()
    } catch {
      toast.error('Failed to delete role')
    } finally {
      setDeletingRole(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Team Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your team members and their roles
          </p>
        </div>
        {activeTab === 'members' ? (
          <button
            onClick={() => setShowInvite(!showInvite)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2
                       rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={15} />
            Add Member
          </button>
        ) : (
          <button
            onClick={() => setShowRoleForm(!showRoleForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2
                       rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} />
            New Role
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${activeTab === 'members'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Users size={14} />
          Members
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${activeTab === 'roles'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Tag size={14} />
          Custom Roles
        </button>
      </div>

      {/* ── MEMBERS TAB ── */}
      {activeTab === 'members' && (
        <>
          {/* Invite Form */}
          {showInvite && (
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6 mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <UserPlus size={15} className="text-blue-600" />
                Add New Team Member
              </h3>
              {/* FIX (BUG — Team): Expanded grid to 2 cols with confirmPassword as 5th field */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Smith"
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="john@company.com"
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                  <div className="relative">
                    <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Temporary password"
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                </div>
                {/* FIX (BUG — Team): New confirm password field */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Re-enter password"
                      className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500
                                 ${form.confirmPassword && form.password !== form.confirmPassword
                                   ? 'border-red-400 bg-red-50'
                                   : 'border-gray-200'}`}
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                  <div className="relative">
                    <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="dpo">DPO — Data Protection Officer</option>
                      <option value="operator">Operator — Limited access</option>
                      <option value="auditor">Auditor — Read only</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Role descriptions */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { role: 'dpo', desc: 'Can view consents, manage grievances, access audit logs' },
                  { role: 'operator', desc: 'Can view consents and manage cookie settings' },
                  { role: 'auditor', desc: 'Read-only access to logs and reports' },
                ].map(({ role, desc }) => {
                  const cfg = ROLE_CONFIG[role]
                  return (
                    <div key={role} className={`p-3 rounded-lg border text-xs ${cfg.cls}`}>
                      <p className="font-semibold mb-0.5">{cfg.label}</p>
                      <p className="opacity-70">{desc}</p>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2
                             rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {inviting ? <RefreshCw size={13} className="animate-spin" /> : <UserPlus size={13} />}
                  {inviting ? 'Adding...' : 'Add Member'}
                </button>
                <button
                  onClick={() => setShowInvite(false)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700
                             rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Current Admin card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Account Owner</p>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {business?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{business?.name}</p>
                  <p className="text-xs text-gray-400">{business?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {business?.mfa_enabled && (
                  <span className="text-xs text-green-600 bg-green-50 border border-green-200
                                   px-2 py-0.5 rounded-full">
                    🔐 MFA On
                  </span>
                )}
                <RoleBadge role="admin" />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Team Members ({members.length})
              </p>
              <Users size={14} className="text-gray-400" />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Users size={32} className="text-gray-200 mb-3" />
                <p className="text-sm font-medium text-gray-500">No team members yet</p>
                <p className="text-xs mt-1">Add a DPO or operator to get started</p>
                <button
                  onClick={() => setShowInvite(true)}
                  className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                >
                  <UserPlus size={13} /> Add your first team member
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center
                                      text-gray-600 text-sm font-bold">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleMfaRequiredToggle(member.id, member.mfa_required)}
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all
                          ${member.mfa_required
                            ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                      >
                        {member.mfa_required ? '🔐 MFA Enforced' : 'Enforce MFA'}
                      </button>
                      {member.mfa_enabled && (
                        <span className="text-xs text-green-600 bg-green-50 border border-green-200
                                         px-2 py-0.5 rounded-full">
                          ✅ MFA On
                        </span>
                      )}
                      {/* Role change dropdown */}
                      <div className="relative">
                        <select
                          value={member.role}
                          disabled={updatingRole === member.id}
                          onChange={e => handleRoleChange(member.id, e.target.value)}
                          className="pl-2 pr-6 py-1 text-xs border border-gray-200 rounded-lg
                                     bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                                     appearance-none cursor-pointer"
                        >
                          <option value="dpo">DPO</option>
                          <option value="operator">Operator</option>
                          <option value="auditor">Auditor</option>
                        </select>
                        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2
                                                          text-gray-400 pointer-events-none" />
                      </div>
                      <RoleBadge role={member.role} />
                      <button
                        onClick={() => handleDelete(member.id, member.email)}
                        disabled={deleting === member.id}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50
                                   rounded-lg transition-all disabled:opacity-50"
                      >
                        {deleting === member.id
                          ? <RefreshCw size={14} className="animate-spin" />
                          : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RBAC info */}
          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-2">Role Permissions</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { role: 'Admin', perms: ['All access', 'Team management', 'Settings', 'Billing'] },
                { role: 'DPO', perms: ['Consents', 'Grievances', 'Audit logs', 'Analytics'] },
                { role: 'Operator', perms: ['Consent logs', 'Cookie manager', 'Renewal', 'Notifications'] },
                { role: 'Auditor', perms: ['Read-only logs', 'Export reports', 'Audit trail'] },
              ].map(({ role, perms }) => (
                <div key={role} className="bg-white rounded-lg p-3 border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 mb-1.5">{role}</p>
                  {perms.map(p => (
                    <p key={p} className="text-xs text-blue-600 flex items-center gap-1">
                      <span className="text-blue-400">✓</span> {p}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CUSTOM ROLES TAB ── */}
      {activeTab === 'roles' && (
        <div>
          {/* New Role Form */}
          {showRoleForm && (
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6 mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Tag size={15} className="text-blue-600" />
                Create Custom Role
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. Compliance Manager"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateRole()}
                  autoFocus
                />
                <button
                  onClick={handleCreateRole}
                  disabled={savingRole}
                  className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2
                             rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingRole ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={13} />}
                  {savingRole ? 'Saving...' : 'Create'}
                </button>
                <button
                  onClick={() => { setShowRoleForm(false); setNewRoleName('') }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Roles List */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Custom Roles ({customRoles.length})
              </p>
              <Tag size={14} className="text-gray-400" />
            </div>

            {rolesLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : customRoles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Tag size={32} className="text-gray-200 mb-3" />
                <p className="text-sm font-medium text-gray-500">No custom roles yet</p>
                <p className="text-xs mt-1">Create roles beyond the 4 preset ones</p>
                <button
                  onClick={() => setShowRoleForm(true)}
                  className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                >
                  <Plus size={13} /> Create your first custom role
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {customRoles.map(role => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <Tag size={14} className="text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{role.name}</p>
                        <p className="text-xs text-gray-400">Custom role</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRole(role.id, role.name)}
                      disabled={deletingRole === role.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50
                                 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingRole === role.id
                        ? <RefreshCw size={14} className="animate-spin" />
                        : <Trash2 size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-indigo-700 mb-1">About Custom Roles</p>
            <p className="text-xs text-indigo-600">
              Custom roles extend beyond the 4 preset roles (Admin, DPO, Operator, Auditor).
              When inviting a team member, custom role names can be assigned directly in the role field.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}