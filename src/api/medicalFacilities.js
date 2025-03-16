// src/api/medicalFacilities.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// Fetch all medical facilities
export const fetchMedicalFacilities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicalfacilities`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch medical facilities', error);
    throw error;
  }
};

// Add a medical facility
export const addMedicalFacility = async (facilityData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/medicalfacilities`, facilityData);
    return response.data;
  } catch (error) {
    console.error('Failed to add medical facility', error);
    throw error;
  }
};

export const updateMedicalFacility = async (id, facilityData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/medicalfacilities/${id}`, facilityData);
    return response.data;
  } catch (error) {
    console.error('Failed to update facility', error);
    throw error;
  }
};

export const deleteMedicalFacility = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/medicalfacilities/${id}`);
  } catch (error) {
    console.error('Failed to delete facility', error);
    throw error;
  }
};