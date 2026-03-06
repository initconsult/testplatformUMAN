import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Report API functions
export const reportApi = {
  getNL: (safeurl: string) => api.get(`/api/reports/nl/${safeurl}`),
  getFR: (safeurl: string) => api.get(`/api/reports/fr/${safeurl}`),
  getEN: (safeurl: string) => api.get(`/api/reports/en/${safeurl}`),
  getPCANL: (safeurl: string) => api.get(`/api/reports/pca/nl/${safeurl}`),
  getPCAFR: (safeurl: string) => api.get(`/api/reports/pca/fr/${safeurl}`),
  getPCAEN: (safeurl: string) => api.get(`/api/reports/pca/en/${safeurl}`),
};

export default api;
