import axios from 'axios';

const BASE_URL = '/api/telemedicine';

// Secure Messaging APIs
export const getMessages = async (providerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/messages`, {
      params: { providerId }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch messages');
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${BASE_URL}/messages`, messageData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to send message');
  }
};

export const getProviders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/providers`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch providers');
  }
};

// Video Consultation APIs
export const initializeCall = async (providerId) => {
  try {
    const response = await axios.post(`${BASE_URL}/calls/initialize`, { providerId });
    return response.data;
  } catch (error) {
    throw new Error('Failed to initialize call');
  }
};

export const endCall = async (callId) => {
  try {
    const response = await axios.post(`${BASE_URL}/calls/${callId}/end`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to end call');
  }
};

export const getCallStatus = async (callId) => {
  try {
    const response = await axios.get(`${BASE_URL}/calls/${callId}/status`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get call status');
  }
};

export const getCallToken = async (callId) => {
  try {
    const response = await axios.get(`${BASE_URL}/calls/${callId}/token`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get call token');
  }
};

// Call Recording APIs
export const startRecording = async (callId) => {
  try {
    const response = await axios.post(`${BASE_URL}/calls/${callId}/recording/start`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to start recording');
  }
};

export const stopRecording = async (callId) => {
  try {
    const response = await axios.post(`${BASE_URL}/calls/${callId}/recording/stop`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to stop recording');
  }
};

export const getCallRecordings = async (callId) => {
  try {
    const response = await axios.get(`${BASE_URL}/calls/${callId}/recordings`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch call recordings');
  }
};

// Provider Availability APIs
export const getProviderAvailability = async (providerId, date) => {
  try {
    const response = await axios.get(`${BASE_URL}/providers/${providerId}/availability`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch provider availability');
  }
};

// Consultation APIs
export const getUpcomingConsultations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/consultations/upcoming`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch upcoming consultations');
  }
};

export const scheduleConsultation = async (consultationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/consultations`, consultationData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to schedule consultation');
  }
};

export const cancelConsultation = async (consultationId) => {
  try {
    const response = await axios.post(`${BASE_URL}/consultations/${consultationId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to cancel consultation');
  }
}; 