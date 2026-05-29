import { useNavigate } from 'react-router-dom'
import { useResponsive } from '../hooks/useResponsive'

/* ── petits composants ───────────────────────────────────── */
function Navbar() {
  const nav = useNavigate()
  const { isMobile } = useResponsive()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 48px', height: isMobile ? 60 : 68,
      background: 'rgba(15,23,42,.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => nav('/')} style={{ cursor: 'pointer' }}>
        <div style={{
          width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, borderRadius: 10,
          background: 'linear-gradient(135deg,#3B82F6,#1A56DB)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'serif', fontWeight: 700, color: '#fff', fontSize: isMobile ? 14 : 16,
        }}>R</div>
        {!isMobile && (
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: '#fff', fontSize: 17 }}>
            Répétitions<span style={{ color: '#60A5FA' }}> à Domicile</span>
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: isMobile ? 6 : 8, alignItems: 'center' }}>
        {user.email ? (
          <button onClick={() => nav('/app')} style={{
            padding: isMobile ? '8px 14px' : '9px 18px', background: '#1A56DB', color: '#fff',
            borderRadius: 9, fontWeight: 600, fontSize: isMobile ? 12 : 13, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', border: 'none',
          }}>
            Mon espace →
          </button>
        ) : (
          <>
            {!isMobile && (
              <button onClick={() => nav('/connexion')} style={{
                padding: '9px 18px', background: 'transparent', color: '#CBD5E1',
                border: '1px solid rgba(255,255,255,.15)', borderRadius: 9, fontWeight: 600,
                fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>
                Se connecter
              </button>
            )}
            <button onClick={() => nav('/inscription')} style={{
              padding: isMobile ? '8px 14px' : '9px 18px', background: '#1A56DB', color: '#fff',
              borderRadius: 9, fontWeight: 600, fontSize: isMobile ? 12 : 13, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', border: 'none',
            }}>
              {isMobile ? "S'inscrire" : "S'inscrire gratuitement"}
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

function StatCard({ n, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display',serif" }}>{n}</div>
      <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '28px 26px',
      border: '1px solid #E2E8F0',
      transition: 'transform .2s, box-shadow .2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, marginBottom: 16,
      }}>{icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#0F172A' }}>{title}</h3>
      <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  )
}

function StepCard({ num, title, desc, forRole }) {
  const colors = { parent: '#059669', professeur: '#1A56DB' }
  const c = colors[forRole]
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%', background: c,
        color: '#fff', fontWeight: 700, fontSize: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{num}</div>
      <div>
        <h4 style={{ margin: '8px 0 4px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{title}</h4>
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
    </div>
  )
}

function TestimonialCard({ quote, name, role, stars = 5 }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '26px',
      border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,.04)',
    }}>
      <div style={{ color: '#F59E0B', fontSize: 18, marginBottom: 14 }}>{'★'.repeat(stars)}</div>
      <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, fontStyle: 'italic', margin: '0 0 16px' }}>
        « {quote} »
      </p>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{name}</div>
        <div style={{ fontSize: 12, color: '#64748B' }}>{role}</div>
      </div>
    </div>
  )
}

