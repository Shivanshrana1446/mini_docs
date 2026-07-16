import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const shareDocument = async (id, email) => {
  const response = await axios.post(`${apiBase}/shares/${id}`, { email }, authHeaders());
  return response.data;
};

export const fetchShares = async (id) => {
  const response = await axios.get(`${apiBase}/shares/${id}`, authHeaders());
  return response.data;
};
