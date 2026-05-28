/**
 * Retourne le rôle de l'utilisateur connecté via localStorage.
 */
export function useRole() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.role || null
}

/**
 * Met à jour le rôle de l'utilisateur dans localStorage.
 */
export function setUserRole(role) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  user.role = role
  localStorage.setItem('user', JSON.stringify(user))
}