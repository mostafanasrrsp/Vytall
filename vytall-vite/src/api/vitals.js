import axios from 'axios';

export async function fetchMyVitals(patientId) {
  const response = await axios.get(`/api/vitals/patient/${patientId}`);
  return response.data;
} 