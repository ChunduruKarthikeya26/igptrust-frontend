import api from './axios'

export const getRetentionConfig = (websiteId) =>
  api.get(`/websites/${websiteId}/retention`)

export const saveRetentionConfig = (websiteId, data) =>
  api.post(`/websites/${websiteId}/retention`, data)