import api from './api';

export const getLeave = () => api.get('/leave');
export const getLeaveById = (id) => api.get(`/leave/${id}`);
export const createLeave = (data) => api.post('/leave', data);
export const updateLeave = (id, data) => api.put(`/leave/${id}`, data);
export const deleteLeave = (id) => api.delete(`/leave/${id}`);
