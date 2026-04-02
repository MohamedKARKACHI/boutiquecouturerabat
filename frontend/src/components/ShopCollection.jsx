import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSearch, HiOutlineFilter, HiX } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import ProductModal from './ProductModal'
import { fetchProducts, fetchCategories, fetchColors, fetchProductById } from '../api'
import heroImg from '../assets/slide2.jpg'
import { useLanguage } from '../context/LanguageContext'

const shimmerStyle = `
  @keyframes shimmer-gold {
    0% { transform: translateX(-150%) skewX(-15deg); }
    50%, 100% { transform: translateX(150%) skewX(-15deg); }
  }
  .animate-shimmer-gold {
    animation: shimmer-gold 2.5s infinite;
  }
`;

const API_URL = import.meta.env.VITE_API_URL || '';

const TRANSLATIONS = {
  FR: {
    bannerTitle: <>CAFTAN & <span className="italic text-gold">HAUTE COUTURE</span></>,
    bannerSub: "Découvrez notre collection exclusive de caftans marocains sur mesure et créations traditionnelles de luxe à Rabat.",
    breadcrumb: 'Accueil / Boutique',
    searchLabel: 'Rechercher un article',
    searchPlaceholder: 'Ex. Caftan...',
    priceLabel: 'Filtrer par prix',
    colorLabel: 'Filtrer par couleur',
    stockLabel: 'Status du stock',
    stockOpts: { all: 'Tout voir', instock: 'En stock', outstock: 'Rupture' },
    filterBtn: 'Filtres et Tri',
    articles: 'ARTICLES',
    discover: 'Découvrir',
    noResults: 'Aucun article trouvé',
    reset: 'Réinitialiser les filtres',
    outOfStock: 'Épuisé'
  },
  EN: {
    bannerTitle: <>MOROCCAN <span className="italic text-gold">CAFTAN</span></>,
    bannerSub: "Explore our exclusive collection of bespoke Moroccan caftans and luxury traditional wear in Rabat.",
    breadcrumb: 'Home / Shop',
    searchLabel: 'Search for an item',
    searchPlaceholder: 'Ex. Caftan...',
    priceLabel: 'Filter by price',
    colorLabel: 'Filter by color',
    stockLabel: 'Stock status',
    stockOpts: { all: 'View all', instock: 'In stock', outstock: 'Out of stock' },
    filterBtn: 'Filters & Sorting',
    articles: 'ITEMS',
    discover: 'Discover',
    noResults: 'No items found',
    reset: 'Reset filters',
    outOfStock: 'Sold out'
  }
}

// Global colors will be fetched from API


