import api from './axios'

export const scanWebsite = (id) =>
  api.post(`/scanner/scan/${id}`)

export const previewScan = (id) =>
  api.get(`/scanner/scan/${id}/preview`)

export const getWebsites = () => api.get('/websites')
export const getWebsite = (id) => api.get(`/websites/${id}`)
export const createWebsite = (data) => api.post('/websites', data)
export const updateWebsite = (id, data) => api.put(`/websites/${id}`, data)
export const deleteWebsite = (id) => api.delete(`/websites/${id}`)
export const getWidgetSettings = (id) => api.get(`/websites/${id}/widget-settings`)
export const updateWidgetSettings = (id, data) => api.put(`/websites/${id}/widget-settings`, data)
export const getWebsiteCategories = (id) =>
  api.get(`/websites/${id}/categories`)   // ← no trailing slash
export const scanAnyUrl = (payload, config = {}) =>
  api.post('/scanner/scan-url', payload, config)
export const checkShadowCookies = (id) =>
  api.get(`/scanner/shadow/${id}`)