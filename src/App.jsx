import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Callback from './pages/Callback'
import RoleSelection from './pages/RoleSelection'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Recherche from './pages/Recherche'
import Seances from './pages/Seances'
import Annonces from './pages/Annonces'
import Eleves from './pages/Eleves'
import Revenus from './pages/Revenus'
import Paiements from './pages/Paiements'
import Profil from './pages/Profil'
import { useRole } from './hooks/useRole'
import { useResponsive } from './hooks/useResponsive'
import { PROFS_INIT, SEANCES_INIT, ELEVES_INIT } from './data/constants'
import api from './services/api'

const NAV_PROF = [
  { id: 'dashboard', icon: '⊞', label: 'Tableau de bord' },
  { id: 'annonces', icon: '📋', label: 'Mes annonces' },
  { id: 'seances', icon: '📅', label: 'Mes séances' },
  { id: 'revenus', icon: '💰', label: 'Mes revenus' },
  { id: 'profil', icon: '👤', label: 'Mon profil' },
]

const NAV_PARENT = [
  { id: 'dashboard', icon: '⊞', label: 'Tableau de bord' },
  { id: 'recherche', icon: '🔍', label: 'Chercher un prof' },
  { id: 'seances', icon: '📅', label: 'Mes séances' },
  { id: 'eleves', icon: '🎒', label: 'Mes élèves' },
  { id: 'paiements', icon: '💳', label: 'Paiements' },
  { id: 'profil', icon: '👤', label: 'Mon profil' },
]

function AppLayout() {
  const role = useRole()
  const { isMobile } = useResponsive()
  const [page, setPage] = useState('dashboard')
  const [profs, setProfs] = useState(PROFS_INIT)
  const [seances, setSeances] = useState(SEANCES_INIT)
  const [eleves, setEleves] = useState(ELEVES_INIT)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const navItems = role === 'professeur' ? NAV_PROF : NAV_PARENT

  // Charger les données depuis l'API au démarrage
  useEffect(() => {
    async function loadData() {
      try {
        const [profsData, seancesData, elevesData] = await Promise.all([
          api.getProfesseurs(),
          api.getSeances(),
          api.getEleves()
        ])
        setProfs(profsData)
        setSeances(seancesData)
        setEleves(elevesData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        // Garder les données mock en cas d'erreur
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  async function handleReservSuccess({ prof, date, heure, duree, eleve, montant }) {
    const end = addHours(heure, duree)
    
    try {
      // Créer la séance via l'API
      const newSeance = await api.createSeance({
        prof_id: prof.id,
        eleve_id: eleve.id,
        matiere: prof.matières[0],
        niveau: prof.niveaux[0],
        date,
        heure: `${heure}–${end}`,
        duree,
        montant,
        statut: 'en_attente'
      })
      
      // Mettre à jour l'état local
      setSeances(prev => [newSeance, ...prev])
      setPage('seances')
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error)
      // Fallback: mettre à jour l'état local uniquement
      setSeances(prev => [{
        id: Date.now(),
        profId: prof.id,
        prof: `${prof.prenom} ${prof.nom}`,
        matière: prof.matières[0],
        niveau: prof.niveaux[0],
        date,
        heure: `${heure}–${end}`,
        statut: 'en_attente',
        eleve: eleve.nom,
        montant,
      }, ...prev])
      setPage('seances')
    }
  }

  function addHours(time, h) {
    const [hh, mm] = time.split(':').map(Number)
    const total = hh * 60 + mm + h * 60
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
  }

  function renderPage() {
    switch (page) {
      case 'dashboard':
        return <Dashboard role={role} seances={seances} profs={profs} setPage={setPage} />
      case 'recherche':
        return role === 'parent' ? <Recherche profs={profs} eleves={eleves} onReservSuccess={handleReservSuccess} /> : <Navigate to="/app" />
      case 'seances':
        return <Seances seances={seances} setSeances={setSeances} role={role} />
      case 'annonces':
        return role === 'professeur' ? <Annonces /> : <Navigate to="/app" />
      case 'eleves':
        return role === 'parent' ? <Eleves eleves={eleves} setEleves={setEleves} /> : <Navigate to="/app" />
      case 'revenus':
        return role === 'professeur' ? <Revenus seances={seances} /> : <Navigate to="/app" />
      case 'paiements':
        return role === 'parent' ? <Paiements seances={seances} /> : <Navigate to="/app" />
      case 'profil':
        return <Profil role={role} />
      default:
        return <Dashboard role={role} seances={seances} profs={profs} setPage={setPage} />
    }
  }

  const currentLabel = navItems.find(item => item.id === page)?.label ?? 'Tableau de bord'

  return (
    <div style={isMobile ? { display: 'flex', flexDirection: 'column', minHeight: '100vh' } : { display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {isMobile ? (
        <>
          <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#0F172A', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>
                  Répétitions <span style={{ color: '#60A5FA' }}>à Domicile</span>
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{currentLabel}</div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(open => !open)}
                aria-label="Ouvrir le menu"
                style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)', color: '#fff', padding: '8px 12px', fontSize: 18 }}
              >
                ☰
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div style={{ background: '#0F172A', padding: '8px 12px 14px' }}>
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id)
                    setMobileMenuOpen(false)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '11px 12px',
                    borderRadius: 10,
                    marginBottom: 6,
                    textAlign: 'left',
                    border: 'none',
                    background: page === item.id ? 'rgba(26,86,219,.32)' : 'transparent',
                    color: page === item.id ? '#93C5FD' : '#E2E8F0',
                    fontWeight: page === item.id ? 700 : 500,
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <Sidebar page={page} setPage={setPage} />
      )}
      <main style={isMobile ? { flex: 1, padding: '18px 16px 28px', background: '#F8FAFC' } : { flex: 1, overflowY: 'auto', padding: '28px 32px', background: '#F8FAFC' }}>
        {renderPage()}
      </main>
    </div>
  )
}

export default function App() {
  const { isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #DBEAFE', borderTopColor: '#1A56DB', animation: 'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/choisir-role" element={<RoleSelection />} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
