import api from './api';

export const emergencyContactsApi = {
    // Get all emergency contacts for a patient
    getPatientEmergencyContacts: async (patientId) => {
        const response = await api.get(`/api/EmergencyContacts/patient/${patientId}`);
        return response.data;
    },

    // Get a specific emergency contact
    getEmergencyContact: async (id) => {
        const response = await api.get(`/api/EmergencyContacts/${id}`);
        return response.data;
    },

    // Create a new emergency contact
    createEmergencyContact: async (contactData) => {
        const response = await api.post('/api/EmergencyContacts', contactData);
        return response.data;
    },

    // Update an existing emergency contact
    updateEmergencyContact: async (id, contactData) => {
        const response = await api.put(`/api/EmergencyContacts/${id}`, contactData);
        return response.data;
    },

    // Delete an emergency contact
    deleteEmergencyContact: async (id) => {
        const response = await api.delete(`/api/EmergencyContacts/${id}`);
        return response.data;
    }
}; 