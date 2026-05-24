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
export const PROFS_INIT = [
  {
    id: 1, nom: "Kamga", prenom: "Éric", email: "eric@demo.cm",
    tarif: 3500, note: 4.8, avis: 12, ville: "Yaoundé", photo: "EK",
    matières: ["Mathématiques", "Physique-Chimie"],
    niveaux: ["Lycée 2nde–1re", "Terminale"],
    bio: "Ingénieur de formation, 8 ans d'expérience en soutien scolaire.",
    dispo: "Lun–Ven 16h–20h, Sam 8h–14h",
    valide: true,
  },
  {
    id: 2, nom: "Nkomo", prenom: "Sylvie", email: "sylvie@demo.cm",
    tarif: 2500, note: 4.6, avis: 8, ville: "Douala", photo: "SN",
    matières: ["Français", "Histoire-Géo"],
    niveaux: ["Collège 6e–4e", "Collège 3e"],
    bio: "Prof certifiée, spécialiste de la préparation au BEPC.",
    dispo: "Mar–Jeu 15h–19h, Sam 9h–13h",
    valide: true,
  },
  {
    id: 3, nom: "Belinga", prenom: "Armel", email: "armel@demo.cm",
    tarif: 4000, note: 4.9, avis: 21, ville: "Yaoundé", photo: "AB",
    matières: ["Informatique", "Mathématiques"],
    niveaux: ["Terminale", "Supérieur"],
    bio: "Développeur full-stack et enseignant vacataire en université.",
    dispo: "Lun–Sam 17h–21h",
    valide: true,
  },
  {
    id: 4, nom: "Owona", prenom: "Carine", email: "carine@demo.cm",
    tarif: 2000, note: 4.5, avis: 6, ville: "Bafoussam", photo: "CO",
    matières: ["Anglais", "Espagnol"],
    niveaux: ["Primaire CM1–CM2", "Collège 6e–4e"],
    bio: "Bilingue franco-anglais, diplômée en linguistique appliquée.",
    dispo: "Mer–Ven 14h–18h",
    valide: true,
  },
  {
    id: 5, nom: "Mballa", prenom: "Thierry", email: "thierry@demo.cm",
    tarif: 3000, note: 4.3, avis: 5, ville: "Yaoundé", photo: "TM",
    matières: ["SVT", "Physique-Chimie"],
    niveaux: ["Collège 3e", "Lycée 2nde–1re"],
    bio: "Médecin et passionné de pédagogie scientifique.",
    dispo: "Sam–Dim 8h–14h",
    valide: false,
  },
]

// ── Séances (données démo) ───────────────────────────────────────────────────
export const SEANCES_INIT = [
  { id: 1, profId: 1, prof: "Éric Kamga",   matière: "Mathématiques",   niveau: "Terminale",        date: "2026-05-28", heure: "16:00–18:00", statut: "confirmee", eleve: "Noah", montant: 7000 },
  { id: 2, profId: 2, prof: "Sylvie Nkomo", matière: "Français",        niveau: "Collège 3e",       date: "2026-05-30", heure: "15:00–17:00", statut: "en_attente", eleve: "Léa",  montant: 5000 },
  { id: 3, profId: 1, prof: "Éric Kamga",   matière: "Physique-Chimie", niveau: "Lycée 2nde–1re",   date: "2026-05-20", heure: "16:00–18:00", statut: "realisee",  eleve: "Noah", montant: 7000 },
  { id: 4, profId: 3, prof: "Armel Belinga", matière: "Informatique",   niveau: "Supérieur",         date: "2026-05-15", heure: "17:00–19:00", statut: "realisee",  eleve: "Noah", montant: 8000 },
]

// ── Élèves (données démo) ────────────────────────────────────────────────────
export const ELEVES_INIT = [
  { id: 1, nom: "Noah",  prenom: "", niveau: "Terminale",  ecole: "Lycée Général Leclerc"  },
  { id: 2, nom: "Léa",   prenom: "", niveau: "Collège 3e", ecole: "Collège de la Retraite" },
]

// ── Annonces (données démo) ──────────────────────────────────────────────────
export const ANNONCES_INIT = [
  { id: 1, titre: "Maths & Physique Terminale",  matière: "Mathématiques",   niveaux: ["Terminale"],         tarif: 3500, statut: "active",   date: "2026-04-01", seances: 7 },
  { id: 2, titre: "Soutien Maths 2nde-1re",      matière: "Mathématiques",   niveaux: ["Lycée 2nde–1re"],    tarif: 3500, statut: "active",   date: "2026-03-15", seances: 4 },
  { id: 3, titre: "Physique-Chimie collège",      matière: "Physique-Chimie", niveaux: ["Collège 3e"],        tarif: 3000, statut: "inactive", date: "2026-02-10", seances: 2 },
]

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
