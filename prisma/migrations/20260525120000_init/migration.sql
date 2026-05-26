-- CreateSchema
CREATE TYPE "Role" AS ENUM ('professeur', 'parent');
CREATE TYPE "StatutAnnonce" AS ENUM ('active', 'inactive', 'suspendue');
CREATE TYPE "StatutSeance" AS ENUM ('en_attente', 'confirmee', 'annulee', 'realisee');
CREATE TYPE "StatutPaiement" AS ENUM ('en_attente', 'valide', 'rembourse', 'echoue');

CREATE TABLE "utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "mot_de_passe" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(20),
    "adresse" TEXT,
    "photo" VARCHAR(255),
    "role" "Role" NOT NULL,
    "date_inscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

CREATE UNIQUE INDEX "utilisateur_email_key" ON "utilisateur"("email");

CREATE TABLE "professeur" (
    "id_professeur" SERIAL NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,
    "cv" TEXT,
    "tarif_horaire" DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    "bio" TEXT,
    "disponibilites" TEXT,
    "note_moyenne" DECIMAL(3,2) DEFAULT 0.00,

    CONSTRAINT "professeur_pkey" PRIMARY KEY ("id_professeur")
);

CREATE UNIQUE INDEX "professeur_id_utilisateur_key" ON "professeur"("id_utilisateur");
CREATE INDEX "professeur_note_moyenne_idx" ON "professeur"("note_moyenne");

CREATE TABLE "parent" (
    "id_parent" SERIAL NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id_parent")
);

CREATE UNIQUE INDEX "parent_id_utilisateur_key" ON "parent"("id_utilisateur");

CREATE TABLE "matiere" (
    "id_matiere" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "matiere_pkey" PRIMARY KEY ("id_matiere")
);

CREATE UNIQUE INDEX "matiere_nom_key" ON "matiere"("nom");

CREATE TABLE "niveau" (
    "id_niveau" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "niveau_pkey" PRIMARY KEY ("id_niveau")
);

CREATE UNIQUE INDEX "niveau_nom_key" ON "niveau"("nom");

CREATE TABLE "eleve" (
    "id_eleve" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "date_naissance" DATE,
    "ecole" VARCHAR(200),
    "id_parent" INTEGER NOT NULL,
    "id_niveau" INTEGER NOT NULL,

    CONSTRAINT "eleve_pkey" PRIMARY KEY ("id_eleve")
);

CREATE INDEX "eleve_id_parent_idx" ON "eleve"("id_parent");

CREATE TABLE "enseigne" (
    "id_professeur" INTEGER NOT NULL,
    "id_matiere" INTEGER NOT NULL,

    CONSTRAINT "enseigne_pkey" PRIMARY KEY ("id_professeur", "id_matiere")
);

CREATE TABLE "annonce" (
    "id_annonce" SERIAL NOT NULL,
    "titre" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "tarif" DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    "statut" "StatutAnnonce" NOT NULL DEFAULT 'active',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_professeur" INTEGER NOT NULL,
    "id_matiere" INTEGER NOT NULL,

    CONSTRAINT "annonce_pkey" PRIMARY KEY ("id_annonce")
);

CREATE INDEX "annonce_statut_idx" ON "annonce"("statut");
CREATE INDEX "annonce_tarif_idx" ON "annonce"("tarif");

CREATE TABLE "annonce_niveau" (
    "id_annonce" INTEGER NOT NULL,
    "id_niveau" INTEGER NOT NULL,

    CONSTRAINT "annonce_niveau_pkey" PRIMARY KEY ("id_annonce", "id_niveau")
);

CREATE TABLE "seance" (
    "id_seance" SERIAL NOT NULL,
    "date_seance" DATE NOT NULL,
    "heure_debut" TIME(0) NOT NULL,
    "heure_fin" TIME(0) NOT NULL,
    "statut" "StatutSeance" NOT NULL DEFAULT 'en_attente',
    "adresse" TEXT,
    "id_annonce" INTEGER NOT NULL,
    "id_parent" INTEGER NOT NULL,
    "id_eleve" INTEGER NOT NULL,

    CONSTRAINT "seance_pkey" PRIMARY KEY ("id_seance"),
    CONSTRAINT "chk_seance_horaire" CHECK ("heure_fin" > "heure_debut")
);

CREATE INDEX "seance_date_seance_idx" ON "seance"("date_seance");
CREATE INDEX "seance_statut_idx" ON "seance"("statut");

CREATE TABLE "paiement" (
    "id_paiement" SERIAL NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "date_paiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'en_attente',
    "mode_paiement" VARCHAR(50),
    "reference" VARCHAR(100),
    "id_seance" INTEGER NOT NULL,

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("id_paiement"),
    CONSTRAINT "paiement_id_seance_key" UNIQUE ("id_seance"),
    CONSTRAINT "chk_paiement_montant" CHECK ("montant" > 0)
);

CREATE INDEX "paiement_statut_idx" ON "paiement"("statut");

