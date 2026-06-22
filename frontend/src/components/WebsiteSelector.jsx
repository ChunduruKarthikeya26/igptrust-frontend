import { useWebsite } from '../context/WebsiteContext'
import { Globe } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function WebsiteSelector() {
  const { websites, selectedId, selectWebsite, loading } = useWebsite()

  if (loading) return (
    <div className="flex items-center gap-3 px-5 py-3 mb-6 bg-slate-50/80 rounded-xl border border-slate-100 text-sm font-medium text-slate-500 animate-pulse">
      <Globe size={18} className="text-slate-400" />
      <span>Loading your websites...</span>
    </div>
  )

  if (websites.length === 0) return (
    <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/60 rounded-xl px-5 py-3 mb-6 text-sm text-amber-800 shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-amber-100/50 flex items-center justify-center shrink-0">
        <Globe size={16} className="text-amber-600" />
      </div>
      <div className="flex-1">
        No websites found.
        <a href="/websites" className="underline font-semibold ml-1.5 hover:text-amber-900 transition-colors">Add a website first &rarr;</a>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Globe size={16} />
        </div>
        <span>Select Website:</span>
      </div>
      <div className="relative flex-1 max-w-sm">
        <Select 
          value={selectedId ? String(selectedId) : 'all-websites'} 
          onValueChange={v => selectWebsite(v === 'all-websites' ? null : v)}
        >
          <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 hover:border-slate-300 font-semibold text-slate-800 rounded-xl h-9">
            <SelectValue placeholder="All Websites Overview" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-websites">All Websites Overview</SelectItem>
            {websites.map(w => (
              <SelectItem key={w.id} value={String(w.id)}>
                {w.domain} {w.name ? `— ${w.name}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}