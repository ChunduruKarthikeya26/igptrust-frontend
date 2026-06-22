import axios from "./axios";

export const getNotifications = (websiteId, params = {}) =>
  axios.get(`/websites/${websiteId}/notifications`, { params });

export const sendRenewalReminders = (websiteId, withinDays = 30) =>
  axios.post(`/websites/${websiteId}/notifications/send-renewal-reminders`, null, {
    params: { within_days: withinDays },
  });