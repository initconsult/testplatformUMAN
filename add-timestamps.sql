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

-- Permission_role tabel - timestamps toevoegen indien kolommen nog niet bestaan
ALTER TABLE `permission_role` 
ADD COLUMN IF NOT EXISTS `created_at` timestamp NULL DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `updated_at` timestamp NULL DEFAULT NULL;

-- Role_user tabel - timestamps toevoegen indien kolommen nog niet bestaan
ALTER TABLE `role_user` 
ADD COLUMN IF NOT EXISTS `created_at` timestamp NULL DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `updated_at` timestamp NULL DEFAULT NULL;

SELECT 'Tabellen aangemaakt en timestamps toegevoegd!' as Status;
