import { useState }      from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth0 }      from '@auth0/auth0-react'

import Landing       from './pages/Landing'
import Login         from './pages/Login'
import Register      from './pages/Register'
import Callback      from './pages/Callback'
import RoleSelection from './pages/RoleSelection'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar       from './components/Sidebar'
import Dashboard     from './pages/Dashboard'
import Recherche     from './pages/Recherche'
import Seances       from './pages/Seances'
import Annonces      from './pages/Annonces'
import Eleves        from './pages/Eleves'
import Revenus       from './pages/Revenus'
import Paiements     from './pages/Paiements'
import Profil        from './pages/Profil'
import { useRole }   from './hooks/useRole'
import { PROFS_INIT, SEANCES_INIT, ELEVES_INIT } from './data/constants'

/* ── Layout principal de l'application (après connexion) ── */
function AppLayout() {
  const role = useRole()
  const [page,    setPage]    = useState('dashboard')
  const [profs]               = useState(PROFS_INIT)
  const [seances, setSeances] = useState(SEANCES_INIT)
  const [eleves,  setEleves]  = useState(ELEVES_INIT)

  function handleReservSuccess({ prof, date, heure, duree, eleve, montant }) {
    const end = addHours(heure, duree)
    setSeances(prev => [{
      id:      Date.now(),
      profId:  prof.id,
      prof:    `${prof.prenom} ${prof.nom}`,
      matière: prof.matières[0],
      niveau:  prof.niveaux[0],
      date,
      heure:   `${heure}–${end}`,
      statut:  'en_attente',
      eleve,
      montant,
    }, ...prev])
    setPage('seances')
  }

  function addHours(time, h) {
    const [hh, mm] = time.split(':').map(Number)
    const total = hh * 60 + mm + h * 60
    return `${String(Math.floor(total / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`
  }

  function renderPage() {
    switch (page) {
      case 'dashboard': return <Dashboard role={role} seances={seances} profs={profs} setPage={setPage} />
      case 'recherche': return role==='parent' ? <Recherche profs={profs} eleves={eleves} onReservSuccess={handleReservSuccess} /> : <Navigate to="/app" />
      case 'seances':   return <Seances seances={seances} setSeances={setSeances} role={role} />
      case 'annonces':  return role==='professeur' ? <Annonces /> : <Navigate to="/app" />
      case 'eleves':    return role==='parent' ? <Eleves eleves={eleves} setEleves={setEleves} /> : <Navigate to="/app" />
      case 'revenus':   return role==='professeur' ? <Revenus seances={seances} /> : <Navigate to="/app" />
      case 'paiements': return role==='parent' ? <Paiements seances={seances} /> : <Navigate to="/app" />
      case 'profil':    return <Profil role={role} />
      default:          return <Dashboard role={role} seances={seances} profs={profs} setPage={setPage} />
    }
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <Sidebar page={page} setPage={setPage} />
      <main style={{ flex:1, overflowY:'auto', padding:'28px 32px', background:'#F8FAFC' }}>
        {renderPage()}
      </main>
    </div>
  )
}

/* ── Router racine ─────────────────────────────────────── */
export default function App() {
  const { isLoading } = useAuth0()

  if (isLoading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8FAFC' }}>
      <div style={{ width:44,height:44,borderRadius:'50%',border:'4px solid #DBEAFE',borderTopColor:'#1A56DB',animation:'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <Routes>
      <Route path="/"              element={<Landing />} />
      <Route path="/connexion"     element={<Login />} />
      <Route path="/inscription"   element={<Register />} />
      <Route path="/callback"      element={<Callback />} />
      <Route path="/choisir-role"  element={<RoleSelection />} />
      <Route path="/app"           element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
      <Route path="*"              element={<Navigate to="/" replace />} />
    </Routes>
  )
}