/* ── Page principale ─────────────────────────────────────── */
export default function Landing() {
  const nav = useNavigate()
  const { isMobile } = useResponsive()

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A', overflowX: 'hidden' }}>
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', background: '#0F172A',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', paddingTop: isMobile ? 60 : 68, overflow: 'hidden',
        padding: isMobile ? '0 16px' : '0 24px',
      }}>
        {/* Orbes décoratifs */}
        <div style={{ position: 'absolute', top: isMobile ? -40 : -80, left: isMobile ? -40 : -80, width: isMobile ? 250 : 400, height: isMobile ? 250 : 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,.25) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: isMobile ? -40 : -60, right: isMobile ? -40 : -60, width: isMobile ? 300 : 500, height: isMobile ? 300 : 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,.2) 0%, transparent 70%)' }} />
        {!isMobile && (
          <div style={{ position: 'absolute', top: '40%', left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,.12) 0%, transparent 70%)' }} />
        )}

        <div style={{ textAlign: 'center', maxWidth: isMobile ? '100%' : 800, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,.15)', border: '1px solid rgba(59,130,246,.3)',
            borderRadius: 20, padding: isMobile ? '4px 12px' : '6px 16px', marginBottom: isMobile ? 20 : 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60A5FA', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: isMobile ? 11 : 13, color: '#93C5FD', fontWeight: 500 }}>Plateforme de cours particuliers à domicile</span>
          </div>

          <h1 style={{
            fontSize: isMobile ? 28 : 58, fontWeight: 700, lineHeight: isMobile ? 1.2 : 1.12, margin: '0 0 24px',
            fontFamily: "'Playfair Display', serif",
            background: 'linear-gradient(135deg,#fff 30%,#93C5FD 70%,#C4B5FD)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Les meilleurs professeurs,<br />directement chez vous
          </h1>

          <p style={{
            fontSize: isMobile ? 15 : 18, color: '#94A3B8', lineHeight: 1.8, margin: '0 0 32px',
            maxWidth: 600, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Mettez en relation professeurs qualifiés et familles en quelques clics.
            Réservez, payez et suivez les séances en toute simplicité.
          </p>

          <div style={{ display: 'flex', gap: isMobile ? 10 : 14, justifyContent: 'center', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
            <button onClick={() => nav('/inscription')} style={{
              padding: isMobile ? '14px 24px' : '15px 32px', background: 'linear-gradient(135deg,#3B82F6,#1A56DB)',
              color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700,
              fontSize: isMobile ? 15 : 16, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              boxShadow: '0 8px 24px rgba(26,86,219,.4)',
            }}>
              Commencer gratuitement →
            </button>
            <button onClick={() => nav('/connexion')} style={{
              padding: isMobile ? '14px 24px' : '15px 32px',
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.15)',
              color: '#fff', borderRadius: 12, fontWeight: 600,
              fontSize: isMobile ? 15 : 16, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>
              Se connecter
            </button>
          </div>

          <p style={{ color: '#475569', fontSize: isMobile ? 11 : 12, marginTop: isMobile ? 16 : 20 }}>
            ✓ Inscription gratuite · ✓ Pas de commission · ✓ Paiement sécurisé
          </p>
        </div>

        {/* Stats bar */}
        <div style={{
          position: 'absolute', bottom: isMobile ? 20 : 40, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: isMobile ? 24 : 48,
          borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: isMobile ? 20 : 24,
        }}>
          <StatCard n="500+" label="Professeurs vérifiés" />
          <StatCard n="2000+" label="Séances réalisées" />
          <StatCard n="98%" label="Satisfaction" />
        </div>
      </section>

      {/* ══ FONCTIONNALITÉS ═════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '60px 16px' : '80px 48px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: isMobile ? '100%' : 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 60 }}>
            <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: '0 0 16px' }}>
              Pourquoi nous choisir ?
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 17, color: '#64748B', maxWidth: 600, margin: '0 auto' }}>
              Une plateforme complète pour simplifier la mise en relation professeurs-parents
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
            gap: isMobile ? 20 : 32,
          }}>
            <FeatureCard icon="🔍" title="Recherche avancée" desc="Trouvez le professeur idéal selon la matière, le niveau, le tarif et la localisation" color="#3B82F6" />
            <FeatureCard icon="📅" title="Réservation facile" desc="Réservez des créneaux horaires en quelques clics avec confirmation instantanée" color="#059669" />
            <FeatureCard icon="💳" title="Paiement sécurisé" desc="Payez en ligne via Mobile Money ou carte avec traçabilité complète" color="#1A56DB" />
            <FeatureCard icon="⭐" title="Professeurs vérifiés" desc="Tous nos professeurs sont vérifiés et notés par les parents" color="#F59E0B" />
            <FeatureCard icon="�" title="Suivi en temps réel" desc="Historique complet des séances, paiements et communications" color="#8B5CF6" />
            <FeatureCard icon="🎯" title="Garantie satisfaction" desc="Satisfait ou remboursé sur vos premières séances" color="#EC4899" />
          </div>
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE ═══════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '60px 16px' : '80px 48px', background: '#fff' }}>
        <div style={{ maxWidth: isMobile ? '100%' : 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 60 }}>
            <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: '0 0 16px' }}>
              Comment ça marche ?
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)',
            gap: isMobile ? 40 : 60,
          }}>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 24px', color: '#059669' }}>Pour les Parents</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <StepCard num="1" title="Créez votre compte" desc="Inscription gratuite en quelques secondes" forRole="parent" />
                <StepCard num="2" title="Cherchez un professeur" desc="Filtrez par matière, niveau et tarif" forRole="parent" />
                <StepCard num="3" title="Réservez une séance" desc="Choisissez un créneau et validez" forRole="parent" />
                <StepCard num="4" title="Payez et suivez" desc="Paiement sécurisé et suivi en temps réel" forRole="parent" />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 24px', color: '#1A56DB' }}>Pour les Professeurs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <StepCard num="1" title="Créez votre profil" desc="Présentez vos qualifications et disponibilités" forRole="professeur" />
                <StepCard num="2" title="Publiez vos annonces" desc="Décrivez vos offres de cours" forRole="professeur" />
                <StepCard num="3" title="Recevez des demandes" desc="Les parents vous contactent directement" forRole="professeur" />
                <StepCard num="4" title="Encaissez vos revenus" desc="Paiement automatique et sécurisé" forRole="professeur" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TEMOIGNAGES ═══════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '60px 16px' : '80px 48px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: isMobile ? '100%' : 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 60 }}>
            <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: '0 0 16px' }}>
              Ce que disent nos utilisateurs
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
            gap: isMobile ? 20 : 32,
          }}>
            <TestimonialCard
              quote="J'ai trouvé un professeur de maths excellent en moins de 24h pour mon fils. Mon fils a réussi son bac avec mention !"
              name="Marie Ateba"
              role="Parent · Yaoundé"
            />
            <TestimonialCard
              quote="La plateforme me permet de gérer mon planning et d'augmenter mes revenus sans stress administratif."
              name="Jean-Pierre Mba"
              role="Professeur · Douala"
            />
            <TestimonialCard
              quote="Le système de paiement est très pratique et je peux suivre toutes les séances de mes enfants en temps réel."
              name="Sophie Ngouo"
              role="Parent · Libreville"
            />
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '80px 16px' : '100px 48px', background: '#0F172A', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 40, fontWeight: 700, fontFamily: "'Playfair Display', serif",
            color: '#fff', margin: '0 0 20px'
          }}>
            Prêt à commencer ?
          </h2>
          <p style={{ fontSize: isMobile ? 16 : 18, color: '#94A3B8', marginBottom: isMobile ? 32 : 40 }}>
            Rejoignez des milliers de parents et professeurs qui utilisent déjà notre plateforme
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('/inscription')} style={{
              padding: isMobile ? '16px 28px' : '18px 36px', background: 'linear-gradient(135deg,#3B82F6,#1A56DB)',
              color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700,
              fontSize: isMobile ? 16 : 18, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              boxShadow: '0 8px 24px rgba(26,86,219,.4)',
            }}>
              Créer mon compte gratuit
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer style={{ padding: isMobile ? '40px 16px' : '48px', background: '#0F172A', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: isMobile ? '100%' : 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#fff', fontSize: 18 }}>
              Répétitions<span style={{ color: '#60A5FA' }}> à Domicile</span>
            </span>
          </div>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 16 }}>
            © 2026 Répétitions à Domicile. Tous droits réservés.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', fontSize: 13, color: '#94A3B8' }}>
            <span style={{ cursor: 'pointer' }}>Conditions d'utilisation</span>
            <span style={{ cursor: 'pointer' }}>Politique de confidentialité</span>
            <span style={{ cursor: 'pointer' }}>Contact</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}