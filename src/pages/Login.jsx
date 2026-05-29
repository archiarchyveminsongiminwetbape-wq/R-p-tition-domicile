import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResponsive } from '../hooks/useResponsive'
import authService from '../services/auth'

export default function Login() {
  const nav = useNavigate()
  const { isMobile } = useResponsive()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Utiliser le service d'authentification JWT
      await authService.login(email, password)

      // Redirection vers l'application
      nav('/app')
    } catch (err) {
      setError('Identifiants incorrects. Veuillez réessayer.')
      setLoading(false)
    }
  }

  const field = (label, val, set, type = 'text', placeholder = '') => (
    <div>
      <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 5, fontWeight: 500 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={type === 'password' ? (showPw ? 'text' : 'password') : type}
          value={val}
          onChange={e => set(e.target.value)}
          placeholder={placeholder}
          required
          style={{ width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = '#1A56DB'}
          onBlur={e => e.target.style.borderColor = '#E2E8F0'}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPw(p => !p)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 16 }}
          >
            {showPw ? '🙈' : '👁'}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC', flexDirection: isMobile ? 'column' : 'row' }}>
      <div style={{ width: isMobile ? '100%' : '42%', background: '#0F172A', display: 'flex', flexDirection: 'column', padding: isMobile ? '28px 18px 24px' : '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,.2) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,.12) 0%,transparent 70%)' }} />
        <div onClick={() => nav('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: isMobile ? 22 : 'auto', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3B82F6,#1A56DB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', fontWeight: 700, color: '#fff', fontSize: 16 }}>R</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: '#fff' }}>Répétitions<span style={{ color: '#60A5FA' }}> à Domicile</span></span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: isMobile ? 26 : 34, color: '#fff', fontWeight: 700, lineHeight: 1.3, margin: '0 0 16px' }}>
            Bon retour parmi nous 👋
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.7, marginBottom: isMobile ? 24 : 36 }}>
            Connectez-vous pour accéder à votre espace personnel et gérer vos cours particuliers.
          </p>
          <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: 20 }}>
            <div style={{ color: '#F59E0B', fontSize: 16, marginBottom: 10 }}>★★★★★</div>
            <p style={{ color: '#CBD5E1', fontSize: 13, lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 12px' }}>
              "La plateforme m'a permis de trouver un professeur de maths excellent en moins de 24h. Mon fils a réussi son bac avec mention !"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 13 }}>MA</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>Mme Ateba</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>Parent · Yaoundé</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px 16px 28px' : '48px 40px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: '0 0 6px' }}>Se connecter</h1>
          <p style={{ color: '#64748B', marginBottom: 24 }}>
            Accédez à votre espace{' '}
            <span onClick={() => nav('/inscription')} style={{ color: '#1A56DB', fontWeight: 600, cursor: 'pointer' }}>ou créez un compte</span>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} /><span style={{ fontSize: 12, color: '#94A3B8' }}>Connexion avec email</span><div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {field('Adresse email', email, setEmail, 'email', 'votre@email.com')}
            {field('Mot de passe', password, setPassword, 'password', '••••••••')}

            <div style={{ textAlign: 'right' }}>
              <span
                onClick={() => nav('/mot-de-passe-oublie')}
                style={{ fontSize: 12, color: '#1A56DB', fontWeight: 600, cursor: 'pointer' }}
              >
                Mot de passe oublié ?
              </span>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#B91C1C' }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px 0',
              background: loading ? '#94A3B8' : '#1A56DB',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
              fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans',sans-serif",
            }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748B' }}>
            En vous connectant, vous acceptez nos{' '}
            <span style={{ color: '#1A56DB', fontWeight: 600, cursor: 'pointer' }}>Conditions d'utilisation</span>
            {' '}et{' '}
            <span style={{ color: '#1A56DB', fontWeight: 600, cursor: 'pointer' }}>Politique de confidentialité</span>
          </p>
        </div>
      </div>
    </div>
  )
}