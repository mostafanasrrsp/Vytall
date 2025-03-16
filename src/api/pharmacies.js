import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api'; // Ensure it's HTTPS

// Fetch all pharmacies
export const fetchPharmacies = async () => {
  const response = await axios.get(`${API_BASE_URL}/pharmacies`);
  return response.data;
};

// Add a new pharmacy
export const addPharmacy = async (pharmacyData) => {
  const response = await axios.post(`${API_BASE_URL}/pharmacies`, pharmacyData);
  return response.data;
};

// Update a pharmacy
export const updatePharmacy = async (id, pharmacyData) => {
  const response = await axios.put(`${API_BASE_URL}/pharmacies/${id}`, pharmacyData);
  return response.data;
};

// Delete a pharmacy
export const deletePharmacy = async (id) => {
  await axios.delete(`${API_BASE_URL}/pharmacies/${id}`);
};