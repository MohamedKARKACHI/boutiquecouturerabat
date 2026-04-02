/**
 * Mock Database Layer
 * 
 * Provides an in-memory database with full CRUD support for development
 * without a MySQL server. Data persists only during the server's lifetime.
 * 
 * Supports: SELECT, INSERT, UPDATE, DELETE queries via pattern matching.
 */

// ── Data Store (mutable) ──
let nextIds = { products: 4, categories: 5, gallery: 7, product_images: 1, hero_slides: 2, users: 2 };

let users = [
  // $2a$10$6zN8... is a bcrypt hash for 'admin123' (simplified for mock)
  { id: 1, username: 'admin', password_hash: '$2a$10$pCvjkTwhdah2otfX5AqTves9u1q2fOtq/JKfgnYD0Ij58muQshlym' }
];

let hero_slides = [
  { id: 1, image_path: 'slide1.jpg', title_fr: 'L\'Élégance du Caftan Marocain Authentique', title_en: 'Authentic Moroccan Caftan Elegance', gold_text_fr: 'Marocain', gold_text_en: 'Moroccan', italic_text_fr: 'L\'Élégance, du Caftan, Authentique', italic_text_en: 'Authentic, Elegance', subtitle_fr: 'Haute Couture & Créations Sur-Mesure par Aziz Bousseta', subtitle_en: 'Bespoke Haute Couture by Aziz Bousseta', order_index: 0, is_active: 1 },
  { id: 2, image_path: 'slide2.jpg', title_fr: 'L\'Élégance du Caftan Marocain Authentique', title_en: 'Authentic Moroccan Caftan Elegance', gold_text_fr: 'Marocain', gold_text_en: 'Moroccan', italic_text_fr: 'L\'Élégance, du Caftan, Authentique', italic_text_en: 'Authentic, Elegance', subtitle_fr: 'Haute Couture & Créations Sur-Mesure par Aziz Bousseta', subtitle_en: 'Bespoke Haute Couture by Aziz Bousseta', order_index: 1, is_active: 1 },
  { id: 3, image_path: 'slide3.jpg', title_fr: 'L\'Élégance du Caftan Marocain Authentique', title_en: 'Authentic Moroccan Caftan Elegance', gold_text_fr: 'Marocain', gold_text_en: 'Moroccan', italic_text_fr: 'L\'Élégance, du Caftan, Authentique', italic_text_en: 'Authentic, Elegance', subtitle_fr: 'Haute Couture & Créations Sur-Mesure par Aziz Bousseta', subtitle_en: 'Bespoke Haute Couture by Aziz Bousseta', order_index: 2, is_active: 1 },
  { id: 4, image_path: 'slide4.jpg', title_fr: 'L\'Élégance du Caftan Marocain Authentique', title_en: 'Authentic Moroccan Caftan Elegance', gold_text_fr: 'Marocain', gold_text_en: 'Moroccan', italic_text_fr: 'L\'Élégance, du Caftan, Authentique', italic_text_en: 'Authentic, Elegance', subtitle_fr: 'Haute Couture & Créations Sur-Mesure par Aziz Bousseta', subtitle_en: 'Bespoke Haute Couture by Aziz Bousseta', order_index: 3, is_active: 1 },
  { id: 5, image_path: 'slide5.jpg', title_fr: 'L\'Élégance du Caftan Marocain Authentique', title_en: 'Authentic Moroccan Caftan Elegance', gold_text_fr: 'Marocain', gold_text_en: 'Moroccan', italic_text_fr: 'L\'Élégance, du Caftan, Authentique', italic_text_en: 'Authentic, Elegance', subtitle_fr: 'Haute Couture & Créations Sur-Mesure par Aziz Bousseta', subtitle_en: 'Bespoke Haute Couture by Aziz Bousseta', order_index: 4, is_active: 1 }
];

let settings = [
  { setting_key: 'contact_phone', setting_value: '+212 666 780 147' },
  { setting_key: 'contact_email', setting_value: 'boutiquecouturerabat@gmail.com' },
  { setting_key: 'contact_address_fr', setting_value: 'Dar Pacha, Arset Aouzal, Médina de Marrakech 40030, Maroc' },
  { setting_key: 'contact_address_en', setting_value: 'Dar Pacha, Arset Aouzal, Marrakech Medina 40030, Morocco' },
  { setting_key: 'whatsapp_number', setting_value: '212666780147' },
  { setting_key: 'opening_hours_fr', setting_value: 'Tous les jours: 10h00 – 22h00' },
  { setting_key: 'opening_hours_en', setting_value: 'Every day: 10:00 AM – 10:00 PM' },
  { setting_key: 'google_maps_url', setting_value: 'https://maps.google.com/maps?q=Boutique%20couturier%20rabat,%20Marrakech&t=&z=16&ie=UTF8&iwloc=&output=embed' }
];