export default function ShopCollection() {
  const { lang, t } = useLanguage()
  const T = TRANSLATIONS[lang]
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [globalColors, setGlobalColors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('category') || '')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [selectedColors, setSelectedColors] = useState([])
  const [stockFilter, setStockFilter] = useState('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const catFilter = searchParams.get('category');
        const [prodData, catData, colorData] = await Promise.all([
          fetchProducts(catFilter ? { category: catFilter } : {}),
          fetchCategories(),
          fetchColors()
        ])
        setProducts(prodData)
        setCategories(catData)
        setGlobalColors(colorData)
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMobileFilters])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const title = t(p, 'title').toLowerCase()
      const category = (p[`category_name${lang === 'EN' ? '_en' : ''}`] || p.category_name || '').toLowerCase()
      const textMatch = title.includes(search.toLowerCase()) || category.includes(search.toLowerCase())
      const priceMatch = p.price <= maxPrice
      const colorMatch = selectedColors.length === 0 || (p.colors && p.colors.some(c => selectedColors.includes(c)))
      const stockMatch = stockFilter === 'all' ? true : stockFilter === 'instock' ? p.in_stock : !p.in_stock
      return textMatch && priceMatch && colorMatch && stockMatch
    })
  }, [products, search, maxPrice, selectedColors, stockFilter, t])

  const toggleColor = (hex) => {
    setSelectedColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]
    )
  }

  const filterContent = (
    <div className="flex flex-col gap-10 md:gap-12 w-full">
      <div className="flex flex-col gap-4">
        <h3 className="font-display text-sm font-bold tracking-[0.2em] text-charcoal uppercase">
          {T.searchLabel}
        </h3>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={T.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-sand rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
          />
          <HiOutlineSearch className="absolute left-4 text-smoke w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-display text-sm font-bold tracking-[0.2em] text-charcoal uppercase">
          {T.priceLabel}
        </h3>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-gold h-1.5 bg-cream rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs font-medium text-smoke mt-3">
            <span>0 DH</span>
            <span className="text-gold-dark font-bold">{maxPrice} DH</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-display text-sm font-bold tracking-[0.2em] text-charcoal uppercase">
          {T.colorLabel}
        </h3>
        <div className="flex flex-wrap gap-3">
          {globalColors.map((c) => {
            const isSelected = selectedColors.includes(c.hex_code)
            return (
              <button
                key={c.id}
                onClick={() => toggleColor(c.hex_code)}
                title={c.name}
                className={`relative w-9 h-9 rounded-full border-2 transition-all ${isSelected ? 'border-charcoal scale-110 shadow-md' : 'border-transparent hover:scale-110 shadow-sm'
                  }`}
                style={{ backgroundColor: c.hex_code }}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-display text-sm font-bold tracking-[0.2em] text-charcoal uppercase">
          {T.stockLabel}
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { id: 'all', label: T.stockOpts.all },
            { id: 'instock', label: T.stockOpts.instock },
            { id: 'outstock', label: T.stockOpts.outstock },
          ].map((opt) => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${stockFilter === opt.id ? 'bg-gold border-gold' : 'border-sand bg-white group-hover:border-gold/50'
                }`}>
                {stockFilter === opt.id && <div className="w-2.5 h-2.5 rounded-sm bg-white" />}
              </div>
              <input
                type="radio"
                name="stock"
                value={opt.id}
                checked={stockFilter === opt.id}
                onChange={(e) => setStockFilter(e.target.value)}
                className="hidden"
              />
              <span className={`text-sm tracking-wide ${stockFilter === opt.id ? 'text-charcoal font-medium' : 'text-smoke group-hover:text-charcoal'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ivory pt-[64px] md:pt-[80px]">
      <style dangerouslySetInnerHTML={{ __html: shimmerStyle }} />
      <div className="relative h-[280px] md:h-[350px] flex items-center justify-center overflow-hidden bg-charcoal">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

        <div className="relative z-10 text-center w-full px-4 pt-10">
          <div className="absolute top-0 left-4 md:left-12 font-accent tracking-widest text-xs text-gold/80 uppercase">
            {T.breadcrumb}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-5xl lg:text-7xl text-white font-semibold tracking-wide"
          >
            {T.bannerTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 font-accent text-sm md:text-base mt-4 max-w-xl mx-auto"
          >
            {T.bannerSub}
          </motion.p>
        </div>
      </div>

      <div className="section-container py-12 md:py-20 flex flex-col lg:flex-row gap-16 lg:gap-16">
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto modal-scrollbar">
          {filterContent}
        </aside>

        <div className="flex-1">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden w-full flex items-center justify-center gap-2 py-3.5 mb-8 bg-white border border-sand rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:border-gold transition-colors"
          >
            <HiOutlineFilter className="w-5 h-5 text-charcoal" />
            <span className="font-bold tracking-[0.15em] uppercase text-xs text-charcoal">{T.filterBtn}</span>
          </button>

          <div className="mb-6 flex items-center justify-between text-sm text-smoke font-medium">
            <p>{filteredProducts.length} {T.articles}</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 gap-y-10 sm:gap-y-12">
              <AnimatePresence>
                {filteredProducts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group flex flex-col h-full bg-cream/30 rounded-2xl overflow-hidden hover:bg-cream transition-colors duration-500 pb-4 sm:pb-5"
                  >
                    <div
                      className="relative aspect-[3/4] bg-transparent overflow-hidden cursor-pointer"
                      onClick={async () => {
                        try {
                          const fullProduct = await fetchProductById(p.id);
                          setSelectedProduct(fullProduct);
                        } catch (err) {
                          console.error("Failed to fetch product details:", err);
                          setSelectedProduct(p); // Fallback to list data if fetch fails
                        }
                      }}
                    >
                      <img
                        src={`${API_URL}/uploads/${p.main_image}`}
                        alt={t(p, 'title')}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {!p.in_stock && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-charcoal/90 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded-md backdrop-blur-sm">
                            {T.outOfStock}
                          </span>
                        </div>
                      )}

                      {p.promo_active && p.old_price && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-md overflow-hidden shadow-[0_0_10px_rgba(191,149,63,0.5)]">
                          <span className="block relative px-2.5 sm:px-3 py-1 sm:py-1.5 text-black text-[9px] sm:text-[10px] font-black tracking-widest uppercase overflow-hidden bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-full h-full block animate-shimmer-gold" />
                            <span className="relative z-10">-{Math.round(((Number(p.old_price) - Number(p.price)) / Number(p.old_price)) * 100)}%</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-center px-2 sm:px-4 pt-0 sm:pt-0 flex flex-col flex-1">
                      <p className="font-accent text-[9px] sm:text-[11px] tracking-[0.25em] text-gold uppercase mb-1 sm:mb-1.5">
                        {p[`category_name${lang === 'EN' ? '_en' : ''}`] || p.category_name}
                      </p>
                      <h4 className="font-display text-base sm:text-lg text-charcoal font-semibold mb-1 line-clamp-1">{t(p, 'title')}</h4>
                      
                      {p.promo_active && p.old_price ? (
                        <div className="flex items-center justify-center gap-2.5 mb-2 sm:mb-3">
                          <span className="text-smoke/60 text-xs line-through decoration-smoke/40 decoration-[1.5px] font-medium">
                            {Number(p.old_price).toLocaleString()} <span className="text-[10px]">DH</span>
                          </span>
                          <span className="text-charcoal text-sm sm:text-base font-bold">
                            {Number(p.price).toLocaleString()} <span className="text-xs">DH</span>
                          </span>
                        </div>
                      ) : (
                        <p className="text-smoke text-xs sm:text-sm font-medium mb-2 sm:mb-3">{Number(p.price).toLocaleString()} DH</p>
                      )}

                      {/* Color Variants */}
                      {p.colors && p.colors.length > 0 && p.colors[0] !== null && (
                        <div className="flex items-center justify-center gap-1.5 mb-3 sm:mb-4">
                          {p.colors.map((hex, idx) => (
                            <div 
                              key={idx} 
                              className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      )}


                      <button
                        onClick={async () => {
                          try {
                            const fullProduct = await fetchProductById(p.id);
                            setSelectedProduct(fullProduct);
                          } catch (err) {
                            console.error("Failed to fetch product details:", err);
                            setSelectedProduct(p);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 md:py-3 rounded-xl border-2 border-charcoal/80 text-charcoal text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white hover:shadow-[0_4px_15px_rgba(212,168,67,0.3)]"
                      >
                        <span>{T.discover}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-cream/50 rounded-3xl border border-sand border-dashed">
              <HiOutlineSearch className="w-12 h-12 text-gold/40 mb-4" />
              <h3 className="font-display text-xl text-charcoal font-semibold mb-2">{T.noResults}</h3>
              <p className="text-smoke text-sm">{T.searchPlaceholder}</p>
              <button
                onClick={() => { setSearch(''); setMaxPrice(5000); setSelectedColors([]); setStockFilter('all') }}
                className="mt-6 px-6 py-2 border border-gold text-gold hover:bg-gold/10 rounded-full text-sm font-medium transition-all"
              >
                {T.reset}
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-charcoal/80 backdrop-blur-sm lg:hidden flex flex-col justify-end"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full bg-ivory rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 pb-24 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 sticky top-0 bg-ivory pt-2 pb-4 border-b border-sand/50 z-10">
                <h3 className="font-display text-lg font-bold tracking-[0.2em] text-charcoal uppercase">{T.filterBtn}</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-cream rounded-full"><HiX className="w-5 h-5" /></button>
              </div>
              {filterContent}
              <button onClick={() => setShowMobileFilters(false)} className="w-full mt-10 py-4 bg-charcoal text-white rounded-xl font-bold uppercase text-xs">
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
