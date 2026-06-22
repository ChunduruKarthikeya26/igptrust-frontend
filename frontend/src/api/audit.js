import api from './axios'

export const getAuditLogs = (params) => api.get('/audit', { params })
export const getWebsiteAuditLogs = (websiteId) => api.get(`/audit/websites/${websiteId}`)
export const loginMfa = (email, code) => api.post('/auth/login-mfa', { email, code })
