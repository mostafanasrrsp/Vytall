import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api/patients';

// ✅ Helper to get JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Fetch all patients (Admins & Physicians)
export const fetchPatients = async () => {
  try {
    const response = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patients', error);
    throw error;
  }
};

// ✅ Fetch single patient (Admins & Physicians)
export const fetchPatientById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient', error);
    throw error;
  }
};

// ✅ Add new patient (Admins Only)
export const addPatient = async (patientData) => {
  try {
    const response = await axios.post(API_BASE_URL, patientData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add patient', error);
    throw error;
  }
};

// ✅ Update patient (Admins Only)
export const updatePatient = async (id, patientData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, patientData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update patient', error);
    throw error;
  }
};

// ❌ Delete patient (Admins Only)
export const deletePatient = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
  } catch (error) {
    console.error('Failed to delete patient', error);
    throw error;
  }
};