CREATE TABLE "avis" (
    "id_avis" SERIAL NOT NULL,
    "note" SMALLINT NOT NULL,
    "commentaire" TEXT,
    "date_avis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_parent" INTEGER NOT NULL,
    "id_professeur" INTEGER NOT NULL,

    CONSTRAINT "avis_pkey" PRIMARY KEY ("id_avis"),
    CONSTRAINT "avis_id_parent_id_professeur_key" UNIQUE ("id_parent", "id_professeur"),
    CONSTRAINT "chk_avis_note" CHECK ("note" >= 1 AND "note" <= 5)
);

CREATE INDEX "avis_id_parent_idx" ON "avis"("id_parent");
CREATE INDEX "avis_id_professeur_idx" ON "avis"("id_professeur");

ALTER TABLE "professeur"
ADD CONSTRAINT "professeur_id_utilisateur_fkey"
FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "parent"
ADD CONSTRAINT "parent_id_utilisateur_fkey"
FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "eleve"
ADD CONSTRAINT "eleve_id_parent_fkey"
FOREIGN KEY ("id_parent") REFERENCES "parent"("id_parent") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "eleve"
ADD CONSTRAINT "eleve_id_niveau_fkey"
FOREIGN KEY ("id_niveau") REFERENCES "niveau"("id_niveau") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "enseigne"
ADD CONSTRAINT "enseigne_id_professeur_fkey"
FOREIGN KEY ("id_professeur") REFERENCES "professeur"("id_professeur") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "enseigne"
ADD CONSTRAINT "enseigne_id_matiere_fkey"
FOREIGN KEY ("id_matiere") REFERENCES "matiere"("id_matiere") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "annonce"
ADD CONSTRAINT "annonce_id_professeur_fkey"
FOREIGN KEY ("id_professeur") REFERENCES "professeur"("id_professeur") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "annonce"
ADD CONSTRAINT "annonce_id_matiere_fkey"
FOREIGN KEY ("id_matiere") REFERENCES "matiere"("id_matiere") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "annonce_niveau"
ADD CONSTRAINT "annonce_niveau_id_annonce_fkey"
FOREIGN KEY ("id_annonce") REFERENCES "annonce"("id_annonce") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "annonce_niveau"
ADD CONSTRAINT "annonce_niveau_id_niveau_fkey"
FOREIGN KEY ("id_niveau") REFERENCES "niveau"("id_niveau") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "seance"
ADD CONSTRAINT "seance_id_annonce_fkey"
FOREIGN KEY ("id_annonce") REFERENCES "annonce"("id_annonce") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "seance"
ADD CONSTRAINT "seance_id_parent_fkey"
FOREIGN KEY ("id_parent") REFERENCES "parent"("id_parent") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "seance"
ADD CONSTRAINT "seance_id_eleve_fkey"
FOREIGN KEY ("id_eleve") REFERENCES "eleve"("id_eleve") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "paiement"
ADD CONSTRAINT "paiement_id_seance_fkey"
FOREIGN KEY ("id_seance") REFERENCES "seance"("id_seance") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "avis"
ADD CONSTRAINT "avis_id_parent_fkey"
FOREIGN KEY ("id_parent") REFERENCES "parent"("id_parent") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "avis"
ADD CONSTRAINT "avis_id_professeur_fkey"
FOREIGN KEY ("id_professeur") REFERENCES "professeur"("id_professeur") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION "maj_note_professeur"()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "professeur"
    SET "note_moyenne" = (
        SELECT ROUND(AVG("note")::numeric, 2)
        FROM "avis"
        WHERE "id_professeur" = COALESCE(NEW."id_professeur", OLD."id_professeur")
    )
    WHERE "id_professeur" = COALESCE(NEW."id_professeur", OLD."id_professeur");

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_maj_note_after_insert"
AFTER INSERT ON "avis"
FOR EACH ROW
EXECUTE FUNCTION "maj_note_professeur"();

CREATE TRIGGER "trg_maj_note_after_update"
AFTER UPDATE ON "avis"
FOR EACH ROW
EXECUTE FUNCTION "maj_note_professeur"();

CREATE TRIGGER "trg_maj_note_after_delete"
AFTER DELETE ON "avis"
FOR EACH ROW
EXECUTE FUNCTION "maj_note_professeur"();

INSERT INTO "niveau" ("nom", "description") VALUES
    ('Primaire CP–CE2', 'Cycle 2 — apprentissages fondamentaux'),
    ('Primaire CM1–CM2', 'Cycle 3 — consolidation des apprentissages'),
    ('Collège 6e–4e', 'Début du secondaire'),
    ('Collège 3e', 'Classe de brevet'),
    ('Lycée 2nde–1re', 'Début du lycée'),
    ('Terminale', 'Classe du baccalauréat'),
    ('Supérieur', 'BTS, licence, master et au-delà');

INSERT INTO "matiere" ("nom", "description") VALUES
    ('Mathématiques', 'Algèbre, géométrie, analyse'),
    ('Français', 'Grammaire, rédaction, littérature'),
    ('Anglais', 'Langue vivante 1'),
    ('Espagnol', 'Langue vivante 2'),
    ('Physique-Chimie', 'Sciences physiques et chimiques'),
    ('SVT', 'Sciences de la vie et de la Terre'),
    ('Histoire-Géo', 'Histoire, géographie, EMC'),
    ('Informatique', 'Algorithmique, programmation'),
    ('Philosophie', 'Terminale toutes séries');
