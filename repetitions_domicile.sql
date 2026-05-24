-- ============================================================
--  APPLICATION RÉPÉTITIONS À DOMICILE
--  Script SQL de création de la base de données
--  Moteur : MySQL 8+ / MariaDB 10.5+
-- ============================================================

CREATE DATABASE IF NOT EXISTS repetitions_domicile
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE repetitions_domicile;

-- ------------------------------------------------------------
-- 1. UTILISATEUR  (table mère de PROFESSEUR et PARENT)
-- ------------------------------------------------------------
CREATE TABLE utilisateur (
    id_utilisateur   INT             NOT NULL AUTO_INCREMENT,
    nom              VARCHAR(100)    NOT NULL,
    prenom           VARCHAR(100)    NOT NULL,
    email            VARCHAR(150)    NOT NULL,
    mot_de_passe     VARCHAR(255)    NOT NULL,   -- hash bcrypt
    telephone        VARCHAR(20)         NULL,
    adresse          TEXT                NULL,
    photo            VARCHAR(255)        NULL,
    role             ENUM('professeur','parent') NOT NULL,
    date_inscription DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_utilisateur PRIMARY KEY (id_utilisateur),
    CONSTRAINT uq_utilisateur_email UNIQUE (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. PROFESSEUR  (sous-classe de UTILISATEUR)
-- ------------------------------------------------------------
CREATE TABLE professeur (
    id_professeur  INT              NOT NULL AUTO_INCREMENT,
    id_utilisateur INT              NOT NULL,
    cv             TEXT                 NULL,
    tarif_horaire  DECIMAL(8,2)     NOT NULL DEFAULT 0.00,
    bio            TEXT                 NULL,
    disponibilites TEXT                 NULL,   -- JSON ou texte libre
    note_moyenne   DECIMAL(3,2)         NULL DEFAULT 0.00,
    CONSTRAINT pk_professeur PRIMARY KEY (id_professeur),
    CONSTRAINT uq_prof_utilisateur UNIQUE (id_utilisateur),
    CONSTRAINT fk_prof_utilisateur
        FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateur (id_utilisateur)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. PARENT  (sous-classe de UTILISATEUR)
-- ------------------------------------------------------------
CREATE TABLE parent (
    id_parent      INT  NOT NULL AUTO_INCREMENT,
    id_utilisateur INT  NOT NULL,
    CONSTRAINT pk_parent PRIMARY KEY (id_parent),
    CONSTRAINT uq_parent_utilisateur UNIQUE (id_utilisateur),
    CONSTRAINT fk_parent_utilisateur
        FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateur (id_utilisateur)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. MATIÈRE
-- ------------------------------------------------------------
CREATE TABLE matiere (
    id_matiere  INT          NOT NULL AUTO_INCREMENT,
    nom         VARCHAR(100) NOT NULL,
    description TEXT             NULL,
    CONSTRAINT pk_matiere PRIMARY KEY (id_matiere),
    CONSTRAINT uq_matiere_nom UNIQUE (nom)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. NIVEAU  (primaire, collège, lycée, supérieur…)
-- ------------------------------------------------------------
CREATE TABLE niveau (
    id_niveau   INT          NOT NULL AUTO_INCREMENT,
    nom         VARCHAR(100) NOT NULL,
    description TEXT             NULL,
    CONSTRAINT pk_niveau PRIMARY KEY (id_niveau),
    CONSTRAINT uq_niveau_nom UNIQUE (nom)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 6. ÉLÈVE
-- ------------------------------------------------------------
CREATE TABLE eleve (
    id_eleve       INT          NOT NULL AUTO_INCREMENT,
    nom            VARCHAR(100) NOT NULL,
    prenom         VARCHAR(100) NOT NULL,
    date_naissance DATE             NULL,
    ecole          VARCHAR(200)     NULL,
    id_parent      INT          NOT NULL,
    id_niveau      INT          NOT NULL,
    CONSTRAINT pk_eleve PRIMARY KEY (id_eleve),
    CONSTRAINT fk_eleve_parent
        FOREIGN KEY (id_parent)
        REFERENCES parent (id_parent)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_eleve_niveau
        FOREIGN KEY (id_niveau)
        REFERENCES niveau (id_niveau)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 7. ENSEIGNE  (association N:N PROFESSEUR × MATIÈRE)
-- ------------------------------------------------------------
CREATE TABLE enseigne (
    id_professeur INT NOT NULL,
    id_matiere    INT NOT NULL,
    CONSTRAINT pk_enseigne PRIMARY KEY (id_professeur, id_matiere),
    CONSTRAINT fk_enseigne_prof
        FOREIGN KEY (id_professeur)
        REFERENCES professeur (id_professeur)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_enseigne_matiere
        FOREIGN KEY (id_matiere)
        REFERENCES matiere (id_matiere)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 8. ANNONCE  (offre publiée par un professeur)
-- ------------------------------------------------------------
CREATE TABLE annonce (
    id_annonce    INT          NOT NULL AUTO_INCREMENT,
    titre         VARCHAR(200) NOT NULL,
    description   TEXT             NULL,
    tarif         DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    statut        ENUM('active','inactive','suspendue') NOT NULL DEFAULT 'active',
    date_creation DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_professeur INT          NOT NULL,
    id_matiere    INT          NOT NULL,
    CONSTRAINT pk_annonce PRIMARY KEY (id_annonce),
    CONSTRAINT fk_annonce_prof
        FOREIGN KEY (id_professeur)
        REFERENCES professeur (id_professeur)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_annonce_matiere
        FOREIGN KEY (id_matiere)
        REFERENCES matiere (id_matiere)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 9. ANNONCE_NIVEAU  (association N:N ANNONCE × NIVEAU)
-- ------------------------------------------------------------
CREATE TABLE annonce_niveau (
    id_annonce INT NOT NULL,
    id_niveau  INT NOT NULL,
    CONSTRAINT pk_annonce_niveau PRIMARY KEY (id_annonce, id_niveau),
    CONSTRAINT fk_an_annonce
        FOREIGN KEY (id_annonce)
        REFERENCES annonce (id_annonce)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_an_niveau
        FOREIGN KEY (id_niveau)
        REFERENCES niveau (id_niveau)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 10. SÉANCE
-- ------------------------------------------------------------
CREATE TABLE seance (
    id_seance   INT          NOT NULL AUTO_INCREMENT,
    date_seance DATE         NOT NULL,
    heure_debut TIME         NOT NULL,
    heure_fin   TIME         NOT NULL,
    statut      ENUM('en_attente','confirmee','annulee','realisee')
                             NOT NULL DEFAULT 'en_attente',
    adresse     TEXT             NULL,
    id_annonce  INT          NOT NULL,
    id_parent   INT          NOT NULL,
    id_eleve    INT          NOT NULL,
    CONSTRAINT pk_seance PRIMARY KEY (id_seance),
    CONSTRAINT chk_seance_horaire CHECK (heure_fin > heure_debut),
    CONSTRAINT fk_seance_annonce
        FOREIGN KEY (id_annonce)
        REFERENCES annonce (id_annonce)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_seance_parent
        FOREIGN KEY (id_parent)
        REFERENCES parent (id_parent)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_seance_eleve
        FOREIGN KEY (id_eleve)
        REFERENCES eleve (id_eleve)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 11. PAIEMENT
-- ------------------------------------------------------------
CREATE TABLE paiement (
    id_paiement    INT          NOT NULL AUTO_INCREMENT,
    montant        DECIMAL(10,2) NOT NULL,
    date_paiement  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut         ENUM('en_attente','valide','rembourse','echoue')
                                NOT NULL DEFAULT 'en_attente',
    mode_paiement  VARCHAR(50)      NULL,   -- carte, mobile_money, espèces…
    reference      VARCHAR(100)     NULL,   -- référence externe (ex. Orange Money)
    id_seance      INT          NOT NULL,
    CONSTRAINT pk_paiement PRIMARY KEY (id_paiement),
    CONSTRAINT uq_paiement_seance UNIQUE (id_seance),   -- 1 paiement par séance
    CONSTRAINT chk_paiement_montant CHECK (montant > 0),
    CONSTRAINT fk_paiement_seance
        FOREIGN KEY (id_seance)
        REFERENCES seance (id_seance)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 12. AVIS  (entité-association PARENT × PROFESSEUR)
-- ------------------------------------------------------------
CREATE TABLE avis (
    id_avis       INT      NOT NULL AUTO_INCREMENT,
    note          TINYINT  NOT NULL,
    commentaire   TEXT         NULL,
    date_avis     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_parent     INT      NOT NULL,
    id_professeur INT      NOT NULL,
    CONSTRAINT pk_avis PRIMARY KEY (id_avis),
    CONSTRAINT chk_avis_note CHECK (note BETWEEN 1 AND 5),
    CONSTRAINT uq_avis_parent_prof UNIQUE (id_parent, id_professeur),
    CONSTRAINT fk_avis_parent
        FOREIGN KEY (id_parent)
        REFERENCES parent (id_parent)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_avis_professeur
        FOREIGN KEY (id_professeur)
        REFERENCES professeur (id_professeur)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
--  INDEX supplémentaires pour les recherches fréquentes
-- ============================================================
CREATE INDEX idx_annonce_statut     ON annonce  (statut);
CREATE INDEX idx_annonce_tarif      ON annonce  (tarif);
CREATE INDEX idx_seance_date        ON seance   (date_seance);
CREATE INDEX idx_seance_statut      ON seance   (statut);
CREATE INDEX idx_paiement_statut    ON paiement (statut);
CREATE INDEX idx_prof_note          ON professeur (note_moyenne);
CREATE INDEX idx_eleve_parent       ON eleve    (id_parent);

-- ============================================================
--  TRIGGER : recalcul automatique de note_moyenne du professeur
-- ============================================================
DELIMITER $$

CREATE TRIGGER trg_maj_note_after_insert
AFTER INSERT ON avis
FOR EACH ROW
BEGIN
    UPDATE professeur
    SET note_moyenne = (
        SELECT ROUND(AVG(note), 2)
        FROM avis
        WHERE id_professeur = NEW.id_professeur
    )
    WHERE id_professeur = NEW.id_professeur;
END$$

CREATE TRIGGER trg_maj_note_after_update
AFTER UPDATE ON avis
FOR EACH ROW
BEGIN
    UPDATE professeur
    SET note_moyenne = (
        SELECT ROUND(AVG(note), 2)
        FROM avis
        WHERE id_professeur = NEW.id_professeur
    )
    WHERE id_professeur = NEW.id_professeur;
END$$

CREATE TRIGGER trg_maj_note_after_delete
AFTER DELETE ON avis
FOR EACH ROW
BEGIN
    UPDATE professeur
    SET note_moyenne = (
        SELECT ROUND(AVG(note), 2)
        FROM avis
        WHERE id_professeur = OLD.id_professeur
    )
    WHERE id_professeur = OLD.id_professeur;
END$$

DELIMITER ;

-- ============================================================
--  DONNÉES DE RÉFÉRENCE (niveaux et matières courants)
-- ============================================================
INSERT INTO niveau (nom, description) VALUES
    ('Primaire CP–CE2',   'Cycle 2 — apprentissages fondamentaux'),
    ('Primaire CM1–CM2',  'Cycle 3 — consolidation des apprentissages'),
    ('Collège 6e–4e',     'Début du secondaire'),
    ('Collège 3e',        'Classe de brevet'),
    ('Lycée 2nde–1re',    'Début du lycée'),
    ('Terminale',         'Classe du baccalauréat'),
    ('Supérieur',         'BTS, licence, master et au-delà');

INSERT INTO matiere (nom, description) VALUES
    ('Mathématiques',   'Algèbre, géométrie, analyse'),
    ('Français',        'Grammaire, rédaction, littérature'),
    ('Anglais',         'Langue vivante 1'),
    ('Espagnol',        'Langue vivante 2'),
    ('Physique-Chimie', 'Sciences physiques et chimiques'),
    ('SVT',             'Sciences de la vie et de la Terre'),
    ('Histoire-Géo',    'Histoire, géographie, EMC'),
    ('Informatique',    'Algorithmique, programmation'),
    ('Philosophie',     'Terminale toutes séries');

-- ============================================================
--  FIN DU SCRIPT
-- ============================================================
