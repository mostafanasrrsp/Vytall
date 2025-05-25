import axios from 'axios';

const API_URL = '/api/patientsatisfactionsurveys';

export const submitSurvey = async (survey) => {
  const response = await axios.post(API_URL, survey);
  return response.data;
};

export const fetchSurveys = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
}; 