CREATE TABLE `Abonnements` (
  `ID` int(11) PRIMARY KEY NOT NULL,
  `td_ID_Utilisateur` char(36) DEFAULT null,
  `td_ID_Utilisateur_Suivi` char(36) DEFAULT null
);

CREATE TABLE `Réinitialisation_de_mot_de_passe` (
  `ID` int(11) PRIMARY KEY NOT NULL,
  `td_ID_Utilisateur` char(36) DEFAULT null,
  `Token` varchar(255) DEFAULT null,
  `Date_d_expiration` datetime DEFAULT null
);

CREATE TABLE `users` (
  `UUID` char(36) PRIMARY KEY NOT NULL,
  `username` varchar(255) DEFAULT null,
  `email` varchar(255) DEFAULT null,
  `hash` varchar(255) DEFAULT null,
  `role` varchar(255) DEFAULT 'user',
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `Image` varchar(255) NOT NULL
);

ALTER TABLE `Abonnements` ADD CONSTRAINT `Abonnements_ibfk_1` FOREIGN KEY (`td_ID_Utilisateur`) REFERENCES `users` (`UUID`);

ALTER TABLE `Abonnements` ADD CONSTRAINT `Abonnements_ibfk_2` FOREIGN KEY (`td_ID_Utilisateur_Suivi`) REFERENCES `users` (`UUID`);

ALTER TABLE `Réinitialisation_de_mot_de_passe` ADD CONSTRAINT `Réinitialisation_de_mot_de_passe_ibfk_1` FOREIGN KEY (`td_ID_Utilisateur`) REFERENCES `users` (`UUID`);
