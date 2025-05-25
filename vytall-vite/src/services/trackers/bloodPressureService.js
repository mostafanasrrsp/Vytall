import axios from 'axios';

const API_URL = 'https://localhost:5227/api/BloodPressure';

// Helper function to attach JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const bloodPressureService = {
    // Get all readings for a patient
    getPatientReadings: async (patientId) => {
        const response = await axios.get(`${API_URL}/patient/${patientId}`, getAuthHeaders());
        return response.data;
    },

    // Get a single reading
    getReadingById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },

    // Create a new reading
    createReading: async (readingData) => {
        const response = await axios.post(API_URL, readingData, getAuthHeaders());
        return response.data;
    },

    // Update an existing reading
    updateReading: async (id, readingData) => {
        const response = await axios.put(`${API_URL}/${id}`, readingData, getAuthHeaders());
        return response.data;
    },

    // Delete a reading
    deleteReading: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    }
}; 