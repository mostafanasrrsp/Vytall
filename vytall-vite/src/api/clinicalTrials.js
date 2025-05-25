import api from './api';

export const clinicalTrialsApi = {
    // Get all clinical trials with optional filters
    getClinicalTrials: async (filters = {}) => {
        const { phase, status, condition, activeOnly = true } = filters;
        const params = new URLSearchParams();
        
        if (phase) params.append('phase', phase);
        if (status) params.append('status', status);
        if (condition) params.append('condition', condition);
        params.append('activeOnly', activeOnly);

        const response = await api.get(`/api/ClinicalTrials?${params.toString()}`);
        return response.data;
    },

    // Get a specific clinical trial
    getClinicalTrial: async (id) => {
        const response = await api.get(`/api/ClinicalTrials/${id}`);
        return response.data;
    },

    // Create a new clinical trial (Admin/HealthcareProvider only)
    createClinicalTrial: async (trialData) => {
        const response = await api.post('/api/ClinicalTrials', trialData);
        return response.data;
    },

    // Update an existing clinical trial (Admin/HealthcareProvider only)
    updateClinicalTrial: async (id, trialData) => {
        const response = await api.put(`/api/ClinicalTrials/${id}`, trialData);
        return response.data;
    },

    // Delete a clinical trial (Admin only)
    deleteClinicalTrial: async (id) => {
        const response = await api.delete(`/api/ClinicalTrials/${id}`);
        return response.data;
    },

    // Get participants for a specific trial (Admin/HealthcareProvider only)
    getTrialParticipants: async (trialId) => {
        const response = await api.get(`/api/ClinicalTrials/${trialId}/participants`);
        return response.data;
    }
}; 