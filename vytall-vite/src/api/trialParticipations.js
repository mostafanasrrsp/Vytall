import api from './api';

export const trialParticipationsApi = {
    // Get all trial participations for a patient
    getPatientParticipations: async (patientId) => {
        const response = await api.get(`/api/TrialParticipations/patient/${patientId}`);
        return response.data;
    },

    // Get a specific trial participation
    getTrialParticipation: async (id) => {
        const response = await api.get(`/api/TrialParticipations/${id}`);
        return response.data;
    },

    // Create a new trial participation (Admin/HealthcareProvider only)
    createTrialParticipation: async (participationData) => {
        const response = await api.post('/api/TrialParticipations', participationData);
        return response.data;
    },

    // Update an existing trial participation (Admin/HealthcareProvider only)
    updateTrialParticipation: async (id, participationData) => {
        const response = await api.put(`/api/TrialParticipations/${id}`, participationData);
        return response.data;
    },

    // Delete/Withdraw from a trial participation (Admin/HealthcareProvider only)
    deleteTrialParticipation: async (id) => {
        const response = await api.delete(`/api/TrialParticipations/${id}`);
        return response.data;
    }
}; 