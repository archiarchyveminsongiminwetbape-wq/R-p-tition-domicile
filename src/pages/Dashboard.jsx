import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Stars from '../components/Stars'
import StatutBadge from '../components/StatutBadge'
import { getAvatarColor } from '../data/constants'
import { useResponsive } from '../hooks/useResponsive'

function KpiCard({ icon, value, label, delta, bg, accent }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: "18px 20px", border: `1px solid ${accent}22` }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", fontFamily: "'Playfair Display', serif" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{label}</div>
      {delta && <div style={{ fontSize: 11, color: accent, fontWeight: 600, marginTop: 4 }}>{delta} vs mois dernier</div>}
    </div>
  )
}

export default function Dashboard({ role, seances, profs, setPage }) {
  const { isMobile, isTablet } = useResponsive()
  const kpis = role === "professeur"
    ? [
        { icon: "📅", value: "0",        label: "Séances ce mois",   delta: "",     bg: "#EFF6FF", accent: "#1A56DB" },
        { icon: "💰", value: "0",        label: "Revenus (FCFA)",    delta: "",     bg: "#F0FDF4", accent: "#059669" },
        { icon: "⭐", value: "0.0 ★",    label: "Note moyenne",       delta: "",     bg: "#FEF3C7", accent: "#D97706" },
        { icon: "📋", value: "0",        label: "Annonces actives",   delta: "",     bg: "#F5F3FF", accent: "#7C3AED" },
      ]
    : [
        { icon: "📅", value: seances.length,                                   label: "Séances réservées", delta: "",  bg: "#EFF6FF", accent: "#1A56DB" },
        { icon: "💳", value: seances.reduce((a,s)=>a+s.montant,0).toLocaleString("fr-FR"), label: "Dépenses (FCFA)",  delta: "", bg: "#FDF2F8", accent: "#DB2777" },
        { icon: "🎒", value: "0",                                              label: "Élèves inscrits",   delta: "",  bg: "#F0FDF4", accent: "#059669" },
        { icon: "❤️", value: "0",                                              label: "Profs favoris",     delta: "",  bg: "#FEF3C7", accent: "#D97706" },
      ]

  const upcoming = seances.filter(s => s.statut !== "realisee").slice(0, 3)

  return (
    <div className="fade-in" style={{ paddingTop: isMobile ? 70 : 0 }}>
      <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: "#0F172A", marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>
        Bonjour 👋
      </h2>
      <p style={{ color: "#64748B", marginBottom: isMobile ? 20 : 28, fontSize: isMobile ? 13 : 14 }}>
        {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </p>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 12 : 16, marginBottom: isMobile ? 24 : 32 }}>
        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>

      {/* Prochaines séances */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? 12 : 14 }}>
        <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: "#0F172A" }}>Prochaines séances</h3>
        <button onClick={() => setPage("seances")}
          style={{ background: "none", border: "none", color: "#1A56DB", fontSize: isMobile ? 12 : 13, fontWeight: 600, cursor: "pointer" }}>
          Voir tout →
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 8 : 10, marginBottom: isMobile ? 24 : 32 }}>
        {upcoming.length === 0
          ? <p style={{ color: "#94A3B8", fontSize: 13 }}>Aucune séance à venir.</p>
          : upcoming.map(s => (
            <div key={s.id} style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
              padding: isMobile ? "12px 14px" : "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 14, width: "100%" }}>
                <div style={{ background: "#EFF6FF", borderRadius: 8, padding: isMobile ? "6px 10px" : "8px 12px", textAlign: "center", minWidth: isMobile ? 48 : 52 }}>
                  <div style={{ fontSize: isMobile ? 10 : 11, color: "#1A56DB", fontWeight: 700 }}>
                    {new Date(s.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 14, color: "#0F172A" }}>
                    {role === "professeur" ? s.matière : s.prof}
                  </div>
                  <div style={{ fontSize: isMobile ? 11 : 12, color: "#64748B" }}>{s.heure} · {s.eleve} · {s.niveau}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "space-between" : "flex-end" }}>
                <StatutBadge statut={s.statut} />
                <span style={{ fontWeight: 700, color: "#059669", fontSize: isMobile ? 12 : 13 }}>
                  {s.montant.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Top profs (parent uniquement) */}
      {role === "parent" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? 12 : 14 }}>
            <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: "#0F172A" }}>Professeurs recommandés</h3>
            <button onClick={() => setPage("recherche")}
              style={{ background: "none", border: "none", color: "#1A56DB", fontSize: isMobile ? 12 : 13, fontWeight: 600, cursor: "pointer" }}>
              Voir tout →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: isMobile ? 12 : 16 }}>
            {profs.filter(p => p.valide).slice(0, 3).map((p, i) => (
              <div key={p.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: isMobile ? 14 : 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 8 : 10 }}>
                  <Avatar initials={p.photo} size={isMobile ? 34 : 38} color={getAvatarColor(i)} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: isMobile ? 12 : 13 }}>{p.prenom} {p.nom}</div>
                    <div style={{ fontSize: isMobile ? 10 : 11, color: "#64748B" }}>📍 {p.ville}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: isMobile ? 6 : 8 }}>
                  <Stars n={p.note} />{" "}
                  <span style={{ fontSize: isMobile ? 10 : 11, color: "#64748B" }}>({p.avis} avis)</span>
                </div>
                <div style={{ marginTop: isMobile ? 6 : 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {p.matières.slice(0, 2).map(m => <Badge key={m} text={m} />)}
                </div>
                <div style={{ marginTop: isMobile ? 8 : 10, fontWeight: 700, color: "#059669", fontSize: isMobile ? 13 : 14 }}>
                  {p.tarif.toLocaleString("fr-FR")} FCFA/h
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
