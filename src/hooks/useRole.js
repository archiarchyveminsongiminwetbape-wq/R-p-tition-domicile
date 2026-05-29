import authService from '../services/auth'

/**
 * Retourne le rôle de l'utilisateur connecté via JWT token.
 */
export function useRole() {
  const user = authService.getUserFromToken()
  return user?.role || null
}

/**
 * Met à jour le rôle de l'utilisateur dans localStorage (pour compatibilité).
 */
export function setUserRole(role) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  user.role = role
  localStorage.setItem('user', JSON.stringify(user))
}