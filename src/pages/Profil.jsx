import { useState, useEffect } from 'react'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Stars from '../components/Stars'
import { MATIERES, NIVEAUX } from '../data/constants'
import authService from '../services/auth'

export default function Profil({ role }) {
  const defaultProf = {
    prenom: "", nom: "", email: "",
    tel: "", ville: "", tarif: "",
    bio: "",
    dispo: "",
    matières: [],
    niveaux: [],
    note: 0, avisCount: 0,
  }
  const defaultParent = {
    prenom: "", nom: "", email: "",
    tel: "", adresse: "", ville: "",
  }

  const init = role === "professeur" ? defaultProf : defaultParent
  const [fields, setFields] = useState(init)
  const [saved,  setSaved]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [tab,    setTab]    = useState("infos")

  // Charger les données du profil au montage
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        const data = await authService.fetchProfile()
        const user = data.user
        
        // Transformer les données de l'API pour le formulaire
        if (role === 'professeur' && user.professeur) {
          setFields({
            prenom: user.professeur.prenom || user.prenom || "",
            nom: user.professeur.nom || user.nom || "",
            email: user.email || "",
            tel: user.professeur.telephone || "",
            ville: user.professeur.ville || "",
            tarif: user.professeur.tarif_horaire?.toString() || "",
            bio: user.professeur.biographie || "",
            dispo: user.professeur.disponibilites || "",
            matières: [], // Sera chargé depuis les relations
            niveaux: [],
            note: 0, // Sera calculé depuis les avis
            avisCount: 0,
          })
        } else if (role === 'parent' && user.parent) {
          setFields({
            prenom: user.parent.prenom || user.prenom || "",
            nom: user.parent.nom || user.nom || "",
            email: user.email || "",
            tel: user.parent.telephone || "",
            adresse: user.parent.adresse || "",
            ville: user.parent.ville || "",
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error)
      } finally {
        setLoading(false)
      }
    }

    if (authService.isAuthenticated()) {
      loadProfile()
    }
  }, [role])

  async function saveProfile() {
    try {
      setLoading(true)
      await authService.updateProfile(fields)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error)
      alert('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  function set(key, val) { setFields(f => ({ ...f, [key]: val })); setSaved(false) }

  function toggleMat(m) {
    setFields(f => ({
      ...f,
      matières: f.matières?.includes(m) ? f.matières.filter(x => x !== m) : [...(f.matières ?? []), m],
    }))
    setSaved(false)
  }

  function toggleNiv(n) {
    setFields(f => ({
      ...f,
      niveaux: f.niveaux?.includes(n) ? f.niveaux.filter(x => x !== n) : [...(f.niveaux ?? []), n],
    }))
    setSaved(false)
  }

  const initials = (fields.prenom?.[0] || "") + (fields.nom?.[0] || "") || (role === "professeur" ? "EK" : "MP")

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 24 }}>Mon profil</h2>

      {/* Carte identité */}
      <div style={{
        background: "linear-gradient(135deg,#1A56DB,#3B82F6)",
        borderRadius: 14, padding: "24px 28px", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 20,
      }}>
        <Avatar initials={initials} size={60} color="rgba(255,255,255,.2)" />
        <div style={{ color: "#fff" }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 20, fontFamily: "'Playfair Display',serif" }}>
            {fields.prenom} {fields.nom}
          </h3>
          <div style={{ fontSize: 13, opacity: .85 }}>{fields.email}</div>
          {role === "professeur" && fields.note > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <Stars n={fields.note} size={14} />
              <span style={{ fontSize: 12, opacity: .8 }}>{fields.note} ({fields.avisCount} avis)</span>
            </div>
          )}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Badge text={role === "professeur" ? "Professeur" : "Parent"} bg="rgba(255,255,255,.2)" color="#fff" />
        </div>
      </div>

      {/* Onglets */}
      <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", marginBottom: 24, gap: 0 }}>
        {(role === "professeur" ? [["infos","Informations"],["offre","Mon offre"],["securite","Sécurité"]] : [["infos","Informations"],["securite","Sécurité"]]).map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "10px 20px", border: "none", background: "none",
            borderBottom: `2px solid ${tab === id ? "#1A56DB" : "transparent"}`,
            color: tab === id ? "#1A56DB" : "#64748B",
            fontWeight: tab === id ? 700 : 400, fontSize: 14, cursor: "pointer",
            marginBottom: -1,
          }}>{lbl}</button>
        ))}
      </div>

      {tab === "infos" && (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "24px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[
              { lbl: "Prénom", key: "prenom" },
              { lbl: "Nom", key: "nom" },
              { lbl: "Email", key: "email", type: "email" },
              { lbl: "Téléphone", key: "tel", type: "tel" },
              { lbl: "Ville", key: "ville" },
              ...(role === "professeur"
                ? [{ lbl: "Tarif horaire (FCFA)", key: "tarif", type: "number" }]
                : [{ lbl: "Adresse", key: "adresse" }]
              ),
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>{f.lbl}</label>
                <input type={f.type ?? "text"} value={fields[f.key] ?? ""} onChange={e => set(f.key, e.target.value)} />
              </div>
            ))}
          </div>
          {role === "professeur" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Biographie</label>
                <textarea value={fields.bio ?? ""} onChange={e => set("bio", e.target.value)} rows={4} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Disponibilités</label>
                <input value={fields.dispo ?? ""} onChange={e => set("dispo", e.target.value)} />
              </div>
            </>
          )}
          <button onClick={saveProfile} disabled={loading} style={{
            background: loading ? "#94A3B8" : "#1A56DB", color: "#fff", border: "none",
            padding: "12px 28px", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700, fontSize: 14, marginTop: 8,
            boxShadow: loading ? "none" : "0 4px 6px rgba(26,86,219,0.2)",
            transition: "all 0.2s"
          }}>
            {loading ? "⏳ Sauvegarde en cours..." : saved ? "✓ Modifications enregistrées !" : "💾 Enregistrer les modifications"}
          </button>
        </div>
      )}

      {tab === "offre" && role === "professeur" && (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "24px 28px" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Matières enseignées</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {MATIERES.map(m => (
              <button key={m} onClick={() => toggleMat(m)} style={{
                padding: "7px 14px", border: `1px solid ${fields.matières?.includes(m) ? "#1A56DB" : "#E2E8F0"}`,
                background: fields.matières?.includes(m) ? "#EFF6FF" : "#fff",
                borderRadius: 20, cursor: "pointer", fontSize: 13,
                fontWeight: fields.matières?.includes(m) ? 700 : 400,
                color: fields.matières?.includes(m) ? "#1A56DB" : "#64748B",
              }}>{m}</button>
            ))}
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Niveaux pris en charge</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {NIVEAUX.map(n => (
              <button key={n} onClick={() => toggleNiv(n)} style={{
                padding: "7px 14px", border: `1px solid ${fields.niveaux?.includes(n) ? "#059669" : "#E2E8F0"}`,
                background: fields.niveaux?.includes(n) ? "#F0FDF4" : "#fff",
                borderRadius: 20, cursor: "pointer", fontSize: 13,
                fontWeight: fields.niveaux?.includes(n) ? 700 : 400,
                color: fields.niveaux?.includes(n) ? "#059669" : "#64748B",
              }}>{n}</button>
            ))}
          </div>
          <button onClick={saveProfile} disabled={loading} style={{
            background: loading ? "#94A3B8" : "#1A56DB", color: "#fff", border: "none",
            padding: "12px 28px", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700, fontSize: 14, marginTop: 8,
            boxShadow: loading ? "none" : "0 4px 6px rgba(26,86,219,0.2)",
            transition: "all 0.2s"
          }}>
            {loading ? "⏳ Sauvegarde en cours..." : saved ? "✓ Enregistré !" : "💾 Enregistrer"}
          </button>
        </div>
      )}

      {tab === "securite" && (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "24px 28px" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Changer le mot de passe</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Mot de passe actuel</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Nouveau mot de passe</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Confirmer le nouveau mot de passe</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button style={{
              background: "#1A56DB", color: "#fff", border: "none",
              padding: "10px 24px", borderRadius: 9, cursor: "pointer",
              fontWeight: 700, fontSize: 14, alignSelf: "flex-start",
            }}>Mettre à jour</button>
          </div>
        </div>
      )}
    </div>
  )
}
