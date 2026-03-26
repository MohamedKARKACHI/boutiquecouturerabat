-- Migration to add English translation columns
ALTER TABLE `categories` ADD COLUMN `name_en` VARCHAR(255) AFTER `name`;
ALTER TABLE `categories` ADD COLUMN `description_en` TEXT AFTER `description`;

ALTER TABLE `products` ADD COLUMN `title_en` VARCHAR(255) AFTER `title`;
ALTER TABLE `products` ADD COLUMN `description_en` TEXT AFTER `description`;

ALTER TABLE `gallery` ADD COLUMN `alt_text_en` VARCHAR(255) AFTER `alt_text`;

-- Optional: Initial data update (placeholders)
UPDATE `categories` SET `name_en` = 'Caftans' WHERE `slug` = 'caftans';
UPDATE `categories` SET `name_en` = 'Djellabas' WHERE `slug` = 'djellabas';
UPDATE `categories` SET `name_en` = 'Gandouras' WHERE `slug` = 'gandouras';
UPDATE `categories` SET `name_en` = 'Abayas' WHERE `slug` = 'abayas';
