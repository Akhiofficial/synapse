import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const fetchResurfaceItems = async () => {
  const response = await api.get('/resurface');
  return response.data;
};

export const fetchRecentItems = async () => {
  const response = await api.get('/items');
  return response.data;
};

export const fetchItemById = async (id) => {
  const response = await api.get(`/item/${id}`);
  return response.data;
};

export const fetchRelatedItems = async (id) => {
  const response = await api.get(`/related/${id}`);
  return response.data;
};
