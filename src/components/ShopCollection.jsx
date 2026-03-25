import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSearch, HiOutlineFilter, HiX } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import ProductModal from './ProductModal'

import heroImg from '../assets/slide2.jpg'
import img1 from '../assets/gallery1.png'
import img2 from '../assets/gallery2.png'
import img3 from '../assets/gallery3.png'
import img4 from '../assets/caftans.png'
import img5 from '../assets/djellabas.png'
import img6 from '../assets/gandouras.png'
import slide3 from '../assets/slide3.jpg'
import slide4 from '../assets/slide4.jpg'
import slide5 from '../assets/slide5.jpg'
import slide6 from '../assets/slide6.jpg'
import slide7 from '../assets/slide7.jpg'
import slide8 from '../assets/slide8.jpg'
import gallery4 from '../assets/gallery4.png'
import gallery5 from '../assets/gallery5.png'
import gallery6 from '../assets/gallery6.png'

const PRODUCTS = [
  { id: 1, title: 'Caftan Majorelle', category: 'Caftans', price: 3500, image: img4, images: [img4, slide3, gallery4], colors: ['#1A2980', '#D4A843'], inStock: true },
  { id: 2, title: 'Djellaba Artisanale', category: 'Djellabas', price: 1800, image: img5, images: [img5, slide4, gallery5], colors: ['#E8DDD0', '#C75B39'], inStock: true },
  { id: 3, title: 'Gandoura Royale', category: 'Gandouras', price: 1200, image: img6, images: [img6, slide5, gallery6], colors: ['#0D6B4B', '#1C1C1E'], inStock: true },
  { id: 4, title: 'Caftan Émeraude', category: 'Caftans', price: 4200, image: img1, images: [img1, slide6, slide7], colors: ['#0D6B4B'], inStock: false },
  { id: 5, title: 'Abaya Nayaa', category: 'Abayas', price: 950, image: img2, images: [img2, slide8, img1], colors: ['#C75B39'], inStock: true },
  { id: 6, title: 'Kimono Sahra', category: 'Kimonos', price: 1100, image: img3, images: [img3, img2, img1], colors: ['#1C1C1E', '#E8DDD0'], inStock: true },
]

const FILTER_COLORS = [
  { id: 'noir', hex: '#1C1C1E', name: 'Noir' },
  { id: 'bleu', hex: '#1A2980', name: 'Bleu' },
  { id: 'vert', hex: '#0D6B4B', name: 'Vert' },
  { id: 'terracotta', hex: '#C75B39', name: 'Rouge/Orange' },
  { id: 'beige', hex: '#E8DDD0', name: 'Beige' },
  { id: 'or', hex: '#D4A843', name: 'Or' },
]

