// src/api/prescriptions.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

export const fetchPrescriptions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/physicians/1/prescriptions`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prescriptions', error);
    throw error;
  }
};

export const addPrescription = async (physicianId, prescriptionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/physicians/${physicianId}/prescribe`, prescriptionData);
    return response.data;
  } catch (error) {
    console.error('Failed to add prescription', error);
    throw error;
  }
};

export const updatePrescription = async (id, prescriptionData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/physicians/prescriptions/${id}`, prescriptionData);
    return response.data;
  } catch (error) {
    console.error('Failed to update prescription', error);
    throw error;
  }
};

export const deletePrescription = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/physicians/prescriptions/${id}`);
  } catch (error) {
    console.error('Failed to delete prescription', error);
    throw error;
  }
};