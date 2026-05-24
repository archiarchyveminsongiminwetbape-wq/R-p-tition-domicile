import { useState }      from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 }       from '@auth0/auth0-react'
import { AUTH0_CONFIG, DB_CONNECTION, SIGNUP_URL } from '../auth/config'

function Logo({ onClick }) {
  return (
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginBottom:40 }}>
      <div style={{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#3B82F6,#1A56DB)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'serif',fontWeight:700,color:'#fff',fontSize:16 }}>R</div>
      <span style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:'#0F172A' }}>Répétitions<span style={{color:'#1A56DB'}}> à Domicile</span></span>
    </div>
  )
}

const ROLES = [
  { id:'parent',     icon:'👨‍👩‍👧', title:'Je suis un parent',    desc:'Je cherche un professeur pour mon enfant.',             color:'#059669', bg:'#F0FDF4', border:'#BBF7D0' },
  { id:'professeur', icon:'👨‍🏫', title:'Je suis un professeur', desc:"J'offre des cours particuliers à domicile.",             color:'#1A56DB', bg:'#EFF6FF', border:'#BFDBFE' },
]

export default function Register() {
  const nav      = useNavigate()
  const location = useLocation()
  const { loginWithRedirect } = useAuth0()

  const preselected = location.state?.role ?? null
  const [step,     setStep]     = useState(preselected ? 2 : 1)
  const [role,     setRole]     = useState(preselected ?? '')
  const [prenom,   setPrenom]   = useState('')
  const [nom,      setNom]      = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showPw,   setShowPw]   = useState(false)

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const pwColors   = ['#E2E8F0','#EF4444','#F59E0B','#059669']
  const pwLabels   = ['','Faible','Moyen','Fort']

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas.')
    if (password.length < 8)  return setError('Le mot de passe doit contenir au moins 8 caractères.')

    setLoading(true)
    try {
      const res = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:     AUTH0_CONFIG.clientId,
          email,
          password,
          connection:    DB_CONNECTION,
          given_name:    prenom,
          family_name:   nom,
          user_metadata: { role, prenom, nom },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.description ?? data.message ?? "Erreur lors de l'inscription.")

      // Connexion automatique après inscription réussie
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri:   AUTH0_CONFIG.callbackUrl,
          login_hint:     email,
          prompt:         'login',
        },
        appState: { returnTo: '/app' },
      })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  async function loginWithGoogle() {
    await loginWithRedirect({
      authorizationParams: {
        connection:   'google-oauth2',
        redirect_uri: AUTH0_CONFIG.callbackUrl,
      },
      appState: { returnTo: '/choisir-role', role },
    })
  }

  const input = (label, val, set, opts = {}) => (
    <div>
      <label style={{ fontSize:12, color:'#64748B', display:'block', marginBottom:5, fontWeight:500 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <input
          type={opts.type === 'password' ? (showPw ? 'text' : 'password') : opts.type ?? 'text'}
          value={val} onChange={e => set(e.target.value)}
          placeholder={opts.placeholder ?? ''}
          required
          style={{
            width:'100%', padding:'11px 14px', border:'1px solid #E2E8F0', borderRadius:10,
            fontSize:14, outline:'none', boxSizing:'border-box',
            background: error && opts.validate?.(val) ? '#FEF2F2' : '#fff',
            transition:'border-color .15s',
          }}
          onFocus={e  => e.target.style.borderColor = '#1A56DB'}
          onBlur={e   => e.target.style.borderColor = '#E2E8F0'}
        />
        {opts.type === 'password' && (
          <button type="button" onClick={() => setShowPw(p => !p)}
            style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', border:'none', background:'none', cursor:'pointer', color:'#94A3B8', fontSize:16 }}>
            {showPw ? '🙈' : '👁'}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'#F8FAFC' }}>
      {/* Panel gauche */}
      <div style={{ width:'44%', background:'#0F172A', display:'flex', flexDirection:'column', padding:'48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,.2) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,.15) 0%,transparent 70%)' }} />
        <div onClick={() => nav('/')} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginBottom:'auto', position:'relative', zIndex:1 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#3B82F6,#1A56DB)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'serif',fontWeight:700,color:'#fff',fontSize:16 }}>R</div>
          <span style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:'#fff' }}>Répétitions<span style={{color:'#60A5FA'}}> à Domicile</span></span>
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:'#fff', fontWeight:700, lineHeight:1.3, margin:'0 0 16px' }}>
            {role === 'professeur' ? 'Développez votre activité' : role === 'parent' ? 'Le meilleur suivi pour votre enfant' : 'Rejoignez notre plateforme'}
          </h2>
          <p style={{ color:'#94A3B8', fontSize:15, lineHeight:1.7 }}>
            {role === 'professeur'
              ? 'Publiez vos annonces, gérez vos séances et recevez vos paiements en toute simplicité.'
              : role === 'parent'
              ? 'Trouvez le professeur idéal, réservez en ligne et suivez les progrès de votre enfant.'
              : 'Connectez-vous à des centaines de professeurs qualifiés ou partagez vos compétences.'}
          </p>
          <div style={{ marginTop:36, display:'flex', flexDirection:'column', gap:14 }}>
            {['✓ Inscription 100% gratuite','✓ Paiement sécurisé Mobile Money','✓ Professeurs vérifiés','✓ Réservation en ligne 24h/24'].map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:10, color:'#94A3B8', fontSize:14 }}>
                <span style={{ color:'#60A5FA' }}>{f.slice(0,1)}</span>{f.slice(2)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel droit */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 40px', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:460 }}>
          {/* Étape 1 : choix du rôle */}
          {step === 1 && (
            <>
              <h1 style={{ fontSize:26, fontWeight:700, fontFamily:"'Playfair Display',serif", margin:'0 0 6px' }}>Créer un compte</h1>
              <p style={{ color:'#64748B', marginBottom:32 }}>Vous êtes…</p>
              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:32 }}>
                {ROLES.map(r => (
                  <button key={r.id} onClick={() => { setRole(r.id); setStep(2) }}
                    style={{
                      padding:'22px 20px', border:`2px solid ${r.border}`,
                      background: r.bg, borderRadius:14, cursor:'pointer',
                      display:'flex', alignItems:'center', gap:16, textAlign:'left',
                      transition:'all .15s', fontFamily:"'DM Sans',sans-serif",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = r.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = r.border}>
                    <span style={{ fontSize:32 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:'#0F172A' }}>{r.title}</div>
                      <div style={{ fontSize:13, color:'#64748B', marginTop:2 }}>{r.desc}</div>
                    </div>
                    <span style={{ marginLeft:'auto', color:r.color, fontSize:18 }}>→</span>
                  </button>
                ))}
              </div>
              <p style={{ textAlign:'center', fontSize:13, color:'#64748B' }}>
                Déjà inscrit ?{' '}
                <span onClick={() => nav('/connexion')} style={{ color:'#1A56DB', fontWeight:600, cursor:'pointer' }}>Se connecter</span>
              </p>
            </>
          )}

          {/* Étape 2 : formulaire */}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} style={{ border:'none', background:'none', color:'#1A56DB', fontSize:13, fontWeight:600, cursor:'pointer', padding:0, marginBottom:24 }}>← Changer de rôle</button>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
                <span style={{ fontSize:28 }}>{ROLES.find(r => r.id === role)?.icon}</span>
                <div>
                  <h1 style={{ fontSize:22, fontWeight:700, fontFamily:"'Playfair Display',serif", margin:0 }}>Créer mon compte</h1>
                  <p style={{ color:'#64748B', fontSize:13, margin:0 }}>{ROLES.find(r => r.id === role)?.title}</p>
                </div>
              </div>

              {/* Google */}
              <button onClick={loginWithGoogle} style={{
                width:'100%', padding:'11px 0', border:'1px solid #E2E8F0', borderRadius:10,
                background:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                gap:10, fontSize:14, fontWeight:600, color:'#374151',
                cursor:'pointer', marginBottom:20, fontFamily:"'DM Sans',sans-serif",
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
                Continuer avec Google
              </button>

              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
                <span style={{ fontSize:12, color:'#94A3B8' }}>ou avec un email</span>
                <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {input('Prénom *', prenom, setPrenom, { placeholder:'Jean' })}
                  {input('Nom *',    nom,    setNom,    { placeholder:'Dupont' })}
                </div>
                {input('Adresse email *', email, setEmail, { type:'email', placeholder:'jean@exemple.com' })}
                {input('Mot de passe *', password, setPassword, { type:'password', placeholder:'Min. 8 caractères' })}

                {/* Indicateur de force */}
                {password.length > 0 && (
                  <div>
                    <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                      {[1,2,3].map(i => (
                        <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i <= pwStrength ? pwColors[pwStrength] : '#E2E8F0', transition:'background .3s' }} />
                      ))}
                    </div>
                    <span style={{ fontSize:11, color:pwColors[pwStrength], fontWeight:600 }}>{pwLabels[pwStrength]}</span>
                  </div>
                )}

                {input('Confirmer le mot de passe *', confirm, setConfirm, { type:'password', placeholder:'Répétez le mot de passe' })}

                {error && (
                  <div style={{ background:'#FEF2F2', border:'1px solid #FCA5A5', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#B91C1C' }}>
                    ⚠ {error}
                  </div>
                )}

                <button type="submit" disabled={loading} style={{
                  width:'100%', padding:'13px 0', background: loading ? '#94A3B8' : '#1A56DB',
                  color:'#fff', border:'none', borderRadius:10, fontWeight:700,
                  fontSize:15, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily:"'DM Sans',sans-serif", marginTop:4,
                }}>
                  {loading ? 'Création du compte…' : 'Créer mon compte'}
                </button>

                <p style={{ textAlign:'center', fontSize:12, color:'#94A3B8', margin:0 }}>
                  En vous inscrivant, vous acceptez nos{' '}
                  <span style={{ color:'#1A56DB', cursor:'pointer' }}>Conditions d'utilisation</span>{' '}et notre{' '}
                  <span style={{ color:'#1A56DB', cursor:'pointer' }}>Politique de confidentialité</span>.
                </p>
              </form>

              <p style={{ textAlign:'center', fontSize:13, color:'#64748B', marginTop:20 }}>
                Déjà inscrit ?{' '}
                <span onClick={() => nav('/connexion')} style={{ color:'#1A56DB', fontWeight:600, cursor:'pointer' }}>Se connecter</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
