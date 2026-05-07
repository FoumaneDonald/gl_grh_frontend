import axios from 'axios';

const API_URL = 'http://localhost:3004';
const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllContrats  = ()          => axios.get(`${API_URL}/contrats`, getHeaders());
export const getMonContrat   = ()          => axios.get(`${API_URL}/contrats/mon-contrat`, getHeaders());
export const creerContrat    = (data)      => axios.post(`${API_URL}/contrats`, data, getHeaders());
export const activerContrat  = (id)        => axios.put(`${API_URL}/contrats/${id}/activer`, {}, getHeaders());
export const accepterContrat = (id)        => axios.put(`${API_URL}/contrats/${id}/accepter`, {}, getHeaders());
export const annulerContrat  = (id, motif) => axios.put(`${API_URL}/contrats/${id}/annuler`, { motif }, getHeaders());
export const terminerContrat = (id)        => axios.put(`${API_URL}/contrats/${id}/terminer`, {}, getHeaders());