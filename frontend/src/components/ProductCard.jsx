import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductCard({ product: p, t, lang, T, API_URL, onDiscover }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0)

  // Ensure main_image is the first in the gallery
  const mainImg = p?.main_image || p?.image
  let productImages = []
  
  if (p && p.images && p.images.length > 0) {
    productImages = [...p.images]
    // Ensure mainImg is at the start and not duplicated
    if (mainImg && !productImages.includes(mainImg)) {
      productImages.unshift(mainImg)
    }
  } else if (p) {
    productImages = [mainImg]
  }

  const currentImage = productImages[currentImgIndex] || mainImg
  const imageUrl = currentImage?.startsWith('http') 
    ? currentImage 
    : `${API_URL}/uploads/${currentImage}`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col h-full bg-cream/30 rounded-2xl overflow-hidden hover:bg-cream transition-colors duration-500 pb-4 sm:pb-5"
    >
      {/* Image Area with forced cover layout */}
      <div 
        className="relative aspect-[3/4] bg-charcoal overflow-hidden cursor-pointer" 
        onClick={() => onDiscover(p)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImgIndex}
            layoutId={currentImgIndex === 0 ? `prod-img-${p.id}` : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={imageUrl}
            alt={p ? t(p, 'title') : ''}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        </AnimatePresence>

        {/* Premium Thumbnail Bar */}
        {productImages.length > 1 && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 p-1.5 bg-black/40 backdrop-blur-2xl rounded-[18px] border border-white/10 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setCurrentImgIndex(idx)}
                onClick={() => setCurrentImgIndex(idx)}
                className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-[12px] overflow-hidden border-2 transition-all duration-300 ${
                  currentImgIndex === idx 
                    ? 'border-white scale-110 shadow-lg' 
                    : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img 
                  src={(typeof img === 'string' && img.startsWith('http')) ? img : `${API_URL}/uploads/${img}`} 
                  className="w-full h-full object-cover" 
                  alt=""
                />
              </button>
            ))}
          </div>
        )}

        {/* Badges */}
        {p && !p.in_stock && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-charcoal/90 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded-md backdrop-blur-sm">
              {T.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Text Area with improved spacing (Smart Space) */}
      <div className="text-center px-2 sm:px-4 pt-7 sm:pt-8 flex flex-col flex-1">
        <p className="font-accent text-[9px] sm:text-[11px] tracking-[0.25em] text-gold uppercase mb-2 sm:mb-2.5">
          {p ? (p[`category_name${lang === 'EN' ? '_en' : ''}`] || p.category_name) : ''}
        </p>
        <h4 className="font-display text-base sm:text-lg text-charcoal font-semibold mb-1.5 line-clamp-1">
          {p ? t(p, 'title') : ''}
        </h4>
        
        {p && p.promo_active && p.old_price ? (
          <div className="flex items-center justify-center gap-2.5 mb-2 sm:mb-3">
            <span className="text-smoke/60 text-xs line-through decoration-smoke/40 decoration-[1.5px] font-medium">
              {Number(p.old_price).toLocaleString()} <span className="text-[10px]">DH</span>
            </span>
            <span className="text-charcoal text-sm sm:text-base font-bold">
              {Number(p.price).toLocaleString()} <span className="text-xs">DH</span>
            </span>
          </div>
        ) : (
          <p className="text-smoke text-xs sm:text-sm font-medium mb-2 sm:mb-3">
            {p ? Number(p.price).toLocaleString() : ''} DH
          </p>
        )}

        {/* Color Variants */}
        {p && p.colors && p.colors.length > 0 && p.colors[0] !== null && (
          <div className="flex items-center justify-center gap-1.5 mb-4 sm:mb-5">
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
          onClick={() => onDiscover(p)}
          className="mt-auto w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 md:py-3 rounded-xl border-2 border-charcoal/80 text-charcoal text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white hover:shadow-[0_4px_15_rgba(212,168,67,0.3)]"
        >
          <span>{T.discover}</span>
        </button>
      </div>
    </motion.div>
  )
}
