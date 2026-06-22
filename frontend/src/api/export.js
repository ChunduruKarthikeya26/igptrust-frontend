import api from './axios'

export const downloadExport = async (type, format, dateParams = {}) => {
  const useMock = window.location.hostname !== 'localhost' || localStorage.getItem('use_mock_backend') === 'true'
  
  if (useMock) {
    // Generate mock report file content
    let content = ''
    let mimeType = 'text/csv'
    const filename = `analytics_report_${type}.${format}`

    if (format === 'json') {
      content = JSON.stringify({
        report_type: type,
        generated_at: new Date().toISOString(),
        site_id: dateParams.siteId || 'all',
        period: {
          start_date: dateParams.startDate || 'N/A',
          end_date: dateParams.endDate || 'N/A'
        },
        summary: {
          total_consents: 1850,
          accepted: 1220,
          rejected: 380,
          partial: 250
        },
        data: [
          { date: '2026-06-20', total: 60, accepted: 42, rejected: 10, partial: 8 },
          { date: '2026-06-21', total: 65, accepted: 45, rejected: 12, partial: 8 },
          { date: '2026-06-22', total: 70, accepted: 50, rejected: 11, partial: 9 }
        ]
      }, null, 2)
      mimeType = 'application/json'
    } else {
      content = `Date,Total Consents,Accepted,Rejected,Partial\n2026-06-20,60,42,10,8\n2026-06-21,65,45,12,8\n2026-06-22,70,50,11,9\n`
    }

    const blob = new Blob([content], { type: mimeType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
    return
  }

  const params = new URLSearchParams()
  if (dateParams.startDate) params.append('start_date', dateParams.startDate)
  if (dateParams.endDate) params.append('end_date', dateParams.endDate)
  if (dateParams.siteId) params.append('site_id', dateParams.siteId)

  const url = `/api/export/${type}/${format}${params.toString() ? '?' + params : ''}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  if (!response.ok) throw new Error('Export failed')

  const blob = await response.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `analytics_report.${format}`
  link.click()
  URL.revokeObjectURL(link.href)
}