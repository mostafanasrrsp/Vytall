import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// ✅ Helper function to attach JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// ✅ Fetch all medical records (Admins Only)
export const fetchMedicalRecords = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicalRecords`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch medical records', error);
    throw error;
  }
};

// ✅ Fetch medical records for a specific patient (Patients & Physicians)
export const fetchMedicalRecordsByPatient = async (patientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicalRecords/patient/${patientId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch medical records for patient', error);
    throw error;
  }
};

// ✅ Fetch a specific medical record (Admins, Physicians, or Patients)
export const fetchMedicalRecordById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicalRecords/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch medical record', error);
    throw error;
  }
};

// ✅ Add a new medical record (Patients & Admins)
export const addMedicalRecord = async (medicalRecordData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/medicalRecords`, medicalRecordData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to add medical record', error);
    throw error;
  }
};

// ✅ Update an existing medical record (Patients can update their own, Admins can update any)
export const updateMedicalRecord = async (id, medicalRecordData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/medicalRecords/${id}`, medicalRecordData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to update medical record', error);
    throw error;
  }
};

// ✅ Delete a medical record (Patients can delete their own, Admins can delete any)
export const deleteMedicalRecord = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/medicalRecords/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Failed to delete medical record', error);
    throw error;
  }
};