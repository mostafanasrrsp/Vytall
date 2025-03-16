import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// Fetch all patients
export const fetchPatients = async () => {
  const response = await axios.get(`${API_BASE_URL}/patients`);
  return response.data;
};

// Add a patient
export const addPatient = async (patientData) => {
  const response = await axios.post(`${API_BASE_URL}/patients`, patientData);
  return response.data;
};

// Update a patient
export const updatePatient = async (id, patientData) => {
  const response = await axios.put(`${API_BASE_URL}/patients/${id}`, patientData);
  return response.data;
};

// Delete a patient
export const deletePatient = async (id) => {
  await axios.delete(`${API_BASE_URL}/patients/${id}`);
};