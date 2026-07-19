import api from './api';

export const getSettings = () => api.get('/settings');
export const getSettingById = (id) => api.get(`/settings/${id}`);
export const createSettings = (data) => api.post('/settings', data);
export const updateSettings = (id, data) => api.put(`/settings/${id}`, data);
