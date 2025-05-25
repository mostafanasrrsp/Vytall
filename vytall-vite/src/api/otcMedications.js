import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api/OTCMedications';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Get all OTC medications for a patient
export const fetchOTCMedicationsByPatient = async (patientId) => {
  const response = await axios.get(`${API_BASE_URL}/patient/${patientId}`, getAuthHeaders());
  return response.data;
};

// Add a new OTC medication
export const addOTCMedication = async (data) => {
  const response = await axios.post(API_BASE_URL, data, getAuthHeaders());
  return response.data;
};

// Update an existing OTC medication
export const updateOTCMedication = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, getAuthHeaders());
  return response.data;
};

// Delete an OTC medication
export const deleteOTCMedication = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
  return response.data;
}; 