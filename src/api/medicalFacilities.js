// src/api/medicalFacilities.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// ✅ Helper function to attach JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// ✅ Fetch all medical facilities (Admins only)
export const fetchMedicalFacilities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicalFacilities`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch medical facilities', error);
    throw error;
  }
};

// ✅ Fetch a single medical facility by ID (Admins only)
export const fetchMedicalFacilityById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicalFacilities/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch medical facility', error);
    throw error;
  }
};

// ✅ Add a new medical facility (Admins only)
export const addMedicalFacility = async (facilityData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/medicalFacilities`, facilityData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to add medical facility', error);
    throw error;
  }
};

// ✅ Update a medical facility (Admins only)
export const updateMedicalFacility = async (id, facilityData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/medicalFacilities/${id}`, facilityData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to update medical facility', error);
    throw error;
  }
};

// ✅ Delete a medical facility (Admins only)
export const deleteMedicalFacility = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/medicalFacilities/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Failed to delete medical facility', error);
    throw error;
  }
};