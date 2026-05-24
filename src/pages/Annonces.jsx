import { useState } from 'react'
import Badge from '../components/Badge'
import { MATIERES, NIVEAUX, ANNONCES_INIT } from '../data/constants'

function AnnonceForm({ initial = {}, onSave, onCancel }) {
  const [titre,   setTitre]   = useState(initial.titre   ?? "")
  const [matiere, setMatiere] = useState(initial.matière ?? "")
  const [niveaux, setNiveaux] = useState(initial.niveaux ?? [])
  const [tarif,   setTarif]   = useState(initial.tarif   ?? "")
  const [desc,    setDesc]    = useState(initial.description ?? "")

  function toggleNiveau(n) {
    setNiveaux(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])
  }

  const valid = titre && matiere && niveaux.length > 0 && tarif

  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
      padding: 22, marginBottom: 20,
    }}>
      <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>
        {initial.id ? "Modifier l'annonce" : "Nouvelle annonce"}
      </h4>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Titre de l'annonce *</label>
          <input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex : Soutien Mathématiques Terminale" />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Matière *</label>
          <select value={matiere} onChange={e => setMatiere(e.target.value)}>
            <option value="">Choisir…</option>
            {MATIERES.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Tarif horaire (FCFA) *</label>
          <input type="number" min={500} step={500} value={tarif}
            onChange={e => setTarif(e.target.value)} placeholder="Ex : 3500" />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 6 }}>Niveaux ciblés *</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {NIVEAUX.map(n => (
            <button key={n} onClick={() => toggleNiveau(n)}
              style={{
                padding: "5px 12px", border: `1px solid ${niveaux.includes(n) ? "#059669" : "#E2E8F0"}`,
                background: niveaux.includes(n) ? "#F0FDF4" : "#fff",
                borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 500,
                color: niveaux.includes(n) ? "#059669" : "#64748B",
              }}>{n}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Description (optionnelle)</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
          placeholder="Décrivez votre approche pédagogique, vos méthodes…" />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => valid && onSave({ titre, matière: matiere, niveaux, tarif: +tarif, description: desc })}
          disabled={!valid}
          style={{
            background: valid ? "#1A56DB" : "#CBD5E1", color: "#fff",
            border: "none", padding: "9px 22px", borderRadius: 8,
            cursor: valid ? "pointer" : "not-allowed", fontWeight: 600, fontSize: 13,
          }}>
          {initial.id ? "Enregistrer les modifications" : "Publier l'annonce"}
        </button>
        <button onClick={onCancel} style={{
          background: "#F1F5F9", color: "#374151", border: "none",
          padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13,
        }}>Annuler</button>
      </div>
    </div>
  )
}

export default function Annonces() {
  const [annonces, setAnnonces] = useState(ANNONCES_INIT)
  const [form,     setForm]     = useState(false)
  const [editing,  setEditing]  = useState(null)

  function saveNew(data) {
    setAnnonces(prev => [...prev, {
      ...data, id: Date.now(), statut: "active",
      date: new Date().toISOString().split("T")[0], seances: 0,
    }])
    setForm(false)
  }

  function saveEdit(data) {
    setAnnonces(prev => prev.map(a => a.id === editing.id ? { ...a, ...data } : a))
    setEditing(null)
  }

  function toggleStatut(id) {
    setAnnonces(prev => prev.map(a =>
      a.id === id ? { ...a, statut: a.statut === "active" ? "inactive" : "active" } : a
    ))
  }

  function deleteAnnonce(id) {
    if (confirm("Supprimer cette annonce ?")) {
      setAnnonces(prev => prev.filter(a => a.id !== id))
    }
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: 0 }}>Mes annonces</h2>
        {!form && !editing && (
          <button onClick={() => setForm(true)} style={{
            background: "#1A56DB", color: "#fff", border: "none",
            padding: "9px 18px", borderRadius: 8, cursor: "pointer",
            fontWeight: 600, fontSize: 13,
          }}>+ Nouvelle annonce</button>
        )}
      </div>

      {form && <AnnonceForm onSave={saveNew} onCancel={() => setForm(false)} />}
      {editing && <AnnonceForm initial={editing} onSave={saveEdit} onCancel={() => setEditing(null)} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {annonces.map(a => {
          const actif = a.statut === "active"
          return (
            <div key={a.id} style={{
              background: "#fff", border: "1px solid #E2E8F0",
              borderRadius: 12, padding: "16px 20px",
              borderLeft: `4px solid ${actif ? "#059669" : "#CBD5E1"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", color: "#0F172A" }}>{a.titre}</h3>
                  <div style={{ fontSize: 12, color: "#64748B", marginBottom: 10 }}>
                    Publiée le {new Date(a.date).toLocaleDateString("fr-FR")} · {a.seances} séance{a.seances > 1 ? "s" : ""} réalisée{a.seances > 1 ? "s" : ""}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    <Badge text={a.matière} />
                    {a.niveaux.map(n => <Badge key={n} text={n} bg="#F0FDF4" color="#059669" />)}
                    <Badge text={`${a.tarif.toLocaleString("fr-FR")} FCFA/h`} bg="#F5F3FF" color="#7C3AED" />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
                  <button onClick={() => setEditing(a)} style={{
                    background: "#EFF6FF", color: "#1A56DB", border: "none",
                    padding: "5px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600,
                  }}>✏️ Modifier</button>
                  <button onClick={() => toggleStatut(a.id)} style={{
                    background: actif ? "#FEF3C7" : "#D1FAE5",
                    color: actif ? "#92400E" : "#065F46",
                    border: "none", padding: "5px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600,
                  }}>{actif ? "⏸ Suspendre" : "▶ Activer"}</button>
                  <button onClick={() => deleteAnnonce(a.id)} style={{
                    background: "#FEE2E2", color: "#991B1B", border: "none",
                    padding: "5px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600,
                  }}>🗑 Supprimer</button>
                </div>
              </div>
            </div>
          )
        })}
        {annonces.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
            Aucune annonce publiée.
          </div>
        )}
      </div>
    </div>
  )
}
