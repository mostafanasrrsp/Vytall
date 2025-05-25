import axios from 'axios';

export async function fetchProviders({ search = '', specialty = '' } = {}) {
  const params = {};
  if (search) params.search = search;
  if (specialty) params.specialty = specialty;
  const res = await axios.get('/api/providers', { params });
  return res.data;
} 