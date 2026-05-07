const API_BASE_URL = '/api';

export const api = {
  // Récupérer tous les contrats
  getContrats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contrats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats:', error);
      throw error;
    }
  },

  // Créer un nouveau contrat
  createContrat: async (contrat) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contrats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contrat),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
      throw error;
    }
  },

  // Activer un contrat
  activerContrat: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contrats/${id}/activer`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'activation du contrat:', error);
      throw error;
    }
  },
};
