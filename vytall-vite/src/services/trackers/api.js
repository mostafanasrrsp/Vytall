import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://localhost:5227/api', // Adjust if your API base URL is different
}); 