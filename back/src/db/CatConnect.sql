CREATE TABLE Utilisateurs (
    UUID CHAR(36) PRIMARY KEY,
    Nom VARCHAR(255),
    Email VARCHAR(255),
    Photo_de_profil VARCHAR(255),
    Mot_de_passe VARCHAR(255),
    Role VARCHAR(255)
);

CREATE TABLE Abonnements (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    td_ID_Utilisateur CHAR(36),
    td_ID_Utilisateur_Suivi CHAR(36),
    FOREIGN KEY (td_ID_Utilisateur) REFERENCES Utilisateurs(UUID),
    FOREIGN KEY (td_ID_Utilisateur_Suivi) REFERENCES Utilisateurs(UUID)
);

CREATE TABLE Réinitialisation_de_mot_de_passe (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    td_ID_Utilisateur CHAR(36),
    Token VARCHAR(255),
    Date_d_expiration DATETIME,
    FOREIGN KEY (td_ID_Utilisateur) REFERENCES Utilisateurs(UUID)
);

CREATE TABLE Publications (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    td_ID_Utilisateur CHAR(36),
    td_message VARCHAR(255),
    td_date_de_commentaire DATE,
    FOREIGN KEY (td_ID_Utilisateur) REFERENCES Utilisateurs(UUID)
);

CREATE TABLE Commentaires (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    td_ID_Utilisateur CHAR(36),
    td_ID_Publication INT,
    td_message VARCHAR(255),
    td_date_de_commentaire DATE,
    FOREIGN KEY (td_ID_Utilisateur) REFERENCES Utilisateurs(UUID),
    FOREIGN KEY (td_ID_Publication) REFERENCES Publications(ID)
);

CREATE TABLE Likes (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    td_ID_Utilisateur CHAR(36),
    td_ID_Publication INT,
    type CHAR(36),
    FOREIGN KEY (td_ID_Utilisateur) REFERENCES Utilisateurs(UUID),
    FOREIGN KEY (td_ID_Publication) REFERENCES Publications(ID)
);

-- db.Publications.insert({
--     ID: "some_id",
--     ID_Utilisateur: "some_user_id",
--     Message: "some_message",
--     Date_de_publication: new Date()
-- });

-- db.Commentaires.insert({
--     ID: "some_id",
--     ID_Utilisateur: "some_user_id",
--     ID_Publication: "some_publication_id",
--     Message: "some_message",
--     Date_de_commentaire: new Date()
-- });

-- db.Likes.insert({
--     ID: "some_id",
--     ID_Utilisateur: "some_user_id",
--     ID_Publication: "some_publication_id",
--     Type: "like"
-- });