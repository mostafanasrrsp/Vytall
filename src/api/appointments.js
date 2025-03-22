// src/api/appointments.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api/appointments';

// ✅ Helper to get JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Fetch all appointments (Physician/Admin only)
export const fetchAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appointments', error);
    throw error;
  }
};

// ✅ Fetch patient-specific appointments (Patients only)
export const fetchAppointmentsForPatient = async (patientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/patient/${patientId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient appointments', error);
    throw error;
  }
};

// ✅ Create appointment (Patients only)
export const addAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(API_BASE_URL, appointmentData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add appointment', error);
    throw error;
  }
};

// ✅ Update appointment (Physicians/Admins only)
export const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, appointmentData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update appointment', error);
    throw error;
  }
};

// ✅ Delete appointment (Admins only)
export const deleteAppointment = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
  } catch (error) {
    console.error('Failed to delete appointment', error);
    throw error;
  }
};