// src/api/dispensing.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// ✅ Helper to get JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Fetch all dispensings (Pharmacists/Admins)
export const fetchDispensings = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dispensing`,
      getAuthHeaders()
    );
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

// ✅ Add a new dispensing record
export const addDispensing = async (dispensingData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/dispensing`,
      {
        ...dispensingData,
        medications: dispensingData.medications.map(med => ({
          medicationId: med.medicationId,
          quantity: med.quantity
        }))
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add dispensing record', error);
    throw error;
  }
};

// ✅ Update a dispensing record
export const updateDispensing = async (dispensingId, dispensingData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/dispensing/${dispensingId}`,
      {
        ...dispensingData,
        medications: dispensingData.medications.map(med => ({
          medicationId: med.medicationId,
          quantity: med.quantity
        }))
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update dispensing record', error);
    throw error;
  }
};

// ✅ Fetch dispensing records for a specific prescription
export const fetchPrescriptionDispensings = async (prescriptionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dispensing/prescription/${prescriptionId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prescription dispensing records', error);
    throw error;
  }
};

// ✅ Fetch dispensing records for a specific pharmacist
export const fetchPharmacistDispensings = async (pharmacistId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dispensing/pharmacist/${pharmacistId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pharmacist dispensing records', error);
    throw error;
  }
};

// ✅ Delete a dispensing record
export const deleteDispensing = async (dispensingId) => {
  try {
    await axios.delete(
      `${API_BASE_URL}/dispensing/${dispensingId}`,
      getAuthHeaders()
    );
  } catch (error) {
    console.error('Failed to delete dispensing record', error);
    throw error;
  }
};

// ✅ Get dispensing statistics
export const fetchDispensingStats = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dispensing/stats`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dispensing statistics', error);
    throw error;
  }
};