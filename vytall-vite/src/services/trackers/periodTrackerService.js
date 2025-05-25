import axios from 'axios';

const API_URL = 'https://localhost:5227/api/PeriodTracker';

// Helper function to attach JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const periodTrackerService = {
    // Get all periods for a patient
    getPatientPeriods: async (patientId) => {
        const response = await axios.get(`${API_URL}/patient/${patientId}`, getAuthHeaders());
        return response.data;
    },

    // Get a single period
    getPeriodById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },

    // Create a new period
    createPeriod: async (periodData) => {
        const response = await axios.post(API_URL, periodData, getAuthHeaders());
        return response.data;
    },

    // Update an existing period
    updatePeriod: async (id, periodData) => {
        const response = await axios.put(`${API_URL}/${id}`, periodData, getAuthHeaders());
        return response.data;
    },

    // Delete a period
    deletePeriod: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    }
}; 