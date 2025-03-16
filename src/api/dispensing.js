// src/api/dispensing.js
import axios from 'axios';

const API_BASE = "https://localhost:5227/api/dispensings";

// Fetch all dispensings
export const fetchDispensings = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error('Failed to fetch dispensings');
  return response.json();
};

// Add dispensing
export const addDispensing = async (dto) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error('Failed to add dispensing');
};

// Update dispensing
export const updateDispensing = async (id, dto) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error('Failed to update dispensing');
};

// Delete dispensing
export const deleteDispensing = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete dispensing');
};