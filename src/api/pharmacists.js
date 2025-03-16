// src/api/pharmacists.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// Fetch all pharmacists
export const fetchPharmacists = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pharmacists`);
    console.log("Fetched pharmacists:", response.data); // ✅ Add this line to check the data
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pharmacists', error);
    throw error;
  }
};

// Add a pharmacist
export const addPharmacist = async (pharmacistData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pharmacists`, pharmacistData);
    return response.data;
  } catch (error) {
    console.error('Failed to add pharmacist', error);
    throw error;
  }
};

export const updatePharmacist = async (id, pharmacistData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/pharmacists/${id}`, pharmacistData);
    return response.data;
  } catch (error) {
    console.error('Failed to update pharmacist', error);
    throw error;
  }
};

export const deletePharmacist = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/pharmacists/${id}`);
  } catch (error) {
    console.error('Failed to delete pharmacist', error);
    throw error;
  }
};