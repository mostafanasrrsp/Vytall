import axios from 'axios';

export async function uploadDocument(file, patientId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('patientId', patientId);
  const res = await axios.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export function downloadDocument(fileName) {
  return axios.get(`/api/documents/download/${fileName}`, {
    responseType: 'blob',
  });
} 