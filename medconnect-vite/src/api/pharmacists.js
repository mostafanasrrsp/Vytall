// src/api/pharmacists.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// ✅ Helper function to attach JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// ✅ Fetch all pharmacists (Admins only)
export const fetchPharmacists = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pharmacists`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pharmacists', error);
    throw error;
  }
};

// ✅ Fetch a single pharmacist by ID (Admins only)
export const fetchPharmacistById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pharmacists/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pharmacist', error);
    throw error;
  }
};

// ✅ Add a new pharmacist (Admins only)
export const addPharmacist = async (pharmacistData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pharmacists`, pharmacistData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to add pharmacist', error);
    throw error;
  }
};

// ✅ Update a pharmacist (Admins only)
export const updatePharmacist = async (id, pharmacistData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/pharmacists/${id}`, pharmacistData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to update pharmacist', error);
    throw error;
  }
};

// ✅ Delete a pharmacist (Admins only)
export const deletePharmacist = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/pharmacists/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Failed to delete pharmacist', error);
    throw error;
  }
};