let categories = [
  { id: 1, name: 'Caftans', name_en: 'Caftans', slug: 'caftans', image: 'caftans.png', description: 'Élégance traditionnelle revisitée', description_en: 'Traditional elegance, reimagined' },
  { id: 2, name: 'Djellabas', name_en: 'Djellabas', slug: 'djellabas', image: 'djellabas.png', description: 'Confort et style au quotidien', description_en: 'Daily comfort and style' },
  { id: 3, name: 'Gandouras', name_en: 'Gandouras', slug: 'gandouras', image: 'gandouras.png', description: 'Légèreté et raffinement', description_en: 'Lightweight and refined' },
  { id: 4, name: 'Abayas', name_en: 'Abayas', slug: 'abayas', image: 'accessories.png', description: 'Modernité et pudeur', description_en: 'Modernity and modesty' }
];

let products = [
  { id: 1, category_id: 1, title: 'Caftan Majorelle', title_en: 'Majorelle Caftan', slug: 'caftan-majorelle', description: 'Un caftan d\'exception, brodé à la main avec des fils dorés.', description_en: 'An exceptional caftan, hand-embroidered with golden threads.', price: 3500.00, main_image: 'caftans.png', in_stock: 1, is_featured: 1, category_name: 'Caftans', category_name_en: 'Caftans', colors: '#1C1C1E,#1A2980' },
  { id: 2, category_id: 2, title: 'Djellaba Artisanale', title_en: 'Artisanal Djellaba', slug: 'djellaba-artisanale', description: 'Djellaba en laine tissée, coupe moderne.', description_en: 'Woven wool djellaba, modern cut.', price: 1800.00, main_image: 'djellabas.png', in_stock: 1, is_featured: 0, category_name: 'Djellabas', category_name_en: 'Djellabas', colors: '#0D6B4B' },
  { id: 3, category_id: 3, title: 'Gandoura Royale', title_en: 'Royal Gandoura', slug: 'gandoura-royale', description: 'Gandoura en soie naturelle, finitions délicates.', description_en: 'Natural silk gandoura with delicate finishes.', price: 1200.00, main_image: 'gandouras.png', in_stock: 1, is_featured: 0, category_name: 'Gandouras', category_name_en: 'Gandouras', colors: '#D4A843' }
];

let productImages = [];

let colors = [
  { id: 1, name: 'Noir', hex_code: '#1C1C1E' },
  { id: 2, name: 'Bleu', hex_code: '#1A2980' },
  { id: 3, name: 'Vert', hex_code: '#0D6B4B' },
  { id: 4, name: 'Rouge/Orange', hex_code: '#C75B39' },
  { id: 5, name: 'Beige', hex_code: '#E8DDD0' },
  { id: 6, name: 'Or', hex_code: '#D4A843' }
];

let gallery = [
  { id: 1, image_path: 'gallery1.png', alt_text: 'Broderie artisanale', alt_text_en: 'Artisanal embroidery', order_index: 1 },
  { id: 2, image_path: 'gallery2.png', alt_text: 'Maître tailleur au travail', alt_text_en: 'Master tailor at work', order_index: 2 },
  { id: 3, image_path: 'gallery3.png', alt_text: 'Caftan de luxe', alt_text_en: 'Luxury caftan', order_index: 3 },
  { id: 4, image_path: 'gallery4.png', alt_text: 'Collection exposée', alt_text_en: 'Collection on display', order_index: 4 },
  { id: 5, image_path: 'gallery5.png', alt_text: 'Djellaba moderne', alt_text_en: 'Modern djellaba', order_index: 5 },
  { id: 6, image_path: 'gallery6.png', alt_text: 'Tissus précieux', alt_text_en: 'Precious fabrics', order_index: 6 }
];

