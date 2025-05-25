import axios from 'axios';

const BASE_URL = '/api/laboratory';

// Lab Test Ordering APIs
export const getAvailableTests = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/tests`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch available tests');
  }
};

export const submitLabOrder = async (orderData) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to submit lab order');
  }
};

export const getLabOrders = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/orders`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab orders');
  }
};

export const getLabOrderStatus = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/${orderId}/status`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab order status');
  }
};

export const cancelLabOrder = async (orderId) => {
  try {
    const response = await axios.post(`${BASE_URL}/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to cancel lab order');
  }
};

// Lab Results APIs
export const getLabResults = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/results`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab results');
  }
};

export const getLabResultDetails = async (resultId) => {
  try {
    const response = await axios.get(`${BASE_URL}/results/${resultId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab result details');
  }
};

export const downloadLabResult = async (resultId) => {
  try {
    const response = await axios.get(`${BASE_URL}/results/${resultId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to download lab result');
  }
};

export const shareLabResult = async (resultId, shareData) => {
  try {
    const response = await axios.post(`${BASE_URL}/results/${resultId}/share`, shareData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to share lab result');
  }
};

// Lab Locations APIs
export const getLabLocations = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/locations`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab locations');
  }
};

export const getLabLocationSchedule = async (locationId, date) => {
  try {
    const response = await axios.get(`${BASE_URL}/locations/${locationId}/schedule`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab location schedule');
  }
};

// Test Categories APIs
export const getTestCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch test categories');
  }
};

export const getTestsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/categories/${categoryId}/tests`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch tests by category');
  }
}; 