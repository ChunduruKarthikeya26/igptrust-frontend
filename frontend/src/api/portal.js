import api from './axios'

export const getConsentsByEmail = (email) =>
  api.get(`/consents/lookup`, { params: { visitor_id: email } })

export const getVisitorConsents = (websiteId, visitorId) =>
  api.get(`/websites/${websiteId}/consents`, { params: { visitor_id: visitorId } })

export const withdrawConsent = (widgetKey, visitorId, reason) =>
  api.post(`/consents/withdraw`, {
    widget_key: widgetKey,
    visitor_id: visitorId,
    reason,
  })

export const getWebsitesPublic = () => api.get(`/websites`)

export const submitGrievance = (websiteId, data) =>
  api.post(`/websites/${websiteId}/grievances`, data)

export const getConsentLogsByVisitor = (websiteId, visitorId) =>
  api.get(`/websites/${websiteId}/consents`, { params: { visitor_id: visitorId, limit: 100 } })


export const updateConsent = (widgetKey, visitorId, newStatus, acceptedList, rejectedList) => {
  const accepted_categories = {}
  const rejected_categories = {}

  acceptedList.forEach(cat => { accepted_categories[cat] = true })
  rejectedList.forEach(cat => { rejected_categories[cat] = true })

  return api.post(`/consents/update`, {
    widget_key: widgetKey,
    visitor_id: visitorId,
    new_status: newStatus,
    accepted_categories,
    rejected_categories,
    update_reason: 'Updated by data principal via consent portal',
  })
}