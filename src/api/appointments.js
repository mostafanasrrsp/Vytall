// src/api/appointments.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5227/api';

export const fetchAppointments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appointments', error);
    throw error;
  }
};

export const addAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/appointments`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Failed to add appointment', error);
    throw error;
  }
};

export const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/appointments/${id}`, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Failed to update appointment', error);
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/appointments/${id}`);
  } catch (error) {
    console.error('Failed to delete appointment', error);
    throw error;
  }
};