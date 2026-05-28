import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setUserRole } from '../hooks/useRole'

const ROLES = [
  { id:'parent',     icon:'👨‍👩‍👧', title:'Je suis un parent',    desc:'Je recherche des professeurs pour mes enfants.',   color:'#059669', bg:'#F0FDF4', border:'#BBF7D0' },
  { id:'professeur', icon:'👨‍🏫', title:'Je suis un professeur', desc:"Je propose des cours particuliers à domicile.",     color:'#1A56DB', bg:'#EFF6FF', border:'#BFDBFE' },
]

export default function RoleSelection() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const nav     = useNavigate()
  const [sel,   setSel]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function confirm() {
    if (!sel) return
    setLoading(true)
    setError('')
    try {
      setUserRole(sel)
      nav('/app')
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la sélection du rôle')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    nav('/connexion')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ maxWidth:520, width:'100%' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:64,height:64,borderRadius:20,background:'linear-gradient(135deg,#3B82F6,#1A56DB)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'serif',fontWeight:700,color:'#fff',fontSize:28,margin:'0 auto 16px' }}>R</div>
          <h1 style={{ fontSize:26,fontWeight:700,fontFamily:"'Playfair Display',serif",margin:'0 0 8px' }}>Bienvenue, {user?.prenom || user?.email?.split('@')[0] || 'Utilisateur'} !</h1>
          <p style={{ color:'#64748B',fontSize:15 }}>Avant de continuer, dites-nous qui vous êtes.</p>
        </div>

        {/* Choix du rôle */}
        <div style={{ display:'flex',flexDirection:'column',gap:14,marginBottom:28 }}>
          {ROLES.map(r => (
            <button key={r.id}
              onClick={() => setSel(r.id)}
              style={{
                padding:'22px 20px',
                border:`2px solid ${sel === r.id ? r.color : r.border}`,
                background: sel === r.id ? r.bg : '#fff',
                borderRadius:14, cursor:'pointer',
                display:'flex', alignItems:'center', gap:16, textAlign:'left',
                transition:'all .15s', fontFamily:"'DM Sans",sans-serif",
                boxShadow: sel === r.id ? `0 4px 12px ${r.color}22` : 'none',
              }}>
              <span style={{ fontSize:32 }}>{r.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontSize:15,color:'#0F172A' }}>{r.title}</div>
                <div style={{ fontSize:13,color:'#64748B',marginTop:2 }}>{r.desc}</div>
              </div>
              <div style={{
                width:22,height:22,borderRadius:'50%',
                border:`2px solid ${sel === r.id ? r.color : '#CBD5E1'}`,
                background: sel === r.id ? r.color : 'transparent',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                {sel === r.id && <div style={{ width:8,height:8,borderRadius:'50%',background:'#fff' }} />}
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background:'#FEF2F2',border:'1px solid #FCA5A5',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#B91C1C',marginBottom:16 }}>
            ⚠ {error}
          </div>
        )}

        <button onClick={confirm} disabled={!sel || loading} style={{
          width:'100%',padding:'14px 0',
          background: (!sel || loading) ? '#94A3B8' : '#1A56DB',
          color:'#fff',border:'none',borderRadius:10,fontWeight:700,
          fontSize:15,cursor: (!sel || loading) ? 'not-allowed' : 'pointer',
          fontFamily:"'DM Sans",sans-serif",
        }}>
          {loading ? 'Enregistrement…' : 'Confirmer et accéder à mon espace →'}
        </button>

        <button onClick={logout}
          style={{ width:'100%',marginTop:12,padding:'10px 0',background:'none',border:'none',color:'#94A3B8',fontSize:13,cursor:'pointer' }}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}