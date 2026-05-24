import { useAuth0 } from '@auth0/auth0-react'
import { ROLE_CLAIM, MGMT_API_URL } from '../auth/config'

/**
 * Retourne le rôle de l'utilisateur connecté.
 * Ordre de priorité :
 *   1. Custom claim dans le token (via Auth0 Action)
 *   2. user_metadata.role (disponible dans l'objet user)
 *   3. null
 */
export function useRole() {
  const { user } = useAuth0()
  if (!user) return null
  return user[ROLE_CLAIM] ?? user.user_metadata?.role ?? null
}

/**
 * Met à jour le rôle de l'utilisateur via le Management API.
 * Nécessite un access token avec audience = Management API
 * et le scope update:current_user_metadata.
 */
export async function setUserRole(accessToken, userId, role) {
  const res = await fetch(`${MGMT_API_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ user_metadata: { role } }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Erreur lors de la mise à jour du rôle')
  }
  return res.json()
}
