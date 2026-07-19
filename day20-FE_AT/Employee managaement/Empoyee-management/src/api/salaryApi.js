import api from './api';

export const getSalary = () => api.get('/salary');
export const getSalaryById = (id) => api.get(`/salary/${id}`);
export const createSalary = (data) => api.post('/salary', data);
export const updateSalary = (id, data) => api.put(`/salary/${id}`, data);
export const deleteSalary = (id) => api.delete(`/salary/${id}`);
