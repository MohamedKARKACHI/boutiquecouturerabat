# Boussete Couture Backend

Ce dossier contient l'API REST pour le site Boussete Couture.

## Pré-requis
- **MAMP** installé et lancé.
- Une base de données nommée `boussete_couture` créée dans phpMyAdmin.
- Node.js installé.

## Installation Rapide

1. **Base de Données** : 
   - Ouvrez phpMyAdmin (`http://localhost/phpMyAdmin5/`).
   - Créez une nouvelle base de données `boussete_couture`.
   - Importez le fichier `./init.sql`.

2. **Configuration** :
   - Le fichier `.env` est déjà configuré pour MAMP (root/root). Changez `DB_PASS` si nécessaire.

3. **Lancement de l'API** :
   ```bash
   npm install
   npm run dev
   ```

## API Endpoints
- `GET /api/products` : Liste des produits (filtres disponibles : `category`, `maxPrice`).
- `GET /api/categories` : Liste des catégories.
- `GET /api/products/:id` : Détails d'un produit spécifique.

## Performance
L'API est conçue pour être "khfif" (légère) en utilisant des requêtes SQL optimisées et une structure JSON minimale.
