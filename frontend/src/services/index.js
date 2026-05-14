import apiClient from './apiClient';

// Investors API
export const investorAPI = {
  getAll: () => apiClient.get('/investors'),
  getById: (id) => apiClient.get(`/investors/${id}`),
  create: (data) => apiClient.post('/investors', data),
  update: (id, data) => apiClient.put(`/investors/${id}`, data),
  delete: (id) => apiClient.delete(`/investors/${id}`),
};

// Funds API
export const fundAPI = {
  getAll: () => apiClient.get('/funds'),
  getById: (id) => apiClient.get(`/funds/${id}`),
  create: (data) => apiClient.post('/funds', data),
  update: (id, data) => apiClient.put(`/funds/${id}`, data),
  delete: (id) => apiClient.delete(`/funds/${id}`),
};

// SIPs API
export const sipAPI = {
  getAll: () => apiClient.get('/sip'),
  getById: (id) => apiClient.get(`/sip/${id}`),
  create: (data) => apiClient.post('/sip', data),
  update: (id, data) => apiClient.put(`/sip/${id}`, data),
  delete: (id) => apiClient.delete(`/sip/${id}`),
  getByInvestor: (investorId) => apiClient.get(`/sip?investorId=${investorId}`),
};

// Transactions API
export const transactionAPI = {
  getAll: () => apiClient.get('/transactions'),
  getById: (id) => apiClient.get(`/transactions/${id}`),
  getBySip: (sipId) => apiClient.get(`/transactions?sipId=${sipId}`),
  getByInvestor: (investorId) => apiClient.get(`/transactions?investorId=${investorId}`),
};

// Portfolio API
export const portfolioAPI = {
  getByInvestor: (investorId) => apiClient.get(`/portfolio/${investorId}`),
  getNetWorth: (investorId) => apiClient.get(`/portfolio/${investorId}/networth`),
};

// Auth API
export const authAPI = {
  login: (email, password) => apiClient.post('/investors/login', { email, password }),
  logout: () => {
    localStorage.removeItem('token');
  },
};
