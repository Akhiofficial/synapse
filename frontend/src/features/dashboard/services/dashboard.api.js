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

// Highlights
export const fetchHighlights = async (itemId) => {
  const response = await api.get(`/highlights/${itemId}`);
  return response.data;
};

export const addHighlight = async (highlightData) => {
  const response = await api.post('/highlights', highlightData);
  return response.data;
};

export const deleteHighlight = async (id) => {
  const response = await api.delete(`/highlights/${id}`);
  return response.data;
};

export const updateHighlight = async (id, data) => {
  const response = await api.put(`/highlights/${id}`, data);
  return response.data;
};
