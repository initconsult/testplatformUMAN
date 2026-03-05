-- Migratie script om created_at en updated_at kolommen toe te voegen
-- aan tabellen die deze nog niet hebben

USE uman;

-- Advisors tabel heeft al created_at en updated_at

-- Categories tabel heeft al created_at en updated_at

-- Clients tabel heeft al created_at en updated_at

-- Client_tests tabel heeft al created_at en updated_at

-- Client_test_results tabel heeft al created_at en updated_at

-- Migrations tabel heeft geen timestamps nodig

-- Password_resets tabel heeft al created_at

-- PCAFA tabel - timestamps toevoegen
ALTER TABLE `PCAFA` 
ADD COLUMN `created_at` timestamp NULL DEFAULT NULL,
ADD COLUMN `updated_at` timestamp NULL DEFAULT NULL;

-- PCAFY tabel - timestamps toevoegen
ALTER TABLE `PCAFY` 
ADD COLUMN `created_at` timestamp NULL DEFAULT NULL,
ADD COLUMN `updated_at` timestamp NULL DEFAULT NULL;

-- PCAMA tabel - timestamps toevoegen
ALTER TABLE `PCAMA` 
ADD COLUMN `created_at` timestamp NULL DEFAULT NULL,
ADD COLUMN `updated_at` timestamp NULL DEFAULT NULL;

-- PCAMY tabel - timestamps toevoegen
ALTER TABLE `PCAMY` 
ADD COLUMN `created_at` timestamp NULL DEFAULT NULL,
ADD COLUMN `updated_at` timestamp NULL DEFAULT NULL;

-- Permissions tabel heeft al created_at en updated_at

-- Permission_role tabel - timestamps toevoegen
ALTER TABLE `permission_role` 
ADD COLUMN `created_at` timestamp NULL DEFAULT NULL,
ADD COLUMN `updated_at` timestamp NULL DEFAULT NULL;

-- Questions tabel heeft al created_at en updated_at

-- Question_lists tabel heeft al created_at en updated_at

-- Roles tabel heeft al created_at en updated_at

-- Role_user tabel - timestamps toevoegen
ALTER TABLE `role_user` 
ADD COLUMN `created_at` timestamp NULL DEFAULT NULL,
ADD COLUMN `updated_at` timestamp NULL DEFAULT NULL;

-- Tests tabel heeft al created_at en updated_at

-- Test_question_lists tabel heeft al created_at en updated_at

-- Users tabel heeft al created_at en updated_at

SELECT 'Timestamps succesvol toegevoegd aan alle tabellen!' as Status;
