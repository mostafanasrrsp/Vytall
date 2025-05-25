// src/api/physicians.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// ✅ Utility to get JWT Token from local storage
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  console.log("JWT Token being sent:", token); // ✅ Debugging
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// ✅ Fetch all physicians (Admins Only)
export const fetchPhysicians = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/physicians`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch physicians', error);
    throw error;
  }
};

// ✅ Add a physician (Admins Only)
export const addPhysician = async (physicianData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/physicians`, physicianData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to add physician', error);
    throw error;
  }
};

// ✅ Update a physician (Admins Only)
export const updatePhysician = async (id, physicianData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/physicians/${id}`, physicianData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to update physician', error);
    throw error;
  }
};

// ✅ Delete a physician (Admins Only)
export const deletePhysician = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/physicians/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Failed to delete physician', error);
    throw error;
  }
};

// ✅ Fetch prescriptions assigned to a specific physician (Physicians & Admins Only)
export const fetchPrescriptionsByPhysician = async (physicianId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/physicians/${physicianId}/prescriptions`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prescriptions', error);
    throw error;
  }
};

// Fetch a single physician by ID
export const fetchPhysicianById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/physicians/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch physician', error);
    throw error;
  }
};