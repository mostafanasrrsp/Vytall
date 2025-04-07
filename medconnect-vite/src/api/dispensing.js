// src/api/dispensing.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api/dispensings';

// ✅ Helper to get JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Fetch all dispensings (Pharmacists/Admins)
export const fetchDispensings = async () => {
  try {
    const response = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dispensings', error);
    throw error;
  }
};

// ✅ Fetch single dispensing (Pharmacists/Admins)
export const fetchDispensingById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dispensing', error);
    throw error;
  }
};

// ✅ Add new dispensing (Pharmacists/Admins)
export const addDispensing = async (dispensingData) => {
  try {
    const response = await axios.post(API_BASE_URL, dispensingData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add dispensing', error);
    throw error;
  }
};

// ✅ Update dispensing (Pharmacists/Admins)
export const updateDispensing = async (id, dispensingData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, dispensingData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update dispensing', error);
    throw error;
  }
};

// ❌ Delete dispensing (Admins Only)
export const deleteDispensing = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
  } catch (error) {
    console.error('Failed to delete dispensing', error);
    throw error;
  }
};