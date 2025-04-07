// src/api/prescriptions.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

// ✅ Helper function to attach JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Fetch all prescriptions (for Admins)
export const fetchAllPrescriptions = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/prescriptions/all-prescriptions`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all prescriptions', error);
    throw error;
  }
};

// ✅ Fetch all prescriptions for a physician
export const fetchPrescriptions = async (physicianId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/physicians/${physicianId}/prescriptions`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prescriptions', error);
    throw error;
  }
};

// ✅ Fetch only undispensed prescriptions (for pharmacists)
export async function fetchUndispensedPrescriptions() {
  try {
    const response = await axios.get(`${API_BASE_URL}/physicians/undispensed-prescriptions`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching undispensed prescriptions:', error);
    return [];
  }
}

// ✅ Add a new prescription (Physicians only)
export const addPrescription = async (physicianId, prescriptionData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/physicians/${physicianId}/prescribe`,
      prescriptionData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add prescription', error);
    throw error;
  }
};

// Reminders for patients
export async function fetchPrescriptionReminders(patientId) {
  const token = localStorage.getItem('jwtToken');
  const response = await axios.get(
    `${API_BASE_URL}/prescriptions/patients/${patientId}/reminders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

//Mark Prescription as taken by patient
export const handleMarkAsTaken = async (prescriptionId, patientId, setReminders) => {
  try {
    if (!patientId) {
      console.error("❌ Patient ID is missing.");
      return;
    }

    console.log("📤 Sending request with:", { patientId, prescriptionId });

    await axios.post(
      `${API_BASE_URL}/prescriptions/patients/${patientId}/take-dose`,
      { prescriptionId }, // ✅ Send prescriptionId in the request body
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      }
    );

    // ✅ Fetch updated prescription reminders immediately
    const updatedReminders = await fetchPrescriptionReminders(patientId);
    setReminders(updatedReminders); // Refresh UI

  } catch (error) {
    console.error("❌ Error marking dose as taken:", error.response?.data || error);
  }
};


// ✅ Update an existing prescription (Physicians only)
export const updatePrescription = async (id, prescriptionData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/physicians/prescriptions/${id}`,
      prescriptionData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update prescription', error);
    throw error;
  }
};

// ✅ Delete a prescription (Admins only)
export const deletePrescription = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/physicians/prescriptions/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Failed to delete prescription', error);
    throw error;
  }
};