import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const fetchDocuments = async () => {
  const response = await axios.get(`${apiBase}/documents`, authHeaders());
  return response.data;
};

export const createDocument = async (title = 'New Document', content = '') => {
  const response = await axios.post(
    `${apiBase}/documents`,
    { title, content },
    authHeaders()
  );
  return response.data;
};

export const fetchDocument = async (id) => {
  const response = await axios.get(`${apiBase}/documents/${id}`, authHeaders());
  return response.data;
};

export const updateDocument = async (id, payload) => {
  const response = await axios.put(`${apiBase}/documents/${id}`, payload, authHeaders());
  return response.data;
};
