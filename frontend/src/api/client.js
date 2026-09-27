import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // Employees
  getEmployees: async (params = {}) => {
    const res = await apiClient.get('/employees', { params });
    return res.data;
  },
  getEmployee: async (id) => {
    const res = await apiClient.get(`/employees/${id}`);
    return res.data;
  },
  createEmployee: async (data) => {
    const res = await apiClient.post('/employees', { employee: data });
    return res.data;
  },
  updateEmployee: async (id, data) => {
    const res = await apiClient.put(`/employees/${id}`, { employee: data });
    return res.data;
  },
  deleteEmployee: async (id) => {
    const res = await apiClient.delete(`/employees/${id}`);
    return res.data;
  },
  addSalaryAdjustment: async (employeeId, data) => {
    const res = await apiClient.post(`/employees/${employeeId}/salary_adjustments`, { salary_adjustment: data });
    return res.data;
  },
  bulkImport: async (formData) => {
    const res = await apiClient.post('/employees/bulk_import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getExportUrl: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return `${API_BASE}/employees/export?${query}`;
  },

  // Analytics
  getOverview: async () => {
    const res = await apiClient.get('/analytics/overview');
    return res.data;
  },
  getByCountry: async () => {
    const res = await apiClient.get('/analytics/by_country');
    return res.data;
  },
  getByDepartment: async () => {
    const res = await apiClient.get('/analytics/by_department');
    return res.data;
  },
  getGenderPayEquity: async () => {
    const res = await apiClient.get('/analytics/gender_pay_equity');
    return res.data;
  },
  getPerformanceVsSalary: async () => {
    const res = await apiClient.get('/analytics/performance_vs_salary');
    return res.data;
  },
  getInsights: async () => {
    const res = await apiClient.get('/analytics/insights');
    return res.data;
  },
};
