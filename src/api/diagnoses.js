import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api/diagnoses';

// ✅ Helper to get the JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Fetch all diagnoses (Physician/Admin only)
export const fetchDiagnoses = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: getAuthHeaders(), // ✅ Attach token
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch diagnoses', error);
    throw error;
  }
};

// ✅ Add new diagnosis (Physician only)
export const addDiagnosis = async (diagnosisData) => {
  try {
    const response = await axios.post(API_BASE_URL, diagnosisData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json', // ✅ Ensure proper request format
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add diagnosis', error);
    throw error;
  }
};

// ✅ Update diagnosis (Physician/Admin only)
export const updateDiagnosis = async (id, diagnosisData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, diagnosisData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json', // ✅ Ensure proper request format
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update diagnosis', error);
    throw error;
  }
};

// ✅ Delete diagnosis (Admin only)
export const deleteDiagnosis = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Failed to delete diagnosis', error);
    throw error;
  }
};