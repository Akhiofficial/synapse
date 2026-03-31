import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
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

export const updateItem = async (id, data) => {
  const response = await api.put(`/item/${id}`, data);
  return response.data;
};

export const saveItem = async (formData) => {
  const response = await api.post('/save', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await api.delete(`/item/${id}`);
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
