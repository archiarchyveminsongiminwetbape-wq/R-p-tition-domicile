// ── Référentiel ─────────────────────────────────────────────────────────────
export const MATIERES = [
  "Mathématiques", "Français", "Anglais", "Espagnol",
  "Physique-Chimie", "SVT", "Histoire-Géo", "Informatique", "Philosophie",
]

export const NIVEAUX = [
  "Primaire CP–CE2", "Primaire CM1–CM2",
  "Collège 6e–4e", "Collège 3e",
  "Lycée 2nde–1re", "Terminale", "Supérieur",
]

// ── Professeurs (données démo) ───────────────────────────────────────────────
export const PROFS_INIT = []

// ── Séances (données démo) ───────────────────────────────────────────────────
export const SEANCES_INIT = []

// ── Élèves (données démo) ────────────────────────────────────────────────────
export const ELEVES_INIT = []

// ── Annonces (données démo) ──────────────────────────────────────────────────
export const ANNONCES_INIT = []

// ── Couleurs avatar ──────────────────────────────────────────────────────────
export const AVATAR_COLORS = ["#1A56DB","#7C3AED","#059669","#D97706","#DC2626","#0891B2"]
export const getAvatarColor = (i) => AVATAR_COLORS[i % AVATAR_COLORS.length]

// ── Statut séance ────────────────────────────────────────────────────────────
export const STATUT_INFO = {
  en_attente: { label: "En attente",  bg: "#FEF3C7", color: "#92400E" },
  confirmee:  { label: "Confirmée",   bg: "#D1FAE5", color: "#065F46" },
  annulee:    { label: "Annulée",     bg: "#FEE2E2", color: "#991B1B" },
  realisee:   { label: "Réalisée",    bg: "#E0E7FF", color: "#3730A3" },
}
