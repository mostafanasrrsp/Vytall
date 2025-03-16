// src/api/physicians.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// Fetch all physicians
export const fetchPhysicians = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/physicians`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch physicians', error);
    throw error;
  }
};

// Add a physician
export const addPhysician = async (physicianData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/physicians`, physicianData);
    return response.data;
  } catch (error) {
    console.error('Failed to add physician', error);
    throw error;
  }
};

export const updatePhysician = async (id, physicianData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/physicians/${id}`, physicianData);
    return response.data;
  } catch (error) {
    console.error('Failed to update physician', error);
    throw error;
  }
};

export const deletePhysician = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/physicians/${id}`);
  } catch (error) {
    console.error('Failed to delete physician', error);
    throw error;
  }
};