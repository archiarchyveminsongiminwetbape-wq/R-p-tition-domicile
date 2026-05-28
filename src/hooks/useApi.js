import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Hook personnalisé pour gérer les appels API avec état de chargement et erreurs
 */
export function useApi(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => apiFunction().then(setData) };
}

/**
 * Hook pour charger les professeurs
 */
export function useProfesseurs(filters = {}) {
  return useApi(() => api.getProfesseurs(filters), [JSON.stringify(filters)]);
}

/**
 * Hook pour charger les séances
 */
export function useSeances(filters = {}) {
  return useApi(() => api.getSeances(filters), [JSON.stringify(filters)]);
}

/**
 * Hook pour charger les élèves
 */
export function useEleves(filters = {}) {
  return useApi(() => api.getEleves(filters), [JSON.stringify(filters)]);
}

/**
 * Hook pour charger les annonces
 */
export function useAnnonces(filters = {}) {
  return useApi(() => api.getAnnonces(filters), [JSON.stringify(filters)]);
}
