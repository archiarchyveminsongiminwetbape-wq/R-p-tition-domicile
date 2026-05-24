import { useState } from 'react'
import Avatar from './Avatar'

export default function ReservModal({ prof, eleves, onClose, onConfirm }) {
  const [date,  setDate]  = useState("")
  const [heure, setHeure] = useState("16:00")
  const [duree, setDuree] = useState(2)
  const [eleve, setEleve] = useState(eleves[0]?.nom ?? "")
  const [mode,  setMode]  = useState("mobile_money")

  const montant = prof.tarif * duree
  const modes   = [
    { id: "mobile_money", label: "📱 Mobile Money" },
    { id: "carte",        label: "💳 Carte"         },
    { id: "especes",      label: "💵 Espèces"       },
  ]

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.55)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: 14, padding: 28,
        width: 460, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0 }}>
            Réserver une séance
          </h3>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, color: "#64748B", cursor: "pointer" }}>✕</button>
        </div>

        {/* Prof recap */}
        <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "12px 14px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar initials={prof.photo} size={38} color="#1A56DB" />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{prof.prenom} {prof.nom}</div>
            <div style={{ fontSize: 12, color: "#64748B" }}>{prof.tarif.toLocaleString("fr-FR")} FCFA/h</div>
          </div>
        </div>

        {/* Date + Heure */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Heure de début</label>
            <input type="time" value={heure} onChange={e => setHeure(e.target.value)} />
          </div>
        </div>

        {/* Durée + Élève */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Durée</label>
            <select value={duree} onChange={e => setDuree(+e.target.value)}>
              {[1, 1.5, 2, 2.5, 3].map(d => <option key={d} value={d}>{d}h</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Élève</label>
            <select value={eleve} onChange={e => setEleve(e.target.value)}>
              {eleves.map(e => <option key={e.id} value={e.nom}>{e.nom}</option>)}
            </select>
          </div>
        </div>

        {/* Mode de paiement */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 6 }}>Mode de paiement</label>
          <div style={{ display: "flex", gap: 8 }}>
            {modes.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                style={{
                  flex: 1, padding: "8px 0",
                  border: `1px solid ${mode === m.id ? "#1A56DB" : "#E2E8F0"}`,
                  background: mode === m.id ? "#EFF6FF" : "#fff",
                  borderRadius: 8, fontSize: 12, fontWeight: mode === m.id ? 700 : 400,
                  color: mode === m.id ? "#1A56DB" : "#64748B", cursor: "pointer",
                }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Récapitulatif */}
        <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px 14px", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 6 }}>
            <span>{prof.tarif.toLocaleString("fr-FR")} FCFA × {duree}h</span>
            <span>{montant.toLocaleString("fr-FR")} FCFA</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            borderTop: "1px solid #E2E8F0", paddingTop: 8,
            fontSize: 15, fontWeight: 700, color: "#0F172A",
          }}>
            <span>Total</span>
            <span style={{ color: "#059669" }}>{montant.toLocaleString("fr-FR")} FCFA</span>
          </div>
        </div>

        <button
          onClick={() => onConfirm({ prof, date, heure, duree, eleve, mode, montant })}
          disabled={!date}
          style={{
            width: "100%", padding: "13px 0", border: "none", borderRadius: 9,
            background: date ? "#1A56DB" : "#CBD5E1",
            color: "#fff", fontWeight: 700, fontSize: 15,
            cursor: date ? "pointer" : "not-allowed", transition: "background .2s",
          }}>
          {date ? `Confirmer et payer ${montant.toLocaleString("fr-FR")} FCFA` : "Choisir une date pour continuer"}
        </button>
      </div>
    </div>
  )
}
