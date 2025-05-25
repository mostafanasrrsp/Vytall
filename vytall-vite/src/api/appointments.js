// src/api/appointments.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// Helper to get JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

// Fetch all appointments (Physician/Admin only)
export const fetchAppointments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Appointments`, { headers: getAuthHeaders() });
    console.log('Appointments API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appointments', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  }
};

// Fetch patient-specific appointments
export const fetchAppointmentsForPatient = async (patientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Appointments/Patient/${patientId}`, { headers: getAuthHeaders() });
    console.log('Patient Appointments API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient appointments', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  }
};

// Create appointment
export const addAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Appointments`, appointmentData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to add appointment', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  }
};

// Update appointment
export const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/Appointments/${id}`, appointmentData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to update appointment', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/Appointments/${id}`, { headers: getAuthHeaders() });
  } catch (error) {
    console.error('Failed to delete appointment', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  }
};