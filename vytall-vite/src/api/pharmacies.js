import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// ✅ Helper function to attach JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// ✅ Fetch all pharmacies (Admins only)
export const fetchPharmacies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pharmacies`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pharmacies', error);
    throw error;
  }
};

// ✅ Fetch a single pharmacy by ID (Admins only)
export const fetchPharmacyById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pharmacies/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pharmacy', error);
    throw error;
  }
};

// ✅ Add a new pharmacy (Admins only)
export const addPharmacy = async (pharmacyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pharmacies`, pharmacyData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to add pharmacy', error);
    throw error;
  }
};

// ✅ Update a pharmacy (Admins only)
export const updatePharmacy = async (id, pharmacyData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/pharmacies/${id}`, pharmacyData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to update pharmacy', error);
    throw error;
  }
};

// ✅ Delete a pharmacy (Admins only)
export const deletePharmacy = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/pharmacies/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Failed to delete pharmacy', error);
    throw error;
  }
};