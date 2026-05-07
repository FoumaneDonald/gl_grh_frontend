import axios from 'axios';

const API_URL = 'http://localhost:3004';

export const login = async (login, motDePasse) => {
  const response = await axios.post(`${API_URL}/auth/login`, { login, motDePasse });
  const { token, role, id, nom } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('userId', id);
  localStorage.setItem('nom', nom);
  return response.data;
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

export const getRole = () => localStorage.getItem('role');
export const getUserId = () => localStorage.getItem('userId');
export const getNom = () => localStorage.getItem('nom');
export const isAuthenticated = () => !!localStorage.getItem('token');