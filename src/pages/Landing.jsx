import { useNavigate } from 'react-router-dom'
import { useAuth0 }    from '@auth0/auth0-react'

/* ── petits composants ───────────────────────────────────── */
function Navbar() {
  const nav = useNavigate()
  const { isAuthenticated } = useAuth0()
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 68,
      background: 'rgba(15,23,42,.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg,#3B82F6,#1A56DB)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'serif', fontWeight: 700, color: '#fff', fontSize: 16,
        }}>R</div>
        <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: '#fff', fontSize: 17 }}>
          Répétitions<span style={{ color: '#60A5FA' }}> à Domicile</span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {isAuthenticated ? (
          <button onClick={() => nav('/app')} style={btnStyle('#1A56DB','#fff')}>
            Mon espace →
          </button>
        ) : (
          <>
            <button onClick={() => nav('/connexion')} style={btnStyle('transparent','#CBD5E1', '1px solid rgba(255,255,255,.15)')}>
              Se connecter
            </button>
            <button onClick={() => nav('/inscription')} style={btnStyle('#1A56DB','#fff')}>
              S'inscrire gratuitement
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

function btnStyle(bg, color, border = 'none') {
  return {
    padding: '9px 18px', background: bg, color, border,
    borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  }
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

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0F172A', overflowX: 'hidden' }}>
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', background: '#0F172A',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', paddingTop: 68, overflow: 'hidden',
      }}>
        {/* Orbes décoratifs */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,.25) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,.12) 0%, transparent 70%)' }} />

        <div style={{ textAlign: 'center', maxWidth: 800, padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,.15)', border: '1px solid rgba(59,130,246,.3)',
            borderRadius: 20, padding: '6px 16px', marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60A5FA', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, color: '#93C5FD', fontWeight: 500 }}>Plateforme de cours particuliers à domicile</span>
          </div>

          <h1 style={{
            fontSize: 58, fontWeight: 700, lineHeight: 1.12, margin: '0 0 24px',
            fontFamily: "'Playfair Display', serif",
            background: 'linear-gradient(135deg,#fff 30%,#93C5FD 70%,#C4B5FD)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Les meilleurs professeurs,<br />directement chez vous
          </h1>

          <p style={{
            fontSize: 18, color: '#94A3B8', lineHeight: 1.8, margin: '0 0 42px',
            maxWidth: 600, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Mettez en relation professeurs qualifiés et familles en quelques clics.
            Réservez, payez et suivez les séances en toute simplicité.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('/inscription')} style={{
              padding: '15px 32px', background: 'linear-gradient(135deg,#3B82F6,#1A56DB)',
              color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700,
              fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              boxShadow: '0 8px 24px rgba(26,86,219,.4)',
            }}>
              Commencer gratuitement →
            </button>
            <button onClick={() => nav('/connexion')} style={{
              padding: '15px 32px',
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.15)',
              color: '#fff', borderRadius: 12, fontWeight: 600,
              fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
            }}>
              Se connecter
            </button>
          </div>

          <p style={{ color: '#475569', fontSize: 12, marginTop: 20 }}>
            ✓ Inscription gratuite · ✓ Pas de commission · ✓ Paiement sécurisé
          </p>
        </div>

        {/* App preview card */}
        <div style={{
          marginTop: 70, width: '100%', maxWidth: 900,
          padding: '0 24px', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(30,41,59,.9) 0%, rgba(15,23,42,.95) 100%)',
            border: '1px solid rgba(255,255,255,.1)', borderRadius: 20,
            padding: '24px', boxShadow: '0 40px 80px rgba(0,0,0,.5)',
          }}>
            {/* Barre d'adresse simulée */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,.06)', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: '#64748B' }}>
                repetitions-domicile.cm/app
              </div>
            </div>
            {/* Mini dashboard preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, height: 220 }}>
              <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", color: '#60A5FA', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Répétitions</div>
                {['⊞ Tableau de bord','🔍 Rechercher','📅 Séances','💳 Paiements','👤 Profil'].map(item => (
                  <div key={item} style={{ fontSize: 12, color: '#64748B', padding: '7px 10px', borderRadius: 7, marginBottom: 3 }}>{item}</div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                  {[['3','Séances','#EFF6FF','#1A56DB'],['4.8★','Note','#FEF3C7','#D97706'],['49 500','Revenus FCFA','#F0FDF4','#059669'],['2','Élèves','#F5F3FF','#7C3AED']].map(([v,l,bg,c]) => (
                    <div key={l} style={{ background: bg, borderRadius: 10, padding: '12px', border: `1px solid ${c}22` }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 15 }}>{v}</div>
                      <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '14px', flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0', marginBottom: 10 }}>Prochaines séances</div>
                  {[['28 Mai','Mathématiques · 16h–18h · Noah','Confirmée','#D1FAE5','#065F46'],['30 Mai','Français · 15h–17h · Léa','En attente','#FEF3C7','#92400E']].map(([d,info,st,bg,tc]) => (
                    <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>{d}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{info}</div>
                      </div>
                      <span style={{ background: bg, color: tc, fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        `}</style>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════ */}
      <section style={{ background: '#1A56DB', padding: '52px 48px' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32,
          borderLeft: '1px solid rgba(255,255,255,.1)',
        }}>
          {[['500+','Professeurs qualifiés'],['2 000+','Familles satisfaites'],['98%','Taux de satisfaction'],['15+','Villes couvertes']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center', padding: '0 20px', borderRight: '1px solid rgba(255,255,255,.1)' }}>
              <StatCard n={n} label={l} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════ */}
      <section style={{ padding: '96px 48px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1A56DB', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Pourquoi nous choisir
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: '0 0 16px' }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 520, margin: '0 auto' }}>
              Une plateforme complète pour une expérience d'apprentissage fluide, de la recherche au paiement.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            <FeatureCard icon="🔍" title="Recherche intelligente" color="#1A56DB"
              desc="Filtrez les professeurs par matière, niveau scolaire, tarif et localisation. Trouvez le profil idéal en quelques secondes." />
            <FeatureCard icon="📅" title="Réservation instantanée" color="#059669"
              desc="Consultez les disponibilités en temps réel, réservez un créneau et recevez une confirmation immédiate." />
            <FeatureCard icon="💳" title="Paiement sécurisé" color="#7C3AED"
              desc="Mobile Money (Orange, MTN, Wave), carte bancaire ou espèces. Recevez un reçu PDF pour chaque transaction." />
            <FeatureCard icon="⭐" title="Avis vérifiés" color="#D97706"
              desc="Consultez les avis laissés par d'autres familles pour choisir le professeur en toute confiance." />
            <FeatureCard icon="📊" title="Suivi en temps réel" color="#DC2626"
              desc="Parents et professeurs disposent d'un tableau de bord personnel pour suivre séances, paiements et progrès." />
            <FeatureCard icon="🔒" title="Authentification sécurisée" color="#0891B2"
              desc="Connexion sécurisée via email/mot de passe ou Google. Vos données sont protégées par Auth0." />
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════ */}
      <section style={{ padding: '96px 48px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1A56DB', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Comment ça marche</div>
            <h2 style={{ fontSize: 38, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: 0 }}>Simple comme bonjour</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            {/* Côté parent */}
            <div style={{ background: '#F0FDF4', borderRadius: 20, padding: '36px', border: '1px solid #BBF7D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👨‍👩‍👧</div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#065F46' }}>Je suis un parent</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <StepCard num="1" forRole="parent" title="Créez votre compte"
                  desc="Inscrivez-vous en tant que parent et ajoutez les profils de vos enfants (niveau, école)." />
                <StepCard num="2" forRole="parent" title="Trouvez le bon professeur"
                  desc="Filtrez par matière, niveau et tarif. Consultez les profils et les avis des autres parents." />
                <StepCard num="3" forRole="parent" title="Réservez et payez"
                  desc="Choisissez un créneau, confirmez la réservation et payez en toute sécurité." />
              </div>
            </div>

            {/* Côté prof */}
            <div style={{ background: '#EFF6FF', borderRadius: 20, padding: '36px', border: '1px solid #BFDBFE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1A56DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👨‍🏫</div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e40af' }}>Je suis un professeur</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <StepCard num="1" forRole="professeur" title="Créez votre profil"
                  desc="Renseignez vos matières, niveaux, tarifs et disponibilités. Ajoutez votre CV et biographie." />
                <StepCard num="2" forRole="professeur" title="Publiez vos annonces"
                  desc="Créez des offres de cours détaillées pour attirer les familles recherchant vos compétences." />
                <StepCard num="3" forRole="professeur" title="Donnez vos cours et encaissez"
                  desc="Confirmez les séances, dispensez vos cours et recevez vos paiements directement." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
      <section style={{ padding: '96px 48px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1A56DB', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Témoignages</div>
            <h2 style={{ fontSize: 38, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: 0 }}>Ils nous font confiance</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            <TestimonialCard
              quote="Grâce à cette plateforme, j'ai trouvé un excellent professeur de maths pour mon fils en Terminale en moins de 24h. Ses résultats se sont nettement améliorés !"
              name="Mme Ateba" role="Parent · Yaoundé" stars={5} />
            <TestimonialCard
              quote="En tant que professeur, j'ai multiplié par 3 mes élèves en seulement 2 mois. La plateforme me permet de gérer mes séances et paiements sans stress."
              name="M. Kamga Éric" role="Professeur de Mathématiques" stars={5} />
            <TestimonialCard
              quote="Interface simple, paiement rapide via Orange Money, et professeurs vraiment sérieux. Je recommande à toutes les familles de Douala !"
              name="Mme Ngo Bela" role="Parent · Douala" stars={5} />
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════════ */}
      <section style={{
        padding: '96px 48px', textAlign: 'center',
        background: 'linear-gradient(135deg,#0F172A 0%,#1e3a8a 50%,#0F172A 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 44, fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display',serif", margin: '0 0 16px' }}>
            Prêt à commencer ?
          </h2>
          <p style={{ fontSize: 17, color: '#94A3B8', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Rejoignez des centaines de familles et de professeurs qui font confiance à notre plateforme.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('/inscription', { state: { role: 'parent' } })} style={{
              padding: '14px 30px', background: '#059669', color: '#fff',
              border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15,
              cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              boxShadow: '0 8px 20px rgba(5,150,105,.35)',
            }}>👨‍👩‍👧 Je suis un parent</button>
            <button onClick={() => nav('/inscription', { state: { role: 'professeur' } })} style={{
              padding: '14px 30px', background: '#1A56DB', color: '#fff',
              border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15,
              cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              boxShadow: '0 8px 20px rgba(26,86,219,.35)',
            }}>👨‍🏫 Je suis un professeur</button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer style={{ background: '#0F172A', padding: '48px 48px 28px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: '#fff', fontSize: 18, marginBottom: 12 }}>
                Répétitions <span style={{ color: '#60A5FA' }}>à Domicile</span>
              </div>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>
                La plateforme qui connecte les meilleurs professeurs aux familles pour des cours particuliers de qualité, directement à domicile.
              </p>
            </div>
            {[
              { title: 'Plateforme', links: ['Comment ça marche', 'Tarifs', 'Témoignages', 'FAQ'] },
              { title: 'Pour les profs', links: ["S'inscrire", 'Publier une annonce', 'Gérer ses séances', 'Support'] },
              { title: 'Pour les parents', links: ['Trouver un prof', 'Réserver', 'Payer en ligne', 'Contacter'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', marginBottom: 14, textTransform: 'uppercase', letterSpacing: .8 }}>{col.title}</h4>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize: 13, color: '#64748B', marginBottom: 8, cursor: 'pointer' }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#475569' }}>© 2026 Répétitions à Domicile. Tous droits réservés.</span>
            <span style={{ fontSize: 12, color: '#475569' }}>Sécurisé par Auth0 🔒</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
