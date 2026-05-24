import { useState } from 'react'
import StatutBadge from '../components/StatutBadge'

export default function Paiements({ seances }) {
  const [filter, setFilter] = useState("all")

  const paiements = seances.map(s => ({
    ...s,
    statutPaiement: s.statut === "realisee" ? "valide"
      : s.statut === "annulee" ? "rembourse"
      : "en_attente",
    mode: "Mobile Money",
    ref: `OM-${s.id.toString().padStart(6, "0")}`,
  }))

  const displayed = filter === "all" ? paiements : paiements.filter(p => p.statutPaiement === filter)
  const total = displayed.filter(p => p.statutPaiement === "valide").reduce((a, p) => a + p.montant, 0)

  const statutPaiementInfo = {
    valide:     { label: "Validé",     bg: "#D1FAE5", color: "#065F46" },
    en_attente: { label: "En attente", bg: "#FEF3C7", color: "#92400E" },
    rembourse:  { label: "Remboursé",  bg: "#E0E7FF", color: "#3730A3" },
    echoue:     { label: "Échoué",     bg: "#FEE2E2", color: "#991B1B" },
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: 0 }}>
          Historique des paiements
        </h2>
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "8px 16px" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>Total validé : </span>
          <span style={{ fontWeight: 700, color: "#059669", fontSize: 14 }}>{total.toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["all","Tous"],["valide","Validés"],["en_attente","En attente"],["rembourse","Remboursés"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding: "6px 14px", border: `1px solid ${filter === v ? "#1A56DB" : "#E2E8F0"}`,
            background: filter === v ? "#EFF6FF" : "#fff",
            borderRadius: 20, cursor: "pointer", fontSize: 13,
            fontWeight: filter === v ? 700 : 400, color: filter === v ? "#1A56DB" : "#64748B",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "auto" }}>
        <table>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Date","Référence","Professeur","Séance","Mode","Montant","Statut","Reçu"].map(h => (
                <th key={h} style={{
                  padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#64748B",
                  textTransform: "uppercase", letterSpacing: .6, borderBottom: "1px solid #E2E8F0",
                  whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "36px 0", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Aucun paiement trouvé.</td></tr>
            ) : displayed.map(p => {
              const si = statutPaiementInfo[p.statutPaiement] ?? { label: p.statutPaiement, bg: "#F3F4F6", color: "#374151" }
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "11px 14px", fontSize: 13, whiteSpace: "nowrap" }}>
                    {new Date(p.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748B", fontFamily: "monospace" }}>{p.ref}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13 }}>{p.prof}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748B" }}>{p.matière} · {p.heure}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748B" }}>📱 {p.mode}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: "#059669", whiteSpace: "nowrap" }}>
                    {p.montant.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ background: si.bg, color: si.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {si.label}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    {p.statutPaiement === "valide" && (
                      <button style={{
                        background: "none", border: "1px solid #E2E8F0", color: "#1A56DB",
                        padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                        fontSize: 11, fontWeight: 600,
                      }}>📄 PDF</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
