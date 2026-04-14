import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'https://passport-bsides-porto-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  // Token de attendee
  const attendeeToken = localStorage.getItem('passport_token');
  if (attendeeToken) config.headers['x-attendee-token'] = attendeeToken;

  // JWT de staff — enviado em todas as chamadas autenticadas
  const staffToken = localStorage.getItem('staff_token');
  if (staffToken) config.headers['Authorization'] = `Bearer ${staffToken}`;

  return config;
});

export const authApi = {
  register: (data: { name: string; email: string; company?: string; rgpdConsent: boolean; eventId: string }) =>
    api.post('/auth/register', data),
  resume: (token: string) =>
    api.get(`/auth/resume?token=${token}`),
  staffLogin: (email: string, password: string) =>
    api.post('/auth/staff/login', { email, password }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/staff/password', { currentPassword, newPassword }),
};

export const eventsApi = {
  getActive: () => api.get('/events/active'),
};

export const stampsApi = {
  scan: (token: string, qrCode: string) =>
    api.post('/stamps/scan', { token, qrCode }),
  getPassport: (token: string) =>
    api.get(`/stamps/passport?token=${token}`),
};

export const adminApi = {
  getDashboard: (eventId: string) => api.get(`/admin/dashboard?eventId=${eventId}`),
  getQualified: (eventId: string) => api.get(`/admin/qualified?eventId=${eventId}`),
  exportCsv: (eventId: string) => api.get(`/admin/export?eventId=${eventId}`, { responseType: 'blob' }),
  getSponsorScans: (eventId: string) => api.get(`/admin/sponsors/scans?eventId=${eventId}`),
  getAttendees: (eventId: string) => api.get(`/attendees?eventId=${eventId}`),
  createSponsor: (data: { name: string; eventId: string; boothNumber?: string }) =>
    api.post('/sponsors', data),
  updateSponsor: (id: string, data: { name?: string; boothNumber?: string }) =>
    api.put(`/sponsors/${id}`, data),
  deleteSponsor: (id: string) => api.delete(`/sponsors/${id}`),
};

export default api;