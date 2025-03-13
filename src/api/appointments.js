import axios from 'axios';

const API_BASE_URL = 'http://localhost:5227/api';

const fetchAppointments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appointments', error);
    throw error;
  }
};

export default fetchAppointments; // ✅ Default export!