export default function ShopCollection() {
  const [search, setSearch] = useState('')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [selectedColors, setSelectedColors] = useState([])
  const [stockFilter, setStockFilter] = useState('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Prevent background scrolling when mobile filters are open
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
    return PRODUCTS.filter((p) => {
      const textMatch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
      const priceMatch = p.price <= maxPrice
      const colorMatch = selectedColors.length === 0 || p.colors.some(c => selectedColors.includes(c))
      const stockMatch = stockFilter === 'all' ? true : stockFilter === 'instock' ? p.inStock : !p.inStock
      return textMatch && priceMatch && colorMatch && stockMatch
    })
  }, [search, maxPrice, selectedColors, stockFilter])

  const toggleColor = (hex) => {
    setSelectedColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]
    )
  }

  const filterContent = (
    <div className="flex flex-col gap-10 md:gap-12 w-full">
      <div className="flex flex-col gap-4">
        <h3 className="font-display text-sm font-bold tracking-[0.2em] text-charcoal uppercase">
          Rechercher un article
        </h3>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ex. Caftan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-sand rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
          />
          <HiOutlineSearch className="absolute left-4 text-smoke w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-display text-sm font-bold tracking-[0.2em] text-charcoal uppercase">
          Filtrer par prix
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
          Filtrer par couleur
        </h3>
        <div className="flex flex-wrap gap-3">
          {FILTER_COLORS.map((c) => {
            const isSelected = selectedColors.includes(c.hex)
            return (
              <button
                key={c.id}
                onClick={() => toggleColor(c.hex)}
                title={c.name}
                className={`relative w-9 h-9 rounded-full border-2 transition-all ${isSelected ? 'border-charcoal scale-110 shadow-md' : 'border-transparent hover:scale-110 shadow-sm'
                  }`}
                style={{ backgroundColor: c.hex }}
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
          Filtrer par stock
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { id: 'all', label: 'Tout voir' },
            { id: 'instock', label: 'En stock' },
            { id: 'outstock', label: 'Rupture de stock' },
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
      {/* ── Collection Banner ── */}
      <div className="relative h-[280px] md:h-[350px] flex items-center justify-center overflow-hidden bg-charcoal">
        <img src={heroImg} alt="Nouvelle Collection" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

        <div className="relative z-10 text-center w-full px-4 pt-10">
          <div className="absolute top-0 left-4 md:left-12 font-accent tracking-widest text-xs text-gold/80 uppercase">
            Accueil / Boutique
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-5xl lg:text-7xl text-white font-semibold tracking-wide"
          >
            NOUVELLE <span className="italic text-gold">COLLECTION</span>
          </motion.h1>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="section-container py-12 md:py-20 flex flex-col lg:flex-row gap-16 lg:gap-16">

        {/* ── Desktop Sidebar Filters ── */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col">
          {filterContent}
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden w-full flex items-center justify-center gap-2 py-3.5 mb-8 bg-white border border-sand rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:border-gold transition-colors"
          >
            <HiOutlineFilter className="w-5 h-5 text-charcoal" />
            <span className="font-bold tracking-[0.15em] uppercase text-xs text-charcoal">Filtres et Tri</span>
          </button>

          <div className="mb-6 flex items-center justify-between text-sm text-smoke font-medium">
            <p>{filteredProducts.length} ARTICLES</p>
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
                      onClick={() => setSelectedProduct(p)}
                    >
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                      {!p.inStock && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-charcoal/90 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded-md backdrop-blur-sm">
                            Épuisé
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-center px-2 sm:px-4 pt-0 sm:pt-0 flex flex-col flex-1">
                      <p className="font-accent text-[9px] sm:text-[11px] tracking-[0.2em] text-gold uppercase mb-1 sm:mb-1.5">{p.category}</p>
                      <h4 className="font-display text-base sm:text-lg text-charcoal font-semibold mb-1 line-clamp-1">{p.title}</h4>
                      <p className="text-smoke text-xs sm:text-sm font-medium mb-3 sm:mb-4">{p.price.toLocaleString()} DH</p>

                      <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-auto mb-4 sm:mb-5">
                        {p.colors.map(hex => (
                          <div key={hex} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: hex }} />
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 md:py-3 rounded-xl border-2 border-charcoal/80 text-charcoal text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white hover:shadow-[0_4px_15px_rgba(212,168,67,0.3)]"
                      >
                        <span>Découvrir</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-cream/50 rounded-3xl border border-sand border-dashed">
              <HiOutlineSearch className="w-12 h-12 text-gold/40 mb-4" />
              <h3 className="font-display text-xl text-charcoal font-semibold mb-2">Aucun article trouvé</h3>
              <p className="text-smoke text-sm">Essayez de modifier vos filtres ou votre recherche.</p>
              <button
                onClick={() => { setSearch(''); setMaxPrice(5000); setSelectedColors([]); setStockFilter('all') }}
                className="mt-6 px-6 py-2 border border-gold text-gold hover:bg-gold/10 rounded-full text-sm font-medium transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Bottom Sheet ── */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-charcoal/80 backdrop-blur-sm lg:hidden flex flex-col justify-end"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full bg-ivory rounded-t-3xl max-h-[85vh] overflow-y-auto overflow-x-hidden p-6 pb-24 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 sticky top-0 bg-ivory pt-2 pb-4 border-b border-sand/50 z-10">
                <h3 className="font-display text-lg font-bold tracking-[0.2em] text-charcoal uppercase">Filtres</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 bg-cream rounded-full hover:bg-gold/20 transition-colors"
                >
                  <HiX className="w-5 h-5 text-charcoal" />
                </button>
              </div>

              {filterContent}

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-10 py-4 bg-charcoal text-white rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-gold transition-colors"
              >
                Afficher les résultats ({filteredProducts.length})
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
