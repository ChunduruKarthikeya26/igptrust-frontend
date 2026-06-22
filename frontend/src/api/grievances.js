import axios from "./axios";

export const getGrievances = (websiteId, params = {}) =>
  axios.get(`/websites/${websiteId || "all"}/grievances`, { params });

export const getGrievanceStats = (websiteId) =>
  axios.get(`/websites/${websiteId || "all"}/grievances/stats/summary`);

export const updateGrievanceStatus = (websiteId, grievanceId, body) =>
  axios.patch(`/websites/${websiteId}/grievances/${grievanceId}/status`, body);

export const createGrievance = (websiteId, body) =>
  axios.post(`/websites/${websiteId}/grievances`, body);

export const submitFeedback = (websiteId, grievanceId, body) =>
  axios.post(`/websites/${websiteId}/grievances/${grievanceId}/feedback`, body);

export const uploadEvidence = (websiteId, grievanceId, formData) =>
  axios.post(`/websites/${websiteId}/grievances/${grievanceId}/evidence`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getEvidence = (websiteId, grievanceId) =>
  axios.get(`/websites/${websiteId}/grievances/${grievanceId}/evidence`);

// ── NEW ───────────────────────────────────────────────────────────────────────
export const getGrievanceEvents = (grievanceId) =>
  axios.get(`/grievances/${grievanceId}/events`);