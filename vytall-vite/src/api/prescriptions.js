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

// ✅ Add a new prescription (Physicians only)
export const addPrescription = async (physicianId, prescriptionData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/physicians/${physicianId}/prescribe`,
      {
        ...prescriptionData,
        medications: prescriptionData.medications.map(med => ({
          medicationDetails: med.medicationDetails,
          dosage: med.dosage,
          frequency: med.frequency
        }))
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add prescription', error);
    throw error;
  }
};

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
export const updatePrescription = async (prescriptionId, prescriptionData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/prescriptions/${prescriptionId}`,
      {
        ...prescriptionData,
        medications: prescriptionData.medications.map(med => ({
          medicationDetails: med.medicationDetails,
          dosage: med.dosage,
          frequency: med.frequency
        }))
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update prescription', error);
    throw error;
  }
};

// ✅ Fetch prescription details including medications
export const fetchPrescriptionDetails = async (prescriptionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/prescriptions/${prescriptionId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prescription details', error);
    throw error;
  }
};

// ✅ Fetch active prescriptions for a patient
export const fetchPatientPrescriptions = async (patientId) => {
  try {
    // There is no /active endpoint, so use reminders and filter for active
    const response = await axios.get(
      `${API_BASE_URL}/prescriptions/patients/${patientId}/reminders`,
      getAuthHeaders()
    );
    // Filter for active prescriptions if needed (e.g., not expired)
    const now = new Date();
    return response.data.filter(p => new Date(p.expirationDate) > now);
  } catch (error) {
    console.error('Failed to fetch patient prescriptions', error);
    throw error;
  }
};

// ✅ Fetch undispensed prescriptions with their medications
export const fetchUndispensedPrescriptions = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/prescriptions/undispensed`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch undispensed prescriptions', error);
    throw error;
  }
};

// ✅ Fetch prescription reminders with medication details
export const fetchPrescriptionReminders = async (patientId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/prescriptions/patients/${patientId}/reminders`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prescription reminders', error);
    throw error;
  }
};

// ✅ Mark a medication as taken
export const markMedicationAsTaken = async (prescriptionId, medicationId, patientId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/prescriptions/${prescriptionId}/medications/${medicationId}/taken`,
      { patientId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to mark medication as taken', error);
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

// ✅ Fetch pending prescriptions (status === 'Pending')
export const fetchPendingPrescriptions = async () => {
  try {
    // Use the all-prescriptions endpoint for admins
    const response = await axios.get(
      `${API_BASE_URL}/prescriptions/all-prescriptions`,
      getAuthHeaders()
    );
    // Filter for pending status
    return response.data.filter(prescription => prescription.status === 'Pending');
  } catch (error) {
    console.error('Failed to fetch pending prescriptions', error);
    throw error;
  }
};