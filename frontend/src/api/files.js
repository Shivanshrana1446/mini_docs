import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const importFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${apiBase}/files/import`, formData, authHeaders());

  return response.data;
};
