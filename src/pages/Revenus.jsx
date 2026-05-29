import StatutBadge from '../components/StatutBadge'

const MOIS_DATA = []

export default function Revenus({ seances }) {
  const realisees = seances.filter(s => s.statut === "realisee")
  const total2026 = MOIS_DATA.length > 0 ? MOIS_DATA.reduce((a, m) => a + m.val, 0) : 0
  const max = MOIS_DATA.length > 0 ? Math.max(...MOIS_DATA.map(m => m.val)) : 1
  const currentMonthRevenue = MOIS_DATA.length > 0 ? MOIS_DATA[MOIS_DATA.length - 1]?.val || 0 : 0

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 24 }}>
        Mes revenus
      </h2>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { icon: "💰", label: "Revenus ce mois",       val: currentMonthRevenue > 0 ? currentMonthRevenue.toLocaleString("fr-FR") + " FCFA" : "0 FCFA", bg: "#EFF6FF", accent: "#1A56DB" },
          { icon: "📅", label: "Séances réalisées",     val: realisees.length,                                                                 bg: "#F0FDF4", accent: "#059669" },
          { icon: "📈", label: "Total 2026",             val: total2026.toLocaleString("fr-FR") + " FCFA",                                          bg: "#FEF3C7", accent: "#D97706" },
        ].map((k, i) => (
          <div key={i} style={{
            background: k.bg, borderRadius: 12, padding: "20px 22px",
            border: `1px solid ${k.accent}22`,
          }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: "#0F172A" }}>{k.val}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Graphique mensuel */}
      {MOIS_DATA.length > 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "22px 24px", marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Revenus mensuels 2026 (FCFA)</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
            {MOIS_DATA.map((m, i) => {
              const h = m.val > 0 ? Math.round((m.val / max) * 100) : 3
              const isCurrent = i === MOIS_DATA.length - 1
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 11, color: isCurrent ? "#1A56DB" : "#64748B", fontWeight: isCurrent ? 700 : 400 }}>
                    {m.val > 0 ? Math.round(m.val / 1000) + "k" : ""}
                  </div>
                  <div title={`${m.mois}: ${m.val.toLocaleString("fr-FR")} FCFA`} style={{
                    width: "100%", borderRadius: "5px 5px 0 0",
                    height: `${h}%`,
                    background: isCurrent
                      ? "linear-gradient(180deg,#3B82F6,#1A56DB)"
                      : i < MOIS_DATA.length - 1 ? "#BFDBFE" : "#F1F5F9",
                    transition: "opacity .2s",
                    cursor: "default",
                  }} />
                  <div style={{ fontSize: 12, color: isCurrent ? "#1A56DB" : "#64748B", fontWeight: isCurrent ? 700 : 400 }}>
                    {m.mois}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "22px 24px", marginBottom: 28, textAlign: "center", color: "#94A3B8" }}>
          Aucune donnée de revenus disponible
        </div>
      )}

      {/* Détail des séances réalisées */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Détail des séances payées</h3>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "auto" }}>
        <table>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Date", "Élève", "Matière", "Durée", "Tarif", "Montant"].map(h => (
                <th key={h} style={{
                  padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#64748B",
                  textTransform: "uppercase", letterSpacing: .6, borderBottom: "1px solid #E2E8F0",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {realisees.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "28px 0", textAlign: "center", color: "#94A3B8" }}>Aucune séance réalisée.</td></tr>
            ) : realisees.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "11px 14px", fontSize: 13 }}>{new Date(s.date).toLocaleDateString("fr-FR")}</td>
                <td style={{ padding: "11px 14px", fontSize: 13 }}>{s.eleve}</td>
                <td style={{ padding: "11px 14px", fontSize: 13 }}>{s.matière}</td>
                <td style={{ padding: "11px 14px", fontSize: 13, color: "#64748B" }}>{s.heure}</td>
                <td style={{ padding: "11px 14px", fontSize: 13, color: "#64748B" }}>
                  {(s.montant / 2).toLocaleString("fr-FR")} FCFA/h
                </td>
                <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: "#059669" }}>
                  {s.montant.toLocaleString("fr-FR")} FCFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
