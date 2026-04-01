-- Database: boussete_couture
-- Complete schema with multilingual support

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

-- Table structure for table `categories`

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `categories`

INSERT INTO `categories` (`name`, `name_en`, `slug`, `image`, `description`, `description_en`) VALUES
('Caftans', 'Caftans', 'caftans', 'caftans.png', 'Élégance traditionnelle revisitée', 'Traditional elegance, reimagined'),
('Djellabas', 'Djellabas', 'djellabas', 'djellabas.png', 'Confort et style au quotidien', 'Daily comfort and style'),
('Gandouras', 'Gandouras', 'gandouras', 'gandouras.png', 'Légèreté et raffinement', 'Lightweight and refined'),
('Abayas', 'Abayas', 'abayas', 'abaya.png', 'Modernité et pudeur', 'Modernity and modesty');

-- --------------------------------------------------------

-- Table structure for table `products`

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `main_image` varchar(255) NOT NULL,
  `in_stock` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `promo_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `products`

INSERT INTO `products` (`category_id`, `title`, `title_en`, `slug`, `price`, `main_image`, `in_stock`, `is_featured`) VALUES
(1, 'Caftan Majorelle', 'Majorelle Caftan', 'caftan-majorelle', 3500.00, 'caftans.png', 1, 1),
(2, 'Djellaba Artisanale', 'Artisanal Djellaba', 'djellaba-artisanale', 1800.00, 'djellabas.png', 1, 0),
(3, 'Gandoura Royale', 'Royal Gandoura', 'gandoura-royale', 1200.00, 'gandouras.png', 1, 0);

-- --------------------------------------------------------

-- Table structure for table `product_images`

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `colors`

CREATE TABLE `colors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `hex_code` varchar(7) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `colors`

INSERT INTO `colors` (`name`, `hex_code`) VALUES
('Noir', '#1C1C1E'),
('Bleu', '#1A2980'),
('Vert', '#0D6B4B'),
('Rouge/Orange', '#C75B39'),
('Beige', '#E8DDD0'),
('Or', '#D4A843');

-- --------------------------------------------------------

-- Table structure for table `product_colors`

CREATE TABLE `product_colors` (
  `product_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`color_id`),
  KEY `color_id` (`color_id`),
  CONSTRAINT `product_colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_colors_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `gallery`

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `alt_text_en` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `gallery`

INSERT INTO `gallery` (`image_path`, `alt_text`, `alt_text_en`, `order_index`) VALUES
('gallery1.png', 'Broderie artisanale', 'Artisanal embroidery', 1),
('gallery2.png', 'Maître tailleur au travail', 'Master tailor at work', 2),
('gallery3.png', 'Caftan de luxe', 'Luxury caftan', 3),
('gallery4.png', 'Collection exposée', 'Collection on display', 4),
('gallery5.png', 'Djellaba moderne', 'Modern djellaba', 5),
('gallery6.png', 'Tissus précieux', 'Precious fabrics', 6);

-- --------------------------------------------------------

-- Table structure for table `users`

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `hero_slides`

CREATE TABLE `hero_slides` (
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

-- --------------------------------------------------------

-- Table structure for table `settings`

CREATE TABLE `settings` (
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

COMMIT;
