import axios from 'axios';

export async function fetchInventory() {
  const response = await axios.get('/api/inventory');
  return response.data;
} 