import axios from 'axios';

const API_URL = 'http://localhost:3004';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllEmployes = () => axios.get(`${API_URL}/employes`, getHeaders());
// Tous les employés peu importe le rôle (pour formulaire contrat)
export const getTousEmployes = () => axios.get(`${API_URL}/employes/tous`, getHeaders());
export const getOperants = () => axios.get(`${API_URL}/employes/operants`, getHeaders());
export const getChefsService = () => axios.get(`${API_URL}/employes/chefs-service`, getHeaders());
export const getProfil = () => axios.get(`${API_URL}/employes/profil`, getHeaders());
export const creerEmploye = (data) => axios.post(`${API_URL}/employes`, data, getHeaders());
export const modifierEmploye = (id, data) => axios.put(`${API_URL}/employes/${id}`, data, getHeaders());
export const supprimerEmploye = (id) => axios.delete(`${API_URL}/employes/${id}`, getHeaders());
export const supprimerOperant = (id) => axios.delete(`${API_URL}/employes/operants/${id}`, getHeaders());
export const modifierProfil = (data) => axios.put(`${API_URL}/employes/profil`, data, getHeaders());