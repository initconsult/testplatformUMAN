-- Migratie script om ontbrekende tabellen aan te maken en
-- created_at en updated_at kolommen toe te voegen

-- PCAFA tabel aanmaken indien niet bestaat
CREATE TABLE IF NOT EXISTS `PCAFA` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `score` int NOT NULL,
  `scorereport` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PCAFY tabel aanmaken indien niet bestaat
CREATE TABLE IF NOT EXISTS `PCAFY` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `score` int NOT NULL,
  `scorereport` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PCAMA tabel aanmaken indien niet bestaat
CREATE TABLE IF NOT EXISTS `PCAMA` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `score` int NOT NULL,
  `scorereport` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PCAMY tabel aanmaken indien niet bestaat
CREATE TABLE IF NOT EXISTS `PCAMY` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `score` int NOT NULL,
  `scorereport` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permission_role tabel - timestamps toevoegen
-- Controleer eerst of kolommen al bestaan via een stored procedure
DELIMITER $$

CREATE PROCEDURE AddTimestampsToPermissionRole()
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLSTATE '42S21' BEGIN END;
    
    ALTER TABLE `permission_role` ADD COLUMN `created_at` timestamp NULL DEFAULT NULL;
    ALTER TABLE `permission_role` ADD COLUMN `updated_at` timestamp NULL DEFAULT NULL;
END$$

DELIMITER ;

CALL AddTimestampsToPermissionRole();
DROP PROCEDURE AddTimestampsToPermissionRole;

-- Role_user tabel - timestamps toevoegen
DELIMITER $$

CREATE PROCEDURE AddTimestampsToRoleUser()
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLSTATE '42S21' BEGIN END;
    
    ALTER TABLE `role_user` ADD COLUMN `created_at` timestamp NULL DEFAULT NULL;
    ALTER TABLE `role_user` ADD COLUMN `updated_at` timestamp NULL DEFAULT NULL;
END$$

DELIMITER ;

CALL AddTimestampsToRoleUser();
DROP PROCEDURE AddTimestampsToRoleUser;

SELECT 'Tabellen aangemaakt en timestamps toegevoegd!' as Status;
