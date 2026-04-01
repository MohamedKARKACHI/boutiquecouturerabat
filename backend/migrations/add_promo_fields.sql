-- Migration: Add promo fields to products table
-- Run this on your production database

ALTER TABLE `products` 
ADD COLUMN `old_price` decimal(10,2) DEFAULT NULL AFTER `price`,
ADD COLUMN `promo_active` tinyint(1) DEFAULT 0 AFTER `is_featured`;
