export default function StatsCard({ label, value, icon: Icon, color = 'blue', sub }) {
  const colors = {
    blue:   { bg: 'rgba(83,58,253,0.08)',  text: '#533afd' },
    green:  { bg: 'rgba(21,190,83,0.10)',  text: '#108c3d' },
    purple: { bg: 'rgba(83,58,253,0.08)',  text: '#533afd' },
    orange: { bg: 'rgba(155,104,41,0.10)', text: '#9b6829' },
    red:    { bg: 'rgba(234,34,97,0.08)',  text: '#ea2261' },
  }

  const c = colors[color] || colors.blue

  return (
    <div
      className="bg-white rounded p-5 border border-[#e5edf5]"
      style={{ boxShadow: '0px 15px 35px rgba(23,23,23,0.06), 0px 3px 6px rgba(50,50,93,0.04)' }}
    >
      <div
        className="w-9 h-9 rounded flex items-center justify-center mb-3"
        style={{ background: c.bg }}
      >
        <Icon size={17} style={{ color: c.text }} />
      </div>

      <p
        className="text-2xl font-light"
        style={{
          color: '#061b31',
          letterSpacing: '-0.5px',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value ?? '—'}
      </p>

      <p className="text-sm mt-0.5" style={{ color: '#64748d' }}>
        {label}
      </p>

      {sub && (
        <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
          {sub}
        </p>
      )}
    </div>
  )
}