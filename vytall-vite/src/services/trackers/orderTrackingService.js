import axios from 'axios';

const API_URL = 'https://localhost:5227/api/OrderTracking';

export const orderTrackingService = {
    // Get all orders for a patient
    getPatientOrders: async (patientId) => {
        const response = await axios.get(`${API_URL}/patient/${patientId}`);
        return response.data;
    },

    // Get a single order
    getOrderById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    // Create a new order
    createOrder: async (orderData) => {
        const response = await axios.post(API_URL, orderData);
        return response.data;
    },

    // Update an existing order
    updateOrder: async (id, orderData) => {
        const response = await axios.put(`${API_URL}/${id}`, orderData);
        return response.data;
    },

    // Delete an order
    deleteOrder: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
}; 