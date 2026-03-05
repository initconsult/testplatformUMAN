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

SELECT 'Tabellen aangemaakt!' as Status;
