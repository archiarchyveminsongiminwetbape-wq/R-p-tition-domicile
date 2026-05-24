import { useState } from 'react'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Stars from '../components/Stars'
import ReservModal from '../components/ReservModal'
import { MATIERES, NIVEAUX, getAvatarColor } from '../data/constants'

function ProfCard({ prof, index, onDetail, onReserv }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
      padding: 20, display: "flex", flexDirection: "column", gap: 10,
      transition: "box-shadow .2s", cursor: "pointer",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
      onClick={() => onDetail(prof)}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar initials={prof.photo} size={44} color={getAvatarColor(index)} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{prof.prenom} {prof.nom}</div>
          <div style={{ fontSize: 12, color: "#64748B" }}>📍 {prof.ville}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, color: "#059669", fontSize: 15 }}>{prof.tarif.toLocaleString("fr-FR")} FCFA/h</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Stars n={prof.note} size={13} />
        <span style={{ fontSize: 12, color: "#64748B" }}>{prof.note} ({prof.avis} avis)</span>
      </div>

      <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6, margin: 0 }}>
        {prof.bio.length > 90 ? prof.bio.slice(0, 90) + "…" : prof.bio}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {prof.matières.map(m => <Badge key={m} text={m} />)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {prof.niveaux.map(n => <Badge key={n} text={n} bg="#F0FDF4" color="#059669" />)}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={e => { e.stopPropagation(); onDetail(prof) }}
          style={{
            flex: 1, padding: "8px 0", border: "1px solid #E2E8F0",
            background: "#F8FAFC", borderRadius: 8, fontSize: 13, fontWeight: 600,
            color: "#374151", cursor: "pointer",
          }}>
          Voir le profil
        </button>
        <button
          onClick={e => { e.stopPropagation(); onReserv(prof) }}
          style={{
            flex: 1, padding: "8px 0", border: "none",
            background: "#1A56DB", borderRadius: 8, fontSize: 13, fontWeight: 600,
            color: "#fff", cursor: "pointer",
          }}>
          Réserver
        </button>
      </div>
    </div>
  )
}

