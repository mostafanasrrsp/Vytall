import axios from 'axios';

export async function fetchOrders() {
  const response = await axios.get('/api/OrderTracking');
  return response.data;
} 