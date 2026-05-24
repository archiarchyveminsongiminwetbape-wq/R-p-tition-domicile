import { useAuth0 }   from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useRole }     from '../hooks/useRole'
import Avatar          from './Avatar'

const NAV_PROF = [
  { id:'dashboard', icon:'⊞', label:'Tableau de bord' },
  { id:'annonces',  icon:'📋', label:'Mes annonces'    },
  { id:'seances',   icon:'📅', label:'Mes séances'     },
  { id:'revenus',   icon:'💰', label:'Mes revenus'     },
  { id:'profil',    icon:'👤', label:'Mon profil'      },
]
const NAV_PARENT = [
  { id:'dashboard', icon:'⊞', label:'Tableau de bord' },
  { id:'recherche', icon:'🔍', label:'Chercher un prof'},
  { id:'seances',   icon:'📅', label:'Mes séances'     },
  { id:'eleves',    icon:'🎒', label:'Mes élèves'      },
  { id:'paiements', icon:'💳', label:'Paiements'       },
  { id:'profil',    icon:'👤', label:'Mon profil'      },
]

export default function Sidebar({ page, setPage }) {
  const { user, logout } = useAuth0()
  const role = useRole()
  const nav  = useNavigate()

  const navItems = role === 'professeur' ? NAV_PROF : NAV_PARENT
  const initials = user
    ? ((user.given_name?.[0] ?? '') + (user.family_name?.[0] ?? '')).toUpperCase() || user.name?.slice(0,2).toUpperCase() || '?'
    : '?'

  return (
    <aside style={{ width:220, background:'#0F172A', color:'#fff', display:'flex', flexDirection:'column', height:'100vh', flexShrink:0, position:'sticky', top:0 }}>
      <div onClick={() => nav('/')} style={{ padding:'20px 20px 14px', borderBottom:'1px solid rgba(255,255,255,.08)', cursor:'pointer' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, lineHeight:1.3 }}>
          Répétitions<br/><span style={{ color:'#60A5FA' }}>à Domicile</span>
        </div>
        <div style={{ fontSize:10, color:'#475569', marginTop:4 }}>v2.0 · Auth0 sécurisé</div>
      </div>

      <div style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background: role==='professeur'?'rgba(26,86,219,.25)':'rgba(5,150,105,.25)', border:`1px solid ${role==='professeur'?'rgba(59,130,246,.3)':'rgba(16,185,129,.3)'}`, borderRadius:20, padding:'4px 12px' }}>
          <span style={{ fontSize:11 }}>{role==='professeur'?'👨‍🏫':'👨‍👩‍👧'}</span>
          <span style={{ fontSize:11, fontWeight:600, color:role==='professeur'?'#93C5FD':'#6EE7B7', textTransform:'capitalize' }}>{role ?? 'Utilisateur'}</span>
        </div>
      </div>

      <nav style={{ padding:'10px 8px', flex:1, overflowY:'auto' }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', border:'none', borderRadius:8, marginBottom:2, textAlign:'left', cursor:'pointer', background:page===item.id?'rgba(26,86,219,.3)':'transparent', color:page===item.id?'#93C5FD':'#94A3B8', fontWeight:page===item.id?600:400, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            <span style={{ fontSize:15 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding:'8px 8px 2px', borderTop:'1px solid rgba(255,255,255,.06)' }}>
        <button onClick={() => logout({ logoutParams:{ returnTo:window.location.origin }})}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', border:'none', borderRadius:8, cursor:'pointer', background:'transparent', color:'#64748B', fontSize:13, fontFamily:"'DM Sans',sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,.1)'; e.currentTarget.style.color='#FCA5A5' }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#64748B' }}>
          <span>🚪</span> Se déconnecter
        </button>
      </div>

      <div style={{ padding:'12px 16px 16px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {user?.picture
            ? <img src={user.picture} alt="" style={{ width:36,height:36,borderRadius:'50%',objectFit:'cover' }} />
            : <Avatar initials={initials} size={36} color='#1A56DB' />}
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#E2E8F0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name ?? 'Utilisateur'}</div>
            <div style={{ fontSize:10, color:'#475569', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
