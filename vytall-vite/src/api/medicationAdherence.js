import api from './api';

export const medicationAdherenceApi = {
    // Get adherence summary for a patient
    getPatientAdherenceSummary: async (patientId) => {
        const response = await api.get(`/api/MedicationAdherence/patient/${patientId}`);
        return response.data;
    },

    // Get a specific adherence record
    getAdherence: async (id) => {
        const response = await api.get(`/api/MedicationAdherence/${id}`);
        return response.data;
    },

    // Record medication adherence
    recordAdherence: async (adherenceData) => {
        const response = await api.post('/api/MedicationAdherence', adherenceData);
        return response.data;
    },

    // Get patient achievements
    getPatientAchievements: async (patientId) => {
        const response = await api.get(`/api/MedicationAdherence/patient/${patientId}/achievements`);
        return response.data;
    },

    // Get patient badges
    getPatientBadges: async (patientId) => {
        const response = await api.get(`/api/MedicationAdherence/patient/${patientId}/badges`);
        return response.data;
    },

    // Update achievement progress
    updateAchievementProgress: async (achievementId, progressData) => {
        const response = await api.post(
            `/api/MedicationAdherence/achievements/${achievementId}/progress`,
            progressData
        );
        return response.data;
    },

    // Unlock a badge
    unlockBadge: async (badgeId) => {
        const response = await api.post(
            `/api/MedicationAdherence/badges/${badgeId}/unlock`,
            {}
        );
        return response.data;
    }
}; 