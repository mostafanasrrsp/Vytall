import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api/diagnoses';

// Fetch all diagnoses
export const fetchDiagnoses = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch diagnoses', error);
    throw error;
  }
};

// Add new diagnosis
export const addDiagnosis = async (diagnosisData) => {
  try {
    const response = await axios.post(API_BASE_URL, diagnosisData);
    return response.data;
  } catch (error) {
    console.error('Failed to add diagnosis', error);
    throw error;
  }
};

// Update diagnosis
export const updateDiagnosis = async (id, diagnosisData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, diagnosisData);
    return response.data;
  } catch (error) {
    console.error('Failed to update diagnosis', error);
    throw error;
  }
};

// Delete diagnosis
export const deleteDiagnosis = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error('Failed to delete diagnosis', error);
    throw error;
  }
};