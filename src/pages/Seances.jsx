import { useState } from 'react'
import StatutBadge from '../components/StatutBadge'

const FILTERS = [
  ["all",        "Toutes"    ],
  ["en_attente", "En attente"],
  ["confirmee",  "Confirmées"],
  ["realisee",   "Réalisées" ],
  ["annulee",    "Annulées"  ],
]

export default function Seances({ seances, setSeances, role }) {
  const [filter, setFilter] = useState("all")

  const displayed = filter === "all" ? seances : seances.filter(s => s.statut === filter)

  function action(id, newStatut) {
    setSeances(prev => prev.map(s => s.id === id ? { ...s, statut: newStatut } : s))
  }

  const totaux = {
    all:        seances.length,
    en_attente: seances.filter(s => s.statut === "en_attente").length,
    confirmee:  seances.filter(s => s.statut === "confirmee").length,
    realisee:   seances.filter(s => s.statut === "realisee").length,
    annulee:    seances.filter(s => s.statut === "annulee").length,
  }

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 20 }}>
        Mes séances
      </h2>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map(([val, lbl]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{
              padding: "6px 14px", border: `1px solid ${filter === val ? "#1A56DB" : "#E2E8F0"}`,
              background: filter === val ? "#EFF6FF" : "#fff",
              borderRadius: 20, cursor: "pointer", fontSize: 13,
              fontWeight: filter === val ? 700 : 400,
              color: filter === val ? "#1A56DB" : "#64748B",
            }}>
            {lbl}
            <span style={{
              marginLeft: 6, background: filter === val ? "#1A56DB" : "#F1F5F9",
              color: filter === val ? "#fff" : "#64748B",
              fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
            }}>
              {totaux[val]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "auto" }}>
        <table>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Date", "Heure", role === "professeur" ? "Élève" : "Professeur", "Matière", "Niveau", "Statut", "Montant", "Actions"].map(h => (
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
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "36px 0", color: "#94A3B8", fontSize: 14 }}>
                  Aucune séance dans cette catégorie.
                </td>
              </tr>
            ) : displayed.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid #F1F5F9" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFBFC"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <td style={{ padding: "12px 14px", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
                  {new Date(s.date).toLocaleDateString("fr-FR")}
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#64748B", whiteSpace: "nowrap" }}>{s.heure}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 500 }}>
                  {role === "professeur" ? s.eleve : s.prof}
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13 }}>{s.matière}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#64748B" }}>{s.niveau}</td>
                <td style={{ padding: "12px 14px" }}><StatutBadge statut={s.statut} /></td>
                <td style={{ padding: "12px 14px", fontWeight: 700, color: "#059669", fontSize: 13, whiteSpace: "nowrap" }}>
                  {s.montant.toLocaleString("fr-FR")} FCFA
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {s.statut === "en_attente" && role === "professeur" && (
                      <button onClick={() => action(s.id, "confirmee")} style={{
                        background: "#D1FAE5", color: "#065F46", border: "none",
                        padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                        fontSize: 12, fontWeight: 600,
                      }}>✓ Confirmer</button>
                    )}
                    {s.statut === "confirmee" && role === "professeur" && (
                      <button onClick={() => action(s.id, "realisee")} style={{
                        background: "#E0E7FF", color: "#3730A3", border: "none",
                        padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                        fontSize: 12, fontWeight: 600,
                      }}>✓ Réalisée</button>
                    )}
                    {["en_attente", "confirmee"].includes(s.statut) && (
                      <button onClick={() => action(s.id, "annulee")} style={{
                        background: "#FEE2E2", color: "#991B1B", border: "none",
                        padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                        fontSize: 12, fontWeight: 600,
                      }}>✕ Annuler</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      {displayed.length > 0 && (
        <div style={{
          marginTop: 14, textAlign: "right",
          fontSize: 13, color: "#64748B", fontWeight: 500,
        }}>
          Total affiché :{" "}
          <strong style={{ color: "#059669" }}>
            {displayed.reduce((a, s) => a + s.montant, 0).toLocaleString("fr-FR")} FCFA
          </strong>
        </div>
      )}
    </div>
  )
}
