import { useEffect }  from 'react'
import { useAuth0 }   from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useRole }    from '../hooks/useRole'

export default function Callback() {
  const { isLoading, isAuthenticated, error } = useAuth0()
  const role = useRole()
  const nav  = useNavigate()

  useEffect(() => {
    if (isLoading) return
    if (error)     { nav('/connexion'); return }
    if (!isAuthenticated) { nav('/connexion'); return }

    // Si l'utilisateur n'a pas encore de rôle (connexion Google la première fois)
    if (!role) { nav('/choisir-role'); return }

    nav('/app')
  }, [isLoading, isAuthenticated, error, role])

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#F8FAFC', gap: 20,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        border: '4px solid #DBEAFE',
        borderTopColor: '#1A56DB',
        animation: 'spin .8s linear infinite',
      }} />
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 600, color: '#0F172A', fontSize: 16 }}>Connexion en cours…</p>
        <p style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>Vérification de vos identifiants Auth0</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
