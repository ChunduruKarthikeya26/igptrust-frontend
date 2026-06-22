import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getCategories, createCategory, deleteCategory,
  getCookies, createCookie, deleteCookie
} from '../api/cookies'
import { Plus, Trash2, ChevronDown, ChevronRight, ArrowLeft, Cookie, Eye, Shield, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORY_COLORS = {
  Analytics: 'bg-blue-100 text-blue-600',
  Marketing: 'bg-red-100 text-red-600',
  Necessary: 'bg-green-100 text-green-600',
  Functional: 'bg-gray-100 text-gray-600',
}

function CookieDetailModal({ cookie, onClose }) {
  if (!cookie) return null
  const rows = [
    { label: 'Name',          value: cookie.name },
    { label: 'Value',         value: cookie.value || 'N/A', mono: true },
    { label: 'Domain',        value: cookie.domain || 'N/A' },
    { label: 'Path',          value: cookie.path || '/' },
    { label: 'Expires',       value: cookie.expiry || 'Session' },
    { label: 'Size',          value: cookie.size != null ? cookie.size : 'N/A' },
    { label: 'HttpOnly',      value: cookie.http_only ? 'Yes' : 'No' },
    { label: 'Secure',        value: cookie.secure ? 'Yes' : 'No' },
    { label: 'Session',       value: cookie.session ? 'Yes' : 'No' },
    { label: 'Priority',      value: cookie.priority || 'N/A' },
    { label: 'Source Scheme', value: cookie.source_scheme || 'N/A' },
    { label: 'Same Party',    value: cookie.same_party ? 'Yes' : 'No' },
    { label: 'SameSite',      value: cookie.same_site || 'N/A' },
    { label: 'Category',      value: cookie.category || 'Other' },
    { label: 'Provider',      value: cookie.provider || 'N/A' },
    { label: 'Purpose',       value: cookie.purpose || 'N/A' },
  ]
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 font-mono text-sm">{cookie.name}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                ${CATEGORY_COLORS[cookie.category?.charAt(0).toUpperCase() + cookie.category?.slice(1)]
                  || 'bg-gray-100 text-gray-600'}`}>
                {cookie.category || 'N/A'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Rows */}
        <div className="p-5">
          {rows.map(({ label, value, mono }) => (
            <div
              key={label}
              className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0"
            >
              <span className="text-xs font-medium text-gray-500 w-32 shrink-0">{label}</span>
              <span className={`text-xs text-right text-gray-800 break-all max-w-[200px] ${mono ? 'font-mono' : ''}`}>
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CookieManager() {
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [expanded, setExpanded] = useState({})
  const [cookies, setCookies] = useState({})
  const [showCatForm, setShowCatForm] = useState(false)
  const [showCookieForm, setShowCookieForm] = useState({})
  const [catForm, setCatForm] = useState({ name: '', description: '', is_required: false })
  const [cookieForm, setCookieForm] = useState({})
  const [selectedCookie, setSelectedCookie] = useState(null)

  const fetchCategories = () =>
    getCategories(id).then(r => setCategories(r.data)).catch(() => {})

  useEffect(() => { fetchCategories() }, [id])

  const toggleExpand = async (catId) => {
    const next = !expanded[catId]
    setExpanded(p => ({ ...p, [catId]: next }))
    if (next && !cookies[catId]) {
      const r = await getCookies(catId)
      setCookies(p => ({ ...p, [catId]: r.data }))
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    try {
      await createCategory(id, catForm)
      toast.success('Category added!')
      setShowCatForm(false)
      setCatForm({ name: '', description: '', is_required: false })
      fetchCategories()
    } catch {
      toast.error('Failed to add category')
    }
  }

  const handleDeleteCategory = async (catId, name) => {
    if (!confirm(`Delete category "${name}"?`)) return
    try {
      await deleteCategory(catId)
      toast.success('Category deleted')
      fetchCategories()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleCreateCookie = async (e, catId) => {
    e.preventDefault()
    try {
      await createCookie(catId, cookieForm[catId] || {})
      toast.success('Cookie added!')
      setShowCookieForm(p => ({ ...p, [catId]: false }))
      const r = await getCookies(catId)
      setCookies(p => ({ ...p, [catId]: r.data }))
    } catch {
      toast.error('Failed to add cookie')
    }
  }

  const handleDeleteCookie = async (cookieId, catId) => {
    try {
      await deleteCookie(cookieId)
      toast.success('Cookie deleted')
      const r = await getCookies(catId)
      setCookies(p => ({ ...p, [catId]: r.data }))
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to={`/websites/${id}`}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Cookie Manager</h2>
            <p className="text-sm text-gray-400">Define cookie categories and individual cookies</p>
          </div>
        </div>
        <button
          onClick={() => setShowCatForm(!showCatForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2
                     rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showCatForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <h3 className="font-semibold text-gray-800 mb-4">New Cookie Category</h3>
          <form onSubmit={handleCreateCategory} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category Name *</label>
                <input
                  required
                  placeholder="e.g. Analytics, Marketing"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={catForm.name}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    checked={catForm.is_required}
                    onChange={e => setCatForm({ ...catForm, is_required: e.target.checked })}
                  />
                  Required (cannot be rejected)
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input
                placeholder="What does this category do?"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={catForm.description}
                onChange={e => setCatForm({ ...catForm, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Add Category
              </button>
              <button type="button" onClick={() => setShowCatForm(false)}
                className="border border-gray-200 text-gray-500 px-5 py-2 rounded-lg text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <Cookie size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No cookie categories yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Category header */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(cat.id)}
              >
                <div className="flex items-center gap-3">
                  {expanded[cat.id] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{cat.name}</span>
                      {cat.is_required && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    {cat.description && <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name) }}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Cookies list */}
              {expanded[cat.id] && (
                <div className="border-t border-gray-100 px-5 py-4">
                  {/* Cookie table */}
                  {cookies[cat.id]?.length > 0 && (
                    <table className="w-full text-xs mb-4">
                      <thead>
                        <tr className="text-gray-400 text-left border-b border-gray-100">
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Provider</th>
                          <th className="pb-2">Purpose</th>
                          <th className="pb-2">Expiry</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {cookies[cat.id].map(c => (
                          <tr key={c.id} className="hover:bg-gray-50">
                            <td className="py-2 font-mono font-semibold text-gray-700">{c.name}</td>
                            <td className="py-2 text-gray-500">{c.provider || '—'}</td>
                            <td className="py-2 text-gray-500 max-w-xs truncate">{c.purpose || '—'}</td>
                            <td className="py-2 text-gray-500">{c.expiry || '—'}</td>
                            <td className="py-2 text-gray-500">{c.cookie_type || '—'}</td>
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedCookie(c)}
                                  className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                                >
                                  <Eye size={13} /> View
                                </button>
                                <button
                                  onClick={() => handleDeleteCookie(c.id, cat.id)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Add cookie form */}
                  {showCookieForm[cat.id] ? (
                    <form onSubmit={e => handleCreateCookie(e, cat.id)} className="grid grid-cols-5 gap-2">
                      {['name', 'provider', 'purpose', 'expiry', 'cookie_type'].map((field, i) => (
                        <input
                          key={field}
                          required={field === 'name'}
                          placeholder={['Cookie name *', 'Provider', 'Purpose', 'Expiry', 'Type'][i]}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={cookieForm[cat.id]?.[field] || ''}
                          onChange={e => setCookieForm(p => ({
                            ...p,
                            [cat.id]: { ...p[cat.id], [field]: e.target.value }
                          }))}
                        />
                      ))}
                      <div className="col-span-5 flex gap-2 mt-1">
                        <button type="submit"
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-blue-700">
                          Add Cookie
                        </button>
                        <button type="button"
                          onClick={() => setShowCookieForm(p => ({ ...p, [cat.id]: false }))}
                          className="border border-gray-200 text-gray-500 px-4 py-1.5 rounded-lg text-xs hover:bg-gray-50">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowCookieForm(p => ({ ...p, [cat.id]: true }))}
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus size={13} /> Add Cookie
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cookie Detail Modal */}
      <CookieDetailModal
        cookie={selectedCookie}
        onClose={() => setSelectedCookie(null)}
      />
    </div>
  )
}