function ProfDetail({ prof, onBack, onReserv }) {
  return (
    <div className="fade-in">
      <button onClick={onBack} style={{
        border: "none", background: "none", cursor: "pointer",
        color: "#1A56DB", fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0,
      }}>← Retour aux résultats</button>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden" }}>
        <div style={{
          background: "linear-gradient(135deg,#1A56DB 0%,#3B82F6 100%)",
          padding: "28px 28px 24px", display: "flex", alignItems: "center", gap: 20,
        }}>
          <Avatar initials={prof.photo} size={64} color="rgba(255,255,255,.2)" />
          <div style={{ flex: 1, color: "#fff" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display',serif", margin: "0 0 4px" }}>
              {prof.prenom} {prof.nom}
            </h2>
            <div style={{ fontSize: 13, opacity: .85 }}>📍 {prof.ville}</div>
            <div style={{ marginTop: 6 }}>
              <Stars n={prof.note} size={15} />
              <span style={{ fontSize: 12, opacity: .8, marginLeft: 6 }}>({prof.avis} avis)</span>
            </div>
          </div>
          <div style={{ textAlign: "right", color: "#fff" }}>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>
              {prof.tarif.toLocaleString("fr-FR")} FCFA
            </div>
            <div style={{ fontSize: 12, opacity: .7 }}>par heure</div>
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 24 }}>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>Biographie</h4>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{prof.bio}</p>

              <h4 style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: .8, margin: "18px 0 8px" }}>Disponibilités</h4>
              <p style={{ fontSize: 14, color: "#374151" }}>🕐 {prof.dispo}</p>
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>Matières enseignées</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                {prof.matières.map(m => <Badge key={m} text={m} />)}
              </div>

              <h4 style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>Niveaux pris en charge</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                {prof.niveaux.map(n => <Badge key={n} text={n} bg="#F0FDF4" color="#059669" />)}
              </div>

              <h4 style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>Tarif</h4>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#059669", fontFamily: "'Playfair Display',serif" }}>
                {prof.tarif.toLocaleString("fr-FR")} FCFA/h
              </div>
            </div>
          </div>

          <button
            onClick={() => onReserv(prof)}
            style={{
              width: "100%", padding: "14px 0", border: "none",
              background: "#1A56DB", borderRadius: 10, cursor: "pointer",
              fontWeight: 700, fontSize: 16, color: "#fff",
            }}>
            Réserver une séance avec {prof.prenom}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Recherche({ profs, eleves, onReservSuccess }) {
  const [matiere,  setMatiere]  = useState("")
  const [niveau,   setNiveau]   = useState("")
  const [maxTarif, setMaxTarif] = useState(10000)
  const [q,        setQ]        = useState("")
  const [detail,   setDetail]   = useState(null)
  const [reserv,   setReserv]   = useState(null)
  const [success,  setSuccess]  = useState(false)

  const filtered = profs.filter(p =>
    p.valide &&
    (!matiere || p.matières.includes(matiere)) &&
    (!niveau  || p.niveaux.includes(niveau))   &&
    p.tarif <= maxTarif &&
    (!q || `${p.prenom} ${p.nom}`.toLowerCase().includes(q.toLowerCase()))
  )

  function handleConfirm(data) {
    onReservSuccess(data)
    setReserv(null)
    setDetail(null)
    setSuccess(true)
  }

  if (success) return (
    <div className="fade-in" style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "80px 0", textAlign: "center",
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>
        Demande envoyée !
      </h3>
      <p style={{ color: "#64748B", marginBottom: 28, fontSize: 15 }}>
        Votre demande a été transmise au professeur.<br/>Vous recevrez une confirmation sous peu.
      </p>
      <button onClick={() => setSuccess(false)} style={{
        background: "#1A56DB", color: "#fff", border: "none",
        padding: "11px 28px", borderRadius: 9, cursor: "pointer",
        fontWeight: 600, fontSize: 14,
      }}>Rechercher un autre professeur</button>
    </div>
  )

  if (detail) return (
    <>
      <ProfDetail prof={detail} onBack={() => setDetail(null)} onReserv={p => { setDetail(null); setReserv(p) }} />
      {reserv && <ReservModal prof={reserv} eleves={eleves} onClose={() => setReserv(null)} onConfirm={handleConfirm} />}
    </>
  )

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 20 }}>
        Trouver un professeur
      </h2>

      {/* Filtres */}
      <div style={{
        background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
        padding: "16px 20px", marginBottom: 20,
        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end",
      }}>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 4 }}>Rechercher</label>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nom du professeur…" />
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 4 }}>Matière</label>
          <select value={matiere} onChange={e => setMatiere(e.target.value)}>
            <option value="">Toutes les matières</option>
            {MATIERES.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 4 }}>Niveau</label>
          <select value={niveau} onChange={e => setNiveau(e.target.value)}>
            <option value="">Tous les niveaux</option>
            {NIVEAUX.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 4 }}>
            Tarif max : <strong>{maxTarif.toLocaleString("fr-FR")} FCFA/h</strong>
          </label>
          <input type="range" min={1000} max={10000} step={500} value={maxTarif}
            onChange={e => setMaxTarif(+e.target.value)} style={{ padding: 0, border: "none" }} />
        </div>
        {(matiere || niveau || q || maxTarif < 10000) && (
          <button onClick={() => { setMatiere(""); setNiveau(""); setQ(""); setMaxTarif(10000) }}
            style={{
              background: "#FEE2E2", color: "#991B1B", border: "none",
              padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
            ✕ Réinitialiser
          </button>
        )}
      </div>

      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 16 }}>
        {filtered.length} professeur{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
        {filtered.map((p, i) => (
          <ProfCard key={p.id} prof={p} index={i}
            onDetail={setDetail} onReserv={setReserv} />
        ))}
        {filtered.length === 0 && (
          <div style={{
            gridColumn: "1/-1", textAlign: "center", padding: "60px 0",
            color: "#94A3B8", fontSize: 14,
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
            Aucun professeur ne correspond à vos critères.
          </div>
        )}
      </div>

      {reserv && (
        <ReservModal prof={reserv} eleves={eleves} onClose={() => setReserv(null)} onConfirm={handleConfirm} />
      )}
    </div>
  )
}
