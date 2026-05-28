const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Service API pour communiquer avec le backend
 */
class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Professeurs
  async getProfesseurs(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/professeurs?${params}`);
  }

  async getProfesseur(id) {
    return this.request(`/professeurs/${id}`);
  }

  async createProfesseur(data) {
    return this.request('/professeurs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfesseur(id, data) {
    return this.request(`/professeurs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProfesseur(id) {
    return this.request(`/professeurs/${id}`, {
      method: 'DELETE',
    });
  }

  // Séances
  async getSeances(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/seances?${params}`);
  }

  async getSeance(id) {
    return this.request(`/seances/${id}`);
  }

  async getSeancesByProfesseur(profId) {
    return this.request(`/seances/professeur/${profId}`);
  }

  async getSeancesByParent(parentId) {
    return this.request(`/seances/parent/${parentId}`);
  }

  async createSeance(data) {
    return this.request('/seances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSeance(id, data) {
    return this.request(`/seances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateSeanceStatut(id, statut) {
    return this.request(`/seances/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    });
  }

  async deleteSeance(id) {
    return this.request(`/seances/${id}`, {
      method: 'DELETE',
    });
  }

  // Élèves
  async getEleves(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/eleves?${params}`);
  }

  async getEleve(id) {
    return this.request(`/eleves/${id}`);
  }

  async getElevesByParent(parentId) {
    return this.request(`/eleves/parent/${parentId}`);
  }

  async createEleve(data) {
    return this.request('/eleves', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEleve(id, data) {
    return this.request(`/eleves/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEleve(id) {
    return this.request(`/eleves/${id}`, {
      method: 'DELETE',
    });
  }

  // Annonces
  async getAnnonces(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/annonces?${params}`);
  }

  async getAnnonce(id) {
    return this.request(`/annonces/${id}`);
  }

  async getAnnoncesByProfesseur(profId) {
    return this.request(`/annonces/professeur/${profId}`);
  }

  async createAnnonce(data) {
    return this.request('/annonces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAnnonce(id, data) {
    return this.request(`/annonces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateAnnonceStatut(id, statut) {
    return this.request(`/annonces/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    });
  }

  async deleteAnnonce(id) {
    return this.request(`/annonces/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
