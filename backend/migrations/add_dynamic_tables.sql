-- Migration to add Security and Dynamic Content Support

-- Table for Admin Users (with BCrypt)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table for Hero Slider items
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) NOT NULL,
  `title_fr` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `subtitle_fr` varchar(255) DEFAULT NULL,
  `subtitle_en` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table for Global Settings (Contact Info, etc.)
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Settings Data
INSERT IGNORE INTO `settings` (`setting_key`, `setting_value`, `description`) VALUES
('contact_phone', '+212 666 780 147', 'Numéro de téléphone principal'),
('contact_email', 'boutiquecouturerabat@gmail.com', 'Email de contact'),
('contact_address_fr', 'Dar Pacha, Arset Aouzal, Médina de Marrakech 40030, Maroc', 'Adresse physique (FR)'),
('contact_address_en', 'Dar Pacha, Arset Aouzal, Marrakech Medina 40030, Morocco', 'Physical address (EN)'),
('whatsapp_number', '212666780147', 'Numéro WhatsApp (format international sans +)'),
('opening_hours_fr', 'Tous les jours: 10h00 – 22h00', 'Horaires d\'ouverture (FR)'),
('opening_hours_en', 'Every day: 10:00 AM – 10:00 PM', 'Opening hours (EN)'),
('google_maps_url', 'https://maps.google.com/maps?q=Boutique%20couturier%20rabat,%20Marrakech&t=&z=16&ie=UTF8&iwloc=&output=embed', 'URL d\'intégration Google Maps');
