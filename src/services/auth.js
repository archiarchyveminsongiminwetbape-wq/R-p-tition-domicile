const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

// Service d'authentification JWT
class AuthService {
  // Stocker les tokens
  setTokens(token, refreshToken) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Récupérer le token
  getToken() {
    return localStorage.getItem('token');
  }

  // Récupérer le refresh token
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  // Nettoyer les tokens
  clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    return !!this.getToken();
  }

  // Récupérer les informations utilisateur depuis le token
  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Décoder le token JWT (partie payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Erreur de décodage du token:', error);
      return null;
    }
  }

  // Inscription
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de l'inscription");

      // Stocker les tokens et les infos utilisateur
      this.setTokens(data.token, data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  }

  // Connexion
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Identifiants incorrects');

      // Stocker les tokens et les infos utilisateur
      this.setTokens(data.token, data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  // Déconnexion
  logout() {
    this.clearTokens();
  }

  // Obtenir les headers d'authentification
  getAuthHeaders() {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la mise à jour du profil');

      // Mettre à jour les informations utilisateur en local
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      throw error;
    }
  }

  // Récupérer le profil utilisateur depuis le serveur
  async fetchProfile() {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la récupération du profil');

      // Mettre à jour les informations utilisateur en local
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Erreur de récupération du profil:', error);
      throw error;
    }
  }

  // Rafraîchir le token (si expiré)
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      this.setTokens(data.token, data.refreshToken);
      return data.token;
    } catch (error) {
      console.error('Erreur de rafraîchissement du token:', error);
      this.clearTokens();
      return null;
    }
  }
}

export default new AuthService();