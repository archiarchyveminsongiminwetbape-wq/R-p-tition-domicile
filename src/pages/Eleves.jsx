import { useState } from 'react'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import { NIVEAUX, getAvatarColor } from '../data/constants'

function EleveForm({ onSave, onCancel }) {
  const [nom,    setNom]    = useState("")
  const [niveau, setNiveau] = useState("")
  const [ecole,  setEcole]  = useState("")
  const [ddn,    setDdn]    = useState("")

  const valid = nom && niveau

  return (
    <div style={{
      background: "#EFF6FF", border: "1px solid #BFDBFE",
      borderRadius: 12, padding: 20, marginBottom: 20,
    }}>
      <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>Ajouter un élève</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Prénom et Nom *</label>
          <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex : Noah Dupont" />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Date de naissance</label>
          <input type="date" value={ddn} onChange={e => setDdn(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Niveau scolaire *</label>
          <select value={niveau} onChange={e => setNiveau(e.target.value)}>
            <option value="">Choisir…</option>
            {NIVEAUX.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>École</label>
          <input value={ecole} onChange={e => setEcole(e.target.value)} placeholder="Nom de l'établissement" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => valid && onSave({ nom, niveau, ecole, ddn })}
          disabled={!valid}
          style={{
            background: valid ? "#1A56DB" : "#CBD5E1", color: "#fff", border: "none",
            padding: "8px 20px", borderRadius: 8,
            cursor: valid ? "pointer" : "not-allowed", fontWeight: 600, fontSize: 13,
          }}>Enregistrer</button>
        <button onClick={onCancel} style={{
          background: "#fff", color: "#374151", border: "1px solid #E2E8F0",
          padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13,
        }}>Annuler</button>
      </div>
    </div>
  )
}

export default function Eleves({ eleves, setEleves }) {
  const [form, setForm] = useState(false)

  function addEleve(data) {
    setEleves(prev => [...prev, { id: Date.now(), prenom: "", ...data }])
    setForm(false)
  }

  function removeEleve(id) {
    if (confirm("Retirer cet élève ?")) {
      setEleves(prev => prev.filter(e => e.id !== id))
    }
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: 0 }}>Mes élèves</h2>
        {!form && (
          <button onClick={() => setForm(true)} style={{
            background: "#1A56DB", color: "#fff", border: "none",
            padding: "9px 18px", borderRadius: 8, cursor: "pointer",
            fontWeight: 600, fontSize: 13,
          }}>+ Ajouter un élève</button>
        )}
      </div>

      {form && <EleveForm onSave={addEleve} onCancel={() => setForm(false)} />}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {eleves.map((e, i) => (
          <div key={e.id} style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <Avatar initials={e.nom.slice(0, 2).toUpperCase()} size={44} color={getAvatarColor(i)} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{e.nom}</div>
                {e.ecole && <div style={{ fontSize: 12, color: "#64748B" }}>🏫 {e.ecole}</div>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Badge text={e.niveau} bg="#F0FDF4" color="#059669" />
              {e.ddn && (
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  🎂 Né(e) le {new Date(e.ddn).toLocaleDateString("fr-FR")}
                </div>
              )}
            </div>
            <button onClick={() => removeEleve(e.id)} style={{
              marginTop: 14, width: "100%", background: "none",
              border: "1px solid #FEE2E2", color: "#991B1B",
              padding: "6px 0", borderRadius: 7, cursor: "pointer",
              fontSize: 12, fontWeight: 600,
            }}>Retirer</button>
          </div>
        ))}

        {eleves.length === 0 && !form && (
          <div style={{
            gridColumn: "1/-1", textAlign: "center",
            padding: "60px 0", color: "#94A3B8",
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎒</div>
            Aucun élève inscrit. Ajoutez votre premier élève.
          </div>
        )}
      </div>
    </div>
  )
}
