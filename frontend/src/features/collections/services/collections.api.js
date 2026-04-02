import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const fetchCollections = async () => {
  const response = await api.get('/collections');
  return response.data;
};

export const createCollection = async (name) => {
  const response = await api.post('/collections', { name });
  return response.data;
};

export const fetchCollectionItems = async (id) => {
  const response = await api.get(`/collections/${id}/items`);
  return response.data;
};

export const addItemToCollection = async (collectionId, itemId) => {
  const response = await api.post(`/collections/${collectionId}/add`, { itemId });
  return response.data;
};

export const removeItemFromCollection = async (collectionId, itemId) => {
  const response = await api.post(`/collections/${collectionId}/remove`, { itemId });
  return response.data;
};

export const updateCollection = async (id, name) => {
  const response = await api.put(`/collections/${id}`, { name });
  return response.data;
};

export const deleteCollection = async (id) => {
  const response = await api.delete(`/collections/${id}`);
  return response.data;
};
