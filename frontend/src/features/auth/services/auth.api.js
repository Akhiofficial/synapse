import axios from 'axios';

const api = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
});

export const loginApi = async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};

export const registerApi = async (name, email, password) => {
    const response = await api.post('/register', { name, email, password });
    return response.data;
};

export const getCurrentUserApi = async () => {
    const response = await api.get('/me');
    return response.data;
};

export const logoutApi = async () => {
    const response = await api.post('/logout');
    return response.data;
};

export const updateUserApi = async (data) => {
    const response = await api.put('/me', data);
    return response.data;
};

export const deleteUserApi = async () => {
    const response = await api.delete('/me');
    return response.data;
};
