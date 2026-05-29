import { Navigate } from 'react-router-dom'
import authService from '../services/auth'
import { useRole } from '../hooks/useRole'

function Spinner() {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '4px solid #E2E8F0',
        borderTopColor: '#1A56DB',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#64748B', fontSize: 14 }}>Vérification de votre session…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

/**
 * Protège une route :
 * - Si non authentifié → redirige vers /connexion
 * - Si pas de rôle    → redirige vers /choisir-role
 * - Si rôle requis ne correspond pas → redirige vers /app
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUserFromToken()
  const role = user?.role || useRole()

  if (!isAuthenticated || !user?.email) return <Navigate to="/connexion" replace />
  if (!role) return <Navigate to="/choisir-role" replace />
  if (requiredRole && role !== requiredRole) return <Navigate to="/app" replace />

  return children
}