import { api } from '../../services/trackers/api';

// Helper function to attach JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const weightService = {
  getPatientReadings: async (patientId) => {
    const response = await api.get(`/Weight/patient/${patientId}`, getAuthHeaders());
    return response.data;
  },
  createReading: async (reading) => {
    const response = await api.post('/Weight', reading, getAuthHeaders());
    return response.data;
  },
  updateReading: async (readingId, reading) => {
    const response = await api.put(`/Weight/${readingId}`, reading, getAuthHeaders());
    return response.data;
  },
  deleteReading: async (readingId) => {
    await api.delete(`/Weight/${readingId}`, getAuthHeaders());
  }
}; 