// ── Query Engine ──
const mockDb = {
  query: async (sql, params = []) => {
    const q = sql.toLowerCase().trim();
    console.log('[MockDB]', q.substring(0, 60) + '...');

    // ═══════════════════════════════════════
    // SELECT queries
    // ═══════════════════════════════════════

    // Products - list with joins
    if (q.includes('select') && q.includes('from products') && q.includes('join categories')) {
      let filtered = [...products];
      if (q.includes('c.slug = ?')) {
        const slug = params.find(p => typeof p === 'string' && !p.includes('%'));
        if (slug) filtered = filtered.filter(p => p.category_name.toLowerCase() === slug.toLowerCase());
      }
      if (q.includes('p.price >= ?')) {
        const minIdx = params.findIndex((_, i) => q.includes('p.price >= ?'));
        if (params[0]) filtered = filtered.filter(p => p.price >= parseFloat(params[0]));
      }
      return [filtered];
    }

    // Products - single by ID
    if (q.includes('select') && q.includes('from products') && q.includes('where id = ?')) {
      const id = parseInt(params[0]);
      const product = products.find(p => p.id === id);
      return [product ? [product] : []];
    }

    // Product images by product_id
    if (q.includes('select') && q.includes('from product_images') && q.includes('product_id = ?')) {
      const pid = parseInt(params[0]);
      const imgs = productImages.filter(img => img.product_id === pid);
      return [imgs];
    }

    // Colors for a product
    if (q.includes('select') && q.includes('from colors') && q.includes('join product_colors')) {
      const pid = parseInt(params[0]);
      const product = products.find(p => p.id === pid);
      if (product && product.colors) {
        const hexCodes = product.colors.split(',');
        const matched = colors.filter(c => hexCodes.includes(c.hex_code));
        return [matched];
      }
      return [[]];
    }

    // Categories - list all
    if (q.includes('select') && q.includes('from categories')) {
      return [categories];
    }

    // Gallery - list all
    if (q.includes('select') && q.includes('from gallery')) {
      const sorted = [...gallery].sort((a, b) => a.order_index - b.order_index);
      return [sorted];
    }

    // Colors - list all
    if (q.includes('select') && q.includes('from colors') && !q.includes('join')) {
      return [colors];
    }

    // Hero Slides
    if (q.includes('select') && q.includes('from hero_slides')) {
      return [hero_slides.filter(s => s.is_active)];
    }

    // Settings
    if (q.includes('select') && q.includes('from settings')) {
      return [settings];
    }

    // Users
    if (q.includes('select') && q.includes('from users')) {
      if (q.includes('username = ?')) {
        const u = users.find(user => user.username === params[0]);
        return [u ? [u] : []];
      }
      return [users];
    }

    // ═══════════════════════════════════════
    // INSERT queries
    // ═══════════════════════════════════════

    if (q.includes('insert into products')) {
      const id = nextIds.products++;
      const cat = categories.find(c => c.id === parseInt(params[4]));
      const newProduct = {
        id, title: params[0], title_en: params[1] || '', slug: params[2],
        price: parseFloat(params[3]), category_id: parseInt(params[4]),
        description: params[5] || '', description_en: params[6] || '',
        main_image: params[7] || '', in_stock: params[8] ? 1 : 0, is_featured: params[9] ? 1 : 0,
        category_name: cat?.name || '', category_name_en: cat?.name_en || '',
        colors: ''
      };
      products.push(newProduct);
      return [{ insertId: id, affectedRows: 1 }];
    }

    if (q.includes('insert into product_images')) {
      const id = nextIds.product_images++;
      productImages.push({ id, product_id: parseInt(params[0]), image_path: params[1] });
      return [{ insertId: id, affectedRows: 1 }];
    }

    if (q.includes('insert into categories')) {
      const id = nextIds.categories++;
      categories.push({
        id, name: params[0], name_en: params[1] || '', slug: params[2],
        description: params[3] || '', description_en: params[4] || '', image: params[5] || ''
      });
      return [{ insertId: id, affectedRows: 1 }];
    }

    if (q.includes('insert into gallery')) {
      const id = nextIds.gallery++;
      gallery.push({
        id, image_path: params[0], alt_text: params[1] || '',
        alt_text_en: params[2] || '', order_index: parseInt(params[3]) || 0
      });
      return [{ insertId: id, affectedRows: 1 }];
    }

    if (q.includes('insert into hero_slides')) {
      const id = nextIds.hero_slides++;
      hero_slides.push({
        id, image_path: params[0], title_fr: params[1], title_en: params[2],
        subtitle_fr: params[3], subtitle_en: params[4], order_index: parseInt(params[5]) || 0, is_active: 1
      });
      return [{ insertId: id, affectedRows: 1 }];
    }

    // ═══════════════════════════════════════
    // UPDATE queries
    // ═══════════════════════════════════════

    if (q.includes('update products')) {
      const id = parseInt(params[params.length - 1]); // last param is always WHERE id=?
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) {
        // Match param order from adminController.updateProduct
        const hasImage = q.includes('main_image=?');
        products[idx].title = params[0] ?? products[idx].title;
        products[idx].title_en = params[1] ?? products[idx].title_en;
        products[idx].slug = params[2] ?? products[idx].slug;
        products[idx].price = parseFloat(params[3]) || products[idx].price;
        products[idx].category_id = parseInt(params[4]) || products[idx].category_id;
        products[idx].description = params[5] ?? products[idx].description;
        products[idx].description_en = params[6] ?? products[idx].description_en;
        products[idx].in_stock = params[7] ? 1 : 0;
        products[idx].is_featured = params[8] ? 1 : 0;
        if (hasImage) {
          products[idx].main_image = params[9];
        }
        // Update category name
        const cat = categories.find(c => c.id === products[idx].category_id);
        if (cat) {
          products[idx].category_name = cat.name;
          products[idx].category_name_en = cat.name_en;
        }
      }
      return [{ affectedRows: idx !== -1 ? 1 : 0 }];
    }

    if (q.includes('update categories')) {
      const id = parseInt(params[params.length - 1]);
      const idx = categories.findIndex(c => c.id === id);
      if (idx !== -1) {
        const hasImage = q.includes('image=?');
        categories[idx].name = params[0] ?? categories[idx].name;
        categories[idx].name_en = params[1] ?? categories[idx].name_en;
        categories[idx].slug = params[2] ?? categories[idx].slug;
        categories[idx].description = params[3] ?? categories[idx].description;
        categories[idx].description_en = params[4] ?? categories[idx].description_en;
        if (hasImage) {
          categories[idx].image = params[5];
        }
      }
      return [{ affectedRows: idx !== -1 ? 1 : 0 }];
    }

    if (q.includes('update gallery')) {
      const id = parseInt(params[params.length - 1]);
      const idx = gallery.findIndex(g => g.id === id);
      if (idx !== -1) {
        const hasImage = q.includes('image_path=?');
        gallery[idx].alt_text = params[0] ?? gallery[idx].alt_text;
        gallery[idx].alt_text_en = params[1] ?? gallery[idx].alt_text_en;
        gallery[idx].order_index = parseInt(params[2]) || gallery[idx].order_index;
        if (hasImage) {
          gallery[idx].image_path = params[3];
        }
      }
      return [{ affectedRows: idx !== -1 ? 1 : 0 }];
    }

    if (q.includes('update settings')) {
      const idx = settings.findIndex(s => s.setting_key === params[1]);
      if (idx !== -1) {
        settings[idx].setting_value = params[0];
      }
      return [{ affectedRows: idx !== -1 ? 1 : 0 }];
    }

    if (q.includes('update hero_slides')) {
      const id = parseInt(params[params.length - 1]);
      const idx = hero_slides.findIndex(s => s.id === id);
      if (idx !== -1) {
        const hasImage = q.includes('image_path=?');
        hero_slides[idx].title_fr = params[0];
        hero_slides[idx].title_en = params[1];
        hero_slides[idx].subtitle_fr = params[2];
        hero_slides[idx].subtitle_en = params[3];
        hero_slides[idx].order_index = parseInt(params[4]);
        hero_slides[idx].is_active = params[5] ? 1 : 0;
        if (hasImage) hero_slides[idx].image_path = params[6];
      }
      return [{ affectedRows: idx !== -1 ? 1 : 0 }];
    }

    // ═══════════════════════════════════════
    // DELETE queries
    // ═══════════════════════════════════════

    if (q.includes('delete from products') && q.includes('where id = ?')) {
      const id = parseInt(params[0]);
      const before = products.length;
      products = products.filter(p => p.id !== id);
      productImages = productImages.filter(pi => pi.product_id !== id);
      return [{ affectedRows: before - products.length }];
    }

    if (q.includes('delete from product_images') && q.includes('where id in')) {
      const ids = Array.isArray(params[0]) ? params[0].map(Number) : [parseInt(params[0])];
      const before = productImages.length;
      productImages = productImages.filter(pi => !ids.includes(pi.id));
      return [{ affectedRows: before - productImages.length }];
    }

    if (q.includes('delete from categories') && q.includes('where id = ?')) {
      const id = parseInt(params[0]);
      const before = categories.length;
      categories = categories.filter(c => c.id !== id);
      return [{ affectedRows: before - categories.length }];
    }

    if (q.includes('delete from gallery') && q.includes('where id = ?')) {
      const id = parseInt(params[0]);
      const before = gallery.length;
      gallery = gallery.filter(g => g.id !== id);
      return [{ affectedRows: before - gallery.length }];
    }

    // Default: empty result
    console.log('[MockDB] Unmatched query:', sql);
    return [[]];
  }
};

module.exports = mockDb;
