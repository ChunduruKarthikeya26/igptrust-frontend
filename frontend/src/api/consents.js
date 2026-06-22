import api from './axios'

// Pass null as websiteId to hit the all-sites endpoints
export const getConsents = (websiteId, params = {}) =>
  websiteId
    ? api.get(`/websites/${websiteId}/consents`, { params })
    : api.get(`/consents`, { params })

export const getConsentStats = async (siteId, startDate = null, endDate = null) => {
  const params = {}
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate
  return siteId
    ? api.get(`/websites/${siteId}/consents/stats`, { params })
    : api.get('/consents/stats', { params })
}

export const withdrawConsent = (websiteId, consentId) =>
  api.post(`/websites/${websiteId}/consents/${consentId}/withdraw`)

export const getConsentAnalytics = async (siteId, days, startDate = null, endDate = null) => {
  const params = {}
  if (startDate && endDate) {
    params.start_date = startDate
    params.end_date = endDate
  } else {
    params.days = days
  }
  if (siteId) {
    return api.get(`/websites/${siteId}/consents/analytics`, { params })
  } else {
    return api.get('/consents/analytics/all', { params })
  }
}

export const getAllSitesAnalytics = (days = 30) =>
  api.get(`/consents/analytics/all?days=${days}`)

export const getConsentLogs = (websiteId, params = {}) =>
  websiteId
    ? api.get(`/websites/${websiteId}/consents`, { params })
    : api.get(`/consents`, { params })

export const getExpiringConsents = (websiteId, withinDays = 30) =>
  api.get(`/websites/${websiteId}/consents/expiring`, { params: { within_days: withinDays } })

export const triggerReconsent = (consentLogId, triggeredBy, reason) =>
  api.post('/reconsent/requests', {
    consent_log_id: consentLogId,
    triggered_by: triggeredBy,
    reason,
  })

export const getAllReconsents = (params = {}) =>
  api.get('/reconsent/admin/all', { params })